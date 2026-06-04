# 🚀 Guide de Déploiement nomProjet

Ce guide vous aide à déployer nomProjet en production gratuitement.

## 📋 Prérequis

- Compte GitHub (pour héberger le code)
- Compte Render (https://render.com) - pour le backend
- Compte Vercel (https://vercel.com) - pour le frontend

---

## 🗂️ Étape 1 : Préparer le Repository GitHub

### 1.1 Créer un repo GitHub

```bash
cd c:\Users\tonol\OneDrive\Desktop\Buzzer

# Initialiser git si pas déjà fait
git init
git add .
git commit -m "Initial commit - nomProjet ready for deployment"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/nomProjet.git
git branch -M main
git push -u origin main
```

### 1.2 Créer un fichier .gitignore (si pas existant)

Assurez-vous que `.gitignore` contient :

```
node_modules/
dist/
.env
.env.local
*.sqlite
.DS_Store
```

---

## 🔧 Étape 2 : Déployer le Backend sur Render

### 2.1 Créer le service

1. Aller sur https://render.com
2. Cliquer sur "New +" → "Web Service"
3. Connecter votre repo GitHub
4. Sélectionner le repo `nomprojet`
5. Configurer :
   - **Name** : `nomProjet-backend`
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : `npm install --include=dev && npm run build && npm run migration:run:prod`
   - **Start Command** : `npm run start:prod`
   - **Plan** : Free

### 2.2 Créer la base de données PostgreSQL

1. Dans Render Dashboard, cliquer "New +" → "PostgreSQL"
2. Configurer :
   - **Name** : `nomProjet-db`
   - **Database** : `nomProjet`
   - **User** : `nomProjet`
   - **Plan** : Free
3. Cliquer "Create Database"
4. **Copier l'URL de connexion** (Internal Database URL)

### 2.3 Configurer les variables d'environnement

Dans votre service backend Render :

1. Aller dans "Environment" tab
2. Ajouter ces variables :

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgres://user:password@host/database (coller l'URL copiée)
FRONTEND_URL=https://votre-app.vercel.app (sera mis à jour après le déploiement frontend)
```

### 2.4 Déployer

1. Cliquer "Manual Deploy" → "Deploy latest commit"
2. Attendre la fin du build (~5 minutes)
3. **Noter l'URL** : `https://nomProjet-backend.onrender.com`

⚠️ **Important** : Le service gratuit de Render s'endort après 15 min d'inactivité. Le premier appel après réveil prend ~30 secondes.

---

## 🎨 Étape 3 : Déployer le Frontend sur Vercel

### 3.1 Créer le projet

1. Aller sur https://vercel.com
2. Cliquer "Add New..." → "Project"
3. Importer votre repo GitHub `nomProjet`
4. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### 3.2 Configurer les variables d'environnement

Dans Vercel, aller dans "Settings" → "Environment Variables" :

```
VITE_API_URL=https://nomProjet-backend.onrender.com
```

⚠️ Remplacer par votre vraie URL backend de l'étape 2.4

### 3.3 Déployer

1. Cliquer "Deploy"
2. Attendre le build (~2 minutes)
3. **Noter l'URL** : `https://nomProjet-xxx.vercel.app`

---

## 🔄 Étape 4 : Finaliser la Configuration

### 4.1 Mettre à jour CORS dans le backend

Retourner sur Render :

1. Aller dans votre service backend
2. Modifier la variable `FRONTEND_URL` avec l'URL Vercel obtenue :
   ```
   FRONTEND_URL=https://nomProjet-xxx.vercel.app
   ```
3. Sauvegarder (redéploiement automatique)

### 4.2 Vérifier la connexion

Ouvrir votre app : `https://nomProjet-xxx.vercel.app`

✅ **Checklist** :

- [ ] Page d'accueil s'affiche
- [ ] Créer une partie fonctionne
- [ ] Rejoindre une partie fonctionne
- [ ] Buzzer temps réel fonctionne
- [ ] Avatars personnalisés fonctionnent

---

## 🐛 Dépannage

### Le backend ne répond pas

1. Vérifier les logs Render : Dashboard → votre service → "Logs"
2. Vérifier que `DATABASE_URL` est correcte
3. Redéployer manuellement

### CORS errors dans le frontend

1. Vérifier que `FRONTEND_URL` dans le backend correspond exactement à l'URL Vercel
2. Pas de `/` à la fin de l'URL

### Database errors

1. Vérifier que la DB Render est bien "Available"
2. Vérifier que `DATABASE_URL` contient le bon mot de passe
3. Dans les logs, chercher "TypeORM" errors

### Socket.io ne se connecte pas

1. Ouvrir les DevTools (F12) → Console
2. Chercher les erreurs WebSocket
3. Vérifier que `VITE_API_URL` pointe vers le bon backend

---

## 🔄 Mises à jour futures

Pour déployer de nouvelles versions :

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

- **Vercel** : Redéploie automatiquement
- **Render** : Redéploie automatiquement

---

## 📊 Monitoring

### Backend (Render)

- Dashboard : https://dashboard.render.com
- Logs en temps réel disponibles
- Métriques gratuites limitées

### Frontend (Vercel)

- Dashboard : https://vercel.com/dashboard
- Analytics disponibles
- Logs de déploiement

---

## 💰 Limites du plan gratuit

### Render

- ⏱️ Service s'endort après 15 min d'inactivité
- 🔄 750 heures/mois (suffisant pour un projet perso)
- 💾 1 GB RAM

### Vercel

- 🚀 100 GB bande passante/mois
- ⚡ Build time illimité
- 🌍 CDN global

---

## 🎯 URLs Finales

Après déploiement, notez vos URLs :

- **Frontend** : https://nomProjet-xxx.vercel.app
- **Backend** : https://nomProjet-backend.onrender.com
- **Database** : (géré par Render)

---

## 🔐 Sécurité

⚠️ **JAMAIS** committer les fichiers `.env` !

Les variables sensibles sont :

- `DATABASE_URL` (contient le mot de passe DB)
- Toutes les clés API futures

---

Bon déploiement ! 🚀
