# Quick Deploy Checklist ✅

## 📦 Fichiers créés pour le déploiement

- ✅ `backend/render.yaml` - Configuration Render
- ✅ `backend/.env.production.example` - Template variables backend
- ✅ `backend/src/config/database.config.ts` - Config PostgreSQL améliorée
- ✅ `frontend/vercel.json` - Configuration Vercel
- ✅ `frontend/.env.production.example` - Template variables frontend
- ✅ `DEPLOYMENT.md` - Guide complet de déploiement
- ✅ `.gitignore` - Mis à jour pour exclure les fichiers sensibles

## 🚀 Étapes Rapides

### 1️⃣ GitHub (5 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ Render - Backend (10 min)
1. Créer compte sur https://render.com
2. New Web Service → Lier GitHub repo
3. Root Directory: `backend`
4. Build: `npm install && npm run build`
5. Start: `npm run start:prod`
6. Créer PostgreSQL database
7. Configurer variables d'environnement :
   - `NODE_ENV=production`
   - `DATABASE_URL=<postgres_url>`
   - `FRONTEND_URL=<vercel_url>` (temporaire)

### 3️⃣ Vercel - Frontend (5 min)
1. Créer compte sur https://vercel.com
2. Import GitHub repo
3. Root Directory: `frontend`
4. Framework: Vite
5. Variable d'environnement :
   - `VITE_API_URL=<render_backend_url>`

### 4️⃣ Finalisation (2 min)
1. Retour sur Render → Mettre à jour `FRONTEND_URL` avec l'URL Vercel
2. Tester l'application !

## 🔗 URLs à sauvegarder
- Frontend: `https://[votre-app].vercel.app`
- Backend: `https://[votre-backend].onrender.com`

## ⚠️ Important
- Le backend Render s'endort après 15 min → premier appel lent (~30s)
- Ne jamais commit `.env` avec secrets
- CORS doit être correctement configuré

## 📖 Documentation complète
Voir `DEPLOYMENT.md` pour le guide détaillé.
