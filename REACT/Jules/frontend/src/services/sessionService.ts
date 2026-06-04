export interface SessionConfig {
  matchDuration: number;
  responseTime: number;
  muteTime: number;
  defaultPoints: number;
}

export interface CreateSessionRequest {
  masterPseudo: string;
  config: SessionConfig;
}

export interface JoinSessionRequest {
  pseudo: string;
}

export class SessionService {
  async createSession(data: CreateSessionRequest): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    return response.json();
  }

  async getSession(token: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.statusText}`);
    }

    return response.json();
  }

  async joinSession(token: string, data: JoinSessionRequest): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${token}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to join session: ${response.statusText}`);
    }

    return response.json();
  }

  async leaveSession(token: string, playerId: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${token}/leave/${playerId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to leave session: ${response.statusText}`);
    }
  }
}

export const sessionService = new SessionService();
