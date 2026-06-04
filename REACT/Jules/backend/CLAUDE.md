# CLAUDE.md - Backend Buzzer

## 📦 Stack Technique

- **Framework** : NestJS 11.0.1
- **Language** : TypeScript 5.3.3
- **Base de données** : SQLite (dev: buzzer.sqlite), PostgreSQL (prod-ready)
- **ORM** : TypeORM 0.3.28
- **Temps réel** : Socket.io 4.8.3 (@nestjs/websockets, @nestjs/platform-socket.io)
- **Validation** : class-validator, class-transformer
- **Port** : 3001 (configuré dans .env)
- **CORS** : Multiple origins (localhost:5173, localhost:5174)

**Version Actuelle** : 2.0.0  
**Dernière Mise à Jour** : Janvier 2026

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes

#### Gestion de Session
- ✅ Création de session avec master player
- ✅ Génération de token unique (6 caractères)
- ✅ Validation d'unicité du token
- ✅ Configuration de partie (durée, temps réponse, temps mute)
- ✅ Suppression de session avec nettoyage complet
- ✅ Mise à jour de configuration
- ✅ Gestion des états (LOBBY, PLAYING, FINISHED)

#### Gestion des Joueurs
- ✅ Création de joueur avec avatar personnalisé (emoji + couleur)
- ✅ Persistance des avatars en base de données
- ✅ Système de master/player
- ✅ Tracking de connexion (isConnected)
- ✅ Expulsion de joueurs
- ✅ Scoring et classement
- ✅ Gestion du statut mute
- ✅ Timer de mute automatique

#### Système de Jeu
- ✅ Détection du premier buzzer
- ✅ Verrouillage automatique après premier clic
- ✅ Reset du buzzer par le maître
- ✅ Gestion des tours de jeu
- ✅ Attribution de points
- ✅ Calcul des résultats finaux

#### Système de Rematch
- ✅ Vote pour rejouer
- ✅ Comptage des votes requis (75% des joueurs)
- ✅ Acceptation automatique si majorité atteinte
- ✅ Notification des joueurs
- ✅ Reset de session pour nouvelle partie

#### WebSocket (Socket.io)
- ✅ Gestion des rooms par session
- ✅ Broadcast d'événements aux joueurs
- ✅ Synchronisation temps réel
- ✅ Gestion de déconnexion propre
- ✅ Events: playerJoined, playerLeft, playerKicked, sessionDeleted, buzzerPressed, buzzerReset, gameStarted, rematchVoteUpdated, rematchAccepted

#### Persistance des Avatars
- ✅ Sauvegarde en base de données (colonnes avatar, color)
- ✅ Logging des valeurs sauvegardées
- ✅ Validation des données reçues
- ✅ Gestion des valeurs par défaut

#### CORS et Sécurité
- ✅ Multi-origin support (dev avec plusieurs ports)
- ✅ Validation des entrées avec class-validator
- ✅ Protection contre les doublons de token
- ✅ Vérification d'appartenance à la session

---

## 🏗️ Structure du Projet (Implémentée)

```
backend/
├── src/
│   ├── modules/
│   │   ├── session/         # ✅ Module Session
│   │   │   ├── entities/
│   │   │   │   └── session.entity.ts        # ✅ Entité Session avec TypeORM
│   │   │   ├── session.controller.ts        # ✅ REST API (POST, GET, DELETE, etc.)
│   │   │   ├── session.service.ts           # ✅ Logique métier + émission socket
│   │   │   └── session.module.ts            # ✅ Module NestJS
│   │   ├── player/          # ✅ Module Player
│   │   │   ├── entities/
│   │   │   │   └── player.entity.ts         # ✅ Entité Player avec relations
│   │   │   └── player.module.ts             # ✅ Module NestJS
│   │   └── game/            # ✅ Module Game (WebSocket)
│   │       ├── game.gateway.ts              # ✅ WebSocket Gateway Socket.io
│   │       └── game.module.ts               # ✅ Module NestJS
│   ├── app.module.ts        # ✅ Module racine avec TypeORM config
│   └── main.ts              # ✅ Bootstrap avec CORS
├── test/
├── .env                     # ✅ PORT=3001, FRONTEND_URL, DB_PATH
├── .env.example             # ✅ Template
├── buzzer.sqlite            # ✅ Base de données SQLite
└── package.json             # ✅ Dépendances installées
```

