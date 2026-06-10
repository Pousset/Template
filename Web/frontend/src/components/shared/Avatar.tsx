type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  username?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizes: Record<AvatarSize, { wrapper: string; text: string }> = {
  sm: { wrapper: 'w-8 h-8 text-xs', text: 'font-semibold' },
  md: { wrapper: 'w-11 h-11 text-sm', text: 'font-semibold' },
  lg: { wrapper: 'w-14 h-14 text-xl', text: 'font-bold' },
};

function getInitials(username?: string | null): string {
  if (!username) return '??';
  return username.slice(0, 2).toUpperCase();
}

export function Avatar({ username, size = 'md', className = '' }: AvatarProps) {
  const { wrapper, text } = sizes[size];
  return (
    <div
      className={[
        'rounded-full bg-primary flex items-center justify-center text-white shrink-0',
        wrapper,
        text,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={username ?? 'Utilisateur'}
    >
      {getInitials(username)}
    </div>
  );
}
