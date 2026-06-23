# CLAUDE.md — Contexte projet : Symfony Boilerplate

> Ce fichier est la **référence autoritaire** du projet pour Claude.  
> Il doit être mis à jour après chaque feature ou décision architecturale importante.  
> En cas de conflit entre ce fichier et le code, ce fichier fait foi.

---

## Vue d'ensemble

**Nom du projet :** Symfony Boilerplate  
**Type :** Boilerplate full-stack réutilisable (usage personnel)  
**Objectif :** Disposer d'une base de départ professionnelle pour tout nouveau projet SaaS PHP  
**Statut :** 🚧 En cours de construction

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | Symfony | 7.x (LTS) |
| Vues | Twig | — |
| CSS | Tailwind CSS | v4 |
| ORM | Doctrine | — |
| Auth JWT | LexikJWTBundle | — |
| Auth OAuth | HWIOAuthBundle | — |
| Base de données | PostgreSQL | 16 |
| Infra | Docker (nginx + php-fpm) | — |
| Assets | Vite | — |
| Analyse statique | PHPStan | niveau 6 |
| Style de code | PHP-CS-Fixer | — |
| CI | GitHub Actions | — |
| Tests | PHPUnit | — |
| Environnement | Windows + PowerShell + VS Code | — |

---

## Arborescence complète

```
symfony-boilerplate/
├── .docker/
│   ├── nginx/
│   │   └── default.conf          # Config nginx : root /public, index.php
│   └── php/
│       └── Dockerfile            # php-fpm 8.3, extensions Symfony
├── .github/
│   └── workflows/
│       └── ci.yml                # lint + phpstan + tests
├── assets/
│   ├── app.js                    # Point d'entrée Vite
│   └── app.css                   # Tailwind v4 import
├── bin/
│   └── console                   # CLI Symfony
├── config/
│   ├── packages/
│   │   ├── doctrine.yaml
│   │   ├── lexik_jwt_authentication.yaml
│   │   ├── security.yaml
│   │   └── twig.yaml
│   ├── routes/
│   └── services.yaml
├── migrations/                   # Migrations Doctrine auto-générées
├── public/
│   └── index.php                 # Point d'entrée unique HTTP
├── src/
│   ├── Auth/
│   │   ├── Controller/
│   │   │   └── AuthController.php
│   │   ├── DTO/
│   │   │   └── RegisterDTO.php
│   │   ├── Entity/
│   │   │   └── User.php
│   │   ├── Form/
│   │   │   └── LoginType.php
│   │   ├── Repository/
│   │   │   └── UserRepository.php
│   │   ├── Security/
│   │   │   └── GoogleAuthenticator.php
│   │   └── Service/
│   │       └── AuthService.php
│   ├── Dashboard/
│   │   ├── Controller/
│   │   │   └── DashboardController.php
│   │   └── Service/
│   ├── Shared/
│   │   ├── Entity/
│   │   └── Service/
│   └── Kernel.php
├── templates/
│   ├── base.html.twig            # Layout principal avec Tailwind
│   ├── auth/
│   │   ├── login.html.twig
│   │   └── register.html.twig
│   └── dashboard/
│       └── index.html.twig
├── tests/
│   ├── Unit/
│   │   └── Auth/
│   └── Functional/
│       └── Auth/
├── var/                          # Cache + logs (gitignored)
├── vendor/                       # Composer (gitignored)
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

## Conventions de code

### PHP / Symfony

- **Nommage :** PascalCase pour les classes, camelCase pour les méthodes, snake_case pour les variables
- **Fichiers :** PascalCase (`AuthController.php`, `UserRepository.php`)
- **Namespace :** `App\Auth\Controller`, `App\Dashboard\Service`, etc.
- **Controllers :** aucune logique métier — uniquement appel de Services et retour de réponse
- **Services :** logique métier injectée via le container Symfony (autowiring)
- **Entities :** jamais exposées directement dans les formulaires — toujours via DTO
- **Imports :** triés alphabétiquement (`use` statements)
- **Langue du code :** anglais (variables, méthodes, commentaires)
- **Style :** PHP-CS-Fixer appliqué avant chaque commit

### Twig

- **Héritage :** toutes les vues étendent `base.html.twig`
- **Blocs :** `{% block title %}`, `{% block content %}`, `{% block scripts %}`
- **Assets :** chargés via `{{ asset('build/app.js') }}` (Vite bundle)

### CSS / Tailwind

- Tailwind v4 avec syntax arbitrary-value : `bg-(--color-primary)`
- Pas de classes utilitaires inline > 3 niveaux de profondeur — extraire en composant Twig si nécessaire

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `APP_ENV` | Environnement Symfony | `dev` / `prod` |
| `APP_SECRET` | Clé secrète Symfony | `change_me` |
| `DATABASE_URL` | DSN PostgreSQL | `postgresql://app:pass@postgres:5432/app_db` |
| `JWT_PASSPHRASE` | Passphrase des clés JWT | `change_me` |
| `JWT_SECRET_KEY` | Chemin clé privée JWT | `%kernel.project_dir%/config/jwt/private.pem` |
| `JWT_PUBLIC_KEY` | Chemin clé publique JWT | `%kernel.project_dir%/config/jwt/public.pem` |
| `GOOGLE_CLIENT_ID` | ID app Google OAuth | — |
| `GOOGLE_CLIENT_SECRET` | Secret app Google OAuth | — |
| `GOOGLE_REDIRECT_URI` | Callback OAuth | `http://localhost/connect/google/check` |

