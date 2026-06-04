import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Modal } from '@/components/ui/Modal';
import { LobbyConfig } from './LobbyConfig';
import { LobbyPlayers } from './LobbyPlayers';
import { LobbyShare } from './LobbyShare';
import { useSocket } from '@/hooks/useSocket';
import { deleteSession, getSession, getSessionPlayers, kickPlayer as kickPlayerApi, startGame as startGameApi, updateSessionConfig } from '@/services/api.service';
import type { Session, SessionConfig } from '@/types/session.types';
import type { Player } from '@/types/player.types';

export function Lobby(): ReactElement {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerToKick, setPlayerToKick] = useState<Player | null>(null);
  const [showKickModal, setShowKickModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const playerId = sessionStorage.getItem('playerId');
  const isMaster = session?.masterId === playerId;

  // Initialize socket
  const { connected, players: socketPlayers, joinSession: socketJoin, leaveSession: socketLeave, kickPlayer: socketKick, startGame: socketStart } = useSocket(token, session || undefined, players);

  // Update local players state when socket players change
  useEffect(() => {
    if (socketPlayers.length > 0) {
      setPlayers(socketPlayers);
    }
  }, [socketPlayers]);

  // Listen for game started event to redirect all players
  useEffect(() => {
    const handleGameStarted = (): void => {
      console.log('🎮 Game started, redirecting to game page...');
      if (token) {
        navigate(`/game/${token}`);
      }
    };

    const handleRematchVoteUpdated = async (): Promise<void> => {
      console.log('🔄 Rematch votes updated event received, reloading session...');
      if (!token) return;
      
      try {
        const sessionData = await getSession(token);
        if (sessionData) {
          console.log('✅ Session reloaded:', {
            status: sessionData.status,
            rematchVotes: sessionData.rematchVotes,
            length: sessionData.rematchVotes?.length || 0,
            votes: sessionData.rematchVotes
          });
          setSession(sessionData);
          
          // Force reload players too
          const playersData = await getSessionPlayers(token);
          console.log('✅ Players reloaded:', playersData.map(p => ({ id: p.id, pseudo: p.pseudo })));
          setPlayers(playersData);
        } else {
          console.error('❌ Session data is null');
        }
      } catch (err) {
        console.error('❌ Failed to reload session:', err);
      }
    };

    const handlePlayerKicked = (data: { playerId: string }): void => {
      console.log('👢 Player kicked event received:', data);
      // Check if the kicked player is the current player
      if (data.playerId === playerId) {
        console.log('⛔ You were kicked from the session');
        // Clear player session
        sessionStorage.removeItem('playerId');
        // Redirect to error page with message
        navigate('/error?title=Expulsé&message=Vous avez été exclu de la partie par l\'hôte.');
      }
    };

    const handleSessionDeleted = (): void => {
      console.log('🗑️ Session deleted event received');
      // Only redirect non-master players (master is already redirected)
      if (!isMaster) {
        console.log('⛔ Session was deleted by host');
        // Clear player session
        sessionStorage.removeItem('playerId');
        // Redirect to error page with message
        navigate('/error?title=Partie annulée&message=L\'hôte a mis fin à la partie.');
      }
    };

    // Import socketService to listen to gameStarted
    import('@/services/socket.service').then(({ socketService }) => {
      console.log('🔌 Setting up socket listeners in Lobby');
      socketService.onGameStarted(handleGameStarted);
      socketService.onRematchVoteUpdated(handleRematchVoteUpdated);
      socketService.onPlayerKicked(handlePlayerKicked);
      socketService.onSessionDeleted(handleSessionDeleted);
    });

    return () => {
      // Cleanup listener
      import('@/services/socket.service').then(({ socketService }) => {
        console.log('🔌 Cleaning up socket listeners in Lobby');
        socketService.off('gameStarted');
        socketService.off('rematchVoteUpdated');
        socketService.off('playerKicked');
        socketService.off('sessionDeleted');
      });
    };
  }, [token, navigate, playerId]);

  // Load session data
  useEffect(() => {
    const loadSession = async (): Promise<void> => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const sessionData = await getSession(token);
        if (!sessionData) {
          throw new Error('Session not found');
        }

        const playersData = await getSessionPlayers(token);

        setSession(sessionData);
        setPlayers(playersData);
        
        console.log('📊 Session loaded:', {
          token,
          status: sessionData.status,
          rematchVotes: sessionData.rematchVotes,
          players: playersData.map(p => ({ id: p.id, pseudo: p.pseudo }))
        });

        // Join socket room
        if (playerId) {
          socketJoin(token, playerId, sessionData.masterId === playerId);
        }
        
        // Force reload after 1 second to catch any pending rematch votes
        setTimeout(async () => {
          console.log('🔄 Force reloading session to catch rematch votes...');
          try {
            const updatedSession = await getSession(token);
            if (updatedSession) {
              console.log('📊 Updated session:', {
                rematchVotes: updatedSession.rematchVotes,
                length: updatedSession.rematchVotes?.length || 0
              });
              setSession(updatedSession);
            }
          } catch (err) {
            console.error('Failed to reload session:', err);
          }
        }, 1000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load session:', err);
        
        // Check if it's a 403 Forbidden error (not part of session)
        if (err instanceof Error && err.message.includes('403')) {
          navigate('/error?title=Accès refusé&message=Vous ne pouvez pas rejoindre cette partie en cours.');
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    return () => {
      if (token && playerId) {
        socketLeave(token, playerId);
      }
    };
  }, [token, playerId, navigate, socketJoin, socketLeave]);

  const handleConfigChange = async (config: SessionConfig): Promise<void> => {
    if (!session || !token) return;

    try {
      const updatedSession = await updateSessionConfig(token, config);
      setSession(updatedSession);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update config:', err);
    }
  };

  const handleKickPlayer = (playerIdToKick: string): void => {
    const player = players.find(p => p.id === playerIdToKick);
    if (player) {
      setPlayerToKick(player);
      setShowKickModal(true);
    }
  };

  const confirmKickPlayer = async (): Promise<void> => {
    if (!session || !token || !playerToKick) return;

    try {
      await kickPlayerApi(token, playerToKick.id);
      socketKick(token, playerToKick.id);
      setPlayers(prev => prev.filter(p => p.id !== playerToKick.id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to kick player:', err);
    } finally {
      setPlayerToKick(null);
    }
  };

  const handleStartGame = async (): Promise<void> => {
    if (!session || !token) return;

    try {
      await startGameApi(token);
      socketStart(token);
      // Navigate to game page
      navigate(`/game/${token}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to start game:', err);
    }
  };

  const handleDeleteSession = (): void => {
    setShowDeleteModal(true);
  };

  const confirmDeleteSession = async (): Promise<void> => {
    if (!token) return;

    try {
      await deleteSession(token);
      navigate('/');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete session:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <p className="text-text-secondary text-lg">Chargement du lobby...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-text-secondary text-lg">Session non trouvée</p>
          </div>
        </div>
      </Layout>
    );
  }

  const connectedPlayers = players.filter(p => p.isConnected);
  const canStart = connectedPlayers.length >= 3;
  console.log('Rendering Lobby:', { session, players, connectedPlayers: connectedPlayers.length, isMaster, canStart });
  console.log('Environment Variables:', import.meta.env);

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent mb-2">
                Lobby
              </h1>
              <div className="flex items-center gap-2 text-text-muted">
                <span className={`w-3 h-3 rounded-full ${connected ? 'bg-success' : 'bg-error'} animate-pulse`} />
                <span className="text-sm">{connected ? 'Connecté' : 'Déconnecté'}</span>
              </div>
            </div>

            {/* Actions (Master only) */}
            {isMaster && (
              <div className="flex gap-3">
                <button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className="px-8 py-4 bg-success hover:bg-success/90 disabled:bg-buzz-locked text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {canStart ? '🚀 Lancer' : '⏳ Attente...'}
                </button>

                <button
                  onClick={handleDeleteSession}
                  className="px-8 py-4 bg-error/20 hover:bg-error/30 text-error font-semibold text-lg rounded-xl transition-all duration-200"
                >
                  Annuler la partie
                </button>
              </div>
            )}
          </div>

          {/* Main Content - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Share Links */}
              {token && <LobbyShare token={token} />}

              {/* Config (Master only) */}
              {isMaster && (
                <LobbyConfig
                  initialConfig={session.config}
                  onSubmit={handleConfigChange}
                />
              )}

              {/* Info for non-master */}
              {!isMaster && (
                <div className="bg-bg-elevated rounded-xl p-6 border border-info/20">
                  <div className="text-center">
                    <p className="text-text-secondary text-lg mb-2">
                      En attente du maître de jeu...
                    </p>
                    <p className="text-text-muted text-sm">
                      La partie démarrera dès que le maître lancera le jeu
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Players */}
            <div>
              {/* Players List */}
              <LobbyPlayers
                players={players}
                canKick={isMaster}
                onKick={handleKickPlayer}
                rematchVotes={session?.rematchVotes || []}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kick Confirmation Modal */}
      <Modal
        isOpen={showKickModal}
        onClose={() => setShowKickModal(false)}
        title="Expulser un joueur"
        onConfirm={confirmKickPlayer}
        confirmText="Expulser"
        cancelText="Annuler"
        confirmVariant="danger"
      >
        <p className="text-base">
          Êtes-vous sûr de vouloir expulser{' '}
          <span className="font-bold text-text-primary">{playerToKick?.pseudo}</span> de la partie ?
        </p>
        <p className="text-sm mt-2 text-text-muted">
          Ce joueur devra rejoindre à nouveau pour participer.
        </p>
      </Modal>

      {/* Delete Session Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Annuler la partie"
        onConfirm={confirmDeleteSession}
        confirmText="Confirmer"
        cancelText="Retour"
        confirmVariant="danger"
      >
        <p className="text-base">
          Êtes-vous sûr de vouloir annuler cette partie ?
        </p>
        <p className="text-sm mt-2 text-text-muted">
          Tous les joueurs seront déconnectés et redirigés.
        </p>
      </Modal>
    </Layout>
  );
}
