# 🔗 Guide : Connecter GitHub à Vercel et Render

## ⚠️ Important

Vous N'AVEZ PAS BESOIN de `sudo` ou de privilèges administrateur !
Tout se fait via l'interface web de GitHub, Vercel et Render.

---

## 📦 Étape 1 : Créer le Repository GitHub (Via le site web)

### Option A : Via l'interface GitHub (RECOMMANDÉ)

1. **Aller sur GitHub.com**
   - Se connecter à votre compte : https://github.com

2. **Créer un nouveau repository**
   - Cliquer sur le `+` en haut à droite → "New repository"
   - Nom : `nomProjet` (ou ce que vous voulez)
   - Description : "Application de buzzer en temps réel"
   - Visibilité : **Public** (obligatoire pour le plan gratuit Render)
   - ❌ Ne pas cocher "Add README" (on a déjà le code)
   - Cliquer "Create repository"

3. **Copier l'URL du repository**
   - GitHub vous montrera une page avec des commandes
   - Copier l'URL HTTPS : `https://github.com/VOTRE_USERNAME/nomProjet.git`

### Option B : Via GitHub Desktop (Alternative sans ligne de commande)

1. **Télécharger GitHub Desktop**
   - https://desktop.github.com/
   - Installer et se connecter avec votre compte GitHub

2. **Ajouter votre projet**
   - File → Add Local Repository
   - Sélectionner : `C:\Users\tonol\OneDrive\Desktop\Buzzer`
   - Cliquer "Add Repository"

3. **Publier sur GitHub**
   - Cliquer "Publish repository" en haut
   - Nom : `nomProjet`
   - ✅ Cocher "Public"
   - Cliquer "Publish Repository"

---

## 💻 Étape 2 : Pousser le code (Choisir UNE méthode)

### Méthode 1 : Via GitHub Desktop (PLUS SIMPLE)

Si vous avez installé GitHub Desktop à l'étape précédente :

1. **Vérifier les changements**
   - GitHub Desktop montre tous les fichiers modifiés
   - Cocher tous les fichiers à inclure

2. **Commit**
   - En bas à gauche, écrire : "Ready for deployment"
   - Cliquer "Commit to main"

3. **Push**
   - Cliquer "Push origin" en haut
   - Attendre que ce soit terminé

✅ **C'est tout !** Pas besoin de ligne de commande.

### Méthode 2 : Via PowerShell (Si vous préférez)

```powershell
# Se placer dans le dossier du projet
cd C:\Users\tonol\OneDrive\Desktop\Buzzer

# Vérifier que Git est installé
git --version
# Si erreur "commande introuvable", installer Git : https://git-scm.com/download/win

# Initialiser Git (si pas déjà fait)
git init

# Configurer Git (première fois seulement)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "Ready for deployment"

# Lier au repository GitHub (remplacer par VOTRE URL)
git remote add origin https://github.com/VOTRE_USERNAME/nomProjet.git

# Pousser le code
git branch -M main
git push -u origin main
```

⚠️ **Si Git demande un mot de passe** :

- Depuis 2021, GitHub n'accepte plus les mots de passe classiques
- Utilisez un **Personal Access Token** :
  1. GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token (classic)
  3. Cocher : `repo` (tous les sous-items)
  4. Générer et COPIER le token (vous ne le reverrez plus !)
  5. Utiliser ce token comme mot de passe dans Git

---

## 🚀 Étape 3 : Connecter à Vercel (Via le site web)

### 3.1 Créer un compte Vercel

1. Aller sur https://vercel.com
2. Cliquer "Sign Up"
3. **Choisir "Continue with GitHub"**
4. Autoriser Vercel à accéder à vos repos GitHub

### 3.2 Importer le projet

1. Sur Vercel Dashboard, cliquer "Add New..." → "Project"
2. Vous verrez la liste de vos repos GitHub
3. Trouver `nomProjet` et cliquer "Import"
4. Configurer :
   - **Root Directory** : Cliquer "Edit" → Sélectionner `frontend`
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `dist` (par défaut)

5. **Environment Variables**
   - Cliquer "Add"
   - Key : `VITE_API_URL`
   - Value : `https://votre-backend.onrender.com` (on mettra ça à jour après)

6. Cliquer "Deploy"
7. ⏱️ Attendre 2-3 minutes
8. ✅ Copier l'URL : `https://nomProjet-xxx.vercel.app`

---

## 🔧 Étape 4 : Connecter à Render (Via le site web)

### 4.1 Créer un compte Render

1. Aller sur https://render.com
2. Cliquer "Get Started"
3. **Choisir "Sign up with GitHub"**
4. Autoriser Render à accéder à vos repos GitHub

