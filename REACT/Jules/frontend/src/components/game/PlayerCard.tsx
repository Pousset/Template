import type { ReactElement } from 'react';
import type { Player } from '@/types/player.types';

interface PlayerCardProps {
  player: Player;
  canKick?: boolean;
  onKick?: (playerId: string) => void;
  isWaitingForRematch?: boolean; // True si le joueur n'a pas encore accepté le rematch
}

export function PlayerCard({ player, canKick = false, onKick, isWaitingForRematch = false }: PlayerCardProps): ReactElement {
  console.log(`🎴 PlayerCard ${player.pseudo}:`, { 
    isWaitingForRematch, 
    isConnected: player.isConnected,
    avatar: player.avatar,
    color: player.color
  });
  
  const handleKick = (): void => {
    if (onKick) {
      onKick(player.id);
    }
  };

  return (
    <div
      className="relative bg-bg-secondary rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all duration-200 flex items-center gap-4"
    >
      {/* Avatar */}
      <div
        className={`w-16 h-16 rounded-full ${player.color} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}
      >
        {player.avatar}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-text-primary truncate mb-1">
          {player.pseudo}
        </h3>
        <div className="flex items-center gap-2">
          {player.isMaster ? (
            <span className="text-sm text-text-muted">
              👑 Maître du jeu
            </span>
          ) : (
            <span className="text-sm text-text-muted">
              🎮 Joueur
            </span>
          )}
        </div>
      </div>

      {/* Connection status */}
      <div
        className={`w-3 h-3 rounded-full ${
          isWaitingForRematch 
            ? 'bg-error' 
            : player.isConnected 
            ? 'bg-success' 
            : 'bg-error'
        } animate-pulse`}
        title={
          isWaitingForRematch 
            ? "En attente d'acceptation du rematch" 
            : player.isConnected 
            ? 'Connecté' 
            : 'Déconnecté'
        }
      />

      {/* Kick button */}
      {canKick && !player.isMaster && (
        <button
          onClick={handleKick}
          className="ml-2 w-8 h-8 rounded-lg bg-error/10 hover:bg-error/20 text-error hover:text-error flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="Exclure le joueur"
        >
          ❌
        </button>
      )}
    </div>
  );
}
