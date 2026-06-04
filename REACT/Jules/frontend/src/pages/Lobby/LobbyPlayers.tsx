import type { ReactElement } from 'react';
import type { Player } from '@/types/player.types';
import { PlayerCard } from '@/components/game/PlayerCard';

interface LobbyPlayersProps {
  players: Player[];
  canKick: boolean;
  onKick: (playerId: string) => void;
  rematchVotes: string[];
}

export function LobbyPlayers({ players, canKick, onKick, rematchVotes }: LobbyPlayersProps): ReactElement {
  // Sort: Master first, then by join time
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isMaster) return -1;
    if (b.isMaster) return 1;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });

  console.log('👥 LobbyPlayers - rematchVotes:', rematchVotes, 'players:', players.map(p => ({ id: p.id, pseudo: p.pseudo })));
  
  // Dans le lobby, on n'affiche jamais les pastilles rouges pour les rematch
  // car les nouveaux arrivants ne doivent pas être marqués comme "en attente"
  return (
    <div className="bg-bg-elevated rounded-xl border border-primary/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl text-text-primary">
          👥 Joueurs
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
            {players.length} {players.length > 1 ? 'joueurs' : 'joueur'}
          </span>
        </div>
      </div>

      {/* Players List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedPlayers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            <p className="text-lg mb-2">En attente de joueurs...</p>
            <p className="text-sm">Partagez le lien ou le code pour inviter des amis !</p>
          </div>
        ) : (
          sortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              canKick={canKick}
              onKick={onKick}
              isWaitingForRematch={false}
            />
          ))
        )}
      </div>

      {/* Info */}
      {players.filter(p => p.isConnected).length < 3 && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg text-warning text-sm">
          ⚠️ Minimum 3 joueurs connectés requis pour démarrer la partie (maître inclus)
        </div>
      )}
    </div>
  );
}