### 4.2 Créer la base de données PostgreSQL

1. Sur Render Dashboard, cliquer "New +" → "PostgreSQL"
2. Configurer :
   - **Name** : `nomProjet-db`
   - **Database** : `nomProjet`
   - **User** : `nomProjet`
   - **Region** : Frankfurt (Europe) ou Oregon (US)
   - **Plan** : Free
3. Cliquer "Create Database"
4. ⏱️ Attendre 1-2 minutes que la DB soit créée
5. **Copier "Internal Database URL"** (garder dans un bloc-notes)

### 4.3 Créer le Web Service (Backend)

1. Sur Render Dashboard, cliquer "New +" → "Web Service"
2. Cliquer "Connect account" si besoin (autorisations GitHub)
3. Trouver `nomProjet` et cliquer "Connect"
4. Configurer :
   - **Name** : `nomProjet-backend`
   - **Region** : Frankfurt (même que la DB)
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start:prod`
   - **Plan** : Free

5. **Environment Variables** (cliquer "Add Environment Variable") :

   ```
   NODE_ENV = production
   PORT = 10000
   DATABASE_URL = [Coller l'URL PostgreSQL copiée à l'étape 4.2]
   FRONTEND_URL = https://nomProjet-xxx.vercel.app [L'URL Vercel copiée à l'étape 3]
   ```

6. Cliquer "Create Web Service"
7. ⏱️ Attendre 5-8 minutes pour le premier déploiement
8. ✅ Copier l'URL : `https://nomProjet-backend.onrender.com`

---

## 🔄 Étape 5 : Finaliser la configuration

### 5.1 Mettre à jour Vercel avec l'URL backend

1. Retour sur Vercel Dashboard
2. Cliquer sur votre projet `nomProjet`
3. Settings → Environment Variables
4. Trouver `VITE_API_URL`
5. Cliquer "Edit"
6. Remplacer par : `https://nomProjet-backend.onrender.com`
7. Sauvegarder
8. Aller dans "Deployments" → Cliquer "..." sur le dernier → "Redeploy"

### 5.2 Tester l'application

1. Ouvrir `https://nomProjet-xxx.vercel.app`
2. Tester :
   - ✅ Page d'accueil s'affiche
   - ✅ Créer une partie
   - ✅ Copier le lien et ouvrir dans un autre onglet
   - ✅ Rejoindre la partie
   - ✅ Tester le buzzer

---

## ❌ Erreurs Communes et Solutions

### Problème 1 : "Sudo authentication failed"

**Cause** : Vous essayez d'utiliser une commande qui nécessite des droits admin.

**Solution** :

- ❌ Ne pas utiliser `sudo` sous Windows
- ✅ Utiliser GitHub Desktop (interface graphique)
- ✅ Ou exécuter PowerShell en mode normal (pas admin)

### Problème 2 : Git n'est pas installé

**Erreur** : `git : The term 'git' is not recognized`

**Solution** :

1. Télécharger Git : https://git-scm.com/download/win
2. Installer avec les options par défaut
3. Redémarrer PowerShell
4. Vérifier : `git --version`

### Problème 3 : GitHub demande un mot de passe

**Erreur** : `remote: Support for password authentication was removed`

**Solution** :

1. Créer un Personal Access Token (voir Étape 2, Méthode 2)
2. Ou utiliser GitHub Desktop (plus simple)

### Problème 4 : Render ne trouve pas le repo

**Cause** : Le repository est privé

**Solution** :

1. Sur GitHub.com → Votre repo → Settings
2. Tout en bas : "Change visibility"
3. Cliquer "Change to public"

### Problème 5 : CORS errors dans l'application

**Cause** : `FRONTEND_URL` mal configuré dans Render

**Solution** :

1. Vérifier que l'URL est exacte (pas de `/` à la fin)
2. Render → Environment → Edit → Sauvegarder
3. Attendre redéploiement automatique

---

## 📱 Captures d'écran utiles

Si vous bloquez sur une étape spécifique, je peux vous guider avec des instructions plus détaillées pour cette étape en particulier !

---

## ✅ Checklist finale

- [ ] Repository GitHub créé et code poussé
- [ ] Vercel connecté à GitHub
- [ ] Frontend déployé sur Vercel avec `VITE_API_URL`
- [ ] Render connecté à GitHub
- [ ] Base PostgreSQL créée sur Render
- [ ] Backend déployé sur Render avec toutes les env vars
- [ ] `FRONTEND_URL` mis à jour dans Render
- [ ] `VITE_API_URL` mis à jour dans Vercel
- [ ] Application testée et fonctionnelle

---

Besoin d'aide sur une étape particulière ? Dites-moi où vous bloquez exactement !
