export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
