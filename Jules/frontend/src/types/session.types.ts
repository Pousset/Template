export const SessionStatus = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED',
} as const;

export type SessionStatus = typeof SessionStatus[keyof typeof SessionStatus];

export interface SessionConfig {
  matchDuration: number; // minutes par question
  responseTime: number; // secondes (default: 10)
  muteTime: number; // secondes de mute après mauvaise réponse (default: 5)
  defaultPoints: number; // points par défaut (default: 1)
}

export interface Session {
  id: string;
  token: string;
  status: SessionStatus;
  config: SessionConfig;
  masterId: string;
  currentRound: number; // Manche actuelle
  isRoundActive: boolean; // Manche en cours ou intermanche
  currentRoundPoints: number; // Points en jeu pour la manche actuelle
  rematchVotes?: string[]; // IDs des joueurs qui ont voté pour rejouer
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface CreateSessionResponse {
  session: Session;
  playerId: string;
  isMaster: true;
}

export interface JoinSessionResponse {
  session: Session;
  playerId: string;
  isMaster: false;
}
