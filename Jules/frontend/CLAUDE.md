# CLAUDE.md - Frontend nomProjet

## 🎯 Identité du Projet

**Nom** : nomProjet  
**Slogan** : _"EXEMPLE"_  
**Concept** : EXEMPLE: Jeu de buzzer en temps réel pour quiz compétitifs, optimisé pour les communautés gaming et streaming.

**Version Actuelle** : EXEMPLE : 2.0.0
**Dernière Mise à Jour** : DATE

---

## 📋 État des Fonctionnalités

### ✅ Fonctionnalités Complètes

#### Système de Personnalisation d'Avatar

<!-- - ✅ Sélection d'emoji (16 choix disponibles)
- ✅ Sélection de couleur (16 couleurs : Violet, Bleu, Vert, Jaune, Orange, Rose, Rouge, Cyan, Indigo, Teal, Lime, Fuchsia, Emerald, Sky, Amber, Slate)
- ✅ Personnalisation du pseudo (2-20 caractères)
- ✅ Persistance avec localStorage (masterPreferences/playerPreferences)
- ✅ Prévisualisation en temps réel
- ✅ Sauvegarde backend complète -->

#### Système de Profil

<!-- - ✅ Bouton profil dans navbar avec avatar personnalisé
- ✅ Mode invité avec icône 👤 stylisé
- ✅ Modale de gestion des préférences avec 3 vues :
  - Vue consultation (voir profil + infos)
  - Mode édition (formulaire complet)
  - Mode invité (informations explicatives)
- ✅ Boutons Modifier/Effacer/Enregistrer
- ✅ Synchronisation événements (storage + custom events) -->

#### Auto-Join/Auto-Create

<!-- - ✅ Détection automatique des préférences sauvegardées
- ✅ Auto-création de partie (bouton "Créer une partie")
- ✅ Auto-join depuis modal "Rejoindre une partie"
- ✅ Formulaire de join toujours accessible avec pré-remplissage
- ✅ Redirection automatique vers lobby -->

#### Système de Mute

<!-- - ✅ Timer visuel avec compte à rebours
- ✅ Son de notification à la fin du mute
- ✅ Auto-mute sur timeout de question
- ✅ Contrôle de volume global
- ✅ États visuels (joueur muté avec opacité réduite) -->

#### Système de Jeu

<!-- - ✅ Buzzer en temps réel via WebSocket
- ✅ Gestion des tours de jeu
- ✅ Système de scoring
- ✅ Détection du premier buzzer
- ✅ Lock automatique du buzzer après premier clic
- ✅ Reset du buzzer par le maître de jeu
- ✅ Écran de résultats avec classement
- ✅ Système de rematch avec votes -->

#### Gestion de Session

<!-- - ✅ Création/Rejoindre/Supprimer une session
- ✅ Configuration de partie (durée, temps de réponse, temps de mute)
- ✅ Partage de lien de session
- ✅ Expulsion de joueurs (maître uniquement)
- ✅ Déconnexion automatique avec nettoyage
- ✅ Gestion des joueurs déconnectés
- ✅ Messages de redirection en cas d'erreur -->

#### Interface et UX

<!-- - ✅ Layout responsive avec Header fixe
- ✅ Dark mode exclusif avec palette gaming
- ✅ Cards joueurs stylisées avec avatar
- ✅ Animations fluides (scale, glow, transitions)
- ✅ Modales de confirmation
- ✅ Messages d'erreur contextuels -->

---

## 🎨 Charte Graphique

<!-- ### Vision Design

<!-- **Style** : Tech Minimaliste avec accent Gaming
**Mode** : Dark mode exclusif
**Public** : Communauté gaming/streaming (18-35 ans) -->

### Palette de Couleurs

<!-- <--

