import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <main>
      <h1>Accueil</h1>
      {user ? (
        <p>Connecté en tant que {user.username}</p>
      ) : (
        <Link to="/login">Se connecter</Link>
      )}
    </main>
  );
}
