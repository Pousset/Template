import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="h-full flex flex-col px-6 py-8 overflow-hidden">
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-muted text-sm mt-1">Bienvenue, {user?.username} 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Avatar + identité */}
        <div className="rounded-2xl border border-border bg-bg-secondary p-5 flex items-center gap-5 shrink-0">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary">{user?.username}</p>
            <p className="text-sm text-text-muted">{user?.email ?? 'Aucun email renseigné'}</p>
            <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 shrink-0">
          <StatCard label="Identifiant" value={user?.username ?? '—'} icon="👤" />
          <StatCard label="Rôle" value={user?.role ?? '—'} icon="🔑" />
          <StatCard label="Membre depuis" value={joinDate} icon="📅" />
        </div>

        {/* Infos compte */}
        <div className="rounded-2xl border border-border bg-bg-secondary p-5 flex flex-col gap-3 flex-1 min-h-0">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0">
            Informations du compte
          </h2>
          <div className="flex flex-col gap-0 overflow-y-auto">
            <InfoRow label="ID" value={user?.id ?? '—'} mono />
            <InfoRow label="Username" value={user?.username ?? '—'} />
            <InfoRow label="Email" value={user?.email ?? 'Non renseigné'} />
            <InfoRow label="Rôle" value={user?.role ?? '—'} />
            <InfoRow label="Inscription" value={joinDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4 space-y-1.5">
      <span className="text-xl">{icon}</span>
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-text-primary truncate">{value}</p>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className={`text-sm text-text-primary ${mono ? 'font-mono text-xs text-text-secondary' : ''}`}>
        {value}
      </span>
    </div>
  );
}
