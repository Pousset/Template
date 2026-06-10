# Frontend — Portfolio App

Interface utilisateur du projet Portfolio App.

## Stack

- React 19 + TypeScript
- Vite 5
- Tailwind CSS 4
- PrimeReact (PassThrough API)
- React Router DOM

## Démarrage

```bash
npm install
npm run dev
```

Disponible sur http://localhost:5173

## Scripts

```bash
npm run dev       # Développement
npm run build     # Build production
npm run preview   # Preview du build
npm run lint      # Lint
```

## Structure

```
src/
├── components/
│   ├── auth/      # LoginForm, RegisterForm, GoogleButton
│   ├── layout/    # Navbar, Footer
│   └── ui/        # Composants réutilisables
├── context/       # AuthContext
├── guards/        # ProtectedRoute, AdminRoute
├── hooks/         # useAuth
├── pages/         # Home, Login, Register, Dashboard, Admin
├── services/      # api.service.ts, auth.service.ts
└── types/         # Types TypeScript
```

## Variables d'environnement

Copier `.env.example` en `.env` :

```env
VITE_API_URL=http://localhost:3001
```
