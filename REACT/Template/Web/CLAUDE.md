# CLAUDE.md - Portfolio App

## 🎯 Vision du Projet

**Portfolio App** est un site web classique (type portfolio / vitrine personnelle) avec un système d'authentification complet. Les visiteurs peuvent s'inscrire avec un nom d'utilisateur ou se connecter via Google. Une fois connectés, ils accèdent à des fonctionnalités supplémentaires. Les utilisateurs avec le statut **admin** disposent d'un espace dédié invisible aux autres.

## 🏗️ Architecture Globale

```
Portfolio/
├── frontend/                  # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── services/          # api.service.ts, auth.service.ts
│   │   ├── hooks/             # useAuth.ts, useUser.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Page publique (visiteurs)
│   │   │   ├── Login.tsx      # Connexion (username ou Google)
│   │   │   ├── Register.tsx   # Inscription
│   │   │   ├── Dashboard.tsx  # Espace connecté (user + admin)
│   │   │   └── Admin.tsx      # Espace admin uniquement
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── auth/          # LoginForm, RegisterForm, GoogleButton
│   │   │   └── ui/            # Composants réutilisables
│   │   ├── guards/            # ProtectedRoute.tsx, AdminRoute.tsx
│   │   └── context/           # AuthContext.tsx
│   ├── .env                   # VITE_API_URL=http://localhost:3001
│   └── CLAUDE.md
├── backend/                   # NestJS 11 + TypeScript
│   ├── src/modules/
│   │   ├── auth/              # Connexion, inscription, JWT, Google OAuth
│   │   ├── user/              # UserService, UserController, entités
│   │   └── admin/             # AdminController, AdminService
│   ├── .env                   # PORT=3001, FRONTEND_URL, JWT_SECRET, GOOGLE_CLIENT_ID...
│   ├── app.sqlite             # Base de données SQLite (dev)
│   └── CLAUDE.md
├── docker-compose.yml
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
| Containerisation | Docker + Docker Compose                          |
| CI/CD            | GitHub Actions                                   |

## 👤 Système d'Authentification

### Méthodes de connexion

- **Inscription classique** : nom d'utilisateur + mot de passe (hashé avec bcrypt)
- **Google OAuth** : connexion via compte Google (création de compte automatique si premier login)

### Rôles utilisateurs

| Rôle    | Description                   | Accès                                      |
| ------- | ----------------------------- | ------------------------------------------ |
| `guest` | Visiteur non connecté         | Pages publiques uniquement                 |
| `user`  | Connecté (username ou Google) | Pages publiques + fonctionnalités connecté |
| `admin` | Administrateur                | Tout + page Admin exclusive                |

> Plusieurs comptes peuvent avoir le statut `admin`. Le statut s'attribue manuellement en base de données ou via l'interface admin.

### Flux d'authentification

1. **Inscription** : formulaire → validation → hash mdp → création compte `user` en BDD
2. **Connexion classique** : username + mdp → vérification → JWT renvoyé
3. **Connexion Google** : redirect OAuth → callback → upsert user en BDD → JWT renvoyé
4. **Session** : JWT stocké côté client (localStorage ou cookie httpOnly) → envoyé dans les headers à chaque requête
5. **Guards** : le backend vérifie le JWT et le rôle sur chaque route protégée

## 📁 Structure des Données

### User

- `id` : UUID
- `username` : String (unique)
- `email` : String (unique, nullable pour inscription classique)
- `passwordHash` : String (nullable si connexion Google)
- `googleId` : String (nullable si inscription classique)
- `role` : `'user'` | `'admin'` (défaut : `'user'`)
- `createdAt` : Timestamp
- `updatedAt` : Timestamp

## 🔐 Protection des Routes

### Frontend (React Guards)

- `<ProtectedRoute>` : redirige vers `/login` si non connecté
- `<AdminRoute>` : redirige vers `/` si connecté mais pas admin

### Backend (NestJS Guards)

- `JwtAuthGuard` : vérifie le token JWT
- `RolesGuard` + `@Roles('admin')` : vérifie le rôle admin

---

## 📊 État de l'Implémentation

### ✅ Fonctionnalités Complétées

_(à remplir au fur et à mesure)_

### 🔄 En Cours / À Compléter

- ⏳ Setup initial du projet (frontend + backend)
- ⏳ Système d'inscription / connexion classique
- ⏳ Intégration Google OAuth
- ⏳ Gestion des rôles (user / admin)
- ⏳ Page Admin protégée
- ⏳ Fonctionnalités utilisateur connecté (à définir)
- ⏳ Configuration Docker
- ⏳ CI/CD GitHub Actions
- ⏳ Migration PostgreSQL pour la production

### 🔧 Ports de Configuration

- **Backend** : `3001`
- **Frontend** : `5173` (Vite par défaut)
- **CORS** : Autorise `http://localhost:5173`

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

- Strict mode activé
- Types explicites (éviter `any`)
- Interfaces préférées aux types pour les objets

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

### Développement

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev

# Les deux (Docker)
docker-compose up
```

### Base de données

```bash
# Générer une migration TypeORM
cd backend && npm run migration:generate -- src/migrations/NomMigration

# Appliquer les migrations
cd backend && npm run migration:run
```

---

## 📝 TODO / Roadmap

- [ ] Setup initial projet (frontend + backend)
- [ ] Page Home + Navbar + Boutton Connexion
- [ ] Authentification classique (username + mot de passe)
- [ ] Authentification Google OAuth
- [ ] Système de rôles (user / admin)
- [ ] Page Admin protégée
- [ ] Définir les fonctionnalités utilisateur connecté
- [ ] Configuration Docker
- [ ] CI/CD GitHub Actions
- [ ] Migration PostgreSQL pour la production
