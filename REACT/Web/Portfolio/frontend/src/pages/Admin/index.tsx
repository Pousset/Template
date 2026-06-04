import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const { user, logout } = useAuth();
  return (
    <main>
      <h1>Administration</h1>
      <p>Connecté en tant qu'admin : {user?.username}</p>
      <button onClick={logout}>Se déconnecter</button>
    </main>
  );
}
