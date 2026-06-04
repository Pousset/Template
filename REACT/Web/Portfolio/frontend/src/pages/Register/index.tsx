import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { accessToken, user } = await authService.register(
        username,
        password,
      );
      login(accessToken, user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
      <Link to="/login">Déjà un compte ? Se connecter</Link>
    </main>
  );
}