Configuration Tailwind v4 avec variables custom :

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* === Brand Colors === */
  --color-primary: oklch(
    60.6% 0.25 292.717
  ); /* violet-500 - Couleur principale gaming */
  --color-primary-light: oklch(70.2% 0.183 293.541); /* violet-400 */
  --color-primary-dark: oklch(49.1% 0.27 292.581); /* violet-700 */

  --color-secondary: oklch(62.3% 0.214 259.815); /* blue-500 - Accent tech */
  --color-accent: oklch(66.7% 0.295 322.15); /* fuchsia-500 - Highlights */

  /* === Backgrounds === */
  --color-bg-primary: oklch(
    12.9% 0.042 264.695
  ); /* slate-950 - Fond principal */
  --color-bg-secondary: oklch(20.8% 0.042 265.755); /* slate-900 - Surfaces */
  --color-bg-elevated: oklch(
    27.9% 0.041 260.031
  ); /* slate-800 - Cards élevées */
  --color-bg-hover: oklch(37.2% 0.044 257.287); /* slate-700 - Hover states */

  /* === Text === */
  --color-text-primary: oklch(
    98.4% 0.003 247.858
  ); /* slate-50 - Texte principal */
  --color-text-secondary: oklch(
    86.9% 0.022 252.894
  ); /* slate-300 - Sous-titres */
  --color-text-muted: oklch(70.4% 0.04 256.788); /* slate-400 - Hints */

  /* === States Sémantiques === */
  --color-success: oklch(72.3% 0.219 149.579); /* green-500 - Bonne réponse */
  --color-error: oklch(63.7% 0.237 25.331); /* red-500 - Mauvaise réponse */
  --color-warning: oklch(76.9% 0.188 70.08); /* amber-500 - Avertissements */
  --color-info: oklch(71.5% 0.143 215.221); /* cyan-500 - Informations */

  /* === Game States === */
  --color-buzz-ready: var(--color-primary); /* Buzzer prêt */
  --color-buzz-active: var(--color-accent); /* Joueur a buzzé */
  --color-buzz-locked: oklch(
    44.6% 0.03 256.802
  ); /* Buzzer verrouillé (gray-600) */
  --color-player-muted: oklch(
    55.4% 0.046 257.417
  ); /* Joueur muté (slate-500) */
  --color-master-badge: oklch(
    82.8% 0.189 84.429
  ); /* Badge maître (amber-400) */

  /* === Shadows avec glow === */
  --shadow-glow-primary: 0 0 20px oklch(60.6% 0.25 292.717 / 0.4);
  --shadow-glow-accent: 0 0 30px oklch(66.7% 0.295 322.15 / 0.5);
  --shadow-glow-success: 0 0 20px oklch(72.3% 0.219 149.579 / 0.3);
  --shadow-glow-error: 0 0 20px oklch(63.7% 0.237 25.331 / 0.3);

  /* === Custom Animations === */
  --animate-ripple: ripple 0.6s cubic-bezier(0, 0, 0.2, 1);
  --animate-glow-pulse: glow-pulse 2s ease-in-out infinite;
  --animate-buzz-shake: buzz-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes glow-pulse {
    0%,
    100% {
      box-shadow: var(--shadow-glow-primary);
      opacity: 1;
    }
    50% {
      box-shadow: var(--shadow-glow-accent);
      opacity: 0.8;
    }
  }

  @keyframes buzz-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-4px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(4px);
    }
  }
}
``` --> -->

### Typographie

<!--
**Fonts** :

- **Titres (H1-H3)** : `Poppins` SemiBold (600) / Bold (700)
- **Corps** : `Poppins` Regular (400) / Medium (500)
- **Monospace** : `JetBrains Mono` (tokens de session, code)

**Installation** :

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

**Configuration Tailwind** :

```css
@theme {
  --font-display: Poppins, ui-sans-serif, system-ui, sans-serif;
  --font-body: Poppins, ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

### Composants Clés

#### 1. Bouton Buzzer (★ Élément Star) -->

**Spécifications** :

<!--
- Forme : Circulaire 250x250px (320x320px sur desktop large)
- Animation idle : Glow pulsé subtil
- Animation hover : Scale 1.05 + glow intensifié
- Animation click : Onde de choc (ripple effect) + leger shake
- États : ready (violet), locked (gris), active (fuchsia) -->

**Exemple de structure** :

<!--
```tsx
// Composant BuzzerButton
<div className="relative flex items-center justify-center">
  {/* Ripple effect container */}
  <div className="absolute inset-0 rounded-full animate-ripple bg-primary opacity-0"></div>

  {/* Bouton principal */}
  <button
    className="
      relative z-10
      w-64 h-64 rounded-full
      bg-gradient-to-br from-primary to-primary-dark
      text-text-primary font-display font-bold text-4xl
      shadow-[var(--shadow-glow-primary)]
      transition-all duration-300
      hover:scale-105 hover:shadow-[var(--shadow-glow-accent)]
      active:scale-95 active:animate-buzz-shake
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-buzz-locked
    "
    disabled={isLocked}
  >
    BUZZ!
  </button>
</div>
``` -->

#### 2. Player Cards

<!--
**Éléments** :

- Avatar : Initiale du pseudo (ou icône)
- Nom + score
- Badge "Maître" pour l'hôte (couleur amber-400)
- États visuels : actif (border primary), muté (opacity 50%), buzzé (glow accent)

**Classes Tailwind** :

```tsx
// Card joueur normal
<div className="
  bg-bg-elevated rounded-lg p-4
  border-2 border-transparent
  transition-all duration-200
">
  {/* Contenu */}
</div>

// Card joueur qui a buzzé
<div className="
  bg-bg-elevated rounded-lg p-4
  border-2 border-buzz-active
  shadow-[var(--shadow-glow-accent)]
  animate-glow-pulse
">
  {/* Contenu */}
</div>

// Card joueur muté
<div className="
  bg-bg-elevated rounded-lg p-4
  border-2 border-player-muted
  opacity-60
">
  {/* Contenu */}
</div>
``` -->

#### 3. Leaderboard/Classement

<!-- **Features** :

- Top 3 avec podium visuel (médailles 🥇🥈🥉)
- Animations d'entrée staggerées (delay progressif)
- Barres de progression des scores
- Highlight sur le joueur actuel

**Couleurs podium** :

- 1er : `text-amber-400` (or)
- 2e : `text-slate-300` (argent)
- 3e : `text-amber-600` (bronze) -->

#### 4. Forms & Inputs

<!-- **Style** : Voir configuration PrimeReact PassThrough (section dédiée ci-dessous)

**Animations** : Transitions modérées (`duration-200`) -->

#### 5. Notifications/Toasts

<!--
**Types** :

- **Buzz** : Border accent + glow + animation slide-in
- **Succès** : Border green + icon ✓ + applaudissements (son)
- **Erreur** : Border red + icon ✗ + huées (son)
- **Info** : Border cyan + icon ℹ -->

### Design Tokens Sémantiques

<!--
**Espacements** :

- Padding cards : `p-4` à `p-6`
- Gap grilles : `gap-4` à `gap-6`
- Marges sections : `mb-8` à `mb-12`

**Border Radius** :

- Buttons/Inputs : `rounded-lg` (0.5rem)
- Cards : `rounded-xl` (0.75rem)
- Buzzer : `rounded-full`

**Transitions** :

- Formulaires : `duration-200 ease-out`
- Jeu/Buzzer : `duration-300 ease-in-out`
- Animations lourdes : `duration-500` -->

### Guidelines Audio 🔊

<!--
**Sons à intégrer** :

| Événement        | Son                                | Volume     | Format  |
| ---------------- | ---------------------------------- | ---------- | ------- |
| Clic buzzer      | Bip électronique court (100-150ms) | Moyen      | MP3/OGG |
| Bonne réponse    | Applaudissements (2-3s)            | Moyen-Fort | MP3/OGG |
| Mauvaise réponse | Huées légères (1-2s)               | Moyen      | MP3/OGG |
| Joueur rejoint   | Notification subtile               | Faible     | MP3/OGG |
| Fin de partie    | Fanfare courte                     | Fort       | MP3/OGG |

**Implémentation** :

```tsx
// src/utils/sounds.ts
const sounds = {
  buzz: new Audio("/sounds/buzz-click.mp3"),
  success: new Audio("/sounds/applause.mp3"),
  error: new Audio("/sounds/boo.mp3"),
  // ...
};

export const playSound = (sound: keyof typeof sounds) => {
  sounds[sound].currentTime = 0;
  sounds[sound].play();
};
```

### Ressources Design

**Outils recommandés** :

- [Realtime Colors](https://www.realtimecolors.com/) - Prévisualiser la palette
- [OKLCH Color Picker](https://oklch.com/) - Générer des couleurs OKLCH
- [Tailwind Play](https://play.tailwindcss.com/) - Prototyper rapidement

**Icônes** :

- PrimeIcons (déjà installé)
- [Heroicons](https://heroicons.com/) (optionnel, pour variété)

--- -->

## 📦 Stack Technique

<!--
- **Framework** : React 19.2.0
- **Language** : TypeScript
- **Build Tool** : Vite 5.x
- **Temps réel** : Socket.io-client 4.8.3 (Real implementation)
- **CSS Framework** : Tailwind CSS 4.1.18
- **Routing** : React Router DOM
- **Port** : 5173 (Vite default)
- **API URL** : http://localhost:3001 (dans .env) -->

## 🏗️ Structure du Projet (Cible)

<!--
```
frontend/
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Composants réutilisables
│   │   ├── ui/              # Composants UI génériques (Button, Input, etc.)
│   │   └── game/            # Composants spécifiques au jeu
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Pages/Vues principales
│   │   ├── Home/            # Page d'accueil
│   │   ├── Lobby/           # Salle d'attente
│   │   ├── Game/            # Interface de jeu
│   │   └── Results/         # Écran de fin
│   ├── services/            # Services (API, WebSocket)
│   ├── stores/              # State management (à définir)
│   ├── types/               # Types TypeScript partagés
│   ├── utils/               # Fonctions utilitaires
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
``` -->

## 🎨 Pages Principales

### 1. Home (`/`)

<!--
- Bouton "Créer une partie" → redirige vers Lobby en tant que maître
- Champ pour rejoindre via token -->

### 2. Join (`/join/:token`)

<!--
- Formulaire de pseudo
- Rejoindre la session -->

### 3. Lobby (`/lobby/:token`)

<!--
- Liste des joueurs connectés
- Configuration de partie (maître uniquement)
- Bouton lancer la partie (maître uniquement) -->

### 4. Game (`/game/:token`)

<!--
- **Vue Maître** :
  - Définir points de la manche
  - Boutons valider/invalider réponse
  - Classement
- **Vue Joueur** :
  - Gros bouton BUZZER
  - État du buzzer (actif/muté/bloqué)
  - Classement -->

### 5. Results (`/results/:token`)

<!--
- Classement final
- Statistiques de partie
- Bouton retour accueil -->

## 🔌 WebSocket Events (Client)

### Émis (client → serveur)

| Event             | Payload                       | Description                  |
| ----------------- | ----------------------------- | ---------------------------- |
| `join-session`    | `{ token, pseudo }`           | Rejoindre une session        |
| `start-game`      | `{ token }`                   | Lancer la partie (maître)    |
| `start-round`     | `{ token, points }`           | Démarrer une manche (maître) |
| `buzz`            | `{ token }`                   | Appuyer sur le buzzer        |
| `validate-answer` | `{ token, correct: boolean }` | Valider/invalider (maître)   |

### Reçus (serveur → client)

| Event              | Payload                   | Description                |
| ------------------ | ------------------------- | -------------------------- |
| `session-state`    | `Session`                 | État complet de la session |
| `player-joined`    | `Player`                  | Nouveau joueur             |
| `player-left`      | `{ playerId }`            | Joueur parti               |
| `game-started`     | `{ config }`              | Partie lancée              |
| `round-started`    | `{ roundNumber, points }` | Manche démarrée            |
| `player-buzzed`    | `{ playerId, pseudo }`    | Quelqu'un a buzzé          |
| `answer-validated` | `{ correct, scores }`     | Réponse validée            |
| `player-muted`     | `{ playerId, until }`     | Joueur muté                |
| `game-ended`       | `{ finalScores }`         | Partie terminée            |

## �️ Services Implémentés (Real, No Mocks)

### api.service.ts (HTTP REST)

**État** : ✅ Implémentation réelle avec fetch

**Fonctions** :

- `createSession(config, masterPseudo)` → `{ session, playerId, isMaster }`
- `getSession(token)` → `Session`
- `joinSession(token, pseudo)` → `{ playerId, isMaster }`
- `getSessionPlayers(token)` → `Player[]`
- `kickPlayer(token, playerId)` → `void`
- `deleteSession(token)` → `void`
- `startGame(token)` → `Session`

**Configuration** : Utilise `VITE_API_URL` depuis `.env` (http://localhost:3001)

### socket.service.ts (WebSocket)

<!-- **État** : ✅ Implémentation réelle Socket.io avec reconnexion -->

**Méthodes** :

<!--
- `connect()` : Connexion Socket.io avec config reconnexion
- `disconnect()` : Déconnexion propre
- `isConnected()` : État connexion
- `emit(event, ...args)` : Émettre événement
- `on(event, handler)` : Écouter événement
- `off(event, handler)` : Retirer listener -->

**API de haut niveau** :

<!-- - `joinSession(token, playerId, isMaster)`
- `leaveSession(token, playerId)`
- `kickPlayer(token, playerId)`
- `startGame(token)`
- `onPlayerJoined(handler)`
- `onPlayerLeft(handler)`
- `onPlayerKicked(handler)`
- `onGameStarted(handler)`
- `onSessionUpdated(handler)` -->

<!-- **Configuration** : WebSocket sur même URL que API, reconnexion automatique -->

### useSocket Hook

<!-- **État** : ✅ Hook React pour gestion temps réel -->

**Fonctionnalités** :

- État connexion (`connected`)
- État joueurs (`players`)
- État session (`session`)
- Refetch automatique des joueurs sur `playerJoined`
- Polling connexion toutes les 1s
- Cleanup automatique

**Retour** :

```typescript
interface UseSocketReturn {
  connected: boolean;
  players: Player[];
  session: Session | null;
  joinSession: (token, playerId, isMaster) => void;
  leaveSession: (token, playerId) => void;
  kickPlayer: (token, playerId) => void;
  startGame: (token) => void;
  refetchPlayers: () => Promise<void>;
}
```

## 🔧 Architecture Technique Actuelle

### Services Clés

#### 1. Socket Service (`src/services/socket.service.ts`)

**Responsabilités** :

- Connexion WebSocket avec Socket.io
- Émission et écoute des événements temps réel
- Gestion des rooms (sessions)
- Synchronisation des états entre joueurs

**Événements Socket Gérés** :

- `connection` / `disconnect` : Gestion de la connexion
- `joinSession` / `leaveSession` : Entrée/Sortie de session
- `playerJoined` / `playerLeft` : Notification de joueurs
- `buzzerPressed` : Premier joueur à buzzer
- `buzzerReset` : Reset du buzzer par le maître
- `gameStarted` : Début de partie
- `rematchVoteUpdated` / `rematchAccepted` : Système de rematch
- `playerKicked` / `sessionDeleted` : Gestion des expulsions

**API Publique** :

```typescript
class SocketService {
  socket: Socket | null;
  connected: boolean;

  // Connexion
  connect(): void;
  disconnect(): void;

  // Events
  on(event: string, handler: Function): void;
  emit(event: string, data?: any): void;

  // Session Management
  joinSession(token: string, playerId: string, isMaster: boolean): void;
  leaveSession(token: string, playerId: string): void;

  // Game Actions
  pressBuzzer(sessionToken: string, playerId: string): void;
  resetBuzzer(sessionToken: string): void;
  startGame(sessionToken: string): void;

  // Listeners (typage fort)
  onBuzzerPressed(handler: (data: { playerId; pseudo }) => void): void;
  onBuzzerReset(handler: () => void): void;
  onGameStarted(handler: () => void): void;
  onRematchVoteUpdated(handler: (data: { votes; required }) => void): void;
  onPlayerKicked(handler: (data: { playerId }) => void): void;
  onSessionDeleted(handler: () => void): void;
}
```

#### 2. API Service (`src/services/api.service.ts`)

**Responsabilités** :

- Communication HTTP avec le backend
- CRUD des sessions et joueurs
- Configuration de parties

**Endpoints principaux** :

```typescript
// Sessions
createSession(pseudo: string, emoji: string, color: string): Promise<SessionResponse>
joinSession(token: string, pseudo: string, emoji: string, color: string): Promise<JoinResponse>
getSession(token: string): Promise<Session>
deleteSession(token: string): Promise<void>
updateSessionConfig(token: string, config: SessionConfig): Promise<Session>
startGame(token: string): Promise<void>

// Players
getSessionPlayers(token: string): Promise<Player[]>
kickPlayer(token: string, playerId: string): Promise<void>
pressBuzzer(sessionToken: string, playerId: string): Promise<void>
resetBuzzer(sessionToken: string): Promise<void>

// Rematch
voteRematch(token: string, playerId: string): Promise<void>
```

### Hooks Personnalisés

#### `useSocket` (`src/hooks/useSocket.ts`)

**Description** : Hook principal pour gérer WebSocket dans les composants
**Paramètres** :

- `token`: Token de session
- `initialSession`: Session initiale (optionnel)
- `initialPlayers`: Joueurs initiaux (optionnel)

**Retour** :

```typescript
interface UseSocketReturn {
  connected: boolean;
  players: Player[];
  joinSession: (token, playerId, isMaster) => void;
  leaveSession: (token, playerId) => void;
  kickPlayer: (token, playerId) => void;
  startGame: (token) => void;
}
```

#### `useVolumeControl` (`src/hooks/useVolumeControl.ts`)

**Description** : Gestion du volume audio global
**Retour** :

```typescript
{
  volume: number; // 0-1
  setVolume: (v: number) => void;
  playMuteSound: () => void;
  playBuzzSound: () => void;
}
```

### Composants Clés

#### Layout

- **`Header`** : Navbar avec logo + profil utilisateur (avatar/mode invité)
- **`Layout`** : Wrapper global avec Header fixe

#### Game Components

- **`PlayerCard`** : Affichage d'un joueur (avatar, pseudo, badges, états)
- **`BuzzerButton`** : Bouton principal de jeu (états: ready/locked/active)

#### Lobby Components

- **`LobbyPlayers`** : Liste des joueurs en attente
- **`LobbyConfig`** : Configuration de partie (maître uniquement)
- **`LobbyShare`** : Partage du lien de session

#### Pages

- **`Home` (`/`)** : Page d'accueil avec création/rejoindre partie
- **`Join` (`/join/:token`)** : Formulaire de personnalisation pour rejoindre
- **`Lobby` (`/lobby/:token`)** : Salle d'attente avant partie
- **`Game` (`/game/:token`)** : Interface de jeu avec buzzer
- **`Results` (`/results/:token`)** : Écran de fin avec classement
- **`Error`** : Page d'erreur personnalisée

### Gestion d'État

#### LocalStorage

**Clés utilisées** :

- `masterPreferences` : Préférences du créateur de partie
- `playerPreferences` : Préférences du joueur qui rejoint
- `volumeControl` : Volume audio (0-1)

**Format des préférences** :

```typescript
{
  pseudo: string;
  emoji: string;
  color: string; // bg-*-400 format
}
```

#### SessionStorage

**Clés utilisées** :

- `playerId` : ID du joueur actuel
- `sessionToken` : Token de la session active
- `playerEmoji` : Emoji du joueur
- `playerColor` : Couleur du joueur

#### Custom Events

**Événements window** :

- `preferencesUpdated` : Dispatché quand les préférences changent (sync entre composants)
- `storage` : Événement natif écouté pour les changements d'autres onglets

### Système de Personnalisation

#### Avatars Disponibles

**16 Emojis** :

```typescript
[
  "😀",
  "😎",
  "🤓",
  "😈",
  "🤠",
  "🥳",
  "🤖",
  "👻",
  "👽",
  "🦄",
  "🦊",
  "🐶",
  "🐱",
  "🐼",
  "🦁",
  "🐯",
];
```

**16 Couleurs** (bg-\*-400) :

- Violet, Bleu, Vert, Jaune, Orange, Rose, Rouge, Cyan
- Indigo, Teal, Lime, Fuchsia, Emerald, Sky, Amber, Slate

#### Flux de Personnalisation

1. **Création** : Modal avec formulaire complet
2. **Sauvegarde** : Checkbox "Se souvenir de moi"
3. **Persistance** : localStorage + backend
4. **Auto-fill** : Pré-remplissage des formulaires
5. **Auto-join** : Skip formulaire si préférences existantes
6. **Gestion** : Modal dans navbar pour voir/modifier/effacer

### Animations et Effets

**Classes Tailwind Custom** :

- `animate-ripple` : Effet d'onde sur le buzzer
- `animate-glow-pulse` : Pulsation lumineuse
- `animate-buzz-shake` : Secousse lors du clic buzzer
- `shadow-[0_0_30px_...]` : Effets de glow dynamiques

**Transitions** :

- Hover states : `hover:scale-110 transition-transform duration-200`
- Modal appearances : fade-in avec backdrop blur
- Player cards : border et shadow animés selon l'état

---

## �🎯 Conventions Spécifiques

### Composants

- Un dossier par composant complexe : `ComponentName/index.tsx`
- Composants simples : fichier unique `ComponentName.tsx`
- Props typées avec interface

### Imports

- **Utiliser les alias `@/`** pour tous les imports internes
- Exemple : `import { Button } from '@/components/ui/Button';`
- Configuration dans `tsconfig.app.json` : `"@/*": ["./src/*"]`
- Configuration Vite : `alias: { '@': path.resolve(__dirname, './src') }`

```tsx
interface BuzzerButtonProps {
  disabled: boolean;
  onBuzz: () => void;
}

export function BuzzerButton({ disabled, onBuzz }: BuzzerButtonProps) {
  // ...
}
```

### Hooks

- Préfixe `use` : `useSocket`, `useGameState`
- Un fichier par hook

### Services

- Classes ou fonctions pour encapsuler la logique externe
- `socketService.ts` pour la gestion WebSocket

## 🎨 Configuration Thème PrimeReact Personnalisé

### Architecture

Le projet utilise **PrimeReact avec Tailwind CSS** via l'API **PassThrough** pour un contrôle total du styling.

```
src/
└── prime/                       # Configuration thème PrimeReact
    ├── index.tsx                # Export du customTheme
    └── components/              # Styles par composant
        ├── inputText.ts
        ├── button.ts            # (à venir)
        └── ...
```

### Principe de Fonctionnement

Dans [src/main.tsx](src/main.tsx) :

```tsx
import { PrimeReactProvider } from "primereact/api";
import { usePassThrough } from "primereact/passthrough";
import Tailwind from "primereact/passthrough/tailwind";
import { customTheme } from "@/prime";

const CustomTailwind = usePassThrough(Tailwind, customTheme, {
  mergeSections: true,
  mergeProps: false,
});

<PrimeReactProvider value={CustomTailwind}>
  <App />
</PrimeReactProvider>;
```

#### Paramètres `usePassThrough`

- **`Tailwind`** : Thème de base fourni par PrimeReact avec classes Tailwind
- **`customTheme`** : Notre objet de customisation
- **`mergeSections: true`** : Fusionne nos styles avec le thème de base au lieu de les remplacer complètement
- **`mergeProps: false`** : N'hérite pas des props, permet un contrôle total

### Structure d'un Composant Customisé

Exemple : [src/prime/components/inputText.ts](src/prime/components/inputText.ts)

```typescript
import type {
  InputTextPassThroughMethodOptions,
  InputTextPassThroughOptions,
} from "primereact/inputtext";
import { classNames } from "primereact/utils";

export const inputtext: InputTextPassThroughOptions = {
  root: ({ props, context }: InputTextPassThroughMethodOptions) => ({
    className: classNames(
      // Classes de base
      "m-0",
      "font-sans text-gray-600 dark:text-white/80",
      "bg-white dark:bg-gray-900",
      "border transition-colors duration-200",
      "appearance-none rounded-lg",

      // États conditionnels
      {
        "focus:outline-none focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]":
          !context.disabled,
        "hover:border-blue-500": !props.invalid && !context.disabled,
        "opacity-60 pointer-events-none": context.disabled,
      },

      // Validation
      {
        "border-gray-300": !props.invalid,
        "border-red-500": props.invalid && !context.disabled,
      },

      // Tailles
      {
        "text-lg px-4 py-4": props.size === "large",
        "text-xs px-2 py-2": props.size === "small",
        "p-3 text-base": !props.size,
      },
    ),
  }),
};
```

### Points Clés

1. **Typage strict** : Utiliser les types `PassThroughOptions` et `PassThroughMethodOptions` de PrimeReact
2. **Réactivité** : `({ props, context })` donne accès aux états (disabled, invalid, focused, etc.)
3. **Utilitaire `classNames`** : Gère les classes conditionnelles élégamment
4. **Structure `root`** : Chaque composant PrimeReact a des "sections" (root, input, label, etc.)

### Ajouter un Nouveau Composant

1. **Créer le fichier** : `src/prime/components/button.ts`

```typescript
import type { ButtonPassThroughOptions } from "primereact/button";

export const button: ButtonPassThroughOptions = {
  root: ({ props }) => ({
    className: classNames(
      "px-4 py-2 rounded-lg font-medium",
      // ... vos styles
    ),
  }),
};
```

2. **Importer dans index.tsx** :

```tsx
import { inputtext } from "./components/inputText";
import { button } from "./components/button";

export const customTheme = {
  inputtext,
  button,
};
```

### Avantages de cette Approche

✅ **Type-safe** : Autocomplétion et validation TypeScript  
✅ **Tailwind natif** : Utiliser des classes Tailwind directement  
✅ **Modulaire** : Un fichier par composant, facile à maintenir  
✅ **Réactif** : Styles dynamiques basés sur l'état (props, context)  
✅ **DRY** : Évite la répétition de classes dans les composants React  
✅ **Compatible** : Tous les composants PrimeReact supportent PassThrough

### Ressources

- [Documentation PassThrough API](https://primereact.org/passthrough/)
- [Tailwind PassThrough Base](https://github.com/primefaces/primereact/blob/master/components/lib/passthrough/tailwind/index.js)
- [Liste des sections disponibles](https://primereact.org/passthrough/#pt-options-api) par composant

---

## 🚀 Commandes

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## 🎨 Design System (À définir)

- Couleurs principales
- Typographie
- Composants UI de base
- Responsive breakpoints (desktop-first, compatible mobile)
