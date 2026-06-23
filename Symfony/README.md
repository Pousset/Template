# 🎼 Symfony Boilerplate

> Boilerplate full-stack moderne basé sur **Symfony 7**, **Twig**, **Doctrine ORM** et **Tailwind CSS v4**.  
> Architecturé en DDD léger, prêt pour Docker, avec auth JWT + Google OAuth intégrée.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Symfony 7 (LTS) |
| Vues | Twig + Tailwind CSS v4 |
| ORM | Doctrine |
| Auth | LexikJWTBundle + HWIOAuthBundle (Google OAuth) |
| Base de données | PostgreSQL 16 |
| Infra locale | Docker : nginx + php-fpm |
| Assets | Vite |
| Qualité | PHPStan (niveau 6) + PHP-CS-Fixer |
| CI | GitHub Actions |

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Symfony CLI](https://symfony.com/download) *(optionnel, pour le dev local sans Docker)*
- PHP 8.3+
- Composer 2+
- Node.js 20+ & npm

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/ton-user/symfony-boilerplate.git
cd symfony-boilerplate
```

### 2. Copier les variables d'environnement

```bash
cp .env.example .env
```

Renseigner les valeurs dans `.env` :

```dotenv
APP_ENV=dev
APP_SECRET=change_me

DATABASE_URL="postgresql://app:password@postgres:5432/app_db"

JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=change_me

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost/connect/google/check
```

### 3. Démarrer l'environnement Docker

```bash
make up
```

### 4. Installer les dépendances

```bash
make install
```

### 5. Générer les clés JWT

```bash
make jwt-keys
```

### 6. Lancer les migrations

```bash
make migrate
```

### 7. (Optionnel) Charger les fixtures

```bash
make fixtures
```

L'application est disponible sur **http://localhost**.

---

## Commandes Makefile

| Commande | Description |
|---|---|
| `make up` | Démarrer les conteneurs Docker |
| `make down` | Arrêter les conteneurs |
| `make restart` | Redémarrer les conteneurs |
| `make install` | Installer Composer + npm |
| `make migrate` | Créer et exécuter les migrations Doctrine |
| `make fixtures` | Charger les données de test |
| `make jwt-keys` | Générer les clés JWT (private/public) |
| `make test` | Lancer la suite de tests PHPUnit |
| `make cs-fix` | Corriger le style de code (PHP-CS-Fixer) |
| `make phpstan` | Analyse statique (niveau 6) |
| `make shell` | Ouvrir un shell dans le conteneur PHP |
| `make logs` | Afficher les logs des conteneurs |
| `make reset-db` | Supprimer et recréer la base de données |

---

## Arborescence

```
symfony-boilerplate/
├── .docker/
│   ├── nginx/default.conf
│   └── php/Dockerfile
├── .github/
│   └── workflows/ci.yml
├── assets/
│   ├── app.js
│   └── app.css
├── bin/console
├── config/
│   ├── packages/
│   └── services.yaml
├── migrations/
├── public/index.php
├── src/
│   ├── Auth/
│   │   ├── Controller/
│   │   ├── DTO/
│   │   ├── Entity/
│   │   ├── Form/
│   │   ├── Repository/
│   │   ├── Security/
│   │   └── Service/
│   ├── Dashboard/
│   │   ├── Controller/
│   │   └── Service/
│   ├── Shared/
│   │   ├── Entity/
│   │   └── Service/
│   └── Kernel.php
├── templates/
│   ├── base.html.twig
│   ├── auth/
│   └── dashboard/
├── tests/
│   ├── Unit/
│   └── Functional/
├── .env.example
├── .gitignore
├── .php-cs-fixer.php
├── compose.yaml
├── composer.json
├── Makefile
├── package.json
├── phpstan.neon
└── vite.config.js
```

---

## Architecture DDD léger

Ce boilerplate adopte une organisation par **domaine métier** plutôt que par type technique.

Chaque domaine sous `src/` est autonome et contient :

- `Controller/` — Points d'entrée HTTP, aucune logique métier
- `Service/` — Logique métier, injectée via le container Symfony
- `Entity/` — Entités Doctrine
- `Repository/` — Requêtes base de données
- `DTO/` — Objets de transfert de données (formulaires, API)
- `Form/` — Types Symfony Form

---

## Auth

### JWT
L'authentification stateless est gérée par **LexikJWTBundle**. Les tokens sont générés à la connexion et validés sur chaque requête protégée.

### Google OAuth
Le flow OAuth2 est géré par **HWIOAuthBundle**. L'utilisateur est redirigé vers Google, puis un `GoogleAuthenticator` personnalisé crée ou retrouve le compte local.

Routes disponibles :

| Route | Description |
|---|---|
| `GET /login` | Page de connexion |
| `POST /login` | Authentification email/mot de passe |
| `GET /connect/google` | Redirection vers Google |
| `GET /connect/google/check` | Callback OAuth Google |
| `GET /logout` | Déconnexion |

---

## Tests

```bash
make test
```

Les tests sont organisés en :
- `tests/Unit/` — Tests unitaires (Services, DTO)
- `tests/Functional/` — Tests fonctionnels (Controllers via WebTestCase)

---

## Qualité de code

```bash
make phpstan    # Analyse statique PHPStan niveau 6
make cs-fix     # Correction automatique du style
```

Le CI GitHub Actions exécute ces deux commandes + les tests à chaque push.

---

## Contribution

1. Créer une branche : `git checkout -b feat/ma-feature`
2. Commiter : `git commit -m "feat: description"`
3. Pousser : `git push origin feat/ma-feature`
4. Ouvrir une Pull Request

---

## Licence

MIT
