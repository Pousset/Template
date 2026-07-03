# Portfolio App

Template de site web minimaliste avec authentification et espace admin.

---

## Stack

| Couche          | Technologies                             |
| --------------- | ---------------------------------------- |
| Frontend        | React 19, TypeScript, Vite, Tailwind CSS |
| Backend         | NestJS, TypeScript, TypeORM              |
| Base de données | SQLite (dev) / PostgreSQL (prod)         |
| Auth            | JWT + Google OAuth 2.0                   |

---

## Architecture — Comment tout s'articule ?

Pour comprendre comment ces technologies fonctionnent ensemble, imagine une **chaîne de restaurants** : la salle où mangent les clients (le Frontend), la cuisine où les plats sont préparés (le Backend), la chambre froide où sont stockés les ingrédients (la Base de données), et le service de sécurité à l'entrée (l'Authentification).

### 🖥️ Frontend — La Salle de Restaurant

Tout ce qui s'exécute dans le navigateur. L'aspect visuel et l'interactivité.

- **React 19** — Le chef d'orchestre de l'interface. Découpe le site en composants réutilisables (bouton, navbar, carte…) et met à jour l'écran de façon fluide sans rechargement de page.
- **TypeScript** — Le garde-fou logique. Ajoute des règles strictes au JavaScript pour éliminer les bugs d'inattention avant l'exécution.
- **Vite** — Le moteur de build ultra-rapide. Compile le code React/TypeScript en fichiers légers pour le navigateur, avec un rechargement quasi instantané en développement.
- **Tailwind CSS** — Le styliste instantané. Intègre le design directement dans le HTML via des micro-classes (`bg-blue-500 p-4 rounded`), sans fichiers CSS séparés.

### ⚙️ Backend — La Cuisine

Le serveur, invisible pour l'utilisateur. Il reçoit les requêtes du Frontend, exécute la logique métier et communique avec la base de données.

- **NestJS** — La structure architecturale. Framework Node.js rigoureux organisé en modules, contrôleurs et services. Rend le code maintenable et évolutif, contrairement à un Express minimal non structuré.
- **TypeScript** — La cohérence totale. Même langage qu'au Frontend, ce qui simplifie la collaboration et réduit les frictions entre les deux couches.
- **TypeORM** — Le traducteur (ORM). Permet de manipuler les données sous forme d'objets TypeScript sans écrire de SQL : il génère les requêtes en arrière-plan.

### 🗄️ Base de données — La Chambre Froide

Le stockage permanent des données (utilisateurs, contenu, sessions…).

- **SQLite** _(dev)_ — La légèreté absolue. Une base de données dans un simple fichier local. Parfait pour développer sans installer de serveur.
- **PostgreSQL** _(prod)_ — Le coffre-fort industriel. Base relationnelle robuste, conçue pour gérer des millions de lignes, des accès simultanés et de forts volumes de données en production.

### 🔐 Authentification — La Sécurité

Le système qui vérifie l'identité des utilisateurs et contrôle les accès.

- **Google OAuth 2.0** — La clé universelle. Connexion en un clic via Google. L'identité est vérifiée par Google, sans stocker ni gérer de mots de passe en base.
- **JWT (JSON Web Token)** — Le pass d'accès temporaire. Une fois authentifié, l'utilisateur reçoit un badge numérique signé. Ce badge est présenté automatiquement à chaque requête vers une route protégée.

---

## Structure du projet

```
React/App/Tauri/
+-- frontend/   # React 19 + Vite
+-- backend/    # NestJS + TypeORM
+-- desktop/    # Tauri
+-- docker-compose.yml
```

---

## Démarrage rapide

```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend (nouveau terminal)
cd frontend && npm install && npm run dev
```

- Frontend : http://localhost:5173
- Backend : http://localhost:3001

---

## Fonctionnalités

- Page d'accueil publique
- Connexion via username/mot de passe ou Google
- Espace utilisateur connecté
- Espace admin protégé (accès restreint)

---

## Branches

| Branche   | Rôle          |
| --------- | ------------- |
| `main`    | Production    |
| `develop` | Développement |
