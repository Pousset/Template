# CLAUDE.md - Frontend Portfolio App

## 🎯 Identité du Projet

**Nom** : Portfolio App  
**Concept** : Site web avec authentification (username ou Google OAuth), espace utilisateur connecté, et espace admin protégé.

**Version Actuelle** : 0.3.0  
**Dernière Mise à Jour** : Juin 2026

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes

#### Infrastructure & Config

- ✅ Setup initial (Vite + React 19 + TypeScript + Tailwind CSS 4.x + PrimeReact)
- ✅ Alias `@/` configurés (tsconfig + vite.config)
- ✅ Dockerfile + nginx.conf + .dockerignore
- ✅ vercel.json (déploiement)

#### Authentification

- ✅ `auth.service.ts` — register, login, logout, getMe, saveToken, getToken, loginWithGoogle
- ✅ `api.service.ts` — apiFetch générique avec injection automatique du JWT
- ✅ Stockage du JWT en localStorage (`access_token`)
- ✅ Déconnexion avec nettoyage du token

#### Contexte & Hooks

- ✅ `AuthContext` — user, isLoading, isAdmin, login, logout
- ✅ Hydratation au démarrage via `GET /auth/me`
- ✅ `useAuth` — hook d'accès au contexte auth

#### Guards & Routing

- ✅ `App.tsx` — routing complet avec BrowserRouter
- ✅ `<ProtectedRoute>` — redirige vers `/login` si non connecté
- ✅ `<AdminRoute>` — redirige vers `/login` si non connecté, vers `/` si pas admin

#### Pages — Logique

- ✅ `Login` (`/login`) — formulaire fonctionnel, redirect selon rôle (admin → /admin, user → /dashboard)
- ✅ `Register` (`/register`) — formulaire fonctionnel, redirect vers /dashboard
- ✅ Bouton "Connexion avec Google" présent (attend le backend OAuth)

#### Types

- ✅ `user.types.ts` — `UserRole`, `User`, `AuthResponse`

### ⏳ En cours / À faire

#### Pages — UI complète ✅

- ✅ `Home` (`/`) — UI complète (affichage conditionnel connecté/non connecté)
- ✅ `Login` (`/login`) — logique + style complets
- ✅ `Register` (`/register`) — logique + style complets
- ✅ `Dashboard` (`/dashboard`) — UI complète
- ✅ `Admin` (`/admin`) — UI complète

#### Composants

- ✅ `components/layout/Navbar.tsx`
- ✅ `components/layout/Footer.tsx`
- ✅ `components/layout/Layout.tsx`
- [ ] `components/ui/` — Button, Input, Modal...
- [ ] `components/auth/` — GoogleButton stylisé

#### Design System

- [ ] Charte graphique (couleurs, typo) — à documenter
- [ ] Configuration PrimeReact PassThrough (`src/prime/index.tsx` — à compléter)
- [ ] Responsive (desktop-first, compatible mobile)

#### Google OAuth

- ✅ `AuthCallback` (`/auth/callback`) — lit le token en query param, appelle `getMe()`, redirige vers `/dashboard` ou `/login`

---

## 📦 Stack Technique

| Outil           | Version                          |
| --------------- | -------------------------------- |
| Framework       | React 19                         |
| Language        | TypeScript                       |
| Build Tool      | Vite 5.x                         |
| CSS Framework   | Tailwind CSS 4.x                 |
| Routing         | React Router DOM                 |
| UI Components   | PrimeReact (PassThrough API)     |
| Package Manager | pnpm                             |
| Auth            | JWT + Google OAuth (via backend) |
| Port dev        | `5173`                           |
| API URL         | `http://localhost:3001` (`.env`) |

---

## 🏗️ Structure du Projet

```
frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Footer.tsx          # ✅
│   │       ├── Layout.tsx          # ✅
│   │       └── Navbar.tsx          # ✅
│   ├── context/
│   │   └── AuthContext.tsx         # ✅ Contexte global auth
│   ├── guards/
│   │   ├── ProtectedRoute.tsx      # ✅
│   │   └── AdminRoute.tsx          # ✅
│   ├── hooks/
│   │   └── useAuth.ts              # ✅
│   ├── pages/
│   │   ├── Home/index.tsx          # ✅ UI complète
│   │   ├── Login/index.tsx         # ✅ UI complète
│   │   ├── Register/index.tsx      # ✅ UI complète
│   │   ├── Dashboard/index.tsx     # ✅ UI complète
│   │   ├── Admin/index.tsx         # ✅ UI complète
│   │   └── AuthCallback/index.tsx  # ✅ Callback Google OAuth
│   ├── services/
│   │   ├── api.service.ts          # ✅
│   │   └── auth.service.ts         # ✅
│   ├── types/
│   │   └── user.types.ts           # ✅
│   ├── App.tsx                     # ✅
│   ├── main.tsx                    # ✅
│   ├── index.css                   # ⏳ thème Tailwind à définir
│   └── vite-env.d.ts               # ✅
└── ...
```

