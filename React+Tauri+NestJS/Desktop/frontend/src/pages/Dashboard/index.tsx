import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/shared/Avatar';
import { Badge, Button } from '@/components/ui';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          <Button variant="secondary" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>

        {/* Avatar + identité */}
        <div className="rounded-2xl border border-border bg-bg-secondary p-5 flex items-center gap-5 shrink-0">
          <Avatar username={user?.username} size="lg" />
          <div>
            <p className="text-xl font-semibold text-text-primary">{user?.username}</p>
            <p className="text-sm text-text-muted">{user?.email ?? 'Aucun email renseigné'}</p>
            <Badge variant="primary" className="mt-1.5">
              {user?.role}
            </Badge>
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
