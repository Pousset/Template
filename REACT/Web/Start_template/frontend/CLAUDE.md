# CLAUDE.md - Frontend Portfolio App

## 🎯 Identité du Projet

**Nom** : Portfolio App  
**Concept** : Site web avec authentification (username ou Google OAuth), espace utilisateur connecté, et espace admin protégé.

**Version Actuelle** : 0.1.0  
**Dernière Mise à Jour** : Juin 2026

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes
*(à remplir au fur et à mesure)*

### ⏳ En cours / À faire

#### Authentification
- [ ] Formulaire d'inscription (username + mot de passe)
- [ ] Formulaire de connexion (username + mot de passe)
- [ ] Bouton "Connexion avec Google" (Google OAuth)
- [ ] Stockage du JWT (localStorage ou cookie httpOnly)
- [ ] Déconnexion avec nettoyage du token

#### Guards & Routing
- [ ] `<ProtectedRoute>` — redirige vers `/login` si non connecté
- [ ] `<AdminRoute>` — redirige vers `/` si connecté mais pas admin

#### Pages
- [ ] `Home` (`/`) — page publique
- [ ] `Login` (`/login`) — connexion
- [ ] `Register` (`/register`) — inscription
- [ ] `Dashboard` (`/dashboard`) — espace utilisateur connecté
- [ ] `Admin` (`/admin`) — espace admin uniquement

#### Contexte & Hooks
- [ ] `AuthContext` — état global de l'utilisateur connecté
- [ ] `useAuth` — hook pour accéder au contexte auth

---

## 📦 Stack Technique

| Outil | Version |
|-------|---------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 5.x |
| CSS Framework | Tailwind CSS 4.x |
| Routing | React Router DOM |
| UI Components | PrimeReact (PassThrough API) |
| Auth | JWT + Google OAuth (via backend) |
| Port dev | `5173` |
| API URL | `http://localhost:3001` (`.env`) |

---

## 🏗️ Structure du Projet

```
frontend/
├── src/
│   ├── assets/                  # Images, fonts, icônes
│   ├── components/
│   │   ├── ui/                  # Composants réutilisables (Button, Input, Modal...)
│   │   ├── layout/              # Navbar, Footer, Layout
│   │   └── auth/                # LoginForm, RegisterForm, GoogleButton
│   ├── context/
│   │   └── AuthContext.tsx      # Contexte global auth (user, token, login, logout)
│   ├── guards/
│   │   ├── ProtectedRoute.tsx   # Redirige si non connecté
│   │   └── AdminRoute.tsx       # Redirige si pas admin
│   ├── hooks/
│   │   └── useAuth.ts           # Hook d'accès au contexte auth
│   ├── pages/
│   │   ├── Home/                # Page publique
│   │   ├── Login/               # Connexion
│   │   ├── Register/            # Inscription
│   │   ├── Dashboard/           # Espace utilisateur connecté
│   │   └── Admin/               # Espace admin (protégé)
│   ├── services/
│   │   ├── api.service.ts       # Client HTTP de base (fetch avec JWT)
│   │   └── auth.service.ts      # login(), register(), googleLogin(), logout()
│   ├── types/                   # Types TypeScript partagés
│   │   └── user.types.ts        # User, AuthResponse, Role...
│   ├── utils/                   # Fonctions utilitaires
│   ├── App.tsx                  # Routes principales
│   ├── main.tsx                 # Entrée app + PrimeReactProvider
│   └── index.css                # Tailwind + variables CSS
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## 🔐 Système d'Authentification (Frontend)

### Flux de connexion classique
```
Login form → auth.service.login() → POST /auth/login
           → JWT reçu → stocké (localStorage)
           → AuthContext mis à jour
           → Redirect selon rôle (user → /dashboard, admin → /admin)
```

### Flux Google OAuth
```
Clic "Connexion Google" → redirect vers /auth/google (backend)
                        → Google callback → JWT renvoyé par backend
                        → Stockage JWT → AuthContext mis à jour
                        → Redirect selon rôle
```

### Persistance de session
```
Au démarrage de l'app → lecture du JWT en localStorage
                      → GET /auth/me avec le token
                      → Hydratation de AuthContext si token valide
                      → Sinon : nettoyage et redirect /login
```

---

## 🧩 Services

### `auth.service.ts`

```typescript
// Inscription
register(username: string, password: string): Promise<AuthResponse>

// Connexion
login(username: string, password: string): Promise<AuthResponse>

// Déconnexion
logout(): void  // Nettoie le token local

