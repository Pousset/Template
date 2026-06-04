import type { ReactElement, FormEvent } from 'react';
import { useState, useEffect } from 'react';

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

interface HeaderProps {
  isFixed?: boolean;
}

export function Header({ isFixed = true }: HeaderProps): ReactElement {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState<{
    pseudo: string;
    emoji: string;
    color: string;
  } | null>(null);
  const [formPseudo, setFormPseudo] = useState('');
  const [formEmoji, setFormEmoji] = useState(AVAILABLE_EMOJIS[0]);
  const [formColor, setFormColor] = useState(AVAILABLE_COLORS[0].value);
  const [formError, setFormError] = useState('');

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = () => {
      const masterPrefs = localStorage.getItem('masterPreferences');
      const playerPrefs = localStorage.getItem('playerPreferences');
      
      if (masterPrefs) {
        try {
          const prefs = JSON.parse(masterPrefs);
          setPreferences(prefs);
          setFormPseudo(prefs.pseudo);
          setFormEmoji(prefs.emoji);
          setFormColor(prefs.color);
        } catch (err) {
          console.error('Failed to parse master preferences:', err);
        }
      } else if (playerPrefs) {
        try {
          const prefs = JSON.parse(playerPrefs);
          setPreferences(prefs);
          setFormPseudo(prefs.pseudo);
          setFormEmoji(prefs.emoji);
          setFormColor(prefs.color);
        } catch (err) {
          console.error('Failed to parse player preferences:', err);
        }
      }
    };

    loadPreferences();
    
    // Listen for storage changes
    window.addEventListener('storage', loadPreferences);
    
    // Custom event for same-window updates
    const handlePreferencesChange = () => loadPreferences();
    window.addEventListener('preferencesUpdated', handlePreferencesChange);
    
    return () => {
      window.removeEventListener('storage', loadPreferences);
      window.removeEventListener('preferencesUpdated', handlePreferencesChange);
    };
  }, []);

  const handleOpenModal = () => {
    setShowPreferencesModal(true);
    setIsEditing(!preferences); // Auto-edit if no preferences exist
    setFormError('');
  };

  const handleSavePreferences = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formPseudo.trim()) {
      setFormError('Le pseudo est requis');
      return;
    }

    if (formPseudo.length < 2 || formPseudo.length > 20) {
      setFormError('Le pseudo doit contenir entre 2 et 20 caractères');
      return;
    }

    const newPrefs = {
      pseudo: formPseudo.trim(),
      emoji: formEmoji,
      color: formColor,
    };

    // Save to both possible locations to ensure compatibility
    localStorage.setItem('masterPreferences', JSON.stringify(newPrefs));
    localStorage.setItem('playerPreferences', JSON.stringify(newPrefs));
    
    setPreferences(newPrefs);
    setIsEditing(false);
    window.dispatchEvent(new Event('preferencesUpdated'));
  };

  const handleClearPreferences = () => {
    localStorage.removeItem('masterPreferences');
    localStorage.removeItem('playerPreferences');
    setPreferences(null);
    setFormPseudo('');
    setFormEmoji(AVAILABLE_EMOJIS[0]);
    setFormColor(AVAILABLE_COLORS[0].value);
    setShowPreferencesModal(false);
    setIsEditing(false);
    window.dispatchEvent(new Event('preferencesUpdated'));
  };

  return (
    <>
      <header className={`${
        isFixed ? 'md:fixed' : ''
      } top-0 left-0 right-0 z-50 bg-bg-secondary/95 backdrop-blur-sm border-b-2 border-gradient-animated`}>
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="font-display font-bold text-2xl bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent animate-gradient">
              BuzzMaster
            </h1>
          </div>

          {/* User Info / Actions */}
          <div className="flex items-center gap-4">
            {preferences ? (
              <button
                onClick={handleOpenModal}
                className={`w-12 h-12 rounded-full ${preferences.color} flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform duration-200 ring-2 ring-white/20 hover:ring-white/40`}
              >
                {preferences.emoji}
              </button>
            ) : (
              <button
                onClick={handleOpenModal}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform duration-200 ring-2 ring-white/20 hover:ring-white/40"
              >
                <span className="text-white drop-shadow-md">👤</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated rounded-xl p-6 max-w-md w-full border border-primary/20 shadow-xl">
            <h3 className="font-display font-bold text-2xl mb-4 text-center">
              {isEditing ? (preferences ? 'Modifier mes préférences' : 'Créer mon profil') : 'Mes préférences'}
            </h3>
            
            {isEditing ? (
              <form onSubmit={handleSavePreferences} className="space-y-4">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-20 h-20 rounded-full ${formColor} flex items-center justify-center text-5xl shadow-lg transition-all duration-200`}>
                    {formEmoji}
                  </div>
                </div>

                {/* Pseudo Input */}
                <div className="space-y-2">
                  <label htmlFor="pseudo" className="block text-sm font-semibold text-text-primary">
                    Pseudo
                  </label>
                  <input
                    id="pseudo"
                    type="text"
                    value={formPseudo}
                    onChange={(e) => setFormPseudo(e.target.value)}
                    placeholder="Votre pseudo..."
                    className="w-full px-4 py-3 bg-bg-secondary border-2 border-primary/20 rounded-lg focus:border-primary outline-none transition-colors text-text-primary placeholder:text-text-muted"
                    maxLength={20}
                    autoComplete="off"
                  />
                </div>

                {/* Emoji Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Avatar
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {AVAILABLE_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormEmoji(emoji)}
                        className={`aspect-square rounded-lg text-2xl hover:scale-110 transition-transform ${
                          formEmoji === emoji
                            ? 'bg-primary/20 ring-2 ring-primary scale-110'
                            : 'bg-bg-secondary hover:bg-bg-hover'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Couleur
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormColor(color.value)}
                        className={`aspect-square rounded-lg ${color.bg} hover:scale-110 transition-transform ${
                          formColor === color.value ? 'ring-2 ring-white scale-110' : ''
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div className="bg-error/20 border border-error/40 rounded-lg p-3">
                    <p className="text-sm text-error font-semibold">{formError}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (preferences) {
                        setIsEditing(false);
                        setFormPseudo(preferences.pseudo);
                        setFormEmoji(preferences.emoji);
                        setFormColor(preferences.color);
                      } else {
                        setShowPreferencesModal(false);
                      }
                      setFormError('');
                    }}
                    className="flex-1 px-4 py-3 bg-bg-hover hover:bg-bg-base text-text-secondary font-semibold rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-lg transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : preferences ? (
              <div className="space-y-4">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-3 p-4 bg-bg-secondary rounded-xl border border-primary/20">
                  <div className={`w-20 h-20 rounded-full ${preferences.color} flex items-center justify-center text-5xl shadow-lg`}>
                    {preferences.emoji}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-text-primary">{preferences.pseudo}</p>
                    <p className="text-sm text-text-muted">Profil enregistré</p>
                  </div>
                </div>

                <div className="bg-info/10 border border-info/30 rounded-lg p-3">
                  <p className="text-sm text-text-secondary">
                    💡 Vos préférences sont sauvegardées. Vous rejoindrez automatiquement les parties sans remplir le formulaire.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreferencesModal(false)}
                    className="flex-1 px-4 py-3 bg-bg-hover hover:bg-bg-base text-text-secondary font-semibold rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-3 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded-lg transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={handleClearPreferences}
                    className="flex-1 px-4 py-3 bg-error/20 hover:bg-error/30 text-error font-bold rounded-lg transition-colors"
                  >
                    Effacer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Guest Info */}
                <div className="flex flex-col items-center gap-3 p-4 bg-bg-secondary rounded-xl border border-primary/20">
                  <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-5xl">
                    👤
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-text-primary">Mode Invité</p>
                    <p className="text-sm text-text-muted">Aucun profil enregistré</p>
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                  <p className="text-sm text-text-secondary">
                    💡 En enregistrant vos préférences, vous pourrez rejoindre ou créer des parties automatiquement sans remplir de formulaire à chaque fois.
                  </p>
                </div>

                <button
                  onClick={() => setShowPreferencesModal(false)}
                  className="w-full px-4 py-3 bg-bg-hover hover:bg-bg-base text-text-secondary font-semibold rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
