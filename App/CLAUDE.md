# CLAUDE.md - Portfolio App

## 🎯 Vision du Projet

**Portfolio App** est un site web classique (type portfolio / vitrine personnelle) avec un système d'authentification complet. Les visiteurs peuvent s'inscrire avec un nom d'utilisateur ou se connecter via Google. Une fois connectés, ils accèdent à des fonctionnalités supplémentaires. Les utilisateurs avec le statut **admin** disposent d'un espace dédié invisible aux autres.

## 🏗️ Architecture Globale

```
Portfolio/
├── frontend/                  # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── services/          # api.service.ts, auth.service.ts
│   │   ├── hooks/             # useAuth.ts
│   │   ├── context/           # AuthContext.tsx, ThemeContext.tsx
│   │   ├── guards/            # ProtectedRoute.tsx, AdminRoute.tsx
│   │   ├── types/             # user.types.ts
│   │   ├── pages/
│   │   │   ├── Home/          # Page publique (visiteurs)
│   │   │   ├── Login/         # Connexion (username ou Google)
│   │   │   ├── Register/      # Inscription
│   │   │   ├── Dashboard/     # Espace connecté (user + admin)
│   │   │   ├── Admin/         # Espace admin uniquement
│   │   │   └── AuthCallback/  # Callback Google OAuth
│   │   └── components/
│   │       ├── layout/        # Navbar, Footer, Layout
│   │       ├── ui/            # Button, Input (composants custom)
│   │       ├── auth/          # AuthFormWrapper, FormField, GoogleSignInButton...
│   │       └── shared/        # Avatar, ErrorMessage...
│   ├── .env                   # VITE_API_URL=http://localhost:3001
│   └── CLAUDE.md
├── backend/                   # NestJS 11 + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Connexion, inscription, JWT, Google OAuth
│   │   │   ├── user/          # UserService, entités
│   │   │   └── admin/         # AdminController, AdminService
│   │   └── database/          # SeedService, migrations
│   ├── test/                  # 5 suites de tests unitaires (39 tests)
│   ├── .env                   # PORT, JWT_SECRET, GOOGLE_CLIENT_ID...
│   ├── app.sqlite             # Base de données SQLite (dev, gitignore)
│   └── CLAUDE.md
├── docker-compose.yml         # ✅ Orchestration complète
└── CLAUDE.md                  # Ce fichier
```

### Stack Technique

| Composant        | Technologie                                      |
| ---------------- | ------------------------------------------------ |
| Frontend         | React 19, TypeScript, Vite 5.x, Tailwind CSS 4.x |
| Backend          | NestJS 11, TypeScript 5.x                        |
| Authentification | JWT + Passport.js + Google OAuth 2.0             |
| Base de données  | SQLite (dev), PostgreSQL (prod)                  |
| ORM              | TypeORM                                          |
| Containerisation | Docker + Docker Compose ✅                       |
| CI/CD            | GitHub Actions (à faire)                         |

## 👤 Système d'Authentification

### Méthodes de connexion

- **Inscription classique** : nom d'utilisateur + mot de passe (hashé avec bcryptjs)
- **Google OAuth** : connexion via compte Google (création de compte automatique si premier login)

### Rôles utilisateurs

| Rôle    | Description                   | Accès                                      |
| ------- | ----------------------------- | ------------------------------------------ |
| `guest` | Visiteur non connecté         | Pages publiques uniquement                 |
| `user`  | Connecté (username ou Google) | Pages publiques + fonctionnalités connecté |
| `admin` | Administrateur                | Tout + page Admin exclusive                |

> Plusieurs comptes peuvent avoir le statut `admin`. Le statut s'attribue via `PATCH /admin/users/:id/role` ou automatiquement au démarrage via `ADMIN_GOOGLE_EMAIL` dans le `.env`.

### Flux d'authentification

1. **Inscription** : formulaire → validation → hash mdp → création compte `user` en BDD
2. **Connexion classique** : username + mdp → vérification → JWT renvoyé
3. **Connexion Google** : redirect OAuth → callback → upsert user en BDD → JWT renvoyé
4. **Session** : JWT stocké en localStorage (`access_token`) → envoyé dans les headers à chaque requête
5. **Guards** : le backend vérifie le JWT et le rôle sur chaque route protégée

## 📁 Structure des Données

### User

- `id` : UUID
- `username` : String (unique, nullable si compte Google sans username)
- `email` : String (unique, nullable pour inscription classique)
- `passwordHash` : String (nullable si connexion Google)
- `googleId` : String (nullable si inscription classique)
- `role` : `'user'` | `'admin'` (défaut : `'user'`)
- `createdAt` / `updatedAt` : Timestamp

## 🔐 Protection des Routes

### Frontend (React Guards)

- `<ProtectedRoute>` : redirige vers `/login` si non connecté
- `<AdminRoute>` : redirige vers `/login` si non connecté, vers `/` si pas admin

### Backend (NestJS Guards)

- `JwtAuthGuard` : vérifie le token JWT
- `RolesGuard` + `@Roles('admin')` : vérifie le rôle admin

---

## 🐳 Docker

### Services

| Service    | Image              | Port    | Description     |
| ---------- | ------------------ | ------- | --------------- |
| `postgres` | postgres:16-alpine | 5432    | Base de données |
| `backend`  | node:22-alpine     | 3001    | API NestJS      |
| `frontend` | nginx:alpine       | 5173→80 | React buildé    |

### Variables d'environnement Docker

Le `docker-compose.yml` expose directement les variables dans `environment`. Les variables sensibles (`JWT_SECRET`, Google OAuth) doivent être remplacées avant un déploiement réel.

