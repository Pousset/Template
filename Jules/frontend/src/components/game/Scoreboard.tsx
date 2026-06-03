import type { ReactElement } from 'react';
import type { Player } from '@/types/player.types';

interface ScoreboardProps {
  players: Player[];
  compact?: boolean;
}

export function Scoreboard({ players, compact = false }: ScoreboardProps): ReactElement {
  // Filter out the master and sort by score
  const sortedPlayers = [...players]
    .filter(player => !player.isMaster)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="bg-bg-elevated rounded-xl border border-primary/20 p-6">
      <h2 className="font-display font-bold text-2xl text-text-primary mb-4">
        🏆 Classement
      </h2>
      <div className="space-y-2">
        {sortedPlayers.length === 0 ? (
          <p className="text-center text-text-muted py-8">
            Aucun joueur
          </p>
        ) : (
          sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                index === 0
                  ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30'
                  : 'bg-bg-secondary'
              }`}
            >
              {/* Rank */}
              <span
                className={`text-2xl font-bold w-8 ${
                  index === 0
                    ? 'text-master-badge'
                    : index === 1
                    ? 'text-text-secondary'
                    : index === 2
                    ? 'text-warning'
                    : 'text-text-muted'
                }`}
              >
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>

              {/* Avatar */}
              <div
                className={`${compact ? 'w-8 h-8 text-lg' : 'w-10 h-10 text-xl'} rounded-full ${player.color} flex items-center justify-center flex-shrink-0`}
              >
                {player.avatar}
              </div>

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-text-primary truncate ${compact ? 'text-sm' : ''}`}>
                  {player.pseudo}
                  {player.isMaster && (
                    <span className="ml-2 text-xs text-master-badge">👑</span>
                  )}
                </p>
                {player.isMuted && !compact && (
                  <p className="text-xs text-player-muted">🔇 Muté</p>
                )}
              </div>

              {/* Score */}
              <span
                className={`font-bold ${compact ? 'text-lg' : 'text-xl'} ${
                  index === 0 ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {player.score}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
