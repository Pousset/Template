import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { createSession, joinSession } from '@/services/api.service';

const AVAILABLE_EMOJIS = ['😀', '😎', '🤓', '😈', '🤠', '🥳', '🤖', '👻', '👽', '🦄', '🦊', '🐶', '🐱', '🐼', '🦁', '🐯'];
const AVAILABLE_COLORS = [
  { name: 'Violet', value: 'bg-purple-400', bg: 'bg-purple-400' },
  { name: 'Bleu', value: 'bg-blue-400', bg: 'bg-blue-400' },
  { name: 'Vert', value: 'bg-green-400', bg: 'bg-green-400' },
  { name: 'Jaune', value: 'bg-yellow-400', bg: 'bg-yellow-400' },
  { name: 'Orange', value: 'bg-orange-400', bg: 'bg-orange-400' },
  { name: 'Rose', value: 'bg-pink-400', bg: 'bg-pink-400' },
  { name: 'Rouge', value: 'bg-red-400', bg: 'bg-red-400' },
  { name: 'Cyan', value: 'bg-cyan-400', bg: 'bg-cyan-400' },
  { name: 'Indigo', value: 'bg-indigo-400', bg: 'bg-indigo-400' },
  { name: 'Teal', value: 'bg-teal-400', bg: 'bg-teal-400' },
  { name: 'Lime', value: 'bg-lime-400', bg: 'bg-lime-400' },
  { name: 'Fuchsia', value: 'bg-fuchsia-400', bg: 'bg-fuchsia-400' },  { name: 'Emerald', value: 'bg-emerald-400', bg: 'bg-emerald-400' },
  { name: 'Sky', value: 'bg-sky-400', bg: 'bg-sky-400' },
  { name: 'Amber', value: 'bg-amber-400', bg: 'bg-amber-400' },
  { name: 'Slate', value: 'bg-slate-400', bg: 'bg-slate-400' },];

