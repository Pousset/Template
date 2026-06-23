import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/auth.service';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    // Save token then let AuthContext's hydration pick it up on next load,
    // OR fetch the user immediately and store it ourselves.
    authService.saveToken(token);
    authService
      .getMe()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => {
        authService.logout();
        navigate('/login', { replace: true });
      });
  }, []);

  return <p>Connexion en cours…</p>;
}
