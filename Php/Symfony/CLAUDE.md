# CLAUDE.md — PHP / Symfony Template

## Présentation

Template Symfony 8 avec authentification complète (e-mail **ou** nom d'utilisateur),
espace admin, dashboard, et thème GitHub dark/light.

---

## Stack technique

| Composant | Version |
|---|---|
| PHP | 8.4 |
| Symfony | 8.1 |
| Doctrine ORM | ^3.2 |
| PostgreSQL | 16 |
| Twig | ^3 |

---

## Architecture

```
src/
├── Command/
│   └── SeedCommand.php          ← php bin/console app:seed
├── Controller/
│   ├── HomeController.php       ← GET /
│   ├── SecurityController.php   ← GET /login, GET /logout
│   ├── RegistrationController.php ← GET|POST /register
│   ├── DashboardController.php  ← GET /dashboard  [ROLE_USER]
│   └── AdminController.php      ← GET /admin       [ROLE_ADMIN]
├── Entity/
│   └── User.php                 ← entité Doctrine
├── Repository/
│   └── UserRepository.php
└── Security/
    └── LoginFormAuthenticator.php  ← login email OU username
```

---

## Authentification

- **Login** : accepte l'e-mail **ou** le nom d'utilisateur.  
  Le champ est détecté via `filter_var($login, FILTER_VALIDATE_EMAIL)`.
- **Roles** : `ROLE_USER` (tous) / `ROLE_ADMIN`
- **CSRF** : tokens sur le formulaire de login et d'inscription
- **Remember me** : cookie 7 jours

## Comptes de test

| Rôle | E-mail | Username | Mot de passe |
|---|---|---|---|
| Admin | admin1@template.com | admin1 | `admin` |
| Admin | admin2@template.com | admin2 | `admin` |
| Admin | admin3@template.com | admin3 | `admin` |
| User | user1@template.com | user1 | `password` |
| … | user2–10@template.com | user2–10 | `password` |

---

## Commandes utiles

```bash
# Migrations
php bin/console doctrine:migrations:migrate

# Générer une migration depuis les entités
php bin/console doctrine:migrations:diff

# Peupler la base
php bin/console app:seed

# Vider le cache
php bin/console cache:clear

# Lister les routes
php bin/console debug:router
```

---

## Conventions de code

- PSR-4 : namespace `App\` → `src/`
- Entités Doctrine avec attributs PHP 8 (`#[ORM\Entity]`, etc.)
- Controllers étendent `AbstractController`
- Routes via attributs `#[Route(...)]`
- Autorisation via `#[IsGranted('ROLE_...')]` sur les controllers
- Pas de FormType Symfony pour garder le code lisible — formulaires HTML directs avec validation manuelle en controller
