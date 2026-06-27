import { apiFetch } from '@/services/api.service';
import type { AuthResponse, User } from '@/types/user.types';

export const authService = {
  async register(username: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getMe(): Promise<User> {
    return apiFetch<User>('/auth/me');
  },

  logout(): void {
    localStorage.removeItem('access_token');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  loginWithGoogle(): void {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
    window.location.href = `${apiUrl}/auth/google`;
  },
};
