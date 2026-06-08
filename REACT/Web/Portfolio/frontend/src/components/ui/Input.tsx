import { forwardRef, type InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

function buildClassName(
  error: string | undefined,
  leftIcon: React.ReactNode,
  rightIcon: React.ReactNode,
  className: string,
): string {
  return [
    'w-full h-10 rounded-lg border bg-bg-card text-text-primary text-sm',
    'placeholder:text-text-muted transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-error focus:ring-error/40 focus:border-error' : 'border-border hover:border-primary/40',
    leftIcon ? 'pl-9' : 'pl-3',
    rightIcon ? 'pr-9' : 'pr-3',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

function IconSlot({ icon, side }: { icon: React.ReactNode; side: 'left' | 'right' }) {
  const position = side === 'left' ? 'left-0 pl-3' : 'right-0 pr-3';
  return (
    <div className={`absolute inset-y-0 ${position} flex items-center pointer-events-none text-text-muted`}>{icon}</div>
  );
}

function HelperText({ error, hint, inputId }: { error?: string; hint?: string; inputId: string }) {
  if (error)
    return (
      <p id={`${inputId}-error`} className="mt-1.5 text-xs text-error" role="alert">
        {error}
      </p>
    );
  if (hint)
    return (
      <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-text-muted">
        {hint}
      </p>
    );
  return null;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth = true, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && <IconSlot icon={leftIcon} side="left" />}
          <input
            ref={ref}
            id={inputId}
            className={buildClassName(error, leftIcon, rightIcon, className)}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
          {rightIcon && <IconSlot icon={rightIcon} side="right" />}
        </div>
        <HelperText error={error} hint={hint} inputId={inputId} />
      </div>
    );
  },
);

Input.displayName = 'Input';