## 📡 Architecture Actuelle

### Modules Implémentés

#### 1. Session Module
**Fichiers** :
- `session.entity.ts` : Entité TypeORM avec relations players
- `session.controller.ts` : REST API endpoints + injection GameGateway
- `session.service.ts` : Logique métier + génération tokens

**Endpoints REST** :
- `POST /sessions` - Créer session + master player
- `GET /sessions/:token` - Récupérer session par token
- `POST /sessions/:token/join` - Rejoindre session
- `GET /sessions/:token/players` - Liste des joueurs
- `DELETE /sessions/:token/players/:playerId` - Kick player
- `DELETE /sessions/:token` - Supprimer session
- `POST /sessions/:token/start` - Démarrer partie

**Événements Socket Émis** :
- `playerJoined` : Après joinSession (depuis controller)
- `playerKicked` : Après kickPlayer (depuis controller)

#### 2. Player Module
**Fichiers** :
- `player.entity.ts` : Entité avec avatar, couleur, score

#### 3. Game Module (WebSocket)
**Fichiers** :
- `game.gateway.ts` : Gateway Socket.io

**Événements Socket Reçus** :
- `joinSession` : Rejoindre room
- `leaveSession` : Quitter room
- `kickPlayer` : Kick player (deprecated, utiliser REST API)
- `startGame` : Démarrer (deprecated, utiliser REST API)

**Événements Socket Émis** :
- `playerJoined` : Nouveau joueur
- `playerLeft` : Joueur parti
- `playerKicked` : Joueur expulsé
- `sessionUpdated` : Session modifiée
- `gameStarted` : Partie lancée

**Méthode Publique** :
- `emitToRoom(token, event, data)` : Émettre événement à tous les clients d'une room

## � API REST Endpoints

### Sessions

#### `POST /sessions`
**Description** : Créer une nouvelle session avec le master player

**Body** :
```json
{
  "pseudo": "string (2-20 chars)",
  "emoji": "string",
  "color": "string (bg-*-400 format)",
  "config": {
    "matchDuration": "number",
    "responseTime": "number (default: 10)",
    "muteTime": "number (default: 5)"
  }
}
```

**Response** :
```json
{
  "session": {
    "id": "uuid",
    "token": "string (6 chars)",
    "status": "LOBBY",
    "masterId": "uuid",
    "config": {...},
    "rematchVotes": []
  },
  "playerId": "uuid",
  "token": "string"
}
```

#### `GET /sessions/:token`
**Description** : Récupérer les informations d'une session

**Response** : Session object avec players relation

#### `POST /sessions/:token/join`
**Description** : Rejoindre une session existante

**Body** :
```json
{
  "pseudo": "string",
  "emoji": "string",
  "color": "string"
}
```

**Response** :
```json
{
  "playerId": "uuid",
  "session": {...}
}
```

#### `GET /sessions/:token/players`
**Description** : Liste des joueurs de la session

**Response** : Player[] avec isConnected status

#### `PATCH /sessions/:token/config`
**Description** : Mettre à jour la configuration (master uniquement)

**Body** :
```json
{
  "matchDuration": "number",
  "responseTime": "number",
  "muteTime": "number"
}
```

#### `POST /sessions/:token/start`
**Description** : Démarrer la partie (master uniquement)

**Response** : Session object avec status PLAYING

#### `DELETE /sessions/:token`
**Description** : Supprimer la session (master uniquement)

**Response** : 200 OK

#### `DELETE /sessions/:token/players/:playerId`
**Description** : Expulser un joueur (master uniquement)

**Response** : 200 OK

### Game Actions

#### `POST /sessions/:token/buzz`
**Description** : Presser le buzzer

**Body** :
```json
{
  "playerId": "uuid"
}
```

**Response** : Session object avec buzzedBy information

