# CLAUDE.md - Buzzer Application

## 🎯 Vision du Projet

**Buzzer** est une application web de buzzer en ligne multijoueur permettant à un groupe d'amis de jouer à des quiz en temps réel. Les joueurs communiquent via Discord (ou autre) et utilisent l'application uniquement pour le système de buzzer et le scoring.

## 🏗️ Architecture Globale

```
Buzzer/
├── frontend/          # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── services/  # api.service.ts, socket.service.ts (Real Socket.io)
│   │   ├── hooks/     # useSocket.ts, useDiagnostics.ts
│   │   ├── pages/     # Home, Join, Lobby
│   │   └── components/
│   ├── .env           # VITE_API_URL=http://localhost:3001
│   └── CLAUDE.md
├── backend/           # NestJS 11 + TypeScript + Socket.io + SQLite
│   ├── src/modules/
│   │   ├── session/   # REST API + SessionService
│   │   ├── player/    # Entities + PlayerService
│   │   └── game/      # game.gateway.ts (WebSocket)
│   ├── .env           # PORT=3001, FRONTEND_URL=http://localhost:5173
│   ├── buzzer.sqlite  # Base de données SQLite
│   └── CLAUDE.md
├── docker-compose.yml
└── CLAUDE.md          # Ce fichier
```

### Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | React 19.2.0, TypeScript, Vite 5.x, Tailwind CSS 4.x |
| Backend | NestJS 11.0.1, TypeScript 5.3.3 |
| Temps réel | Socket.io 4.8.3 (Backend + Client) |
| Base de données | SQLite (dev), PostgreSQL (prod-ready) |
| ORM | TypeORM 0.3.28 |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## 🎮 Règles du Jeu

### Rôles
- **Maître du jeu** : Rôle exclusif, crée et gère la session, lit les questions, valide les réponses
- **Joueurs** : Max 10 par session, rejoignent via lien d'invitation avec pseudo

### Configuration de partie (par le maître)
- Nombre de manches
- Temps de mute après buzzer raté (défaut: 10s)
- Temps max pour répondre après avoir buzzé

### Flux de jeu
1. **Création** : Maître crée une session → reçoit un lien avec token unique
2. **Configuration** : Définit les paramètres de partie
3. **Lobby** : Partage le lien → joueurs rejoignent avec pseudo
4. **Lancement** : Maître lance quand tous les joueurs sont prêts
5. **Boucle de manche** :
   - Maître définit les points de la manche → buzzers débloqués pour tous
   - Maître lit sa question (via Discord)
   - Joueur buzze → buzzers bloqués, timer de réponse démarre
   - Joueur répond vocalement (Discord)
   - Maître valide (✓ points attribués) ou invalide (✗ rebuzz possible)
   - Si ✗ → buzzers re-débloqués (sauf joueur muté pendant X secondes)
6. **Fin** : Après toutes les manches → écran récapitulatif des scores

### Affichage
- Classement visible par tous en temps réel
- Scores affichés tout au long de la partie
- Récapitulatif final

## 📁 Structure des Données (Conceptuel)