// Récupérer l'utilisateur connecté
getMe(): Promise<User>
```

### `api.service.ts`

Client HTTP de base qui injecte automatiquement le JWT dans les headers :

```typescript
// Requête authentifiée
apiFetch(endpoint: string, options?: RequestInit): Promise<Response>
// Ajoute automatiquement : Authorization: Bearer <token>
```

---

## 🧭 Routing

```tsx
// App.tsx
<Routes>
  {/* Pages publiques */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Pages protégées (user connecté) */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>

  {/* Pages admin uniquement */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<Admin />} />
  </Route>
</Routes>
```

### Guards

**`ProtectedRoute.tsx`** : vérifie que l'utilisateur est connecté (token valide), sinon redirige vers `/login`.

**`AdminRoute.tsx`** : vérifie que l'utilisateur est connecté **et** a le rôle `admin`, sinon redirige vers `/`.

---

## 🗂️ Types Partagés

```typescript
// types/user.types.ts

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: Role;
  googleId?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
```

---

## 🎨 Charte Graphique

### Design System
- **Style** : À définir (minimaliste recommandé pour un portfolio)
- **Mode** : À définir (light / dark / système)
- **Public** : Général

### Palette de Couleurs
*(à définir lors du setup du projet)*

```css
/* src/index.css — à compléter */
@import "tailwindcss";

@theme {
  /* Brand Colors — à définir */
  --color-primary: ;
  --color-primary-light: ;
  --color-primary-dark: ;

  /* Backgrounds — à définir */
  --color-bg-primary: ;
  --color-bg-secondary: ;

  /* Text — à définir */
  --color-text-primary: ;
  --color-text-secondary: ;
  --color-text-muted: ;

  /* States */
  --color-success: ;
  --color-error: ;
  --color-warning: ;
}
```

### Typographie
*(à définir — éviter Inter/Roboto, choisir une typo distincte)*

---

## 🎨 Configuration PrimeReact (PassThrough API)

Le projet utilise **PrimeReact avec Tailwind CSS** via l'API **PassThrough** pour un contrôle total du styling.

### Architecture

```
src/
└── prime/
    ├── index.tsx                # Export du customTheme
    └── components/
        ├── inputText.ts         # Style InputText
        ├── button.ts            # Style Button
        └── ...
```

### Setup dans `main.tsx`

```tsx
import { PrimeReactProvider } from "primereact/api";
import { usePassThrough } from "primereact/passthrough";
import Tailwind from "primereact/passthrough/tailwind";
import { customTheme } from "@/prime";

const CustomTailwind = usePassThrough(Tailwind, customTheme, {
  mergeSections: true,
  mergeProps: false,
});

<PrimeReactProvider value={CustomTailwind}>
  <App />
</PrimeReactProvider>
```

### Exemple de composant customisé

```typescript
// src/prime/components/inputText.ts
import type { InputTextPassThroughOptions } from "primereact/inputtext";
import { classNames } from "primereact/utils";

export const inputtext: InputTextPassThroughOptions = {
  root: ({ props, context }) => ({
    className: classNames(
      "rounded-lg border transition-colors duration-200 p-3 text-base",
      {
        "hover:border-primary focus:outline-none": !context.disabled,
        "opacity-60 pointer-events-none": context.disabled,
        "border-error": props.invalid,
        "border-gray-300": !props.invalid,
      }
    ),
  }),
};
```

### Ajouter un composant

1. Créer `src/prime/components/button.ts`
2. L'importer dans `src/prime/index.tsx` :

```tsx
import { inputtext } from "./components/inputText";
import { button } from "./components/button";

export const customTheme = { inputtext, button };
```

### Ressources
- [Documentation PassThrough API](https://primereact.org/passthrough/)
- [Tailwind PassThrough Base](https://github.com/primefaces/primereact/blob/master/components/lib/passthrough/tailwind/index.js)

---

## 🗃️ Gestion d'État

### AuthContext

Stocke l'état global de l'utilisateur connecté :

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}
```

### LocalStorage

| Clé | Valeur |
|-----|--------|
| `access_token` | JWT renvoyé par le backend |

> Note : si tu passes à des cookies httpOnly, supprimer cette clé et gérer côté backend.

---

## 🎯 Conventions Spécifiques

### Composants
- Un dossier par composant complexe : `ComponentName/index.tsx`
- Composants simples : fichier unique `ComponentName.tsx`
- Props typées avec interface

### Imports
- **Utiliser les alias `@/`** pour tous les imports internes
- Exemple : `import { useAuth } from '@/hooks/useAuth';`
- Configuration `tsconfig.app.json` : `"@/*": ["./src/*"]`
- Configuration Vite : `alias: { '@': path.resolve(__dirname, './src') }`

### Hooks
- Préfixe `use` : `useAuth`, `useUser`
- Un fichier par hook

### Services
- Classes ou fonctions pour encapsuler la logique externe
- `auth.service.ts` pour toute la logique d'authentification
- `api.service.ts` pour les appels HTTP génériques

---

## 🚀 Commandes

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## 📝 TODO / Roadmap Frontend

- [ ] Setup initial (Vite + React + TypeScript + Tailwind + PrimeReact)
- [ ] Configurer les alias `@/` (tsconfig + vite.config)
- [ ] Créer `AuthContext` + `useAuth`
- [ ] Implémenter `auth.service.ts` + `api.service.ts`
- [ ] Créer les guards `ProtectedRoute` + `AdminRoute`
- [ ] Pages : Home, Login, Register
- [ ] Pages : Dashboard, Admin
- [ ] Intégrer le bouton Google OAuth
- [ ] Définir la charte graphique (couleurs, typo)
- [ ] Créer les composants UI de base (Button, Input, Modal)
- [ ] Responsive (desktop-first, compatible mobile)
