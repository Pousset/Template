# Template Monorepo

Monorepo contenant plusieurs templates d'applications full-stack, tous orchestrés via Docker.

---

## Projets inclus

| Projet | URL | Stack |
|---|---|---|
| React / Web | http://127.0.0.1:5173 | React + NestJS + PostgreSQL |
| React / App (Tauri) | http://127.0.0.1:3002 (backend seul) | React + NestJS + PostgreSQL |
| PHP / Laravel | http://127.0.0.1:8000 | Laravel 11 + SQLite |
| PHP / Symfony | http://127.0.0.1:8080 | Symfony 7 + PostgreSQL |

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (≥ 4.x)
- [Node.js](https://nodejs.org/) ≥ 20 (optionnel, pour les commandes npm du monorepo)
- Git

---

## Démarrage rapide (nouveau dev)

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd Template
```

### 2. Lancer tous les conteneurs

```bash
docker compose up -d
```

> La première fois, Docker télécharge les images et compile les assets — prévoir quelques minutes.

### 3. Vérifier que tout tourne

```bash
docker compose ps
```

Tous les services doivent afficher le statut `running` ou `healthy`.

---

## Accès aux applications

### React / Web
- **Frontend** → http://127.0.0.1:5173
- **Backend API** → http://127.0.0.1:3001
- **PostgreSQL** → `127.0.0.1:5432` (user: `portfolio`, pass: `portfolio_password`, db: `portfolio_db`)

### React / App (Tauri)
- **Backend API** → http://127.0.0.1:3002
- **PostgreSQL** → `127.0.0.1:5433`
- ⚠ L'application desktop se lance **en natif** :
  ```bash
  cd React/App/Tauri/frontend
  pnpm tauri dev
  ```

### PHP / Laravel
- **App** → http://127.0.0.1:8000 (⚠ utiliser `127.0.0.1`, pas `localhost`)
- Base SQLite intégrée au conteneur

### PHP / Symfony
- **App** → http://127.0.0.1:8080
- **PostgreSQL** → `127.0.0.1:5434` (user: `app`, pass: `password`, db: `app`)

---

## Comptes de test

Identiques sur tous les projets :

| Rôle | E-mail | Nom d'utilisateur | Mot de passe |
|---|---|---|---|
| Admin | admin1@template.com | admin1 | `admin` |
| Admin | admin2@template.com | admin2 | `admin` |
| Admin | admin3@template.com | admin3 | `admin` |
| Utilisateur | user1@template.com | user1 | `password` |
| … | user2–10@template.com | user2–10 | `password` |

> **Laravel / Symfony** : connexion acceptée avec l'e-mail **ou** le nom d'utilisateur.

---

## Commandes utiles

### Gestion Docker (depuis la racine)

```bash
# Démarrer tous les services
npm run docker:up

# Arrêter tous les services
npm run docker:down

# Voir les logs en temps réel
npm run docker:logs

# Rebuild complet (supprime les layers cachés)
npm run docker:rebuild

# Rebuild d'un seul projet
npm run docker:rebuild:laravel
npm run docker:rebuild:symfony
npm run docker:rebuild:react-web
npm run docker:rebuild:react-app
```

### Base de données Laravel

```bash
# Reset complet (migrate:fresh + seed)
npm run laravel:db:reset

# Seed uniquement
npm run laravel:db:seed

# Nouvelle migration
npm run laravel:db:migrate

# Shell dans le conteneur
npm run laravel:shell
```

### Base de données Symfony

```bash
# Reset complet (migrations + seed)
npm run symfony:db:reset

# Migration uniquement
npm run symfony:db:migrate

# Shell dans le conteneur
npm run symfony:shell
```

---

## Structure du monorepo

```
Template/
├── docker-compose.yml          ← orchestration globale
├── package.json                ← scripts npm du monorepo
├── React/
│   ├── Web/                    ← React + NestJS (web)
│   └── App/Tauri/              ← React + Tauri (desktop)
└── Php/
    ├── Laravel/                ← Laravel 11 (SQLite)
    └── Symfony/                ← Symfony 7 (PostgreSQL)
```

---

## Variables d'environnement

Chaque projet contient un fichier `.env.example`. Copier et adapter si besoin :

```bash
# Exemple pour Symfony
cp Php/Symfony/.env.example Php/Symfony/.env
```

> ⚠ Ne jamais committer de vrais secrets. Les valeurs dans `docker-compose.yml` sont des valeurs de développement local uniquement.

---

## Arrêter et nettoyer

```bash
# Arrêter les conteneurs (les données sont conservées dans les volumes)
docker compose down

# Supprimer aussi les volumes (données perdues)
docker compose down -v
```

```

Pour Symfony uniquement :

```bash
npm --prefix Php/Symfony/Web run setup
npm --prefix Php/Symfony/Web run dev
npm --prefix Php/Symfony/Web run lint
npm --prefix Php/Symfony/Web run test
```
