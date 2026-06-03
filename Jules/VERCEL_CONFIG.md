# 🚀 Configuration Vercel

## Variables d'environnement requises

Dans le dashboard Vercel, tu DOIS ajouter cette variable :

### Settings → Environment Variables

| Nom            | Valeur                             | Production | Preview | Development |
| -------------- | ---------------------------------- | ---------- | ------- | ----------- |
| `VITE_API_URL` | `https://ton-backend.onrender.com` | ✅         | ✅      | ✅          |

⚠️ **IMPORTANT** :

- Le nom doit être **exactement** `VITE_API_URL` (pas de faute de frappe)
- La valeur doit être l'URL **complète** de ton backend Render (avec https://)
- **SANS** slash à la fin (❌ pas de `/` final)
- Cocher les 3 cases : Production, Preview, Development

## Étapes pour configurer

### 1. Trouver l'URL de ton backend

Sur Render, copie l'URL de ton service backend, par exemple :

```
https://nomProjet-backend.onrender.com
```

### 2. Ajouter la variable sur Vercel

1. Va sur https://vercel.com
2. Clique sur ton projet
3. Va dans **Settings** → **Environment Variables**
4. Clique **Add**
5. Entre :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://nomProjet-backend.onrender.com` (ton URL)
   - Coche **Production**, **Preview**, **Development**
6. Clique **Save**

### 3. Redéployer

⚠️ **CRUCIAL** : Les variables Vite sont "compilées" au build !

Après avoir ajouté/modifié la variable :

1. Va dans **Deployments**
2. Clique sur les 3 points `...` du dernier déploiement
3. Clique **Redeploy**
4. Attends que le build se termine (~1-2 min)

## Vérification

### Dans les logs de build Vercel

Tu devrais voir :

```
✓ building for production...
VITE_API_URL: https://ton-backend.onrender.com
```

### Dans le navigateur (Console DevTools)

Ouvre la console et tape :

```javascript
console.log(import.meta.env.VITE_API_URL);
```

Tu devrais voir ton URL backend. Si tu vois `undefined` → La variable n'est pas définie ou le build n'a pas été refait.

## Problèmes courants

### ❌ La variable n'est pas prise en compte

**Cause** : Tu as ajouté la variable APRÈS le build

**Solution** : Redéploie le projet (Deployments → ... → Redeploy)

### ❌ "CORS error" ou "Failed to fetch"

**Cause** : L'URL backend est incorrecte ou le backend n'est pas démarré

**Solution** :

- Vérifie que l'URL est correcte (copie-colle depuis Render)
- Teste l'URL dans le navigateur : `https://ton-backend.onrender.com` doit répondre
- Vérifie que FRONTEND_URL est configuré dans Render avec l'URL Vercel

### ❌ "undefined" dans la console

**Cause** : Faute de frappe dans le nom de la variable

**Solution** : Vérifie que c'est bien `VITE_API_URL` (pas `VITE_API_URL_` ni `API_URL`)

## Configuration complète recommandée

### Sur Vercel (Frontend)

| Setting          | Valeur          |
| ---------------- | --------------- |
| Framework        | Vite            |
| Root Directory   | `frontend`      |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |
| Node Version     | 20.x            |

**Environment Variables** :

- `VITE_API_URL` = `https://ton-backend.onrender.com`

### Sur Render (Backend)

| Setting        | Valeur                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| Root Directory | `backend`                                                                  |
| Build Command  | `npm install --include=dev && npm run build && npm run migration:run:prod` |
| Start Command  | `npm run start:prod`                                                       |

**Environment Variables** :

- `NODE_ENV` = `production`
- `PORT` = `10000`
- `DATABASE_URL` = (auto depuis la base PostgreSQL)
- `FRONTEND_URL` = `https://ton-app.vercel.app`

## Ordre de configuration

1. ✅ Déployer le backend sur Render → Noter l'URL
2. ✅ Configurer VITE_API_URL sur Vercel avec l'URL backend
3. ✅ Déployer le frontend sur Vercel → Noter l'URL
4. ✅ Configurer FRONTEND_URL sur Render avec l'URL frontend
5. ✅ Redéployer le backend sur Render (pour prendre en compte le CORS)

---

## Commandes de diagnostic

Si ça ne marche toujours pas, ajoute temporairement ce code dans un composant :

```typescript
// Dans Lobby.tsx ou App.tsx
useEffect(() => {
  console.log("=== DIAGNOSTIC ===");
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  console.log("Mode:", import.meta.env.MODE);
  console.log("All env:", import.meta.env);
}, []);
```

Déploie et regarde la console du navigateur. Ça te dira exactement ce qui est configuré.
