# CLAUDE.md - Backend Portfolio App

## 📦 Stack Technique

- **Framework** : NestJS 11
- **Language** : TypeScript 5.3.3
- **Base de données** : SQLite (dev: `app.sqlite`), PostgreSQL (prod)
- **ORM** : TypeORM 0.3.28
- **Authentification** : JWT (`@nestjs/jwt`, `@nestjs/passport`) + Google OAuth 2.0 (`passport-google-oauth20`)
- **Validation** : class-validator, class-transformer
- **Hachage** : bcrypt
- **Port** : `3001` (configuré dans `.env`)
- **CORS** : `http://localhost:5173`
- **Package manager** : npm

**Version Actuelle** : 0.4.0  
**Dernière Mise à Jour** : Juin 2026

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes

#### Auth

- ✅ Inscription classique (`POST /auth/register`) — publique, hash bcrypt, retourne JWT
- ✅ Connexion classique (`POST /auth/login`) — publique, retourne JWT
- ✅ Stratégie JWT (`passport-jwt`) + `JwtAuthGuard`
- ✅ Endpoint `GET /auth/me` — retourne l'utilisateur connecté (JWT requis)

#### User

- ✅ Entité `User` avec rôle (`user` | `admin`)
- ✅ `UserService` — CRUD utilisateurs

#### Admin

- ✅ `RolesGuard` + `@Roles('admin')` — protège les routes admin
- ✅ `GET /admin/dashboard` — protégé JWT + Admin
- ✅ `GET /admin/users` — liste tous les utilisateurs (JWT + Admin)
- ✅ `PATCH /admin/users/:id/role` — modifie le rôle d'un utilisateur (JWT + Admin)

#### Seed

- ✅ `SeedService` (`src/database/seed.service.ts`) — crée le compte admin au démarrage
  - Déclenché via `onApplicationBootstrap`
  - Credentials lus depuis `ADMIN_USERNAME` + `ADMIN_PASSWORD` (variables d'env)
  - Ignoré silencieusement si le compte existe déjà (idempotent)
  - Log NestJS si création effective, warning si variables absentes
- ✅ Promotion d'un compte Google en admin via `ADMIN_GOOGLE_EMAIL` (variable d'env)
  - Idempotent — ignoré si déjà admin
  - Warning si le compte n'est pas encore en base (pas encore connecté via Google)
- ✅ `SeedModule` (`src/database/seed.module.ts`) — enregistré dans `AppModule`

#### Google OAuth

- ✅ Google OAuth 2.0 (`passport-google-oauth20`)
  - ✅ `GoogleStrategy` — upsert user via `googleId` + `email`, émet JWT
  - ✅ `GoogleAuthGuard`
  - ✅ `GET /auth/google` → redirect vers Google
  - ✅ `GET /auth/google/callback` → upsert user + JWT + redirect frontend (`/auth/callback?token=...`)

#### Base de données

- ✅ Config TypeORM avec SSL conditionnel via variable `DB_SSL`
  - `DB_SSL=false` → pas de SSL (Docker local, dev)
  - `DB_SSL=true` → `{ rejectUnauthorized: false }` (prod cloud)

#### Tests

- ✅ Tests unitaires — 39 tests, 5 suites, tous passants
  - `user.service.spec.ts` — CRUD utilisateurs
  - `auth.service.spec.ts` — register, login, Google OAuth
  - `auth.controller.spec.ts` — délégation AuthService, redirect Google callback
  - `admin.spec.ts` — AdminService + AdminController
  - `seed.service.spec.ts` — seed admin + promotion Google

---

## 🔐 Routes & Protection

