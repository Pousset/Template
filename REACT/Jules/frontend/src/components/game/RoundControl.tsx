import type { ReactElement } from 'react';
import { useState } from 'react';

interface RoundControlProps {
  onValidate: () => void;
  onInvalidate: () => void;
  onReset: () => void;
  onSetPoints: (points: number) => void;
  currentPoints: number;
  isBuzzed: boolean;
  roundActive: boolean;
}

export function RoundControl({ onValidate, onInvalidate, onReset, onSetPoints, currentPoints, isBuzzed, roundActive }: RoundControlProps): ReactElement {
  const [points, setPoints] = useState(currentPoints);

  const handlePointsChange = (newPoints: number): void => {
    setPoints(newPoints);
    onSetPoints(newPoints);
  };

  const pointsOptions = [1, 2, 3, 5, 10];

  return (
    <div className="bg-bg-elevated rounded-xl border border-master-badge/20 p-6 space-y-6">
      <h3 className="font-display font-bold text-xl text-master-badge mb-4">
        👑 Contrôles Maître
      </h3>

      {/* Points selector */}
      {!isBuzzed && !roundActive && (
        <div className="space-y-3">
          <label className="block text-text-secondary text-sm font-semibold">
            Points de la manche
          </label>
          <div className="flex gap-2">
            {pointsOptions.map((p) => (
              <button
                key={p}
                onClick={() => handlePointsChange(p)}
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                  points === p
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'bg-bg-secondary text-text-muted hover:bg-bg-hover'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validation buttons */}
      {isBuzzed && (
        <div className="space-y-3">
          <p className="text-text-secondary text-sm text-center mb-4">
            Validez ou invalidez la réponse
          </p>
          <div className="flex gap-4">
            <button
              onClick={onValidate}
              className="flex-1 px-6 py-4 bg-success hover:bg-success/90 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              ✓ Bonne réponse
            </button>
            <button
              onClick={onInvalidate}
              className="flex-1 px-6 py-4 bg-error hover:bg-error/90 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              ✗ Mauvaise
            </button>
          </div>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full px-6 py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
      >
        🔄 Réinitialiser le buzzer
      </button>

      {/* Instructions */}
      <div className="p-4 bg-info/10 border border-info/30 rounded-lg text-info text-sm">
        <p className="font-semibold mb-2">💡 Instructions:</p>
        <ul className="space-y-1 text-xs">
          <li>• Définissez les points avant de poser la question</li>
          <li>• Les joueurs buzzent pour répondre</li>
          <li>• Validez ou invalidez leur réponse vocale</li>
          <li>• Réinitialisez pour la prochaine question</li>
        </ul>
      </div>
    </div>
  );
}
