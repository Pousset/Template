import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/shared/Avatar';
import { Button } from '@/components/ui';

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full border-b border-border bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-text-primary hover:text-primary transition-colors"
        >
          TEMPLATE SITE
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link to="/" className="hover:text-text-primary transition-colors">
            Home
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-text-primary transition-colors">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary-light transition-colors">
              Admin
            </Link>
          )}
        </div>

        {/* Auth + theme toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar username={user.username} size="sm" />
                <span className="text-sm text-text-secondary">{user.username}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
