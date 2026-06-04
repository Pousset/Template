import type { CreateSessionResponse, JoinSessionResponse, Session, SessionConfig } from '@/types/session.types';
import type { Player } from '@/types/player.types';

const API_URL = import.meta.env.VITE_API_URL

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const playerId = sessionStorage.getItem('playerId');
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(playerId ? { 'x-player-id': playerId } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function createSession(
  config: SessionConfig,
  masterPseudo: string,
  emoji?: string,
  color?: string
): Promise<CreateSessionResponse> {
  return apiCall<CreateSessionResponse>('/sessions', {
    method: 'POST',
    body: JSON.stringify({
      masterPseudo,
      emoji,
      color,
      config,
    }),
  });
}

export async function getSession(token: string): Promise<Session | null> {
  try {
    return await apiCall<Session>(`/sessions/${token}`);
  } catch {
    return null;
  }
}

export async function joinSession(token: string, pseudo: string, emoji?: string, color?: string): Promise<JoinSessionResponse> {
  return apiCall<JoinSessionResponse>(`/sessions/${token}/join`, {
    method: 'POST',
    body: JSON.stringify({ pseudo, emoji, color }),
  });
}

export async function getSessionPlayers(token: string): Promise<Player[]> {
  return apiCall<Player[]>(`/sessions/${token}/players`);
}

export async function kickPlayer(token: string, playerId: string): Promise<void> {
  return apiCall<void>(`/sessions/${token}/players/${playerId}`, {
    method: 'DELETE',
  });
}

export async function deleteSession(token: string): Promise<void> {
  return apiCall<void>(`/sessions/${token}`, {
    method: 'DELETE',
  });
}

export async function startGame(token: string): Promise<Session> {
  return apiCall<Session>(`/sessions/${token}/start`, {
    method: 'POST',
  });
}

export async function updateSessionConfig(token: string, config: SessionConfig): Promise<Session> {
  return apiCall<Session>(`/sessions/${token}/config`, {
    method: 'POST',
    body: JSON.stringify(config),
  });
}
