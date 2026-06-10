import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { AuthFormWrapper } from '@/components/auth/AuthFormWrapper';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { FormField } from '@/components/auth/FormField';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Button } from '@/components/ui';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await authService.login(username, password);
      login(data.accessToken, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      setError('Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="Connexion" subtitle="Content de te revoir.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nom d'utilisateur"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
          required
        />
        <FormField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <ErrorMessage message={error} />}
        <Button type="submit" isLoading={isLoading} fullWidth>
          Se connecter
        </Button>
      </form>

      <AuthDivider />
      <GoogleSignInButton onClick={() => authService.loginWithGoogle()} />

      <p className="text-center text-xs text-text-muted">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-primary hover:text-primary-light transition-colors">
          S'inscrire
        </Link>
      </p>
    </AuthFormWrapper>
  );
}
