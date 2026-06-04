import type { ReactElement } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export function Error(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const message = searchParams.get('message') || 'Une erreur est survenue';
  const title = searchParams.get('title') || 'Erreur';

  const handleGoHome = (): void => {
    // Clear player session
    sessionStorage.removeItem('playerId');
    navigate('/');
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full text-center space-y-6 p-8">
          {/* Icon */}
          <div className="text-8xl mb-4 animate-bounce">
            ⛔
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-4xl text-text-primary">
            {title}
          </h1>

          {/* Message */}
          <p className="text-text-secondary text-lg">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={handleGoHome}
            className="mt-8 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </Layout>
  );
}
