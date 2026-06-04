# Backend — Portfolio App

API REST du projet Portfolio App.

## Stack

- NestJS 11 + TypeScript
- TypeORM
- SQLite (dev) / PostgreSQL (prod)
- JWT + Passport + Google OAuth 2.0

## Démarrage

```bash
npm install
npm run start:dev
```

Disponible sur http://localhost:3001

## Scripts

```bash
npm run start:dev    # Développement (watch)
npm run build        # Build production
npm run start:prod   # Production
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end
```

## Structure

```

src/
├── modules/
│   ├── auth/    # Inscription, connexion, JWT, Google OAuth
│   ├── user/    # Entité User, CRUD
│   └── admin/   # Routes admin protégées
├── config/      # Configuration base de données
└── database/    # Migrations TypeORM
test/

```

## Endpoints principaux

| Méthode | Route              | Description          |
| ------- | ------------------ | -------------------- |
| POST    | `/auth/register`   | Inscription          |
| POST    | `/auth/login`      | Connexion            |
| GET     | `/auth/me`         | Utilisateur connecté |
| GET     | `/auth/google`     | Connexion Google     |
| GET     | `/admin/dashboard` | Dashboard admin      |

## Variables d'environnement

Copier `.env.example` en `.env` :

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
DATABASE_PATH=app.sqlite
```
