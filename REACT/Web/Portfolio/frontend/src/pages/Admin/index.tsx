import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api.service";
import type { User } from "@/types/user.types";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    apiFetch<User[]>("/admin/users")
      .then(setUsers)
      .catch(console.error)
      .finally(() => setIsLoadingUsers(false));
  }, []);

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin",
  ) => {
    try {
      await apiFetch(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch {
      console.error("Erreur lors du changement de rôle");
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-primary px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-text-primary">Admin</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30 font-medium">
              ADMIN
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Identité admin */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white shrink-0">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {user?.username}
            </p>
            <p className="text-sm text-text-muted">
              {user?.email ?? "Aucun email renseigné"}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Membre depuis {joinDate}
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Utilisateurs"
            value={String(users.length)}
            icon="👥"
          />
          <StatCard label="Admins" value={String(adminCount)} icon="🛡️" />
          <StatCard
            label="Membres"
            value={String(users.length - adminCount)}
            icon="👤"
          />
        </div>

        {/* Table utilisateurs */}
        <div className="rounded-2xl border border-border bg-bg-secondary overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Gestion des utilisateurs
            </h2>
            <span className="text-xs text-text-muted">
              {users.length} comptes
            </span>
          </div>

          {isLoadingUsers ? (
            <div className="px-6 py-8 text-center text-text-muted text-sm">
              Chargement...
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-xs font-semibold text-text-secondary shrink-0">
                      {u.username?.slice(0, 2).toUpperCase() ?? "??"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {u.username}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {u.email ?? "Pas d'email"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        u.role === "admin"
                          ? "bg-primary/20 text-primary-light border-primary/30"
                          : "bg-bg-card text-text-muted border-border"
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.id !== user?.id && (
                      <button
                        onClick={() =>
                          handleRoleChange(
                            u.id,
                            u.role === "admin" ? "user" : "admin",
                          )
                        }
                        className="text-xs px-3 py-1 rounded-lg border border-border text-text-muted hover:text-text-primary hover:border-text-muted transition-colors"
                      >
                        {u.role === "admin" ? "→ user" : "→ admin"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5 space-y-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs text-text-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}
