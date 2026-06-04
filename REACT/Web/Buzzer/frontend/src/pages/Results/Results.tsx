import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import type { Player } from '@/types/player.types';
import type { Session } from '@/types/session.types';
import { getSession, getSessionPlayers } from '@/services/api.service';
import { socketService } from '@/services/socket.service';

export function Results(): ReactElement {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  const playerId = sessionStorage.getItem('playerId');

  useEffect(() => {
    const loadResults = async (): Promise<void> => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const [sessionData, playersData] = await Promise.all([
          getSession(token),
          getSessionPlayers(token)
        ]);

        if (!sessionData) {
          throw new Error('Session not found');
        }

        // Check if game is finished
        if (sessionData.status !== 'FINISHED') {
          console.log('⚠️ Game is not finished yet, redirecting...');
          // Redirect based on session status
          if (sessionData.status === 'LOBBY') {
            navigate(`/lobby/${token}`);
          } else if (sessionData.status === 'PLAYING') {
            navigate(`/game/${token}`);
          }
          return;
        }

        setSession(sessionData);
        setPlayers(playersData);
      } catch (err) {
        console.error('Failed to load results:', err);
        
        // Check if it's a 403 Forbidden error (not part of session)
        if (err instanceof Error && err.message.includes('403')) {
          navigate('/error?title=Accès refusé&message=Vous ne pouvez pas accéder aux résultats de cette partie.');
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [token, navigate]);

  // Listen to rematch events
  useEffect(() => {
    if (!token || !playerId) return;

    // Connect socket first
    socketService.connect();
    
    // Wait a bit for socket to connect before joining
    const joinTimeout = setTimeout(() => {
      // Join socket room
      const masterStatus = session?.masterId === playerId;
      socketService.joinSession(token, playerId, masterStatus);
      console.log('📡 Joined socket room on Results page, connected:', socketService.isConnected());
    }, 500);

    const handleRematchVoteUpdated = (data: { votes: number; required: number }): void => {
      console.log('🔄 Rematch votes updated:', data);
    };

    const handleRematchAccepted = (): void => {
      console.log('✅ Rematch accepted! Redirecting to lobby...');
      navigate(`/lobby/${token}`);
    };

    const handleRematchAcceptedForYou = (data: { playerId: string }): void => {
      console.log('✅ Rematch accepted for player:', data.playerId, 'Current player:', playerId);
      // Only redirect if it's for this player
      if (data.playerId === playerId) {
        console.log('🚀 Redirecting to lobby...');
        navigate(`/lobby/${token}`);
      }
    };

    socketService.onRematchVoteUpdated(handleRematchVoteUpdated);
    socketService.onRematchAccepted(handleRematchAccepted);
    socketService.onRematchAcceptedForYou(handleRematchAcceptedForYou);

    return () => {
      clearTimeout(joinTimeout);
      socketService.off('rematchVoteUpdated');
      socketService.off('rematchAccepted');
      socketService.off('rematchAcceptedForYou');
      socketService.leaveSession(token, playerId);
    };
  }, [token, playerId, session?.masterId, navigate]);

  const handleVoteRematch = (vote: boolean): void => {
    if (!token || !playerId) return;
    
    console.log('🗳️ Voting for rematch:', vote, 'Token:', token, 'PlayerId:', playerId);
    console.log('🔌 Socket connected?', socketService.isConnected());
    
    setHasVoted(true);
    socketService.voteRematch(token, playerId, vote);
    
    if (vote) {
      // Redirect to lobby if voting YES
      console.log('🚀 Redirecting to lobby immediately...');
      setTimeout(() => {
        navigate(`/lobby/${token}`);
      }, 500);
    } else {
      // Redirect to home if voting NO
      console.log('👋 Player refused rematch, redirecting to home...');
      setTimeout(() => {
        // Clear player session
        sessionStorage.removeItem('playerId');
        navigate('/');
      }, 500);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <p className="text-text-secondary text-lg">Chargement des résultats...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Sort players by score (excluding master)
  const rankedPlayers = [...players]
    .filter(p => !p.isMaster)
    .sort((a, b) => b.score - a.score);

  const winner = rankedPlayers[0];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <h1 className="font-display font-bold text-5xl md:text-6xl bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
            Partie terminée !
          </h1>
          <p className="text-text-secondary text-lg">
            {session?.currentRound || 0} manches jouées
          </p>
        </div>

        {/* Winner Podium */}
        {winner && (
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary rounded-2xl p-8 text-center space-y-4">
            <div className="text-7xl">{winner.avatar}</div>
            <div>
              <p className="text-text-muted text-sm uppercase tracking-wider mb-2">Vainqueur</p>
              <h2 className="font-display font-bold text-4xl text-primary mb-2">
                {winner.pseudo}
              </h2>
              <p className="text-5xl font-bold text-accent">
                {winner.score} points
              </p>
            </div>
          </div>
        )}

        {/* Full Ranking */}
        <div className="bg-bg-elevated rounded-xl border border-primary/20 p-6">
          <h3 className="font-display font-bold text-2xl text-text-primary mb-6">
            📊 Classement final
          </h3>
          <div className="space-y-3">
            {rankedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-primary/30 to-accent/30 border-2 border-primary/50'
                    : index === 1
                    ? 'bg-bg-secondary border border-text-secondary/20'
                    : index === 2
                    ? 'bg-bg-secondary border border-warning/20'
                    : 'bg-bg-secondary'
                }`}
              >
                {/* Rank */}
                <span className="text-4xl font-bold w-12 text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>

                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {player.avatar}
                </div>

                {/* Player info */}
                <div className="flex-1">
                  <p className="font-semibold text-lg text-text-primary">
                    {player.pseudo}
                  </p>
                </div>

                {/* Score */}
                <span className={`font-bold text-2xl ${
                  index === 0 ? 'text-primary' : 'text-text-secondary'
                }`}>
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rematch Section */}
        <div className="bg-bg-elevated rounded-xl border border-primary/20 p-6">
          <div className="text-center space-y-4">
            <h3 className="font-display font-bold text-2xl text-text-primary">
              🔄 Rejouer ?
            </h3>
            <p className="text-text-muted text-sm">
              Ceux qui votent OUI retournent au lobby pour une nouvelle partie
            </p>
            
            {!hasVoted ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleVoteRematch(true)}
                  className="px-8 py-4 bg-success hover:bg-success/80 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105"
                >
                  ✅ Oui, rejouer
                </button>
                <button
                  onClick={() => handleVoteRematch(false)}
                  className="px-8 py-4 bg-error hover:bg-error/80 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105"
                >
                  ❌ Non merci
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin text-4xl">⏳</div>
                  <p className="text-text-primary text-xl font-semibold">
                    Redirection vers le lobby...
                  </p>
                </div>
                <p className="text-text-muted text-sm">
                  Si rien ne se passe, vérifiez votre connexion
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-primary hover:bg-primary-light text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            🏠 Retour à l'accueil
          </button>
        </div>
      </div>
    </Layout>
  );
}