function Home(): ReactElement {
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [masterPseudo, setMasterPseudo] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👑');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for saved preferences and auto-create when button is clicked
  const handleCreateButtonClick = async (): Promise<void> => {
    const savedPreferences = localStorage.getItem('masterPreferences');
    
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.pseudo && prefs.emoji && prefs.color) {
          // Auto-create with saved preferences
          setLoading(true);
          const response = await createSession({
            matchDuration: 30,
            responseTime: 10,
            muteTime: 5,
            defaultPoints: 1,
          }, prefs.pseudo, prefs.emoji, prefs.color);
          
          sessionStorage.setItem('playerId', response.playerId);
          sessionStorage.setItem('playerEmoji', prefs.emoji);
          sessionStorage.setItem('playerColor', prefs.color);
          navigate(`/lobby/${response.session.token}`);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Auto-create failed:', err);
        setLoading(false);
      }
    }
    
    // No saved preferences or auto-create failed, show modal
    setShowCreateModal(true);
    
    // Load preferences for the form if they exist
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        setMasterPseudo(prefs.pseudo || '');
        setSelectedEmoji(prefs.emoji || '👑');
        setSelectedColor(prefs.color || AVAILABLE_COLORS[0].value);
        setRememberMe(true);
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    }
  };

  const handleCreateGame = async (): Promise<void> => {
    if (!masterPseudo.trim()) return;
    
    setLoading(true);
    try {
      console.log('🎨 Creating game with:', { 
        masterPseudo: masterPseudo.trim(), 
        emoji: selectedEmoji, 
        color: selectedColor 
      });
      
      // Save preferences if "remember me" is checked
      if (rememberMe) {
        localStorage.setItem('masterPreferences', JSON.stringify({
          pseudo: masterPseudo.trim(),
          emoji: selectedEmoji,
          color: selectedColor,
        }));
        window.dispatchEvent(new Event('preferencesUpdated'));
      } else {
        localStorage.removeItem('masterPreferences');
        window.dispatchEvent(new Event('preferencesUpdated'));
      }
      
      // Create session with default config, master pseudo, and customization
      const response = await createSession({
        matchDuration: 30,
        responseTime: 10,
        muteTime: 5,
        defaultPoints: 1,
      }, masterPseudo.trim(), selectedEmoji, selectedColor);
      
      console.log('✅ Create response:', JSON.stringify(response, null, 2));
      
      sessionStorage.setItem('playerId', response.playerId);
      sessionStorage.setItem('playerEmoji', selectedEmoji);
      sessionStorage.setItem('playerColor', selectedColor);
      navigate(`/lobby/${response.session.token}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create session:', err);
      alert('Erreur lors de la création de la partie');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = (): void => {
    if (!joinToken.trim()) return;
    
    const savedPreferences = localStorage.getItem('playerPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.pseudo && prefs.emoji && prefs.color) {
          // Auto-join with saved preferences
          setLoading(true);
          joinSession(joinToken.trim(), prefs.pseudo, prefs.emoji, prefs.color)
            .then((response) => {
              sessionStorage.setItem('playerId', response.playerId);
              sessionStorage.setItem('sessionToken', joinToken.trim());
              sessionStorage.setItem('playerEmoji', prefs.emoji);
              sessionStorage.setItem('playerColor', prefs.color);
              navigate(`/lobby/${joinToken.trim()}`);
            })
            .catch((err) => {
              // If auto-join fails, go to join form
              console.error('Auto-join failed:', err);
              setLoading(false);
              navigate(`/join/${joinToken.trim()}`);
            });
          return;
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    }
    
    // No saved preferences, go to join form
    navigate(`/join/${joinToken.trim()}`);
  };

  return (
    <Layout isHeaderFixed={false}>
      {/* Page d'accueil */}
      <div className="flex flex-col items-center justify-center min-h-full pb-12 md:pb-0">
        <div className="text-center space-y-6 max-w-2xl">
          {/* Hero Title */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-6xl md:text-7xl bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
              Be the Buzz Master
            </h2>
            <p className="text-text-secondary text-xl md:text-2xl font-medium">
              Jeu de buzzer en temps réel pour quiz compétitifs
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={handleCreateButtonClick}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-light text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Chargement...' : '🎮 Créer une partie'}
            </button>
            
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-bg-elevated hover:bg-bg-hover text-text-primary font-semibold text-lg rounded-xl border-2 border-primary/30 hover:border-primary/60 transition-all duration-200"
            >
              🔗 Rejoindre une partie
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-bg-elevated p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-200">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-display font-semibold text-xl mb-2">Temps Réel</h3>
              <p className="text-text-muted text-sm">Synchronisation instantanée via WebSocket</p>
            </div>
            
            <div className="bg-bg-elevated p-6 rounded-xl border border-accent/10 hover:border-accent/30 transition-all duration-200">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-display font-semibold text-xl mb-2">Compétitif</h3>
              <p className="text-text-muted text-sm">Système de points et classement en direct</p>
            </div>
            
            <div className="bg-bg-elevated p-6 rounded-xl border border-secondary/10 hover:border-secondary/30 transition-all duration-200">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-display font-semibold text-xl mb-2">Multijoueur</h3>
              <p className="text-text-muted text-sm">Jusqu'à 20 joueurs simultanés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pt-16">
          <div className="bg-bg-elevated rounded-xl p-6 max-w-lg w-full border border-primary/20 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="font-display font-bold text-2xl mb-4 text-center">Créer une partie</h3>
            <p className="text-text-muted text-sm mb-6 text-center">
              Personnalisez votre profil de maître du jeu
            </p>
            
            {/* Avatar Preview Centered */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full ${selectedColor} flex items-center justify-center text-5xl shadow-lg`}>
                {selectedEmoji}
              </div>
            </div>
            
            {/* Pseudo Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Votre pseudo
              </label>
              <input
                type="text"
                value={masterPseudo}
                onChange={(e) => setMasterPseudo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateGame()}
                placeholder="Votre pseudo..."
                maxLength={20}
                className="w-full px-4 py-3 bg-bg-base border-2 border-primary/30 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
              <p className="text-text-muted text-xs mt-1">{masterPseudo.length}/20 caractères</p>
            </div>
            
            {/* Emoji Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Choisir un emoji
              </label>
              <div className="grid grid-cols-8 gap-2">
                {AVAILABLE_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      selectedEmoji === emoji
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-bg-secondary hover:bg-bg-hover'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Choisir une couleur
              </label>
              <div className="grid grid-cols-8 gap-2">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                    className={`w-full aspect-square rounded-lg transition-all duration-200 hover:scale-110 ${
                      selectedColor === color.value
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-elevated scale-110'
                        : 'hover:ring-2 hover:ring-primary/50'
                    } ${color.bg} shadow-md`}
                  >
                  </button>
                ))}
              </div>
            </div>
            
            {/* Remember Me Checkbox */}
            <label className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg mb-4 cursor-pointer hover:bg-bg-hover transition-colors group">
              <div className="relative flex items-center">
                <input
                  id="rememberMeMaster"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-bg-primary rounded-full peer-checked:bg-primary transition-all duration-300 peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-bg-secondary"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-md"></div>
              </div>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors select-none flex-1">
                Se souvenir de moi
              </span>
            </label>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  if (!rememberMe) {
                    setMasterPseudo('');
                    setSelectedEmoji('👑');
                    setSelectedColor(AVAILABLE_COLORS[0].value);
                  }
                }}
                className="flex-1 px-4 py-3 bg-bg-hover hover:bg-bg-base text-text-secondary font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateGame}
                disabled={loading || masterPseudo.trim().length < 2}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-elevated rounded-xl p-8 max-w-md w-full mx-4 border border-primary/20 shadow-xl">
            <h3 className="font-display font-bold text-2xl mb-4 text-center">Rejoindre une partie</h3>
            <p className="text-text-muted text-sm mb-6 text-center">
              Entrez le code de la partie
            </p>
            
            <input
              type="text"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
              placeholder="Code de partie..."
              className="w-full px-4 py-3 bg-bg-base border-2 border-primary/30 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors mb-4"
              autoFocus
              disabled={loading}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinToken('');
                }}
                className="flex-1 px-4 py-3 bg-bg-hover hover:bg-bg-base text-text-secondary font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleJoinGame}
                disabled={!joinToken.trim() || loading}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Connexion...' : 'Rejoindre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Home;
