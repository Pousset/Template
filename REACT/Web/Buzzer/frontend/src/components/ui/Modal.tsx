import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'primary',
}: ModalProps): ReactElement | null {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = (): void => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-bg-elevated rounded-2xl shadow-2xl border border-primary/20 max-w-md w-full animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary/10">
          <h2 className="font-display font-bold text-2xl text-text-primary">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 text-text-secondary">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-primary/10 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-bg-base hover:bg-bg-elevated border border-primary/20 text-text-secondary hover:text-text-primary"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                confirmVariant === 'danger'
                  ? 'bg-error hover:bg-error/80 text-white'
                  : 'bg-primary hover:bg-primary/80 text-white'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
