# Laravel Template

Template Laravel complet avec une UI inspirée du style **GitHub Dark/Light**. Conçu pour évoluer vers une application portfolio avec authentification, gestion de rôles et fonctionnalités avancées.

## Stack

- **PHP** 8.5 · **Laravel** 13 · **Tailwind CSS** 4
- **Vite** 8 · **Pest** 4 · **SQLite** (dev)

## Prérequis

- PHP 8.2+ avec les extensions : `openssl`, `fileinfo`, `mbstring`, `pdo_sqlite`, `zip`
- [Composer](https://getcomposer.org/)
- Node.js 18+ et npm

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Pousset/Template.git
cd Template/Php/Laravel
```

### 2. Installer les dépendances PHP

```bash
composer install
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Créer la base de données

```bash
touch database/database.sqlite   # ou : New-Item database/database.sqlite (PowerShell)
php artisan migrate
```

### 5. Installer les dépendances JS

```bash
npm install
```

### 6. Lancer le projet

```bash
# Les deux serveurs en même temps (recommandé)
npm run start

# Ou séparément :
php artisan serve   # Laravel → http://127.0.0.1:8000
npm run dev         # Vite   → hot-reload CSS/JS
```

Ouvre **http://127.0.0.1:8000** dans ton navigateur.

## Commandes utiles

```bash
npm run start          # Lance Laravel + Vite simultanément
npm run build          # Build CSS/JS pour la production
php artisan test --compact   # Lancer les tests
vendor/bin/pint --dirty      # Formater le code PHP
```

> **Note Windows :** `touch` n'existe pas en PowerShell, utilise `New-Item database/database.sqlite` à la place.

## Structure

```
resources/views/
├── layouts/app.blade.php          # Layout principal
├── components/
│   ├── layout/navbar.blade.php    # <x-layout.navbar />
│   ├── layout/footer.blade.php    # <x-layout.footer />
│   └── ui/button.blade.php        # <x-ui.button />
└── pages/
    ├── home.blade.php             # Page d'accueil
    └── laravel.blade.php          # Page Laravel
```

## Thème

Toggle Dark/Light intégré. La préférence est persistée dans `localStorage`. Le mode sombre est actif par défaut.

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
