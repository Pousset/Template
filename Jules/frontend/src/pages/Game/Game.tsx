import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BuzzerButton } from '@/components/game/BuzzerButton';
import { RoundControl } from '@/components/game/RoundControl';
import { Scoreboard } from '@/components/game/Scoreboard';
import { ResponseTimer } from '@/components/game/ResponseTimer';
import { getSession, getSessionPlayers } from '@/services/api.service';
import { socketService } from '@/services/socket.service';
import { useSocket } from '@/hooks/useSocket';
import type { Session } from '@/types/session.types';
import type { Player } from '@/types/player.types';

export function Game(): ReactElement {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Game state
  const [roundActive, setRoundActive] = useState(false); // Phase: waiting vs playing
  const [isBuzzed, setIsBuzzed] = useState(false);
  const [buzzedBy, setBuzzedBy] = useState<string | null>(null);
  const [buzzedById, setBuzzedById] = useState<string | null>(null); // Store playerId of who buzzed
  const [currentPoints, setCurrentPoints] = useState(1);
  const [timerActive, setTimerActive] = useState(false);
  const [roundNumber, setRoundNumber] = useState(0); // Nombre de manches écoulées
  const [celebration, setCelebration] = useState<{ show: boolean; playerName: string; points: number }>({ show: false, playerName: '', points: 0 });
  const [muteAnimation, setMuteAnimation] = useState<{ show: boolean; remainingTime: number }>({ show: false, remainingTime: 0 });
  const [volume, setVolume] = useState(0.5); // Volume des effets sonores (0 à 1)
  const [previousVolume, setPreviousVolume] = useState(0.5); // Volume avant mute
  const [tictacAudio, setTictacAudio] = useState<HTMLAudioElement | null>(null);
  const [applauseAudio, setApplauseAudio] = useState<HTMLAudioElement | null>(null);
  const [hueeAudio, setHueeAudio] = useState<HTMLAudioElement | null>(null);

  const playerId = sessionStorage.getItem('playerId');
  const currentPlayer = players.find(p => p.id === playerId);
  const isMaster = session?.masterId === playerId;

  console.log('🔍 Game State:', { 
    playerId, 
    masterId: session?.masterId, 
    isMaster, 
    token,
    session: session ? 'loaded' : 'null'
  });

  // Initialize socket
  const { connected, players: socketPlayers, session: socketSession, joinSession } = useSocket(token, session || undefined, players);

  // Join the socket room when component mounts
  useEffect(() => {
    if (token && playerId) {
      const masterStatus = session?.masterId === playerId;
      console.log('🔌 Joining socket room:', { token, playerId, isMaster: masterStatus });
      joinSession(token, playerId, masterStatus);
    }
  }, [token, playerId, session?.masterId, joinSession]);

  // Update local state when socket state changes
  useEffect(() => {
    if (socketPlayers.length > 0) {
      setPlayers(socketPlayers);
    }
  }, [socketPlayers]);

  useEffect(() => {
    if (socketSession) {
      setSession(socketSession);
    }
  }, [socketSession]);

  // Manage tictac sound based on timer state
  useEffect(() => {
    if (timerActive) {
      // Start tictac sound
      const audio = new Audio('/tictac.mp3');
      audio.volume = volume;
      audio.loop = true;
      audio.play().catch(err => console.log('Tictac audio play failed:', err));
      setTictacAudio(audio);
    } else {
      // Stop tictac sound
      if (tictacAudio) {
        tictacAudio.pause();
        tictacAudio.currentTime = 0;
        setTictacAudio(null);
      }
    }

    // Cleanup on unmount
    return () => {
      if (tictacAudio) {
        tictacAudio.pause();
        tictacAudio.currentTime = 0;
      }
    };
  }, [timerActive]);

  // Update all active audio volumes when global volume changes
  useEffect(() => {
    if (tictacAudio) {
      tictacAudio.volume = volume;
    }
    if (applauseAudio) {
      applauseAudio.volume = volume;
    }
    if (hueeAudio) {
      hueeAudio.volume = volume;
    }
  }, [volume, tictacAudio, applauseAudio, hueeAudio]);

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

        // Check if game is actually started
        if (sessionData.status !== 'PLAYING') {
          navigate(`/lobby/${token}`);
          return;
        }

        const playersData = await getSessionPlayers(token);

        setSession(sessionData);
        setPlayers(playersData);
        
        // Initialize roundActive from session state
        if (sessionData.isRoundActive) {
          console.log('🔄 Restoring active round state');
          setRoundActive(true);
          setCurrentPoints(sessionData.currentRoundPoints);
        }
      } catch (err) {
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
  }, [token, navigate]);

  // Listen to game events
  useEffect(() => {
    console.log('🎧 Setting up game event listeners');
    
    const handleRoundStarted = (data: { points: number; currentRound: number }): void => {
      console.log('🚀 Round started:', data);
      setRoundActive(true);
      setCurrentPoints(data.points);
      setIsBuzzed(false);
      setBuzzedBy(null);
      setBuzzedById(null);
      setTimerActive(false);
      setRoundNumber(data.currentRound); // Utiliser le numéro de manche du serveur
    };

    const handleBuzzed = (data: { playerId: string; pseudo: string }): void => {
      console.log('🔔 Player buzzed:', data);
      
      // Play buzzer sound for everyone
      if (volume > 0) {
        const audio = new Audio('/buzzer.mp3');
        audio.volume = volume;
        audio.play().catch(err => console.log('Buzzer audio play failed:', err));
      }
      
      setIsBuzzed(true);
      setBuzzedBy(data.pseudo);
      setBuzzedById(data.playerId);
      setTimerActive(true);
    };

    const handleAnswerValidated = (data: { playerId: string; pseudo: string; points: number; isGameFinished?: boolean }): void => {
      console.log('✓ Answer validated:', data);
      
      // Stop any previous applause audio
      if (applauseAudio) {
        applauseAudio.pause();
        applauseAudio.currentTime = 0;
      }
      
      // Play applause sound with current volume
      const audio = new Audio('/applause.mp3');
      audio.volume = volume;
      audio.play().catch(err => console.log('Audio play failed:', err));
      setApplauseAudio(audio);
      
      // Stop audio after 3.2 seconds to match animation
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setApplauseAudio(null);
      }, 3200);
      
      // Show celebration with player name from backend
      setCelebration({ show: true, playerName: data.pseudo, points: data.points });
      setTimeout(() => {
        setCelebration({ show: false, playerName: '', points: 0 });
        
        // Redirect to results if game is finished
        if (data.isGameFinished && token) {
          console.log('🏁 Game finished, redirecting to results...');
          navigate(`/results/${token}`);
        }
      }, 3200);
      
      // Update player score locally
      setPlayers(prev => prev.map(p => 
        p.id === data.playerId ? { ...p, score: p.score + data.points } : p
      ));
      // Reset round
      setRoundActive(false);
      setIsBuzzed(false);
      setBuzzedBy(null);
      setBuzzedById(null);
      setTimerActive(false);
    };

    const handleAnswerInvalidated = (data: { playerId: string; mutedUntil?: string }): void => {
      console.log('✗ Answer invalidated:', data);
      
      // Check if this is the current player
      if (data.playerId === playerId && data.mutedUntil) {
        // Stop any previous error audio
        if (hueeAudio) {
          hueeAudio.pause();
          hueeAudio.currentTime = 0;
        }
        
        // Play error sound
        const audio = new Audio('/huee.mp3');
        audio.volume = volume;
        audio.play().catch(err => console.error('Failed to play error sound:', err));
        setHueeAudio(audio);
        
        // Calculate remaining time in seconds
        const mutedUntilTime = new Date(data.mutedUntil).getTime();
        const now = Date.now();
        const remainingMs = mutedUntilTime - now;
        const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
        
        console.log('🔇 You are muted for', remainingSeconds, 'seconds');
        
        // Show mute animation
        setMuteAnimation({ show: true, remainingTime: remainingSeconds });
        
        // Update countdown every second
        const interval = setInterval(() => {
          const newRemainingMs = mutedUntilTime - Date.now();
          const newRemainingSeconds = Math.max(0, Math.ceil(newRemainingMs / 1000));
          
          if (newRemainingSeconds > 0) {
            setMuteAnimation({ show: true, remainingTime: newRemainingSeconds });
          } else {
            clearInterval(interval);
          }
        }, 100); // Update every 100ms for smooth countdown
        
        // Hide animation and stop sound after mute duration
        setTimeout(() => {
          clearInterval(interval);
          setMuteAnimation({ show: false, remainingTime: 0 });
          audio.pause();
          audio.currentTime = 0;
          setHueeAudio(null);
        }, remainingMs);
      }
      
      setIsBuzzed(false);
      setBuzzedBy(null);
      setTimerActive(false);
    };

    const handleBuzzerReset = (): void => {
      console.log('🔄 Buzzer reset');
      setIsBuzzed(false);
      setBuzzedBy(null);
      setTimerActive(false);
    };

    socketService.onRoundStarted(handleRoundStarted);
    socketService.onBuzzed(handleBuzzed);
    socketService.onAnswerValidated(handleAnswerValidated);
    socketService.onAnswerInvalidated(handleAnswerInvalidated);
    socketService.onBuzzerReset(handleBuzzerReset);
    
    console.log('✅ Game event listeners registered');

    return () => {
      console.log('🧹 Cleaning up game event listeners');
      socketService.off('roundStarted');
      socketService.off('buzzed');
      socketService.off('answerValidated');
      socketService.off('answerInvalidated');
      socketService.off('buzzerReset');
    };
  }, [volume]); // Add volume as dependency to get updated value in callbacks

  // Game handlers
  const handleBuzz = (): void => {
    if (!currentPlayer || isBuzzed || !token) return;
    
    socketService.buzz(token, currentPlayer.id);
  };

  const handleValidate = (): void => {
    if (!isMaster || !token) return;
    
    const buzzedPlayer = players.find(p => p.pseudo === buzzedBy);
    if (!buzzedPlayer) return;
    
    socketService.validateAnswer(token, buzzedPlayer.id, currentPoints);
  };

  const handleInvalidate = (): void => {
    if (!isMaster || !token) return;
    
    const buzzedPlayer = players.find(p => p.pseudo === buzzedBy);
    if (!buzzedPlayer) return;
    
    socketService.invalidateAnswer(token, buzzedPlayer.id);
  };

  const handleReset = (): void => {
    if (!isMaster || !token) return;
    
    socketService.resetBuzzer(token);
  };

  const handleSetPoints = (points: number): void => {
    setCurrentPoints(points);
  };

  const handleStartRound = (): void => {
    console.log('🚀 handleStartRound called', { isMaster, token, currentPoints, connected });
    
    if (!isMaster || !token) {
      console.warn('❌ Cannot start round:', { isMaster, token });
      return;
    }
    
    if (!connected) {
      console.warn('❌ Socket not connected');
      return;
    }
    
    console.log('📤 Emitting startRound event');
    socketService.startRound(token, currentPoints);
  };

  const handleTimeout = (): void => {
    console.log('⏰ Response timer timeout');
    
    // If someone buzzed and master didn't validate/invalidate, we consider it as wrong answer
    if (buzzedById && token) {
      socketService.emit('invalidateAnswer', {
        token,
        playerId: buzzedById,
      });
    }
    
    // Reset buzzer state
    setIsBuzzed(false);
    setBuzzedBy(null);
    setBuzzedById(null);
    setTimerActive(false);
  };

  // Toggle mute
  const toggleMute = (): void => {
    if (volume === 0) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  // Get color for points badge
  const getPointsColor = (points: number): string => {
    if (points >= 10) return 'bg-error/20 text-error border border-error/30';
    if (points >= 5) return 'bg-warning/20 text-warning border border-warning/30';
    if (points >= 3) return 'bg-success/20 text-success border border-success/30';
    return 'bg-info/20 text-info border border-info/30';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <p className="text-text-secondary text-lg">Chargement de la partie...</p>
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

  return (
    <Layout>
      {/* Celebration Overlay */}
      {celebration.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="text-9xl animate-bounce">🎉</div>
            <div className="space-y-2">
              <h2 className="font-display font-bold text-5xl text-success animate-pulse">
                Bonne réponse !
              </h2>
              <p className="text-3xl text-text-primary font-bold">
                {celebration.playerName}
              </p>
              <p className="text-6xl font-bold text-accent">
                +{celebration.points} point{celebration.points > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex justify-center gap-4 text-6xl">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>👏</span>
              <span className="animate-bounce" style={{ animationDelay: '100ms' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Mute Animation Overlay */}
      {muteAnimation.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="text-9xl animate-bounce">❌</div>
            <div className="space-y-2">
              <h2 className="font-display font-bold text-5xl text-error animate-pulse">
                Mauvaise réponse !
              </h2>
              <p className="text-3xl text-text-primary font-bold">
                Vous êtes muté
              </p>
              <p className="text-6xl font-bold text-error">
                {muteAnimation.remainingTime}s
              </p>
            </div>
            <div className="flex justify-center gap-4 text-6xl">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🔇</span>
              <span className="animate-bounce" style={{ animationDelay: '100ms' }}>⏱️</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🚫</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent mb-2">
                  🎮 Partie en cours
                </h1>
                <div className="flex items-center gap-4 text-text-muted">
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${connected ? 'bg-success' : 'bg-error'} animate-pulse`} />
                    <span className="text-sm">{connected ? 'Connecté' : 'Déconnecté'}</span>
                  </span>
                  <span className="text-sm">
                    Code: <span className="font-mono text-accent font-semibold">{token}</span>
                  </span>
                </div>
              </div>
              
              {/* Volume Control */}
              <div className="relative group">
                <button
                  onClick={toggleMute}
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-bg-secondary hover:bg-primary/20 transition-all text-xl border border-transparent hover:border-primary/30"
                  title={volume === 0 ? "Activer le son" : "Couper le son"}
                >
                  {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>
                
                {/* Volume slider on hover */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-bg-secondary/95 backdrop-blur-sm rounded-lg border border-primary/30 p-3 shadow-xl">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setVolume(newVolume);
                        if (newVolume > 0) setPreviousVolume(newVolume);
                      }}
                      className="w-24 h-1 bg-bg-primary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(168,85,247,0.6)] [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, oklch(60.6% 0.25 292.717) ${volume * 100}%, oklch(27.9% 0.041 260.031) ${volume * 100}%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-semibold">
                {isMaster ? '👑 Maître du jeu' : '🎮 Joueur'}
              </div>
              
              {/* Round counter */}
              {roundNumber > 0 && session && (
                <div className="px-4 py-2 bg-accent/20 text-accent rounded-lg font-semibold flex items-center gap-2">
                  <span>📊</span>
                  <span>Manche {roundNumber} / {session.config.matchDuration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Area - First on mobile, right on desktop */}
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
              {/* Waiting Phase - Master prepares the round */}
              {!roundActive && isMaster && (
                <div className="bg-bg-elevated rounded-xl border border-master-badge/20 p-8">
                  <div className="text-center space-y-6">
                    <h2 className="font-display font-bold text-3xl text-master-badge">
                      👑 Préparez la manche
                    </h2>
                    
                    <div className="max-w-md mx-auto space-y-6">
                      {/* Points selector */}
                      <div className="space-y-3">
                        <label className="block text-text-secondary text-sm font-semibold">
                          Points de la manche
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 5, 10].map((p) => (
                            <button
                              key={p}
                              onClick={() => handleSetPoints(p)}
                              className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                                currentPoints === p
                                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                  : 'bg-bg-secondary text-text-muted hover:bg-bg-hover'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Start round button */}
                      <button
                        onClick={handleStartRound}
                        className="w-full px-8 py-6 bg-success hover:bg-success/90 text-white font-bold text-xl rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                      >
                        🚀 Démarrer la manche ({currentPoints} point{currentPoints > 1 ? 's' : ''})
                      </button>

                      <div className="p-4 bg-info/10 border border-info/30 rounded-lg text-info text-sm">
                        <p className="font-semibold mb-2">💡 Instructions:</p>
                        <ul className="space-y-1 text-xs text-left">
                          <li>• Choisissez les points de cette manche</li>
                          <li>• Cliquez sur "Démarrer" pour débloquer les buzzers</li>
                          <li>• Lisez votre question via Discord</li>
                          <li>• Attendez qu'un joueur buzze pour répondre</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Waiting Phase - Players wait */}
              {!roundActive && !isMaster && (
                <div className="bg-bg-elevated rounded-xl border border-primary/20 p-8">
                  <div className="text-center space-y-6 py-12">
                    <div className="text-8xl mb-6 animate-pulse">⏳</div>
                    <h2 className="font-display font-bold text-3xl text-text-primary">
                      En attente...
                    </h2>
                    <p className="text-text-secondary text-lg max-w-md mx-auto">
                      Le maître du jeu prépare la prochaine question.
                      <br />
                      Soyez prêt à buzzer !
                    </p>
                  </div>
                </div>
              )}

              {/* Playing Phase - Buzzer Area */}
              {roundActive && !isMaster && (
                <div 
                  className="bg-bg-elevated rounded-xl border border-primary/20 p-8 cursor-pointer hover:border-primary/40 transition-all duration-200"
                  onClick={() => {
                    if (!currentPlayer?.isMuted && !isBuzzed) {
                      handleBuzz();
                    }
                  }}
                >
                  <div className="text-center space-y-6 pointer-events-none">
                    {/* Points indicator */}
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg ${getPointsColor(currentPoints)}`}>
                      <span>💎</span>
                      <span>{currentPoints} point{currentPoints > 1 ? 's' : ''} en jeu</span>
                    </div>

                    <h2 className="font-display font-bold text-3xl text-text-primary">
                      Zone de Buzzer
                    </h2>

                    {/* Response Timer */}
                    {timerActive && (
                      <div className="max-w-md mx-auto">
                        <ResponseTimer
                          isActive={timerActive}
                          duration={session?.config.responseTime || 30}
                          onTimeout={handleTimeout}
                        />
                      </div>
                    )}
                    
                    {/* Buzzer Button */}
                    <div className="py-8 pointer-events-auto">
                      <BuzzerButton
                        disabled={currentPlayer?.isMuted || false}
                        isBuzzed={isBuzzed}
                        buzzedBy={buzzedBy}
                        currentPlayerPseudo={currentPlayer?.pseudo || ''}
                        onBuzz={handleBuzz}
                      />
                    </div>

                    {/* Status message */}
                    {!isBuzzed && (
                      <p className="text-text-muted text-lg">
                        {currentPlayer?.isMuted
                          ? '🔇 Vous êtes muté temporairement...'
                          : 'Appuyez sur le buzzer pour répondre à la question !'}
                      </p>
                    )}

                    {isBuzzed && (
                      <div className="max-w-md mx-auto p-4 bg-accent/10 border border-accent/30 rounded-lg">
                        <p className="text-accent font-semibold text-lg">
                          {buzzedBy === currentPlayer?.pseudo
                            ? '🎤 C\'est votre tour ! Répondez à la question'
                            : `⏳ ${buzzedBy} répond...`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Playing Phase - Master controls (no buzzer for master) */}
              {roundActive && isMaster && (
                <div className="bg-bg-elevated rounded-xl border border-primary/20 p-8">
                  <div className="text-center space-y-6 py-8">
                    <h2 className="font-display font-bold text-3xl text-text-primary">
                      Manche en cours
                    </h2>
                    
                    <div className="max-w-md mx-auto p-6 bg-master-badge/10 border border-master-badge/30 rounded-lg">
                      <p className="text-master-badge font-semibold text-xl mb-2">
                        {currentPoints} point{currentPoints > 1 ? 's' : ''} en jeu
                      </p>
                      <p className="text-text-secondary text-sm">
                        {isBuzzed 
                          ? `${buzzedBy} répond...` 
                          : 'En attente d\'un buzz...'}
                      </p>
                    </div>

                    {/* Response Timer */}
                    {timerActive && (
                      <div className="max-w-md mx-auto">
                        <ResponseTimer
                          isActive={timerActive}
                          duration={session?.config.responseTime || 30}
                          onTimeout={handleTimeout}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Master Controls (only during playing phase) */}
              {roundActive && isMaster && (
                <RoundControl
                  onValidate={handleValidate}
                  onInvalidate={handleInvalidate}
                  onReset={handleReset}
                  onSetPoints={handleSetPoints}
                  currentPoints={currentPoints}
                  isBuzzed={isBuzzed}
                  roundActive={roundActive}
                />
              )}
            </div>
            
            {/* Scoreboard - Second on mobile, left on desktop */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Scoreboard players={players} />
            </div>
          </div>
    </Layout>
  );
}
