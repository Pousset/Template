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

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsLoading(true);
    try {
      const data = await authService.register(username, password);
      login(data.accessToken, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="Créer un compte" subtitle="Rejoins l'espace.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nom d'utilisateur"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
          minLength={3}
          maxLength={20}
          required
        />
        <FormField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={8}
          required
        />
        <FormField
          label="Confirmer le mot de passe"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <ErrorMessage message={error} />}
        <Button type="submit" isLoading={isLoading} fullWidth>
          Créer mon compte
        </Button>
      </form>

      <AuthDivider />
      <GoogleSignInButton label="S'inscrire avec Google" onClick={() => authService.loginWithGoogle()} />

      <p className="text-center text-xs text-text-muted">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light transition-colors">
          Se connecter
        </Link>
      </p>
    </AuthFormWrapper>
  );
}
