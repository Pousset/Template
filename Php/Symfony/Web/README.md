# Symfony Web Template

Template web Symfony structure pour demarrer un projet avec authentification, espace admin et calendrier exemple.

## Stack

| Couche | Technologies |
| --- | --- |
| Backend web | Symfony 7, PHP 8.3 |
| UI | Twig, CSS vanilla inspire du template React |
| Base de donnees | SQLite en local, PostgreSQL en production |
| Auth | Symfony Security, formulaire login/register, roles |
| Exemple metier | Calendrier d'evenements |

## Architecture

Le template suit une organisation par domaine pour rester lisible quand le projet grandit.

```text
Php/Symfony/Web/
+-- assets/styles/                 # CSS applicatif
+-- config/                        # Configuration Symfony
+-- public/                        # Front controller
+-- src/
|   +-- Auth/                      # Authentification et securite
|   +-- Calendar/                  # Domaine exemple calendrier
|   +-- Dashboard/                 # Espace connecte/admin
|   +-- Shared/                    # Briques transverses
|   +-- User/                      # Utilisateurs et roles
+-- templates/                     # Layout Twig et pages
+-- migrations/                    # Migrations Doctrine
+-- tests/                         # Tests
```

## Demarrage

```bash
composer install
cp .env.example .env
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
symfony server:start
```

URL locale par defaut : http://localhost:8000

## Demarrage avec le PHP portable du repo

Si PHP et Composer ne sont pas installes globalement, ce repo peut utiliser les outils portables places dans `.tools/`.

```powershell
cd Php/Symfony/Web
..\..\..\.tools\php\php.exe ..\..\..\.tools\composer.phar install
..\..\..\.tools\php\php.exe bin\console doctrine:migrations:migrate
..\..\..\.tools\php\php.exe -S 127.0.0.1:8000 -t public public/router.php
```

Les memes commandes sont disponibles via npm :

```powershell
npm run setup
npm run dev
npm run lint
npm run test
```

Commandes de verification :

```powershell
..\..\..\.tools\php\php.exe bin\console about
..\..\..\.tools\php\php.exe bin\console doctrine:schema:validate
..\..\..\.tools\php\php.exe bin\console lint:twig templates
..\..\..\.tools\php\php.exe bin\console lint:container
..\..\..\.tools\php\php.exe ..\..\..\.tools\composer.phar audit
```

## Comptes et roles

- `ROLE_USER` : acces au dashboard et au calendrier.
- `ROLE_ADMIN` : acces a l'espace admin.

Le formulaire d'inscription cree un utilisateur standard. Le premier admin peut etre promu via une fixture, une commande ou une mise a jour en base selon le besoin du projet final.
