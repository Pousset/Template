import type { ReactElement } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';

interface LobbyShareProps {
  token: string;
}

export function LobbyShare({ token }: LobbyShareProps): ReactElement {
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}/join/${token}`;

  return (
    <div className="bg-bg-elevated rounded-xl p-6 border border-primary/20 space-y-4">
      <h2 className="font-display font-bold text-xl text-text-primary mb-4">
        🔗 Partager la partie
      </h2>

      {/* Full URL */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Lien complet
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={fullUrl}
            readOnly
            className="flex-1 px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-lg text-primary text-sm font-mono focus:outline-none"
          />
          <CopyButton text={fullUrl} label="Copier" />
        </div>
      </div>

      {/* Token Only */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Code de session
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={token}
            readOnly
            className="flex-1 px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-lg text-primary text-xl font-mono font-bold text-center focus:outline-none tracking-wider"
          />
          <CopyButton text={token} label="Copier" />
        </div>
      </div>

      <p className="text-xs text-text-muted mt-4">
        💡 Les joueurs peuvent rejoindre en utilisant le lien complet ou en entrant le code sur la page d'accueil
      </p>
    </div>
  );
}
