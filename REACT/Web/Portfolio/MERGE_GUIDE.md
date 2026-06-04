# 🔀 Guide : Merger develop dans main via Pull Request

## Étape 1 : Vérifier l'état actuel

```bash
# Voir sur quelle branche vous êtes
git branch

# Voir les fichiers modifiés
git status
```

## Étape 2 : Sauvegarder les fichiers non commités

```bash
# Commiter vos changements sur develop
git checkout develop
git add .
git commit -m "WIP: Save current work"

# Nettoyer les fichiers non trackés restants (build, cache, etc.)
git clean -fd
```

## Étape 3 : Pousser develop sur GitHub

```bash
git push origin develop
```

> C'est ce push qui rend vos changements visibles sur GitHub et permet de créer la Pull Request.

## Étape 4 : Créer la Pull Request sur GitHub.com

1. Aller sur votre repo GitHub
2. GitHub affiche une bannière **"Compare & pull request"** → cliquer dessus
   - Si la bannière n'apparaît pas : cliquer **"Pull requests"** → **"New pull request"**
3. Vérifier : Base `main` ← Compare `develop`
4. Donner un titre clair à votre PR
5. Cliquer **"Create pull request"**

## Étape 5 : Merger la Pull Request

1. Vérifier les changements affichés par GitHub
2. Cliquer **"Merge pull request"**
3. Cliquer **"Confirm merge"**

✅ La PR apparaît maintenant sur votre profil GitHub avec le carré violet 🟣

## Étape 6 : Resynchroniser develop en local ⚠️

> **C'est cette étape qui évite le message "This branch is X commits behind main".**

```bash
git checkout develop
git pull origin main
git push origin develop
```

---

## 🚨 Commandes de secours si ça se passe mal

### Annuler le merge en cours (en local)

```bash
git merge --abort
```

### Revenir en arrière après un merge

```bash
# Voir l'historique des commits
git log --oneline

# Revenir au commit précédent (ATTENTION : perte des changements non pushés)
git reset --hard HEAD~1
```

### Voir les différences avant de merger

```bash
git checkout main
git diff develop
```

---

## ✅ Checklist complète

- [ ] `.gitignore` à jour
- [ ] Tous les changements de develop sont commités
- [ ] develop pushée sur GitHub (`git push origin develop`)
- [ ] Pull Request créée sur GitHub.com
- [ ] Changements vérifiés dans la PR
- [ ] PR mergée ("Merge pull request")
- [ ] develop resynchronisée avec main (`git checkout develop && git pull origin main && git push origin develop`)

---

## 🎉 BRAVO VOUS AVEZ RÉUSSI !
