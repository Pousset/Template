import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/shared/Avatar';
import { Button } from '@/components/ui';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
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

        {/* Auth */}
        <div className="flex items-center gap-3">
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
