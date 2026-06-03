import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';

interface BuzzerButtonProps {
  disabled: boolean;
  isBuzzed: boolean;
  buzzedBy: string | null;
  currentPlayerPseudo: string;
  onBuzz: () => void;
}

export function BuzzerButton({ disabled, isBuzzed, buzzedBy, currentPlayerPseudo, onBuzz }: BuzzerButtonProps): ReactElement {
  const [ripple, setRipple] = useState(false);

  const handleClick = (): void => {
    if (!disabled) {
      setRipple(true);
      onBuzz();
      setTimeout(() => setRipple(false), 600);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.code === 'Space' && !disabled && !isBuzzed) {
        e.preventDefault();
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, isBuzzed]);

  const getButtonState = () => {
    if (isBuzzed && buzzedBy === currentPlayerPseudo) {
      return {
        className: 'bg-gradient-to-br from-accent to-primary animate-glow-pulse',
        text: 'BUZZÉ!',
      };
    }
    if (isBuzzed && buzzedBy !== currentPlayerPseudo) {
      return {
        className: 'bg-buzz-locked cursor-not-allowed opacity-50',
        text: `${buzzedBy} a buzzé!`,
      };
    }
    if (disabled) {
      return {
        className: 'bg-buzz-locked cursor-not-allowed opacity-50',
        text: 'BLOQUÉ',
      };
    }
    return {
      className: 'bg-gradient-to-br from-primary to-accent hover:from-primary-light hover:to-accent shadow-[0_0_60px_rgba(168,85,247,0.6)] hover:shadow-[0_0_80px_rgba(168,85,247,0.8)] hover:scale-105 active:scale-95',
      text: 'BUZZ!',
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleClick}
        disabled={disabled || isBuzzed}
        className={`relative w-64 h-64 rounded-full text-white font-display font-bold text-5xl transition-all duration-300 ${buttonState.className} ${ripple ? 'animate-buzz-shake' : ''}`}
      >
        {buttonState.text}
        
        {ripple && (
          <span className="absolute inset-0 rounded-full border-4 border-accent animate-ripple" />
        )}
      </button>

      {/* Keyboard hint */}
      {!disabled && !isBuzzed && (
        <div className="absolute -bottom-12 text-center">
          <p className="text-text-muted text-sm">
            Appuyez sur <kbd className="px-2 py-1 bg-bg-elevated rounded text-primary font-mono">ESPACE</kbd>
          </p>
        </div>
      )}
    </div>
  );
}
