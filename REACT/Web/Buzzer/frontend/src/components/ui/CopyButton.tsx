import type { ReactElement } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copier' }: CopyButtonProps): ReactElement {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = (): void => {
    copy(text);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-bg-elevated hover:bg-bg-hover text-text-primary rounded-lg border border-primary/30 hover:border-primary/60 transition-all duration-200 flex items-center gap-2 font-medium text-sm"
    >
      {copied ? (
        <>
          <span className="text-primary">✓</span>
          <span className="text-primary">Copié !</span>
        </>
      ) : (
        <>
          <span>📋</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
