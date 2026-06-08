import { createContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types/user.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydratation au démarrage — vérifier si un token valide existe
  useEffect(() => {
    const token = authService.getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getMe()
      .then(setUser)
      .catch(() => authService.logout())
      .finally(() => setIsLoading(false));
  }, []);

  function login(token: string, user: User) {
    authService.saveToken(token);
    setUser(user);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext value={{ user, isLoading, isAdmin: user?.role === 'admin', login, logout }}>
      {children}
    </AuthContext>
  );
}
