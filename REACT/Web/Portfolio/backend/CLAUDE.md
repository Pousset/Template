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

**Version Actuelle** : 0.3.0  
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
- ✅ `SeedModule` (`src/database/seed.module.ts`) — enregistré dans `AppModule`

#### Google OAuth

- ✅ Google OAuth 2.0 (`passport-google-oauth20`)
  - ✅ `GoogleStrategy` — upsert user via `googleId` + `email`, émet JWT
  - ✅ `GoogleAuthGuard`
  - ✅ `GET /auth/google` → redirect vers Google
  - ✅ `GET /auth/google/callback` → upsert user + JWT + redirect frontend (`/auth/callback?token=...`)

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
│   │   │   │   ├── jwt-auth.guard.ts        # Protège les routes auth ✅
│   │   │   │   ├── google-auth.guard.ts     # Protège les routes Google OAuth ✅
│   │   │   │   └── roles.guard.ts           # Protège les routes admin ✅
│   │   │   ├── decorators/
│   │   │   │   └── roles.decorator.ts       # @Roles('admin') ✅
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts          # ✅
│   │   │   │   └── login.dto.ts             # ✅
│   │   │   ├── auth.controller.ts           # /auth/* ✅ (register, login, me, google, google/callback)
│   │   │   ├── auth.service.ts              # Logique login/register/JWT ✅
│   │   │   └── auth.module.ts               # ✅
│   │   ├── user/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts           # Entité TypeORM ✅
│   │   │   ├── user.service.ts              # CRUD utilisateurs ✅
│   │   │   └── user.module.ts               # ✅
│   │   └── admin/
│   │       ├── admin.controller.ts          # /admin/* ✅
│   │       ├── admin.service.ts             # ✅
│   │       └── admin.module.ts              # ✅
│   ├── config/
│   │   └── database.config.ts               # Config TypeORM
│   ├── database/
│   │   ├── data-source.ts
│   │   ├── seed.service.ts              # ✅ Seed admin au démarrage
│   │   ├── seed.module.ts               # ✅
│   │   ├── migrations/
│   │   └── run-migrations.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
├── app.sqlite
└── package.json
```

---

## 🗄️ Schéma de Base de Données (TypeORM)

```typescript
// src/modules/user/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'user' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  username: string | null; // null si connexion Google sans username défini

  @Column({ unique: true, nullable: true })
  email: string | null; // requis pour Google OAuth

  @Column({ nullable: true, select: false })
  passwordHash: string | null; // null si connexion Google uniquement

  @Column({ nullable: true, unique: true })
  googleId: string | null; // null si inscription classique

  @Column({ default: 'user' })
  role: UserRole; // 'user' | 'admin'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔐 Authentification

### Flux inscription classique

```
POST /auth/register { username, password }
→ Vérifier unicité username
→ Hash password (bcrypt, saltRounds: 10)
→ Créer User (role: 'user')
→ Générer JWT
→ Renvoyer { accessToken, user }
```

### Flux connexion classique

```
POST /auth/login { username, password }
→ Trouver User par username
→ Vérifier bcrypt.compare(password, passwordHash)
→ Générer JWT
→ Renvoyer { accessToken, user }
```

### Flux Google OAuth ✅

```
GET /auth/google                         → Redirect vers Google
GET /auth/google/callback                → Google rappelle ici
→ Upsert User (googleId + email + displayName)
→ Générer JWT
→ Redirect frontend : ${FRONTEND_URL}/auth/callback?token=<jwt>
```

**Piège `.env` :** `GOOGLE_CALLBACK_URL` doit être seul sur sa ligne — aucun paramètre parasite (`flowName=...`) ne doit y être accolé.

### JWT Payload

```typescript
interface JwtPayload {
  sub: string; // user.id
  username: string;
  role: UserRole;
}
```

---

## 📡 API REST Endpoints

### Auth

#### `POST /auth/register` ✅

**Body** :

```json
{ "username": "string (3-20 chars)", "password": "string (min 8 chars)" }
```

**Response** :

```json
{
  "accessToken": "string",
  "user": { "id": "uuid", "username": "string", "role": "user" }
}
```

#### `POST /auth/login` ✅

**Body** :

```json
{ "username": "string", "password": "string" }
```

**Response** :

```json
{
  "accessToken": "string",
  "user": { "id": "uuid", "username": "string", "role": "user|admin" }
}
```

#### `GET /auth/me` 🔒 ✅

**Response** : Objet `User` sans `passwordHash`

#### `GET /auth/google` ✅

Redirige vers Google OAuth. Déclenché par `GoogleAuthGuard`.

#### `GET /auth/google/callback` ✅

Callback Google → upsert user → génère JWT → redirige vers `${FRONTEND_URL}/auth/callback?token=<jwt>`.

---

### Admin ✅

#### `GET /admin/dashboard` 🔒🛡️

#### `GET /admin/users` 🔒🛡️

Liste tous les utilisateurs.

#### `PATCH /admin/users/:id/role` 🔒🛡️

**Body** : `{ "role": "user" | "admin" }`

---

## 🛡️ Guards & Décorateurs

### `GoogleAuthGuard` ✅

Lance le flux OAuth Google via Passport. Utilisé sur `GET /auth/google` et `GET /auth/google/callback`.

### `JwtAuthGuard` ✅

Vérifie la présence et la validité du JWT dans le header `Authorization: Bearer <token>`.

### `RolesGuard` ✅

Vérifie que l'utilisateur a le rôle requis.  
→ Toujours combiné avec `JwtAuthGuard`.

### `@Roles('admin')` ✅

```typescript
@Get('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getDashboard() { ... }
```

---

## 🔧 DTOs avec class-validator

```typescript
// register.dto.ts
export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// login.dto.ts
export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
```

---

## ⚙️ Configuration

### Variables d'environnement (`.env`)

```env
# App
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Base de données
DATABASE_PATH=app.sqlite

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Seed admin initial (laisser vide pour désactiver)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me_in_production
```

### TypeORM Config

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'app.sqlite',
  entities: [User],
  synchronize: true, // ⚠️ false en production
  logging: false,
});
```

---

## 🚀 Commandes

### Depuis `backend/`

```bash
npm run start:dev
npm run build
npm run start:prod
npm run test
npm run migration:generate -- src/database/migrations/NomMigration
npm run migration:run
npm run migration:revert
```

### Depuis la racine `Portfolio/`

```bash
npm run dev:backend      # démarre NestJS seul
npm run dev              # démarre backend + frontend en parallèle (concurrently)
```

---

## 📝 TODO / Roadmap Backend

- [x] Installer les dépendances auth
- [x] Créer l'entité `User`
- [x] Implémenter `AuthService` (register, login, JWT)
- [x] Implémenter `JwtStrategy` + `JwtAuthGuard`
- [x] Implémenter `RolesGuard` + `@Roles()`
- [x] Créer `AdminController` + `AdminService` (dashboard, users, patch role)
- [x] Configurer les variables d'environnement
- [x] `SeedService` + `SeedModule` — création admin au démarrage via variables d'env
- [x] Implémenter Google OAuth (`GoogleStrategy` + `GoogleAuthGuard` + routes callback)
- [ ] Tests unitaires `AuthService`
- [ ] Migrations TypeORM pour la production
- [ ] Migration PostgreSQL (prod)
