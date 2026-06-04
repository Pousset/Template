export interface BuzzAction {
  playerId: string;
  buzzTime: number;
}

export class GameService {
  async buzz(sessionToken: string, playerId: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/game/${sessionToken}/buzz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to buzz: ${response.statusText}`);
    }

    return response.json();
  }

  async startGame(sessionToken: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/game/${sessionToken}/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to start game: ${response.statusText}`);
    }

    return response.json();
  }

  async getGameState(sessionToken: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/game/${sessionToken}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get game state: ${response.statusText}`);
    }

    return response.json();
  }
}

export const gameService = new GameService();