#### `POST /sessions/:token/reset-buzzer`
**Description** : Reset le buzzer (master uniquement)

**Response** : 200 OK

#### `POST /sessions/:token/validate-answer`
**Description** : Valider/invalider une réponse (master uniquement)

**Body** :
```json
{
  "playerId": "uuid",
  "isCorrect": "boolean"
}
```

**Response** : Updated session

### Rematch

#### `POST /sessions/:token/rematch`
**Description** : Voter pour rejouer

**Body** :
```json
{
  "playerId": "uuid"
}
```

**Response** :
```json
{
  "votes": "number",
  "required": "number",
  "accepted": "boolean"
}
```

---

## 🔌 WebSocket Events

### Events Client → Server

#### `joinSession`
```typescript
{
  token: string;
  playerId: string;
  isMaster: boolean;
}
```

#### `leaveSession`
```typescript
{
  token: string;
  playerId: string;
}
```

#### `pressBuzzer`
```typescript
{
  sessionToken: string;
  playerId: string;
}
```

#### `resetBuzzer`
```typescript
{
  sessionToken: string;
}
```

#### `startGame`
```typescript
{
  sessionToken: string;
}
```

### Events Server → Client

#### `playerJoined`
```typescript
{
  playerId: string;
  pseudo: string;
  emoji: string;
  color: string;
}
```

#### `playerLeft`
```typescript
{
  playerId: string;
}
```

#### `playerKicked`
```typescript
{
  playerId: string;
}
```

#### `sessionDeleted`
```typescript
// Pas de payload
```

#### `buzzerPressed`
```typescript
{
  playerId: string;
  pseudo: string;
}
```

#### `buzzerReset`
```typescript
// Pas de payload
```

#### `gameStarted`
```typescript
// Pas de payload
```

#### `rematchVoteUpdated`
```typescript
{
  votes: number;
  required: number;
}
```

#### `rematchAccepted`
```typescript
{
  newSessionToken: string;
}
```

#### `rematchAcceptedForYou`
```typescript
{
  playerId: string;
}
```

---

## �🗄️ Schéma de Base de Données (TypeORM)

```typescript
// src/modules/session/entities/session.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'enum', enum: ['LOBBY', 'PLAYING', 'FINISHED'], default: 'LOBBY' })
  status: 'LOBBY' | 'PLAYING' | 'FINISHED';

  @Column({ default: 10 })
  muteTime: number; // secondes

  @Column({ default: 30 })
  responseTime: number; // secondes

  @Column({ default: 10 })
  totalRounds: number;

  @Column({ default: 0 })
  currentRound: number;

  @Column()
  masterId: string;

  @Column({ nullable: true })
  buzzedBy: string; // ID du joueur qui a buzzé

  @Column({ type: 'simple-json', default: '[]' })
  rematchVotes: string[]; // IDs des joueurs qui ont voté pour rejouer

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Player, player => player.session, { cascade: true })
  players: Player[];
}

// src/modules/player/entities/player.entity.ts

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => Session, session => session.players)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column()
  pseudo: string;

  @Column({ default: '😀' })
  avatar: string; // Emoji du joueur

  @Column({ default: 'bg-purple-400' })
  color: string; // Couleur de l'avatar (format Tailwind)

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  isMaster: boolean;

  @Column({ default: true })
  isConnected: boolean;

  @Column({ nullable: true })
  socketId: string;

  @Column({ type: 'timestamp', nullable: true })
  mutedUntil: Date | null; // Timestamp de fin de mute

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Note: Le système Round a été simplifié. Les rounds ne sont plus
// stockés en base mais gérés en mémoire par le GameGateway.
// L'entité Round.entity.ts peut être supprimée si non utilisée.
```

---

## 🔧 Services Principaux

### SessionService (`src/modules/session/session.service.ts`)

**Responsabilités** :
- CRUD des sessions
- Génération de tokens uniques
- Gestion des joueurs (création, expulsion)
- Configuration de parties
- Système de rematch avec votes

