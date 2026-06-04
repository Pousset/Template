import { useEffect, useState } from 'react';

export interface DiagnosticsResults {
  backendHealth: boolean;
  websocketConnected: boolean;
  apiReachable: boolean;
  responseTime: number;
  errors: string[];
}

export function useDiagnostics(): DiagnosticsResults {
  const [results, setResults] = useState<DiagnosticsResults>({
    backendHealth: false,
    websocketConnected: false,
    apiReachable: false,
    responseTime: 0,
    errors: [],
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const errors: string[] = [];
      const apiUrl = 'http://localhost:3000';

      // Check API reachability
      const startTime = performance.now();
      try {
        const response = await fetch(`${apiUrl}/health`, { mode: 'cors' });
        const responseTime = performance.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          setResults((prev) => ({
            ...prev,
            backendHealth: data.status === 'ok',
            apiReachable: true,
            responseTime: Math.round(responseTime),
          }));
        } else {
          errors.push(`API responded with status ${response.status}`);
        }
      } catch (err) {
        errors.push(`Backend unreachable: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Check WebSocket connectivity
      try {
        const { io } = window as any;
        if (!io) {
          errors.push('Socket.io library not loaded');
        } else {
          const socket = io(apiUrl, {
            transports: ['websocket'],
            upgrade: false,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 3,
          });

          const connectionTimeout = setTimeout(() => {
            socket.disconnect();
            errors.push('WebSocket connection timeout');
          }, 5000);

          socket.on('connect', () => {
            clearTimeout(connectionTimeout);
            setResults((prev) => ({
              ...prev,
              websocketConnected: true,
            }));
            socket.disconnect();
          });

          socket.on('connect_error', (err: Error) => {
            errors.push(`WebSocket error: ${err.message}`);
          });
        }
      } catch (err) {
        errors.push(`WebSocket check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      if (errors.length > 0) {
        setResults((prev) => ({
          ...prev,
          errors,
        }));
      }
    };

    runDiagnostics();
  }, []);

  return results;
}