> Note : `src/prime/` supprimé de la structure active (non présent dans le projet). À recréer si la customisation PrimeReact PassThrough est reprise.

---

## 🔐 Système d'Authentification (Frontend)

### Flux de connexion classique ✅

```
Login form → auth.service.login() → POST /auth/login
           → JWT reçu → localStorage.setItem('access_token')
           → AuthContext mis à jour (login())
           → Redirect : admin → /admin, user → /dashboard
```

### Flux Google OAuth ✅

```
Clic "Connexion Google" → window.location.href = /auth/google
                        → Google callback → JWT renvoyé par backend en query param
                        → Page /auth/callback → saveToken() → getMe() → redirect /dashboard
```

### Persistance de session ✅

```
App mount → getToken() → GET /auth/me
          → setUser() si valide
          → authService.logout() si invalide
```

---

## 🧩 Services

### `auth.service.ts` ✅

```typescript
register(username, password): Promise<AuthResponse>
login(username, password): Promise<AuthResponse>
logout(): void
getMe(): Promise<User>
getToken(): string | null
saveToken(token: string): void
loginWithGoogle(): void  // window.location.href = VITE_API_URL/auth/google
```

### `api.service.ts` ✅

```typescript
apiFetch<T>(endpoint, options?): Promise<T>
// Injecte automatiquement : Authorization: Bearer <token>
```

---

## 🧭 Routing ✅

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<Admin />} />
  </Route>
</Routes>
```

---

## 🗂️ Types Partagés ✅

```typescript
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  role: UserRole;
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

### Palette de Couleurs ⏳

_(à définir — modifier `src/index.css`)_

```css
@import 'tailwindcss';

@theme {
  --color-primary: ;
  --color-primary-light: ;
  --color-primary-dark: ;
  --color-bg-primary: ;
  --color-bg-secondary: ;
  --color-text-primary: ;
  --color-text-secondary: ;
  --color-text-muted: ;
  --color-success: ;
  --color-error: ;
  --color-warning: ;
}
```

### Typographie ⏳

_(à définir — éviter Inter/Roboto)_

---

## 🎨 Configuration PrimeReact (PassThrough API)

### Architecture

```
src/prime/
├── index.tsx                # Export customTheme (actuellement vide)
└── components/              # À créer
    ├── inputText.ts
    ├── button.ts
    └── ...
```

### Setup dans `main.tsx`

```tsx
import { PrimeReactProvider } from 'primereact/api';
import { usePassThrough } from 'primereact/passthrough';
import Tailwind from 'primereact/passthrough/tailwind';
import { customTheme } from '@/prime';

const CustomTailwind = usePassThrough(Tailwind, customTheme, {
  mergeSections: true,
  mergeProps: false,
});

<PrimeReactProvider value={CustomTailwind}>
  <App />
</PrimeReactProvider>;
```

### Ressources

- [Documentation PassThrough API](https://primereact.org/passthrough/)
- [Tailwind PassThrough Base](https://github.com/primefaces/primereact/blob/master/components/lib/passthrough/tailwind/index.js)

---

## 🗃️ Gestion d'État

### AuthContext ✅

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}
```

> Note : `token` n'est pas exposé dans le contexte — il est lu directement via `authService.getToken()` dans `apiFetch`.

### LocalStorage

| Clé            | Valeur                     |
| -------------- | -------------------------- |
| `access_token` | JWT renvoyé par le backend |

---

## 🎯 Conventions Spécifiques

### Imports

- Alias `@/` pour tous les imports internes
- `tsconfig.app.json` : `"@/*": ["./src/*"]`

### Composants

- Dossier par page : `PageName/index.tsx`
- Composants simples : `ComponentName.tsx`

---

## 🚀 Commandes

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

---

## 📝 TODO / Roadmap Frontend

- [x] Setup initial (Vite + React + TypeScript + Tailwind + PrimeReact)
- [x] Alias `@/` (tsconfig + vite.config)
- [x] `AuthContext` + `useAuth`
- [x] `auth.service.ts` + `api.service.ts`
- [x] Guards `ProtectedRoute` + `AdminRoute`
- [x] Pages Login + Register (logique + UI)
- [x] Pages Home, Dashboard, Admin (UI complète)
- [x] Navbar + Footer + Layout
- [x] Gestion callback Google OAuth (`/auth/callback`)
- [x] Créer composants UI de base (Button, Input...)
- [x] GoogleButton stylisé (`components/auth/`)
- [x] Responsive
- [x] Définir la charte graphique (couleurs, typo) dans `index.css`
<!-- A voir a l'avenir -->
- [ ] Configuration PrimeReact PassThrough (`src/prime/`)