**Méthodes Clés** :
```typescript
class SessionService {
  // Session CRUD
  create(createSessionDto, pseudo, emoji, color): Promise<Session>
  findByToken(token): Promise<Session>
  update(token, updateDto): Promise<Session>
  delete(token): Promise<void>
  
  // Players
  addPlayer(token, pseudo, emoji, color): Promise<Player>
  getPlayers(token): Promise<Player[]>
  kickPlayer(token, playerId): Promise<void>
  
  // Game Actions
  startGame(token): Promise<Session>
  pressBuzzer(token, playerId): Promise<Session>
  resetBuzzer(token): Promise<Session>
  validateAnswer(token, playerId, isCorrect): Promise<Session>
  
  // Rematch
  voteRematch(token, playerId): Promise<VoteResult>
  
  // Helpers
  generateUniqueToken(): Promise<string>
}
```

**Logging** : Console logs détaillés pour debugging (émojis pour visibilité)
- 👑 Master player actions
- 👤 Regular player actions
- 🔊 Socket events emitted

### GameGateway (`src/modules/game/game.gateway.ts`)

**Responsabilités** :
- Gestion des connexions WebSocket
- Rooms par session (token = room id)
- Broadcast d'événements aux joueurs
- Coordination avec SessionService

**Méthodes Publiques** :
```typescript
class GameGateway {
  emitToRoom(token: string, event: string, data: any): void
  // Broadcast un événement à tous les clients d'une session
}
```

**Configuration Socket.io** :
```typescript
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  },
  transports: ['websocket', 'polling']
})
```

---

## 🛡️ Sécurité & Validation

### DTOs avec class-validator

```typescript
// create-session.dto.ts
export class CreateSessionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  pseudo: string;

  @IsString()
  emoji: string;

  @IsString()
  color: string;

  @IsObject()
  config: {
    matchDuration: number;
    responseTime: number;
    muteTime: number;
  };
}

// join-session.dto.ts
export class JoinSessionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  pseudo: string;

  @IsString()
  emoji: string;

  @IsString()
  color: string;
}
```

### Validation d'Accès

- **Master uniquement** : startGame, resetBuzzer, validateAnswer, kickPlayer, deleteSession
- **Vérification token** : Tous les endpoints vérifient l'existence de la session
- **Vérification playerId** : Les actions joueur vérifient l'appartenance à la session

---

## 🔧 Configuration

### Variables d'environnement (`.env`)

```env
# Database
DATABASE_PATH=buzzer.sqlite
# Pour PostgreSQL en prod:
# DATABASE_URL="postgresql://user:password@localhost:5432/buzzer"

# App
PORT=3001
FRONTEND_URL="http://localhost:5173"

# CORS (multiple origins)
# Les ports 5173 et 5174 sont autorisés automatiquement en dev
```

### TypeORM Config (`src/app.module.ts`)

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'buzzer.sqlite',
  entities: [Session, Player],
  synchronize: true, // ⚠️ false en production
  logging: false,
})
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

# TypeORM
npm run typeorm migration:generate -- -n MigrationName  # Générer migration
npm run typeorm migration:run                            # Appliquer migrations
npm run typeorm schema:sync                              # Sync schema (dev only)
```

## 📝 Dépendances à Installer

```bash
# WebSocket
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

# TypeORM
npm install @nestjs/typeorm typeorm pg

# Validation
npm install class-validator class-transformer

# Configuration
npm install @nestjs/config

# UUID
npm install uuid
npm install @types/uuid --save-dev
```

## 🎯 Conventions Spécifiques NestJS

### Imports
- **Utiliser les alias `@/`** pour tous les imports internes
- Exemple : `import { Session } from '@/modules/session/entities/session.entity';`
- Configuration dans `tsconfig.json` : `"@/*": ["src/*"]`

### Modules
- Un module par domaine fonctionnel
- Exports explicites des services partagés

### Services
- Logique métier dans les services
- Controllers/Gateways minimalistes

### Erreurs
- Utiliser les exceptions NestJS (`NotFoundException`, `BadRequestException`, etc.)
- Filtres d'exception custom si besoin

### Tests
- Tests unitaires pour les services
- Tests e2e pour les endpoints/events critiques
