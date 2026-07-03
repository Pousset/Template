# Django Boilerplate

Projet Django de base, pensé comme template réutilisable pour des projets personnels.

## Stack

- Python 3.12
- Django 6.0
- SQLite (dev)
- `dj-database-url` — bascule facile vers PostgreSQL si besoin (voir [Base de données](#base-de-données))

## Structure du projet

```
monprojet/
├── config/              # réglages du projet
│   ├── settings.py
│   ├── urls.py          # routeur principal
│   ├── wsgi.py
│   └── asgi.py
├── core/                 # première app
│   ├── views.py          # vue de test (JSON)
│   ├── urls.py
│   ├── models.py
│   └── admin.py
├── manage.py
├── requirements.txt
└── .gitignore
```

## Prérequis

- Python 3.12+ installé et disponible dans le PATH (`python --version`)

## Installation

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Lancer le projet

```powershell
python manage.py migrate
python manage.py runserver
```

Le serveur est accessible sur **http://127.0.0.1:8000/**

| Route     | Description                               |
| --------- | ----------------------------------------- |
| `/`       | Vue de test, renvoie un JSON de bienvenue |
| `/admin/` | Interface d'administration Django         |

## Créer un compte administrateur

```powershell
python manage.py createsuperuser
```

## Base de données

Par défaut, le projet utilise SQLite (`db.sqlite3`), généré automatiquement par `migrate`.

Pour basculer sur PostgreSQL, définir la variable d'environnement `DATABASE_URL` avant de lancer le serveur :

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/nom_db"
python manage.py migrate
python manage.py runserver
```

Sans cette variable, le projet retombe automatiquement sur SQLite.

## Ajouter une nouvelle app

```powershell
python manage.py startapp nom_app
```

Puis :

1. Ajouter `'nom_app'` dans `INSTALLED_APPS` (`config/settings.py`)
2. Créer `nom_app/urls.py` avec ses routes
3. L'inclure dans `config/urls.py` : `path('nom_app/', include('nom_app.urls'))`

## Commandes utiles

```powershell
python manage.py makemigrations    # générer les migrations après modif des models
python manage.py migrate           # appliquer les migrations
python manage.py test              # lancer les tests
python manage.py shell             # shell Python avec le contexte Django chargé
```

## Docker

Non configuré pour le moment.
