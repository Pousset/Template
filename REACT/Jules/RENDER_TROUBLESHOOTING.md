# 🚨 Render Deployment Troubleshooting

## Erreur: "npm error could not determine executable to run"

### Cause

Cette erreur se produit quand Render essaie de démarrer l'application mais ne trouve pas les fichiers compilés dans le dossier `dist/`.

### Solutions

#### Solution 1 : Vérifier le Root Directory (RECOMMANDÉ)

Dans le dashboard Render :

1. Aller dans **Settings** de votre service
2. Trouver la section **Root Directory**
3. S'assurer qu'elle est définie à : `backend`
4. Sauvegarder et redéployer

#### Solution 2 : Utiliser render.yaml à la racine

J'ai créé un fichier `render.yaml` à la racine du projet qui configure automatiquement le `rootDir: backend`.

**Pour l'utiliser :**

1. Dans Render, supprimer le service existant
2. Créer un nouveau service
3. Sélectionner "Blueprint"
4. Render détectera automatiquement le `render.yaml`

#### Solution 3 : Vérifier que le build s'est bien passé

Dans les logs Render, vérifiez :

```bash
# Le build doit afficher :
✔ Successfully compiled
✔ Build completed

# Vérifier que dist/main.js existe
ls dist/
```

Si le build échoue, c'est probablement parce que :

- Le Root Directory n'est pas configuré
- Les dépendances ne sont pas installées correctement

### Commandes de débogage

Si vous avez accès au shell Render :

```bash
# Vérifier la structure
pwd
ls -la

# Vérifier que dist existe
ls -la dist/

# Vérifier que main.js existe
ls -la dist/main.js

# Tester le start manuellement
node dist/main
```

---

## Configuration Render recommandée

### Via Dashboard (Manuel)

```
Name: nomProjet-backend
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

### Via render.yaml (Automatique)

Le fichier `render.yaml` à la racine configure automatiquement :

- rootDir: backend
- buildCommand
- startCommand
- envVars
- database

**Avantage** : Configuration versionnée avec votre code.

---

## Checklist de vérification

- [ ] Root Directory est défini à `backend` dans Render
- [ ] Build Command : `npm install && npm run build`
- [ ] Start Command : `npm run start:prod`
- [ ] Le build se termine sans erreur
- [ ] Le dossier `dist/` contient `main.js`
- [ ] Les variables d'environnement sont définies (NODE_ENV, PORT, DATABASE_URL)

---

## Ordre de déploiement

1. **Database** : Créer d'abord la base PostgreSQL
2. **Backend** : Configurer avec DATABASE_URL de la base
3. **Frontend** : Configurer avec l'URL du backend

⚠️ **Important** : Ne pas oublier de mettre à jour FRONTEND_URL dans les variables d'environnement du backend après le déploiement du frontend !
