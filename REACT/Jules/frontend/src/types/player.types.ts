export interface Player {
  id: string;
  pseudo: string;
  sessionId: string;
  score: number;
  isMaster: boolean;
  isConnected: boolean;
  isMuted?: boolean;
  mutedUntil?: Date;
  avatar: string; // Emoji
  color: string; // Tailwind class
  joinedAt: Date;
}

export interface PlayerJoinedEvent {
  player: Player;
}

export interface PlayerLeftEvent {
  playerId: string;
}

export interface PlayerKickedEvent {
  playerId: string;
  kickedBy: string;
}
