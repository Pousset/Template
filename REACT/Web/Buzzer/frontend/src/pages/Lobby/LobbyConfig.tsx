import type { ReactElement } from 'react';
import type { SessionConfig } from '@/types/session.types';

interface LobbyConfigProps {
  initialConfig: SessionConfig;
  onSubmit: (config: SessionConfig) => void;
}

export function LobbyConfig({ initialConfig, onSubmit }: LobbyConfigProps): ReactElement {
  const handleChange = (field: keyof SessionConfig, value: number): void => {
    const newConfig = { ...initialConfig, [field]: value };
    onSubmit(newConfig);
  };

  return (
    <div className="bg-bg-elevated rounded-xl p-6 border border-primary/20">
      <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
        ⚙️ Configuration de la partie
      </h2>

      <div className="space-y-6">
        {/* Response Time and Mute Time - Same Line */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="responseTime"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Temps de réponse (secondes)
            </label>
            <input
              id="responseTime"
              type="number"
              value={initialConfig.responseTime}
              onChange={(e) => handleChange('responseTime', Number(e.target.value))}
              min={5}
              max={60}
              className="w-full px-4 py-3 bg-bg-primary border-2 border-bg-hover focus:border-primary rounded-lg text-text-primary transition-colors duration-200 focus:outline-none"
            />
            <p className="mt-1 text-xs text-text-muted">
              Après buzz
            </p>
          </div>

          <div>
            <label
              htmlFor="muteTime"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Temps de mute (secondes)
            </label>
            <input
              id="muteTime"
              type="number"
              value={initialConfig.muteTime}
              onChange={(e) => handleChange('muteTime', Number(e.target.value))}
              min={0}
              max={30}
              className="w-full px-4 py-3 bg-bg-primary border-2 border-bg-hover focus:border-primary rounded-lg text-text-primary transition-colors duration-200 focus:outline-none"
            />
            <p className="mt-1 text-xs text-text-muted">
              Après mauvaise réponse
            </p>
          </div>
        </div>

        {/* Match Duration and Default Points - Same Line */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="matchDuration"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Nombre de manches
            </label>
            <input
              id="matchDuration"
              type="number"
              value={initialConfig.matchDuration}
              onChange={(e) => handleChange('matchDuration', Number(e.target.value))}
              min={1}
              max={30}
              className="w-full px-4 py-3 bg-bg-primary border-2 border-bg-hover focus:border-primary rounded-lg text-text-primary transition-colors duration-200 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="defaultPoints"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Points par manche
            </label>
            <input
              id="defaultPoints"
              type="number"
              value={initialConfig.defaultPoints}
              onChange={(e) => handleChange('defaultPoints', Number(e.target.value))}
              min={1}
              max={100}
              className="w-full px-4 py-3 bg-bg-primary border-2 border-bg-hover focus:border-primary rounded-lg text-text-primary transition-colors duration-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
