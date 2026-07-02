# PHP / Symfony Template

Template Symfony 8 avec authentification (e-mail **ou** nom d'utilisateur), dashboard utilisateur et espace admin.

---

## Lancement avec Docker

```bash
# Depuis la racine du monorepo
docker compose up -d

# Ou rebuild complet
npm run docker:rebuild:symfony
```

L'application est disponible sur **http://127.0.0.1:8080**

---

## Comptes de test

| Rôle | E-mail | Nom d'utilisateur | Mot de passe |
|---|---|---|---|
| Admin | admin1@template.com | admin1 | `admin` |
| Utilisateur | user1@template.com | user1 | `password` |

> Connexion acceptée avec l'**e-mail** ou le **nom d'utilisateur**.

---

## Stack

- **Symfony 8.1** — PHP 8.4
- **Doctrine ORM 3** + migrations
- **PostgreSQL 16** (port `5434` sur l'hôte)
- **Twig 3** — templates
- Thème **GitHub dark/light** — basculement côté client

---

## Structure

```
Php/Symfony/
├── Dockerfile
├── composer.json
├── .env / .env.example
├── migrations/         ← migrations Doctrine
├── public/
│   ├── index.php       ← point d'entrée web
│   └── styles/app.css  ← CSS GitHub dark/light
├── src/
│   ├── Command/        ← app:seed
│   ├── Controller/     ← Home, Security, Registration, Dashboard, Admin
│   ├── Entity/         ← User
│   ├── Repository/     ← UserRepository
│   └── Security/       ← LoginFormAuthenticator
└── templates/
    ├── base.html.twig
    ├── home.html.twig
    ├── security/login.html.twig
    ├── registration/register.html.twig
    ├── dashboard/index.html.twig
    └── admin/index.html.twig
```

---

## Développement local (sans Docker)

```bash
cd Php/Symfony

# Configurer la DB locale dans .env.local
echo 'DATABASE_URL="postgresql://user:pass@127.0.0.1:5434/app"' > .env.local

# Installer les dépendances PHP
composer install

# Migrations + seed
php bin/console doctrine:migrations:migrate
php bin/console app:seed

# Serveur de développement
php -S 127.0.0.1:8080 -t public public/index.php
```

---

## Reset base de données

```bash
# Via Docker (depuis la racine)
npm run symfony:db:reset

# Manuellement dans le conteneur
docker compose exec symfony php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec symfony php bin/console app:seed
```