| Route                   | Méthode | Protection  | Description                               |
| ----------------------- | ------- | ----------- | ----------------------------------------- |
| `/auth/register`        | POST    | Publique    | Inscription classique                     |
| `/auth/login`           | POST    | Publique    | Connexion classique                       |
| `/auth/me`              | GET     | JWT         | Utilisateur connecté                      |
| `/auth/google`          | GET     | Publique    | Redirect vers Google OAuth                |
| `/auth/google/callback` | GET     | Publique    | Callback Google → JWT → redirect frontend |
| `/admin/dashboard`      | GET     | JWT + Admin | Dashboard admin                           |
| `/admin/users`          | GET     | JWT + Admin | Liste des utilisateurs                    |
| `/admin/users/:id/role` | PATCH   | JWT + Admin | Modification de rôle                      |

---

## 🏗️ Structure du Projet

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts          # Validation du JWT ✅
│   │   │   │   └── google.strategy.ts       # OAuth Google ✅
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts        # ✅
│   │   │   │   ├── google-auth.guard.ts     # ✅
│   │   │   │   └── roles.guard.ts           # ✅
│   │   │   ├── decorators/
│   │   │   │   └── roles.decorator.ts       # @Roles('admin') ✅
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts          # ✅
│   │   │   │   └── login.dto.ts             # ✅
│   │   │   ├── auth.controller.ts           # /auth/* ✅
│   │   │   ├── auth.service.ts              # ✅
│   │   │   └── auth.module.ts               # ✅
│   │   ├── user/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts           # ✅
│   │   │   ├── user.service.ts              # ✅
│   │   │   └── user.module.ts               # ✅
│   │   └── admin/
│   │       ├── admin.controller.ts          # /admin/* ✅
│   │       ├── admin.service.ts             # ✅
│   │       └── admin.module.ts              # ✅
│   ├── config/
│   │   └── database.config.ts               # ✅ SSL conditionnel via DB_SSL
│   ├── database/
│   │   ├── data-source.ts
│   │   ├── seed.service.ts                  # ✅
│   │   ├── seed.module.ts                   # ✅
│   │   ├── migrations/                      # ⏳ à créer pour la prod
│   │   └── run-migrations.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── user.service.spec.ts                 # ✅
│   ├── auth.service.spec.ts                 # ✅
│   ├── auth.controller.spec.ts              # ✅
│   ├── admin.spec.ts                        # ✅
│   └── seed.service.spec.ts                 # ✅
├── Dockerfile                               # ✅ Multi-stage (builder + production)
├── .env
├── .env.example
├── app.sqlite                               # ⚠️ gitignore
└── package.json
```

---

## 🗄️ Schéma de Base de Données (TypeORM)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  username: string | null;

  @Column({ unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true, select: false })
  passwordHash: string | null;

  @Column({ nullable: true, unique: true })
  googleId: string | null;

  @Column({ default: 'user' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🐳 Docker

### Dockerfile (multi-stage)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main"]
```

### Variables Docker

| Variable       | Valeur Docker      | Notes                               |
| -------------- | ------------------ | ----------------------------------- |
| `DATABASE_URL` | `postgresql://...` | Pointe vers le container `postgres` |
| `DB_SSL`       | `"false"`          | Pas de SSL en local Docker          |
| `NODE_ENV`     | `production`       |                                     |
| `JWT_SECRET`   | À remplacer        | Ne pas committer la vraie valeur    |

---

## ⚙️ Configuration

### Variables d'environnement (`.env`)

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

DATABASE_PATH=app.sqlite
DB_SSL=false

JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me_in_production
ADMIN_GOOGLE_EMAIL=ton.email@gmail.com
```

---

## 🚀 Commandes

```bash
npm run start:dev
npm run build
npm run start:prod
npm run test
npm run test:cov
npm run migration:generate -- src/database/migrations/NomMigration
npm run migration:run
npm run migration:revert
```

---

## 📝 TODO / Roadmap Backend

- [x] Auth classique (register, login, JWT)
- [x] Google OAuth
- [x] Système de rôles (user / admin)
- [x] Routes admin protégées
- [x] SeedService + SeedModule
- [x] Tests unitaires (39 tests)
- [x] Config TypeORM SSL conditionnel (DB_SSL)
- [x] Dockerfile multi-stage
- [ ] Migrations TypeORM pour la production
- [ ] CI/CD GitHub Actions
