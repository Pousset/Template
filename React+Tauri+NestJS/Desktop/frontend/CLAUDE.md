# CLAUDE.md - Frontend Portfolio App

## 🎯 Identité du Projet

**Nom** : Portfolio App  
**Concept** : Site web avec authentification (username ou Google OAuth), espace utilisateur connecté, et espace admin protégé.

**Version Actuelle** : 0.4.0  
**Dernière Mise à Jour** : Juin 2026

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes

#### Infrastructure & Config

- ✅ Setup initial (Vite + React 19 + TypeScript + Tailwind CSS 4.x)
- ✅ Alias `@/` configurés (tsconfig + vite.config)
- ✅ Dockerfile multi-stage (node:22-alpine builder + nginx:alpine production)
- ✅ nginx.conf
- ✅ vercel.json (déploiement)
- ✅ Package manager : **npm**

#### Authentification

- ✅ `auth.service.ts` — register, login, logout, getMe, saveToken, getToken, loginWithGoogle
- ✅ `api.service.ts` — apiFetch générique avec injection automatique du JWT
- ✅ Stockage du JWT en localStorage (`access_token`)
- ✅ Déconnexion avec nettoyage du token

#### Contexte & Hooks

- ✅ `AuthContext` — user, isLoading, isAdmin, login, logout
- ✅ `ThemeContext` — dark/light mode, toggle, persistance
- ✅ Hydratation au démarrage via `GET /auth/me`
- ✅ `useAuth` — hook d'accès au contexte auth
- ✅ `useTheme` — hook d'accès au contexte theme

#### Guards & Routing

- ✅ `App.tsx` — routing complet avec BrowserRouter
- ✅ `<ProtectedRoute>` — redirige vers `/login` si non connecté
- ✅ `<AdminRoute>` — redirige vers `/login` si non connecté, vers `/` si pas admin

#### Pages

- ✅ `Home` (`/`) — UI complète (affichage conditionnel connecté/non connecté)
- ✅ `Login` (`/login`) — logique + style complets
- ✅ `Register` (`/register`) — logique + style complets
- ✅ `Dashboard` (`/dashboard`) — UI complète
- ✅ `Admin` (`/admin`) — UI complète
- ✅ `AuthCallback` (`/auth/callback`) — lit le token en query param, appelle `getMe()`, redirige

#### Composants UI (custom, pas PrimeReact)

- ✅ `components/ui/Button.tsx` — variants (primary, secondary, ghost, danger), sizes, isLoading, forwardRef
- ✅ `components/ui/Input.tsx` — label, error, hint, leftIcon, rightIcon, forwardRef
- ✅ `components/auth/AuthFormWrapper.tsx`
- ✅ `components/auth/AuthDivider.tsx`
- ✅ `components/auth/FormField.tsx`
- ✅ `components/auth/GoogleSignInButton.tsx`
- ✅ `components/shared/Avatar.tsx`
- ✅ `components/shared/ErrorMessage.tsx`
- ✅ `components/layout/Navbar.tsx` — liens conditionnels, theme toggle, avatar
- ✅ `components/layout/Footer.tsx` — liens sociaux, copyright
- ✅ `components/layout/Layout.tsx`

#### Design System

- ✅ Charte graphique dans `src/index.css` — dark mode (défaut) + light mode
- ✅ Polices : Inter (sans) + JetBrains Mono (mono)
- ✅ CSS variables : text, bg, border, accent, success, error, warning
- ✅ Dark/light mode via classe `.dark` sur `<html>`

#### Types

- ✅ `user.types.ts` — `UserRole`, `User`, `AuthResponse`

---

## 📦 Stack Technique

| Outil           | Version                                        |
| --------------- | ---------------------------------------------- |
| Framework       | React 19                                       |
| Language        | TypeScript (strict + verbatimModuleSyntax)     |
| Build Tool      | Vite 5.x                                       |
| CSS Framework   | Tailwind CSS 4.x                               |
| Routing         | React Router DOM                               |
| UI Components   | Composants custom (pas PrimeReact PassThrough) |
| Package Manager | npm                                            |
| Auth            | JWT + Google OAuth (via backend)               |
| Port dev        | `5173`                                         |
| Port Docker     | `5173→80` (nginx)                              |
| API URL         | `http://localhost:3001` (`.env`)               |

> **Note PrimeReact** : La lib est installée mais le PassThrough n'est pas configuré. Décision suspendue — les composants UI sont custom pour garder le contrôle et la légèreté du bundle.

---