### Session
- `id` : UUID
- `token` : String unique (pour le lien d'invitation)
- `status` : 'lobby' | 'playing' | 'finished'
- `config` : { muteTime, responseTime, totalRounds }
- `currentRound` : Number
- `masterId` : String

### Player
- `id` : UUID
- `sessionId` : FK
- `pseudo` : String
- `score` : Number
- `isMuted` : Boolean
- `mutedUntil` : Timestamp | null

### Round
- `id` : UUID
- `sessionId` : FK
- `roundNumber` : Number
- `points` : Number
- `status` : 'pending' | 'active' | 'answered' | 'completed'
- `buzzedBy` : PlayerId | null
- `buzzedAt` : Timestamp | null
- `answeredCorrectly` : Boolean | null

---

## 📊 État de l'Implémentation (Janvier 2026)

### ✅ Fonctionnalités Complétées

#### Backend
- ✅ Modules NestJS (session, player, game)
- ✅ REST API complète avec SessionController
- ✅ WebSocket Gateway avec Socket.io (game.gateway.ts)
- ✅ Événements temps réel : playerJoined, playerLeft, playerKicked, gameStarted, sessionUpdated
- ✅ SessionService avec injection de GameGateway pour émission d'événements
- ✅ CORS configuré pour port 5173
- ✅ Base de données SQLite fonctionnelle
- ✅ Variables d'environnement (.env)

#### Frontend
- ✅ Services API réels (api.service.ts) - Plus de mocks
- ✅ Service Socket.io réel (socket.service.ts) avec reconnexion
- ✅ Hook useSocket pour gestion état temps réel
- ✅ Pages : Home, Join, Lobby
- ✅ Composants Lobby : LobbyConfig, LobbyPlayers, LobbyShare
- ✅ Mise à jour dynamique des cartes joueurs
- ✅ Configuration .env pointant vers port 3001

#### Intégration Front-Back
- ✅ Communication HTTP + WebSocket fonctionnelle
- ✅ Synchronisation événements (camelCase)
- ✅ Refetch automatique des joueurs lors de playerJoined
- ✅ Gestion kick/leave avec émission socket depuis API

### 🔄 En Cours / À Compléter
- ⏳ Page Game (interface buzzer)
- ⏳ Système de points et scoring
- ⏳ Gestion des rounds
- ⏳ Timer de réponse
- ⏳ Migration PostgreSQL pour production

### 🔧 Ports de Configuration
- **Backend** : `3001` (PORT dans .env)
- **Frontend** : `5173` (Vite par défaut)
- **CORS** : Autorise `http://localhost:5173`

---

## 🤖 Instructions pour Claude (Assistant IA)

### Processus de Développement

**IMPORTANT** : Pour chaque nouvelle feature demandée, je dois :

1. **Analyser** : Comprendre la demande et son impact sur l'existant
2. **Proposer un plan** : Présenter un plan détaillé étape par étape incluant :
   - Les fichiers à créer/modifier
   - Les dépendances à installer
   - L'ordre d'implémentation
   - Les tests à prévoir
3. **Attendre validation** : Ne pas coder avant que l'utilisateur valide le plan
4. **Implémenter** : Une fois validé, procéder étape par étape
5. **Tester** : Vérifier que tout fonctionne
6. **Mettre à jour la documentation** : Après chaque feature ou modification importante :
   - Mettre à jour `/CLAUDE.md` si la vision/architecture globale change
   - Mettre à jour `/frontend/CLAUDE.md` si ajout de lib, composants, services frontend
   - Mettre à jour `/backend/CLAUDE.md` si ajout de lib, modules, schéma Prisma backend
   - Garder la documentation synchronisée avec le code réel

### Conventions de Code

#### Général
- Langue du code : **Anglais**
- Langue des commentaires : **Français** (si demandé)
- Commits : Messages en anglais, format conventionnel (`feat:`, `fix:`, `docs:`, etc.)

#### TypeScript
- Strict mode activé
- Types explicites (éviter `any`)
- Interfaces préférées aux types pour les objets

#### Nommage
- **Fichiers** : kebab-case (`game-session.service.ts`)
- **Classes** : PascalCase (`GameSessionService`)
- **Variables/Fonctions** : camelCase (`createSession`)
- **Constantes** : SCREAMING_SNAKE_CASE (`MAX_PLAYERS`)
- **Interfaces** : PascalCase avec préfixe I optionnel (`Session` ou `ISession`)

#### Imports
- **Utiliser les alias `@/`** dans les deux projets pour les imports internes
- Backend : `import { Session } from '@/modules/session/entities/session.entity';`
- Frontend : `import { Button } from '@/components/ui/Button';`

#### Git
- Branche principale : `main`
- Branche de développement : `develop`
- Feature branches : `feature/nom-feature`
- Fix branches : `fix/nom-bug`

### Communication

- **Toujours poser des questions** si le prompt manque de clarté ou contient des omissions
- Demander des précisions avant de commencer l'implémentation si des détails importants manquent
- Proposer des alternatives quand pertinent
- Signaler les risques ou problèmes potentiels
- Expliquer les choix techniques importants

---

## 🚀 Commandes Utiles

### Développement
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev

# Les deux (à venir avec docker-compose)
docker-compose up
```

### Base de données
```bash
# Migrations Prisma (à configurer)
cd backend && npx prisma migrate dev
```

---

## 📝 TODO / Roadmap

- [ ] Configuration Docker (frontend, backend, PostgreSQL)
- [ ] Setup CI/CD GitHub Actions
- [ ] Système de sessions (création, join)
- [ ] WebSocket events pour le temps réel
- [ ] Interface maître du jeu
- [ ] Interface joueur (buzzer)
- [ ] Système de scoring
- [ ] Écran de fin de partie
