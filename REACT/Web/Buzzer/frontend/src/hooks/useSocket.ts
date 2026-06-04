import { useEffect, useState, useCallback } from 'react';
import type { Player } from '@/types/player.types';
import type { Session } from '@/types/session.types';
import { socketService } from '@/services/socket.service';
import { getSessionPlayers } from '@/services/api.service';

interface UseSocketReturn {
  connected: boolean;
  players: Player[];
  session: Session | null;
  joinSession: (token: string, playerId: string, isMaster: boolean) => void;
  leaveSession: (token: string, playerId: string) => void;
  kickPlayer: (token: string, playerId: string) => void;
  startGame: (token: string) => void;
  refetchPlayers: () => Promise<void>;
}

export function useSocket(token?: string, initialSession?: Session, initialPlayers?: Player[]): UseSocketReturn {
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState<Player[]>(initialPlayers || []);
  const [session, setSession] = useState<Session | null>(initialSession || null);

  // Function to refetch players
  const refetchPlayers = useCallback(async () => {
    if (!token) return;
    
    try {
      const updatedPlayers = await getSessionPlayers(token);
      setPlayers(updatedPlayers);
      console.log('✅ Players refetched:', updatedPlayers);
    } catch (error) {
      console.error('Failed to refetch players:', error);
    }
  }, [token]);

  useEffect(() => {
    // Connect socket
    socketService.connect();

    // Event handlers
    const handlePlayerJoined = async (data: any): Promise<void> => {
      console.log('📥 playerJoined event received:', data);
      // Refetch the complete list of players
      await refetchPlayers();
    };

    const handlePlayerLeft = (data: any): void => {
      console.log('📥 playerLeft event received:', data);
      setPlayers(prev => prev.filter(p => p.id !== data.playerId));
    };

    const handlePlayerKicked = (data: any): void => {
      console.log('📥 playerKicked event received:', data);
      setPlayers(prev => prev.filter(p => p.id !== data.playerId));
    };

    const handleSessionUpdated = (data: any): void => {
      console.log('📥 sessionUpdated event received:', data);
      if (data.session) {
        setSession(data.session);
      }
    };

    const handleGameStarted = (data: any): void => {
      console.log('📥 gameStarted event received:', data);
    };

    // Subscribe to events
    socketService.onPlayerJoined(handlePlayerJoined);
    socketService.onPlayerLeft(handlePlayerLeft);
    socketService.onPlayerKicked(handlePlayerKicked);
    socketService.onSessionUpdated(handleSessionUpdated);
    socketService.onGameStarted(handleGameStarted);

    // Check connection status
    const checkConnection = (): void => {
      setConnected(socketService.isConnected());
    };

    const connectionCheckInterval = setInterval(checkConnection, 1000);
    checkConnection();

    return () => {
      clearInterval(connectionCheckInterval);
      socketService.disconnect();
      setConnected(false);
    };
  }, [refetchPlayers]);

  const joinSession = (token: string, playerId: string, isMaster: boolean): void => {
    socketService.joinSession(token, playerId, isMaster);
  };

  const leaveSession = (token: string, playerId: string): void => {
    socketService.leaveSession(token, playerId);
  };

  const kickPlayer = (token: string, playerId: string): void => {
    socketService.kickPlayer(token, playerId);
  };

  const startGame = (token: string): void => {
    socketService.startGame(token);
  };

  return {
    connected,
    players,
    session,
    joinSession,
    leaveSession,
    kickPlayer,
    startGame,
    refetchPlayers,
  };
}
