<!-- # BuzzMaster - Lobby Implementation

## Overview
This document describes the lobby implementation for BuzzMaster, including game creation, player management, and real-time synchronization.

## Architecture

### Routes
- `/` - Home page with create/join options
- `/join/:token` - Join page for entering pseudo
- `/lobby/:token` - Lobby page (game creation + player management)

### Key Components

#### Pages
- **Home** (`src/index.tsx`): Landing page with create/join modal
- **Join** (`src/pages/Join/Join.tsx`): Pseudo input before joining lobby
- **Lobby** (`src/pages/Lobby/Lobby.tsx`): Main lobby page with config and players

#### Lobby Sub-Components
- **LobbyConfig** (`LobbyConfig.tsx`): Game configuration form (master only)
  - Match duration (minutes)
  - Response time (5-60s, default 10s)
  - Default points (1-100, default 1)
  - Locks after submission

- **LobbyPlayers** (`LobbyPlayers.tsx`): Player list with cards
  - Sorts master first
  - Shows player count
  - Warning if < 3 players
  - Kick functionality (master only)

- **LobbyShare** (`LobbyShare.tsx`): Share links section
  - Full URL with origin
  - Token only (shorter)
  - Copy buttons with feedback

#### UI Components
- **CopyButton** (`src/components/ui/CopyButton.tsx`): Reusable copy-to-clipboard button
- **PlayerCard** (`src/components/game/PlayerCard.tsx`): Player display with avatar, badge, status, kick button

### Services

#### API Service (`src/services/api.service.ts`)
Mock REST API with Map-based storage:
- `createSession(config)` - Creates new session, returns token + playerId
- `getSession(token)` - Fetches session by token
- `joinSession(token, pseudo)` - Adds player to session
- `getSessionPlayers(sessionId)` - Gets all players
- `kickPlayer(sessionId, playerId)` - Removes player
- `deleteSession(token)` - Deletes session
- `startGame(token)` - Changes status to PLAYING

#### Socket Service (`src/services/socket.service.ts`)
Mock Socket.io client for real-time events:
- Events: `playerJoined`, `playerLeft`, `playerKicked`, `gameStarted`, `sessionUpdated`
- Methods: `joinSession`, `leaveSession`, `kickPlayer`, `startGame`

**Note**: Both services are mocks for frontend development. Replace with real API/WebSocket when backend is ready.

### Hooks

#### useCopyToClipboard (`src/hooks/useCopyToClipboard.ts`)
- Copies text to clipboard
- Shows "copied" feedback for 2 seconds
- Returns `{ copied, copy }`

#### useSocket (`src/hooks/useSocket.ts`)
- Manages WebSocket connection and state
- Tracks players array and session
- Subscribes to all socket events
- Provides methods: `joinSession`, `leaveSession`, `kickPlayer`, `startGame`

### Types

#### Session Types (`src/types/session.types.ts`)
```typescript
enum SessionStatus { LOBBY, PLAYING, FINISHED }

interface SessionConfig {
  matchDuration: number;  // minutes
  responseTime: number;   // seconds (5-60)
  defaultPoints: number;  // points (1-100)
}

interface Session {
  id: string;
  token: string;
  masterId: string;
  status: SessionStatus;
  config: SessionConfig;
  createdAt: Date;
}
```

#### Player Types (`src/types/player.types.ts`)
```typescript
interface Player {
  id: string;
  pseudo: string;
  score: number;
  isMaster: boolean;
  isConnected: boolean;
  avatar: string;       // emoji
  color: string;        // Tailwind class
  joinedAt: Date;
}
```

### Utils

#### Colors (`src/utils/colors.ts`)
- 12 player colors: blue, green, red, yellow, purple, pink, indigo, teal, orange, cyan, lime, rose
- MASTER_COLOR: amber-400
- `getPlayerColor(index)` - Get color by player index
- `getRandomColor()` - Random color from pool

#### Avatars (`src/utils/avatars.ts`)
- 36 emojis: gaming, animals, food, music, sports
- `getRandomAvatar()` - Random emoji
- `getAvatarByIndex(index)` - Get emoji by index

## User Flows

### Master Flow
1. Click "Créer une partie" on home
2. Session created with default config → redirect to `/lobby/:token`
3. Configure game settings (duration, response time, points)
4. Share URL or token with players
5. Wait for min 3 players
6. Kick unwanted players if needed
7. Click "Lancer la partie" when ready

### Player Flow
1. Click "Rejoindre une partie" on home
2. Enter token in modal → redirect to `/join/:token`
3. Enter pseudo (2-20 characters)
4. Join lobby → redirect to `/lobby/:token`
5. Wait for master to start game

## Real-Time Updates

Players receive instant updates for:
- New player joins
- Player leaves/disconnects
- Player kicked
- Game started
- Session configuration changes

All managed through `useSocket` hook.

## Validation Rules

### Pseudo (Join Page)
- Required
- 2-20 characters

### Config (Lobby Page)
- Match duration: required, positive number
- Response time: 5-60 seconds
- Default points: 1-100 points

### Start Game
- Minimum 3 players
- Config must be locked (submitted)

## State Management

### sessionStorage
- `playerId` - Current player's ID (set on create/join)

### Component State
- **Home**: `showJoinModal`, `joinToken`, `loading`
- **Join**: `pseudo`, `error`, `loading`
- **Lobby**: `session`, `players`, `loading`, `configLocked`

## Styling

### Theme
- Dark mode exclusive
- Primary: Violet (OKLCH)
- Accent: Fuchsia
- Success: Green
- Error: Red

### Animations
- `glow-pulse` - Connection status indicators
- `buzz-shake` - Error feedback
- `gradient-shift` - Animated borders
- `ripple` - Button effects (future use)

### Responsive
- Mobile first
- 2-column layout on lg breakpoint (1024px+)
- Stacked on mobile/tablet

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install react-router-dom socket.io-client
   ```

2. **Backend Integration**
   - Replace `api.service.ts` with real API calls
   - Replace `socket.service.ts` with real Socket.io client
   - Update environment variables for API URL

3. **Game Page**
   - Implement buzzer interface
   - Real-time buzz handling
   - Score tracking
   - Question display

4. **Testing**
   - Open multiple browser tabs
   - Test real-time synchronization
   - Verify kick functionality
   - Test with various player counts

## Development Notes

- Mock services use `setTimeout(300ms)` to simulate network delay
- Socket events are simulated with `simulateEvent()` method
- All ESLint rules are applied (single quotes, semicolons, etc.)
- TypeScript strict mode enabled -->
