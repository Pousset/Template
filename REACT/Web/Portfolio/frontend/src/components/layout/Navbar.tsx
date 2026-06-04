import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??';

  return (
    <nav className="w-full border-b border-border bg-[var(--color-bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          TEMPLATE SITE
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
          <Link to="/" className="hover:text-[var(--color-text-primary)] transition-colors">
            Home
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-[var(--color-text-primary)] transition-colors">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="hover:text-[var(--color-primary-light)] transition-colors text-[var(--color-primary)]"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Avatar + username */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-semibold text-white">
                  {initials}
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-all"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
