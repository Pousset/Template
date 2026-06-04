import type { FormEvent, ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { joinSession } from '@/services/api.service';

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
  { name: 'Fuchsia', value: 'bg-fuchsia-400', bg: 'bg-fuchsia-400' },
  { name: 'Emerald', value: 'bg-emerald-400', bg: 'bg-emerald-400' },
  { name: 'Sky', value: 'bg-sky-400', bg: 'bg-sky-400' },
  { name: 'Amber', value: 'bg-amber-400', bg: 'bg-amber-400' },
  { name: 'Slate', value: 'bg-slate-400', bg: 'bg-slate-400' },
];

export function Join(): ReactElement {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(AVAILABLE_EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved preferences from localStorage (but don't auto-join, show form)
  useEffect(() => {
    const savedPreferences = localStorage.getItem('playerPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        setPseudo(prefs.pseudo || '');
        setSelectedEmoji(prefs.emoji || AVAILABLE_EMOJIS[0]);
        setSelectedColor(prefs.color || AVAILABLE_COLORS[0].value);
        setRememberMe(true);
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    // Validation
    if (!pseudo.trim()) {
      setError('Le pseudo est requis');
      return;
    }

    if (pseudo.length < 2 || pseudo.length > 20) {
      setError('Le pseudo doit contenir entre 2 et 20 caractères');
      return;
    }

    if (!token) {
      setError('Token de session invalide');
      return;
    }

    try {
      setLoading(true);
      
      console.log('🎨 Joining with:', { pseudo: pseudo.trim(), emoji: selectedEmoji, color: selectedColor });
      
      // Save preferences if "remember me" is checked
      if (rememberMe) {
        localStorage.setItem('playerPreferences', JSON.stringify({
          pseudo: pseudo.trim(),
          emoji: selectedEmoji,
          color: selectedColor,
        }));
        window.dispatchEvent(new Event('preferencesUpdated'));
      } else {
        localStorage.removeItem('playerPreferences');
        window.dispatchEvent(new Event('preferencesUpdated'));
      }
      
      const response = await joinSession(token, pseudo.trim(), selectedEmoji, selectedColor);

      console.log('✅ Join response:', response);

      // Save playerId and player preferences in sessionStorage for later use
      sessionStorage.setItem('playerId', response.playerId);
      sessionStorage.setItem('sessionToken', token);
      sessionStorage.setItem('playerEmoji', selectedEmoji);
      sessionStorage.setItem('playerColor', selectedColor);

      // Navigate to lobby
      navigate(`/lobby/${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-full py-8">
        <div className="w-full max-w-lg">
          <div className="bg-bg-elevated rounded-xl p-8 border border-primary/20">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-4xl text-primary mb-2">
                Rejoindre la partie
              </h1>
              <p className="text-text-secondary">
                Code : <span className="font-mono text-accent font-semibold">{token}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Preview Centered */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-full ${selectedColor} flex items-center justify-center text-5xl shadow-lg`}>
                  {selectedEmoji}
                </div>
              </div>

              {/* Pseudo Input */}
              <div>
                <label
                  htmlFor="pseudo"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  Votre pseudo
                </label>
                <input
                  id="pseudo"
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="Entrez votre pseudo"
                  className="w-full px-4 py-3 bg-bg-primary border-2 border-bg-hover focus:border-primary rounded-lg text-text-primary placeholder-text-muted transition-colors duration-200 focus:outline-none"
                  maxLength={20}
                  autoFocus
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-text-muted">
                  {pseudo.length}/20 caractères
                </p>
              </div>

              {/* Emoji Selection */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Choisir un emoji
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {AVAILABLE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-3xl p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
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
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
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
              <label className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg cursor-pointer hover:bg-bg-hover transition-colors group">
                <div className="relative flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-bg-primary rounded-full peer-checked:bg-primary transition-all duration-300 peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-bg-secondary"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-md"></div>
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors select-none flex-1">
                  Se souvenir de moi (enregistrer mes préférences)
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-3 text-error text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !pseudo.trim()}
                className="w-full px-6 py-4 bg-primary hover:bg-primary-light disabled:bg-buzz-locked text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : '🎮 Rejoindre la partie'}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
