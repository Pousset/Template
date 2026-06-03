import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

interface ResponseTimerProps {
  isActive: boolean;
  duration: number; // in seconds
  onTimeout: () => void;
}

export function ResponseTimer({ isActive, duration, onTimeout }: ResponseTimerProps): ReactElement {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration, onTimeout]);

  if (!isActive) {
    return <></>;
  }

  const percentage = (timeLeft / duration) * 100;
  const isWarning = percentage < 30;
  const isCritical = percentage < 10;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm font-semibold">
          ⏱️ Temps de réponse
        </span>
        <span className={`text-2xl font-bold font-mono ${isCritical ? 'text-error animate-pulse' : isWarning ? 'text-warning' : 'text-primary'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical
              ? 'bg-error'
              : isWarning
              ? 'bg-warning'
              : 'bg-success'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