---

## Commandes fréquentes

```bash
# Docker
make up                    # Démarrer l'environnement
make down                  # Arrêter l'environnement
make shell                 # Shell dans le conteneur PHP
make logs                  # Logs en temps réel

# Symfony
make install               # composer install + npm install
make migrate               # Créer et exécuter les migrations
make fixtures              # Charger les fixtures de dev
make jwt-keys              # Générer les clés JWT
make reset-db              # Drop + recreate + migrate

# Qualité
make test                  # PHPUnit (Unit + Functional)
make phpstan               # Analyse statique niveau 6
make cs-fix                # Correction style PHP-CS-Fixer

# Symfony CLI (dans le conteneur ou en local)
php bin/console doctrine:migrations:diff      # Générer une migration
php bin/console doctrine:migrations:migrate   # Exécuter les migrations
php bin/console cache:clear                   # Vider le cache
php bin/console debug:router                  # Lister les routes
php bin/console debug:container              # Lister les services
```

---

## Avancement des phases

### ✅ Phase 0 — Conception
- [x] Choix du stack (Symfony 7 + Twig + Tailwind v4 + Doctrine + PostgreSQL)
- [x] Arborescence DDD léger validée
- [x] README + CLAUDE.md rédigés

### 🚧 Phase 1 — Infrastructure Docker
- [ ] `compose.yaml` (nginx + php-fpm + postgres)
- [ ] `.docker/nginx/default.conf`
- [ ] `.docker/php/Dockerfile`
- [ ] `.env.example`
- [ ] `Makefile` complet

### ⬜ Phase 2 — Bootstrap Symfony
- [ ] `composer.json` avec toutes les dépendances
- [ ] `config/packages/` (doctrine, security, twig, jwt)
- [ ] `public/index.php`
- [ ] `src/Kernel.php`
- [ ] `bin/console`

### ⬜ Phase 3 — Auth
- [ ] Entité `User` avec rôles
- [ ] Migration initiale
- [ ] `AuthController` (login / register / logout)
- [ ] `GoogleAuthenticator`
- [ ] Clés JWT générées
- [ ] Vues Twig login/register

### ⬜ Phase 4 — Dashboard
- [ ] `DashboardController` (route protégée)
- [ ] Vue Twig dashboard
- [ ] Layout `base.html.twig` avec Tailwind

### ⬜ Phase 5 — Assets
- [ ] `vite.config.js`
- [ ] `package.json` (Vite + Tailwind v4)
- [ ] `assets/app.js` + `assets/app.css`

### ⬜ Phase 6 — Qualité & CI
- [ ] `phpstan.neon` (niveau 6)
- [ ] `.php-cs-fixer.php`
- [ ] `.github/workflows/ci.yml`
- [ ] `tests/` (Unit + Functional de base)

### ⬜ Phase 7 — Fixtures & Seed
- [ ] `src/DataFixtures/UserFixture.php`
- [ ] Utilisateur admin par défaut

---

## Décisions architecturales

| # | Décision | Raison |
|---|---|---|
| 1 | DDD léger (`src/Auth/`, `src/Dashboard/`) | Standard entreprise Symfony, meilleure lisibilité vs structure plate |
| 2 | Doctrine ORM (pas Eloquent) | Natif Symfony, standard de facto |
| 3 | Twig (pas React) | Objectif : apprendre le PHP pur full-stack |
| 4 | Tailwind v4 | Stack front familier, cohérence avec les autres projets |
| 5 | Docker (nginx + php-fpm) | Reproductibilité, pas de dépendance à l'OS local |
| 6 | PHPStan niveau 6 | Bon équilibre rigueur / productivité en solo |

---

## À ne pas faire (anti-patterns)

- ❌ Mettre de la logique métier dans les Controllers
- ❌ Exposer les Entities Doctrine directement dans les formulaires (utiliser des DTO)
- ❌ Committer les fichiers `var/`, `vendor/`, `.env`, `config/jwt/*.pem`
- ❌ Utiliser `$_SESSION` ou `$_GET` directement — toujours passer par le `Request` Symfony
- ❌ Requêtes SQL brutes dans les Controllers — toujours via les Repositories

---

## Instructions pour Claude

- Toujours proposer un **plan détaillé avant d'implémenter**
- Attendre la validation avant de générer le code
- Respecter les conventions listées dans ce fichier
- Mettre à jour ce fichier après chaque phase complétée
- Les fichiers PHP suivent le style **PHP-CS-Fixer** (PSR-12 étendu)
- Toujours utiliser l'**autowiring Symfony** (pas de configuration manuelle de services sauf exception)
- En cas de doute sur une convention, **demander avant d'implémenter**
