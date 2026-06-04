# Portfolio App

Template de site web minimaliste avec authentification et espace admin.

## Stack

|                 |                                          |
| --------------- | ---------------------------------------- |
| Frontend        | React 19, TypeScript, Vite, Tailwind CSS |
| Backend         | NestJS, TypeScript, TypeORM              |
| Base de données | SQLite (dev) / PostgreSQL (prod)         |
| Auth            | JWT + Google OAuth 2.0                   |

## Structure

```
Web/
├── frontend/   # React 19 + Vite
├── backend/    # NestJS + TypeORM
└── docker-compose.yml
```

## Démarrage rapide

```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend (nouveau terminal)
cd frontend && npm install && npm run dev
```

- Frontend : http://localhost:5173
- Backend : http://localhost:3001

## Fonctionnalités

- Page d'accueil publique
- Connexion via username/mot de passe ou Google
- Espace utilisateur connecté
- Espace admin protégé (accès restreint)

## Branches

- `main` — production
- `develop` — développement
