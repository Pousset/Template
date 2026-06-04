import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute left-1/4 top-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="text-center max-w-2xl mx-auto space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-card text-xs text-text-secondary tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Portfolio personnel
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-text-primary leading-none">
            Template
            <br />
            <span className="text-primary">Site</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
            Un espace personnel pour présenter mes projets, mon parcours et mes compétences.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors text-sm"
            >
              Accéder au Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors text-sm"
              >
                Créer un compte
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors text-sm"
              >
                Se connecter
              </Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 pt-4 border-t border-border">
          {[
            { label: 'Projets', value: '12+' },
            { label: "Années d'exp.", value: '3+' },
            { label: 'Technologies', value: '20+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