## 🏗️ Structure du Projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthDivider.tsx         # ✅
│   │   │   ├── AuthFormWrapper.tsx     # ✅
│   │   │   ├── FormField.tsx           # ✅
│   │   │   └── GoogleSignInButton.tsx  # ✅
│   │   ├── layout/
│   │   │   ├── Footer.tsx              # ✅
│   │   │   ├── Layout.tsx              # ✅
│   │   │   └── Navbar.tsx              # ✅
│   │   ├── shared/
│   │   │   ├── Avatar.tsx              # ✅
│   │   │   └── ErrorMessage.tsx        # ✅
│   │   └── ui/
│   │       ├── Button.tsx              # ✅
│   │       └── Input.tsx               # ✅
│   ├── context/
│   │   ├── AuthContext.tsx             # ✅
│   │   └── ThemeContext.tsx            # ✅
│   ├── guards/
│   │   ├── AdminRoute.tsx              # ✅
│   │   └── ProtectedRoute.tsx          # ✅
│   ├── hooks/
│   │   ├── useAuth.ts                  # ✅
│   │   └── useTheme.ts                 # ✅ (via ThemeContext)
│   ├── pages/
│   │   ├── Admin/index.tsx             # ✅
│   │   ├── AuthCallback/index.tsx      # ✅
│   │   ├── Dashboard/index.tsx         # ✅
│   │   ├── Home/index.tsx              # ✅
│   │   ├── Login/index.tsx             # ✅
│   │   └── Register/index.tsx          # ✅
│   ├── services/
│   │   ├── api.service.ts              # ✅
│   │   └── auth.service.ts             # ✅
│   ├── types/
│   │   └── user.types.ts               # ✅
│   ├── App.tsx                         # ✅
│   ├── main.tsx                        # ✅
│   ├── index.css                       # ✅ Thème dark/light complet
│   └── vite-env.d.ts                   # ✅
├── Dockerfile                          # ✅ Multi-stage
├── nginx.conf                          # ✅
└── ...
```

---

## 🎨 Design System

### Polices

- **Sans** : Inter (300, 400, 500)
- **Mono** : JetBrains Mono (300, 400, 500) — utilisé pour `code`, `pre`, `kbd`, `.font-mono`

### CSS Variables (Tailwind `@theme`)

```css
/* Dark mode (défaut — classe .dark sur <html>) */
--color-text-primary / secondary / muted
--color-bg-deep / primary / surface / elevated
--color-border / border-subtle / border-strong
--color-accent / accent-hover / accent-subtle / accent-border / accent-text / accent-muted
--color-success / success-bg / success-border
--color-error / error-bg / error-border
--color-warning / warning-bg / warning-border
```

### Dark/Light Mode

- Dark mode = défaut (classe `.dark` sur `<html>`)
- Light mode = `:root:not(.dark)`
- Toggle via `ThemeContext` → `toggleTheme()`

---

## 🔐 Système d'Authentification (Frontend)

### Flux connexion classique

```
Login form → auth.service.login() → POST /auth/login
           → JWT reçu → localStorage.setItem('access_token')
           → AuthContext mis à jour
           → Redirect : admin → /admin, user → /dashboard
```

### Flux Google OAuth

```
Clic "Connexion Google" → window.location.href = VITE_API_URL/auth/google
                        → Google callback → JWT renvoyé par backend en query param
                        → Page /auth/callback → saveToken() → getMe() → redirect /dashboard
```

### Persistance de session

```
App mount → getToken() → GET /auth/me
          → setUser() si valide
          → authService.logout() si invalide
```

---

## ⚠️ Conventions TypeScript Importantes

- `verbatimModuleSyntax` activé → **toujours** `import type` pour les types purs
- `sort-imports` ESLint → membres d'import triés alphabétiquement
- `forwardRef`, `useId`, `useState`... doivent être **explicitement importés** depuis React
- Complexité cyclomatique max : **10** (ESLint) → extraire les fonctions helper si dépassé

```tsx
// ✅ Correct
import { forwardRef, type InputHTMLAttributes, useId } from 'react';

// ❌ Incorrect
import { InputHTMLAttributes, forwardRef, useId } from 'react';
```

---

## 🧩 Services

### `auth.service.ts`

```typescript
register(username, password): Promise<AuthResponse>
login(username, password): Promise<AuthResponse>
logout(): void
getMe(): Promise<User>
getToken(): string | null
saveToken(token: string): void
loginWithGoogle(): void  // window.location.href = VITE_API_URL/auth/google
```

### `api.service.ts`

```typescript
apiFetch<T>(endpoint, options?): Promise<T>
// Injecte automatiquement : Authorization: Bearer <token>
```

---

## 🧭 Routing

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

## 🚀 Commandes

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 📝 TODO / Roadmap Frontend

- [x] Setup initial (Vite + React + TypeScript + Tailwind)
- [x] Alias `@/`
- [x] AuthContext + ThemeContext + useAuth
- [x] auth.service.ts + api.service.ts
- [x] Guards ProtectedRoute + AdminRoute
- [x] Pages Login + Register (logique + UI)
- [x] Pages Home, Dashboard, Admin (UI complète)
- [x] Navbar + Footer + Layout
- [x] Callback Google OAuth
- [x] Composants UI : Button, Input
- [x] Composants auth : FormField, AuthFormWrapper, GoogleSignInButton
- [x] Composants shared : Avatar, ErrorMessage
- [x] Charte graphique dark/light dans index.css
- [x] Dockerfile multi-stage + nginx
- [ ] Responsive complet (mobile)
- [ ] CI/CD GitHub Actions
- [ ] PrimeReact PassThrough (optionnel — décision suspendue)