**Variable clé :** `DB_SSL: "false"` — désactive SSL pour PostgreSQL local. Passer à `"true"` en prod sur un hébergeur cloud.

### Commandes

```bash

# Démarre sans build (plus rapide)
docker compose up

# Démarrer tout
docker compose up --build

# Stopper
docker compose down

# Voir les logs d'un service
docker logs portfolio-backend
```

---

## 📊 État de l'Implémentation

### ✅ Backend — Complété

- Auth classique (register, login, JWT)
- Google OAuth (GoogleStrategy, GoogleAuthGuard, callback)
- Entité `User` avec rôles
- Routes admin protégées (dashboard, users, patch role)
- SeedService — création admin + promotion compte Google via `.env`
- Tests unitaires — 39 tests, 5 suites
- Config TypeORM — SSL conditionnel via `DB_SSL`

### ✅ Frontend — Complété

- Setup (Vite + React 19 + TypeScript + Tailwind 4.x)
- AuthContext + ThemeContext (dark/light) + useAuth
- ProtectedRoute + AdminRoute
- auth.service.ts + api.service.ts
- Pages : Home, Login, Register, Dashboard, Admin, AuthCallback
- Navbar + Footer + Layout
- Composants UI custom : Button, Input, FormField
- Composants auth : AuthFormWrapper, AuthDivider, GoogleSignInButton
- Composants shared : Avatar, ErrorMessage
- Package manager : **npm**

### ✅ Infrastructure — Complété

- Docker Compose (PostgreSQL + NestJS + Nginx/React)
- Dockerfiles frontend (multi-stage: node + nginx) et backend (multi-stage: node)
- SSL conditionnel (`DB_SSL`) pour supporter dev Docker et prod cloud

### 🔄 À Faire

- [ ] CI/CD GitHub Actions
- [ ] Migrations TypeORM pour la production
- [ ] Migration PostgreSQL (prod)
- [ ] PrimeReact PassThrough (optionnel — décision suspendue)

---

## 🤖 Instructions pour Claude (Assistant IA)

### Processus de Développement

**IMPORTANT** : Pour chaque nouvelle feature demandée, je dois :

1. **Analyser** : Comprendre la demande et son impact sur l'existant
2. **Proposer un plan** : Présenter un plan détaillé étape par étape incluant :
   - Les fichiers à créer/modifier
   - Les dépendances à installer
   - L'ordre d'implémentation
   - Les tests à prévoir
3. **Attendre validation** : Ne pas coder avant que l'utilisateur valide le plan
4. **Implémenter** : Une fois validé, procéder étape par étape
5. **Tester** : Vérifier que tout fonctionne
6. **Mettre à jour la documentation** : Après chaque feature ou modification importante :
   - Mettre à jour `/CLAUDE.md` si la vision/architecture globale change
   - Mettre à jour `/frontend/CLAUDE.md` si ajout de lib, composants, services frontend
   - Mettre à jour `/backend/CLAUDE.md` si ajout de lib, modules, entités backend
   - Garder la documentation synchronisée avec le code réel

### Conventions de Code

#### Général

- Langue du code : **Anglais**
- Langue des commentaires : **Français** (si demandé)
- Commits : Messages en anglais, format conventionnel (`feat:`, `fix:`, `docs:`, etc.)

#### TypeScript

- Strict mode activé (`verbatimModuleSyntax` activé — utiliser `import type` pour les types)
- Types explicites (éviter `any`)
- Interfaces préférées aux types pour les objets
- `forwardRef`, `useId` etc. doivent être explicitement importés depuis React

#### Nommage

- **Fichiers** : kebab-case (`auth.service.ts`)
- **Classes** : PascalCase (`AuthService`)
- **Variables/Fonctions** : camelCase (`createUser`)
- **Constantes** : SCREAMING_SNAKE_CASE (`MAX_ADMIN_COUNT`)
- **Interfaces** : PascalCase avec préfixe I optionnel (`User` ou `IUser`)

#### Imports

- **Utiliser les alias `@/`** dans les deux projets pour les imports internes
- Backend : `import { User } from '@/modules/user/entities/user.entity';`
- Frontend : `import { Button } from '@/components/ui/Button';`
- ESLint enforce `sort-imports` — toujours trier alphabétiquement les membres d'un import

#### Git

- Branche principale : `main`
- Branche de développement : `develop`
- Feature branches : `feature/nom-feature`
- Fix branches : `fix/nom-bug`

### Communication

- **Toujours poser des questions** si le prompt manque de clarté ou contient des omissions
- Demander des précisions avant de commencer l'implémentation si des détails importants manquent
- Proposer des alternatives quand pertinent
- Signaler les risques ou problèmes potentiels
- Expliquer les choix techniques importants

---

## 🚀 Commandes Utiles

### Développement local

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev
```

### Docker

```bash
docker compose up --build
docker compose down
docker logs portfolio-backend
docker logs portfolio-frontend
```

### Tests

```bash
cd backend && npm run test
cd backend && npm run test:cov
```

### Base de données

```bash
cd backend && npm run migration:generate -- src/migrations/NomMigration
cd backend && npm run migration:run
```

---

## 📝 TODO / Roadmap

- [x] Setup initial projet (frontend + backend)
- [x] Authentification classique (username + mot de passe)
- [x] Authentification Google OAuth
- [x] Système de rôles (user / admin)
- [x] Page Admin protégée
- [x] Tests unitaires backend
- [x] Charte graphique + composants UI
- [x] Configuration Docker (PostgreSQL + NestJS + Nginx)
- [ ] CI/CD GitHub Actions
- [ ] Migrations TypeORM pour la production
- [ ] Migration PostgreSQL pour la production
