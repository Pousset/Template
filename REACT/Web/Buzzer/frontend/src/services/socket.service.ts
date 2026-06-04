import type { Player } from '@/types/player.types';
import type { Session } from '@/types/session.types';
import { io, type Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Debug: Log API URL at startup
console.log('🔧 Socket Service Configuration:');
console.log('   API_URL:', API_URL);
console.log('   VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('   MODE:', import.meta.env.MODE);

class SocketService {
  private socket: Socket | null = null;
  private connected = false;

  connect(): void {
    if (this.socket) {
      return;
    }

    console.log('🔌 Attempting to connect to:', API_URL);

    this.socket = io(API_URL, {
      transports: ['websocket'],
      upgrade: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('✅ Socket connected to:', API_URL);
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket disconnected');
    }
  }

  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  // Emit events (to server)
  emit(event: string, ...args: unknown[]): void {
    if (this.socket) {
      this.socket.emit(event, ...args);
      console.log(`📤 Socket emit: ${event}`, args);
    } else {
      console.warn('Socket not connected');
    }
  }

  // Listen to events (from server)
  on(event: string, handler: (...args: unknown[]) => void): void {
    if (this.socket) {
      console.log(`📥 Listening to event: ${event}`);
      this.socket.on(event, (...args) => {
        console.log(`📨 Event received: ${event}`, args);
        handler(...args);
      });
    }
  }

  // Remove event listener
  off(event: string, handler?: (...args: unknown[]) => void): void {
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler);
      } else {
        // Remove all listeners for this event
        this.socket.off(event);
      }
    }
  }

  // === Session Events ===
  joinSession(token: string, playerId: string, isMaster: boolean): void {
    this.emit('joinSession', { token, playerId, isMaster });
  }

  leaveSession(token: string, playerId: string): void {
    this.emit('leaveSession', { token, playerId });
  }

  // === Game Events ===
  kickPlayer(token: string, playerId: string): void {
    this.emit('kickPlayer', { token, playerId });
  }

  startGame(token: string): void {
    this.emit('startGame', { token });
  }

  // === Round Events ===
  startRound(token: string, points: number): void {    console.log('🔌 socketService.startRound', { connected: this.isConnected(), token, points });    this.emit('startRound', { token, points });
  }

  buzz(token: string, playerId: string): void {
    this.emit('buzz', { token, playerId });
  }

  validateAnswer(token: string, playerId: string, points: number): void {
    this.emit('validateAnswer', { token, playerId, points });
  }

  invalidateAnswer(token: string, playerId: string): void {
    this.emit('invalidateAnswer', { token, playerId });
  }

  resetBuzzer(token: string): void {
    this.emit('resetBuzzer', { token });
  }

  // === Event Listeners ===
  onPlayerJoined(handler: (player: Player) => void): void {
    this.on('playerJoined', (data: unknown) => handler(data as Player));
  }

  onPlayerLeft(handler: (playerId: string) => void): void {
    this.on('playerLeft', (data: unknown) => handler(data as string));
  }

  onPlayerKicked(handler: (data: { playerId: string }) => void): void {
    this.on('playerKicked', (data: unknown) => handler(data as { playerId: string }));
  }

  onSessionDeleted(handler: () => void): void {
    this.on('sessionDeleted', () => handler());
  }

  onGameStarted(handler: (session: Session) => void): void {
    this.on('gameStarted', (data: unknown) => handler(data as Session));
  }

  onSessionUpdated(handler: (session: Session) => void): void {
    this.on('sessionUpdated', (data: unknown) => handler(data as Session));
  }

  // === Round Event Listeners ===
  onRoundStarted(handler: (data: { points: number; currentRound: number }) => void): void {
    this.on('roundStarted', (data: unknown) => handler(data as { points: number; currentRound: number }));
  }

  onBuzzed(handler: (data: { playerId: string; pseudo: string }) => void): void {
    this.on('buzzed', (data: unknown) => handler(data as { playerId: string; pseudo: string }));
  }

  onAnswerValidated(handler: (data: { playerId: string; pseudo: string; points: number; isGameFinished?: boolean }) => void): void {
    this.on('answerValidated', (data: unknown) => handler(data as { playerId: string; pseudo: string; points: number; isGameFinished?: boolean }));
  }

  onAnswerInvalidated(handler: (data: { playerId: string }) => void): void {
    this.on('answerInvalidated', (data: unknown) => handler(data as { playerId: string }));
  }

  onBuzzerReset(handler: () => void): void {
    this.on('buzzerReset', () => handler());
  }

  // === Rematch Event Listeners ===
  onRematchVoteUpdated(handler: (data: { votes: number; required: number }) => void): void {
    this.on('rematchVoteUpdated', (data: unknown) => handler(data as { votes: number; required: number }));
  }

  onRematchAccepted(handler: () => void): void {
    this.on('rematchAccepted', () => handler());
  }

  onRematchAcceptedForYou(handler: (data: { playerId: string }) => void): void {
    this.on('rematchAcceptedForYou', (data: unknown) => handler(data as { playerId: string }));
  }

  // === Rematch Actions ===
  voteRematch(token: string, playerId: string, vote: boolean): void {
    this.emit('voteRematch', { token, playerId, vote });
  }
}

export const socketService = new SocketService();
