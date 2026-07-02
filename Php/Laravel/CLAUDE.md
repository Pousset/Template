<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- tailwindcss (TAILWINDCSS) - v4

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
    - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

</laravel-boost-guidelines>

---

# CLAUDE.md — Laravel Template (Documentation Projet)

## 🎯 Vision du Projet

**Laravel Template** est un template Laravel complet avec une UI inspirée du style GitHub Dark/Light. Il est conçu pour évoluer vers une application portfolio complète avec authentification, gestion de rôles et fonctionnalités avancées. La base est posée pour un développement incrémental et professionnel.

## 🏗️ Architecture Globale

```
Laravel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── PageController.php       # Contrôleur des pages publiques
│   └── Models/
│       └── User.php
├── resources/
│   ├── css/
│   │   └── app.css                      # Variables CSS + utilitaires Tailwind v4
│   ├── js/
│   │   └── app.js
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php            # Layout principal (navbar + footer)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── navbar.blade.php     # <x-layout.navbar />
│       │   │   └── footer.blade.php    # <x-layout.footer />
│       │   └── ui/
│       │       └── button.blade.php    # <x-ui.button />
│       └── pages/
│           ├── home.blade.php           # Page d'accueil (hero)
│           └── laravel.blade.php        # Page de bienvenue Laravel originale
├── routes/
│   └── web.php                          # Routes publiques
└── tests/
    ├── Feature/
    └── Unit/
```

## 🎨 Système de Design (GitHub Dark/Light)

Le thème est géré via des **variables CSS** sur `:root`. Le mode sombre est actif par défaut. La préférence est persistée dans `localStorage` via un script JS dans le layout.

| Variable CSS             | Dark      | Light     |
| ------------------------ | --------- | --------- |
| `--color-bg-primary`     | `#0d1117` | `#ffffff` |
| `--color-bg-secondary`   | `#161b22` | `#f6f8fa` |
| `--color-bg-elevated`    | `#1c2128` | `#eaeef2` |
| `--color-text-primary`   | `#e6edf3` | `#1f2328` |
| `--color-text-secondary` | `#7d8590` | `#656d76` |
| `--color-primary`        | `#2f81f7` | `#0969da` |
| `--color-border`         | `#21262d` | `#d0d7de` |

### Classes utilitaires disponibles

```
text-text-primary / text-text-secondary / text-text-muted
text-primary / text-primary-light
bg-bg-primary / bg-bg-secondary / bg-bg-elevated
border-border / border-border-subtle / border-border-strong
btn-primary / btn-secondary
nav-link / nav-link.active
```

## 🧩 Composants Blade

### Layout

| Composant             | Description                       |
| --------------------- | --------------------------------- |
| `<x-layout.navbar />` | Barre de navigation principale    |
| `<x-layout.footer />` | Pied de page avec icônes sociales |

### UI

| Composant       | Props                                                           | Description              |
| --------------- | --------------------------------------------------------------- | ------------------------ |
| `<x-ui.button>` | `variant` (primary\|secondary), `href`, `type`, `size` (sm\|md) | Bouton/lien réutilisable |

**Exemple :**

```blade
<x-ui.button variant="primary" href="{{ route('home') }}">
    Accéder
</x-ui.button>
```

## 🔗 Routes

| Route          | Nom       | Vue             | Description               |
| -------------- | --------- | --------------- | ------------------------- |
| `GET /`        | `home`    | `pages.home`    | Page d'accueil (hero)     |
| `GET /laravel` | `laravel` | `pages.laravel` | Page de bienvenue Laravel |

**Futur :**

```
GET  /login         auth.login      Page de connexion
POST /login         auth.login      Traitement connexion
GET  /register      auth.register   Page d'inscription
POST /register      auth.register   Traitement inscription
POST /logout        —               Déconnexion
GET  /dashboard     dashboard       Espace connecté (auth)
GET  /admin         admin.index     Espace admin (rôle admin)
```

## 👤 Système d'Authentification (À venir)

### Rôles utilisateurs

| Rôle    | Description           | Accès                       |
| ------- | --------------------- | --------------------------- |
| `guest` | Visiteur non connecté | Pages publiques uniquement  |
| `user`  | Connecté              | Pages publiques + Dashboard |
| `admin` | Administrateur        | Tout + page Admin exclusive |

### Méthodes prévues

- **Inscription classique** : nom d'utilisateur + mot de passe (bcrypt)
- **Google OAuth** : via Socialite

## 🚀 Commandes Utiles

```bash
# Lancer Laravel + Vite simultanément (recommandé)
npm run start

# Ou séparément :
php artisan serve   # Laravel → http://127.0.0.1:8000
npm run dev         # Vite   → hot-reload CSS/JS

# Build production
npm run build

# Lancer les tests
php artisan test --compact

# Formater le code PHP
vendor/bin/pint --dirty
```

> **Note importante** : `npm run dev` démarre uniquement Vite (le bundler CSS/JS).
> Pour voir l'app, il faut toujours accéder au port **8000** (`php artisan serve`).
> `npm run start` lance les deux en même temps via `concurrently`.

## 🤖 Instructions pour Claude

### Processus de développement

1. **Analyser** : Comprendre la demande et son impact sur l'existant
2. **Proposer un plan** : Fichiers à créer/modifier, ordre d'implémentation
3. **Attendre validation** : Ne pas coder avant validation
4. **Implémenter** : Étape par étape
5. **Tester** : `php artisan test --compact`
6. **Formater** : `vendor/bin/pint --dirty`
7. **Mettre à jour CLAUDE.md** : Si l'architecture change

### Conventions

- **Pages** : `resources/views/pages/` — une vue par page
- **Composants** : `resources/views/components/[catégorie]/[nom].blade.php`
- **Layouts** : `resources/views/layouts/` — structure HTML globale
- **Routes** : toujours nommées, préférer `route()` à `url()`
- **Vues Blade** : kebab-case (`home.blade.php`, `navbar.blade.php`)
- **Classes PHP** : PascalCase (`PageController.php`)

### Communication

- Toujours vérifier les fichiers existants avant de modifier
- Respecter la structure de dossiers établie
- Ne jamais supprimer de tests sans approbation explicite

## 📊 État de l'Implémentation

### ✅ Complété

- Thème GitHub Dark/Light via variables CSS + toggle persisté
- Layout principal (`layouts/app.blade.php`) avec composants Blade
- Composants : `<x-layout.navbar>`, `<x-layout.footer>`, `<x-ui.button>`
- Page Home (hero identique au React template)
- Page Laravel (welcome page originale stylisée)
- Routes nommées (`home`, `laravel`) via `PageController`
- Script `npm run start` (Laravel + Vite via concurrently)
- README.md avec guide d'installation complet
- Base SQLite initialisée avec migrations

### 🔄 À Faire

- [ ] Authentification (Login / Register / Logout)
- [ ] Google OAuth via Socialite
- [ ] Système de rôles (`user` / `admin`)
- [ ] Page Dashboard (protégée, auth)
- [ ] Page Admin (protégée, rôle admin)
- [ ] Composant `<x-shared.avatar>`
- [ ] Composant `<x-ui.input>` et `<x-ui.form-field>`
- [ ] Migrations production (PostgreSQL)
- [ ] Tests Feature pour les routes publiques
- [ ] CI/CD GitHub Actions
