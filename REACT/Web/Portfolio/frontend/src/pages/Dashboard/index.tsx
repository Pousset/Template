import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Bienvenue, {user?.username} !</p>
      <button onClick={logout}>Se déconnecter</button>
    </main>
  );
}
