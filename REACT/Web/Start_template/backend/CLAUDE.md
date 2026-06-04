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

**Version Actuelle** : 0.1.0  
**Dernière Mise à Jour** : Juin 2026

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes

_(à remplir au fur et à mesure)_

### ⏳ En cours / À faire

#### Auth

- [ ] Inscription classique (username + mot de passe hashé)
- [ ] Connexion classique → JWT
- [ ] Stratégie JWT (`passport-jwt`)
- [ ] Google OAuth 2.0 (`passport-google-oauth20`)
- [ ] `JwtAuthGuard` — protège les routes
- [ ] `RolesGuard` + `@Roles('admin')` — protège les routes admin
- [ ] Endpoint `GET /auth/me` — récupère l'utilisateur connecté

#### User

- [ ] Entité `User` avec rôle (`user` | `admin`)
- [ ] `UserService` — CRUD utilisateurs
- [ ] Plusieurs comptes admin possibles

#### Admin

- [ ] `AdminController` — routes exclusives admin
- [ ] `AdminService` — logique admin (liste users, attribution rôle...)

---

## 🏗️ Structure du Projet

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts          # Validation du JWT
│   │   │   │   └── google.strategy.ts       # OAuth Google
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts        # Protège les routes auth
│   │   │   │   └── roles.guard.ts           # Protège les routes admin
│   │   │   ├── decorators/
│   │   │   │   └── roles.decorator.ts       # @Roles('admin')
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   ├── auth.controller.ts           # /auth/register, /auth/login, /auth/google
│   │   │   ├── auth.service.ts              # Logique login/register/JWT
│   │   │   └── auth.module.ts
│   │   ├── user/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts           # Entité TypeORM
│   │   │   ├── user.controller.ts           # /users (admin only)
│   │   │   ├── user.service.ts              # CRUD utilisateurs
│   │   │   └── user.module.ts
│   │   └── admin/
│   │       ├── admin.controller.ts          # /admin/* (admin only)
│   │       ├── admin.service.ts
│   │       └── admin.module.ts
│   ├── config/
│   │   └── database.config.ts               # Config TypeORM
│   ├── database/
│   │   ├── data-source.ts
│   │   ├── migrations/
│   │   └── run-migrations.ts
│   ├── app.module.ts
│   └── main.ts
├── .env                                     # Variables d'environnement
├── .env.example                             # Template
├── app.sqlite                               # BDD SQLite (dev)
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

### Flux Google OAuth

```
GET /auth/google                         → Redirect vers Google
GET /auth/google/callback                → Google rappelle ici
→ Upsert User (googleId + email)
→ Générer JWT
→ Redirect frontend avec token en query param
```

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

#### `POST /auth/register`

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

#### `POST /auth/login`

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

#### `GET /auth/me` 🔒 _(JWT requis)_

**Response** : Objet `User` sans `passwordHash`

#### `GET /auth/google`

Redirige vers Google OAuth.

#### `GET /auth/google/callback`

Callback Google → génère JWT → redirige vers frontend.

---

### Users _(admin only)_

#### `GET /users` 🔒🛡️

Liste tous les utilisateurs.

#### `PATCH /users/:id/role` 🔒🛡️

**Body** : `{ "role": "user" | "admin" }`  
Attribue ou révoque le rôle admin.

---

### Admin

#### `GET /admin/dashboard` 🔒🛡️

Données réservées à l'interface admin. _(À compléter selon les besoins)_

---

## 🛡️ Guards & Décorateurs

### `JwtAuthGuard`

Vérifie la présence et la validité du JWT dans le header `Authorization: Bearer <token>`.  
→ Appliqué sur toutes les routes protégées.

### `RolesGuard`

Vérifie que l'utilisateur a le rôle requis.  
→ Toujours combiné avec `JwtAuthGuard`.

### `@Roles('admin')`

Décorateur custom pour marquer une route comme réservée aux admins.

```typescript
// Utilisation dans un controller
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
# Pour PostgreSQL en prod :
# DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

### TypeORM Config (`src/app.module.ts`)

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'app.sqlite',
  entities: [User],
  synchronize: true, // ⚠️ false en production — utiliser les migrations
  logging: false,
});
```

---

## 🚀 Commandes

```bash
# Développement
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Migrations TypeORM
npm run migration:generate -- src/database/migrations/NomMigration
npm run migration:run
npm run migration:revert
```

---

## 📦 Dépendances à Installer

```bash
# Auth JWT
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @types/passport-jwt --save-dev

# Google OAuth
npm install passport-google-oauth20
npm install @types/passport-google-oauth20 --save-dev

# Bcrypt
npm install bcrypt
npm install @types/bcrypt --save-dev

# Validation
npm install class-validator class-transformer

# Config
npm install @nestjs/config

# TypeORM + drivers
npm install @nestjs/typeorm typeorm better-sqlite3 pg
npm install @types/better-sqlite3 --save-dev
```

---

## 🎯 Conventions Spécifiques NestJS

### Imports

- **Utiliser les alias `@/`** pour tous les imports internes
- Exemple : `import { User } from '@/modules/user/entities/user.entity';`
- Configuration dans `tsconfig.json` : `"@/*": ["src/*"]`

### Modules

- Un module par domaine fonctionnel (`auth`, `user`, `admin`)
- Exports explicites des services partagés entre modules

### Services

- Toute la logique métier dans les services
- Controllers minimalistes (valider DTO → appeler service → retourner résultat)

### Erreurs

- Utiliser les exceptions NestJS : `NotFoundException`, `UnauthorizedException`, `BadRequestException`, `ForbiddenException`
- Ne jamais exposer les détails internes dans les messages d'erreur

### Sécurité

- Ne jamais retourner `passwordHash` dans les réponses (utiliser `select: false` sur la colonne)
- Valider tous les inputs avec les DTOs et class-validator
- Vérifier l'appartenance des ressources avant modification

---

## 📝 TODO / Roadmap Backend

- [ ] Installer les dépendances auth
- [ ] Créer l'entité `User`
- [ ] Implémenter `AuthService` (register, login, JWT)
- [ ] Implémenter `JwtStrategy` + `JwtAuthGuard`
- [ ] Implémenter Google OAuth (`GoogleStrategy`)
- [ ] Implémenter `RolesGuard` + `@Roles()`
- [ ] Créer `AdminController` + `AdminService`
- [ ] Configurer les variables d'environnement
- [ ] Migrations TypeORM pour la production
- [ ] Tests unitaires `AuthService`
- [ ] Migration PostgreSQL (prod)
