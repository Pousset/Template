# 🔀 Guide : Merger develop dans main

## Étape 1 : Vérifier l'état actuel

```bash
# Voir sur quelle branche vous êtes
git branch

# Voir les fichiers modifiés
git status
```

## Étape 2 : Nettoyer les fichiers non suivis (IMPORTANT avant merge)

```bash
# Nettoyer les fichiers ignorés et non trackés
git clean -fd

# Si vous avez des fichiers modifiés à garder, les commit d'abord
git add .
git commit -m "WIP: Save current work"
```

## Étape 3 : Se positionner sur main

```bash
# Aller sur la branche main
git checkout main

# Mettre à jour main avec le remote (si vous avez pushé avant)
git pull origin main
```

## Étape 4 : Merger develop dans main

```bash
# Merger develop dans main
git merge develop
```

### Si vous avez des conflits :

Git vous dira quels fichiers ont des conflits. Pour chaque fichier :

1. **Ouvrir le fichier** avec les conflits
2. Chercher les marqueurs :
   ```
   <<<<<<< HEAD
   Code de main
   =======
   Code de develop
   >>>>>>> develop
   ```
3. **Choisir** quelle version garder (ou combiner les deux)
4. **Supprimer** les marqueurs (`<<<<<<<`, `=======`, `>>>>>>>`)
5. **Sauvegarder** le fichier

6. **Marquer comme résolu** :
   ```bash
   git add le-fichier-avec-conflit.ts
   ```

7. **Finaliser le merge** :
   ```bash
   git commit -m "Merge develop into main"
   ```

## Étape 5 : Pousser sur GitHub

```bash
# Pousser main
git push origin main

# Optionnel : pousser develop aussi si vous avez fait des commits
git checkout develop
git push origin develop
```

## 🚨 Commandes de secours si ça se passe mal

### Annuler le merge en cours
```bash
git merge --abort
```

### Revenir en arrière après un merge
```bash
# Voir l'historique des commits
git log --oneline

# Revenir au commit précédent (ATTENTION: perte des changements)
git reset --hard HEAD~1
```

### Voir les différences avant de merger
```bash
git checkout main
git diff develop
```

## ✅ Checklist complète

- [ ] `.gitignore` à jour (fait ✅)
- [ ] Tous les changements de develop sont commitéss
- [ ] Sur la branche main (`git checkout main`)
- [ ] Merge effectué (`git merge develop`)
- [ ] Conflits résolus (si présents)
- [ ] Tests passent (vérifier que l'app fonctionne)
- [ ] Push vers GitHub (`git push origin main`)

## 💡 Alternative : Merge via GitHub Pull Request (RECOMMANDÉ)

Si vous voulez être plus sûr et avoir une revue :

1. **Pousser develop** :
   ```bash
   git checkout develop
   git push origin develop
   ```

2. **Sur GitHub.com** :
   - Aller dans votre repo
   - Cliquer "Pull requests" → "New pull request"
   - Base: `main` ← Compare: `develop`
   - Cliquer "Create pull request"
   - Vérifier les changements
   - Cliquer "Merge pull request"

C'est plus sûr car GitHub montre tous les changements et conflits avant de merger !
