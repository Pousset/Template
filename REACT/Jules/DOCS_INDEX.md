# 📚 Documentation Index - Buzzer Application

Bienvenue dans la documentation de l'application Buzzer ! 🔔

## 📖 Fichiers de documentation

### 🚀 [QUICK_START.md](./QUICK_START.md) - **COMMENCER ICI**
**Pour:** Démarrer rapidement en 30 secondes  
**Contient:**
- Instructions de démarrage simple
- Checklist de vérification
- Commandes de test rapides
- Tableau de dépannage

**Durée:** 5 min max ⏱️

---

### 📋 [TESTING.md](./TESTING.md) - Guide complet des tests
**Pour:** Tester en détail tous les aspects  
**Contient:**
- Guide d'installation complet
- Tests API avec cURL
- Tests du frontend
- Dépannage détaillé
- Commandes par composant

**Durée:** 15 min 📖

---

### 🔧 [TEST_TOOLS.md](./TEST_TOOLS.md) - Outils et utilitaires de test
**Pour:** Utiliser les outils de diagnostique  
**Contient:**
- Documentation de `test-helper.js`
- Hook `useDiagnostics`
- Composant `Diagnostics`
- Exemples d'utilisation

**Durée:** 10 min 🛠️

---

### 📄 [README.md](./README.md) - Vue d'ensemble du projet
**Pour:** Comprendre la structure générale  
**Contient:**
- Structure du projet
- Technologies utilisées
- Dossiers du backend et du frontend
- Commandes disponibles
- Prochaines étapes

**Durée:** 5 min 📌

---

## 🎯 Parcours recommandé

### 1️⃣ Première fois ? 
```
QUICK_START.md → Vérifier que tout fonctionne → TEST_TOOLS.md
```

### 2️⃣ Besoin de détails ?
```
QUICK_START.md → TESTING.md → Consulter la source
```

### 3️⃣ Comprendre le projet ?
```
README.md → Explorer les dossiers src/ → Lire le code
```

### 4️⃣ Développer une feature ?
```
TESTING.md → Lancer avec `npm run start:dev` → Développer
```

---

## 🚀 Commandes rapides

### Démarrer
```bash
# Terminal 1
cd backend && npm install && npm run start:dev

# Terminal 2
cd frontend && npm install && npm run dev
```

### URLs
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`
- Health Check: `http://localhost:3000/health`

### Tests console
1. `F12` pour ouvrir la console du navigateur
2. `checkHealth()` pour vérifier le serveur
3. `createTestSession('Admin')` pour créer une session
4. `sendBuzz()` pour tester le buzz

---

## 📊 Structure du projet

```
Buzzer/
├── 📖 Documentation
│   ├── README.md          ← Vue d'ensemble
│   ├── QUICK_START.md     ← Démarrage rapide ⭐
│   ├── TESTING.md         ← Tests complets
│   ├── TEST_TOOLS.md      ← Outils de test
│   └── DOCS_INDEX.md      ← Ce fichier
│
├── 🔙 Backend (NestJS + TypeScript)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── modules/
│   │       ├── session/
│   │       ├── player/
│   │       └── game/
│   ├── package.json
│   ├── .env
│   └── tsconfig.json
│
├── 🎨 Frontend (React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── 🚀 Scripts
│   ├── start.bat          ← Windows
│   ├── start.ps1          ← PowerShell
│   └── public/
│       └── test-helper.js ← Console de test
```

---

## 🔍 Points clés

### Backend
- ✅ NestJS pour l'API
- ✅ TypeScript pour la typage
- ✅ Socket.io pour WebSocket
- ✅ TypeORM pour la base de données
- ✅ Configuration CORS

### Frontend
- ✅ React 19 avec Hooks
- ✅ TypeScript pour la typage
- ✅ Tailwind CSS pour le style
- ✅ Vite pour le build rapide
- ✅ React Router pour la navigation
- ✅ Socket.io client pour WebSocket

---

## 🧪 Outils de test disponibles

### Console du navigateur (`test-helper.js`)
- `checkHealth()` - Vérifier le serveur
- `createTestSession(nom)` - Créer une session
- `joinSession(token, pseudo)` - Rejoindre
- `sendBuzz(token)` - Envoyer un buzz
- `sendReset(token)` - Envoyer un reset

### Hook React (`useDiagnostics`)
- Vérifie la santé du backend
- Vérifie l'accessibilité de l'API
- Vérifie la connexion WebSocket
- Retourne les temps de réponse et erreurs

### Composant React (`Diagnostics`)
- Widget en bas à droite de la page
- Affiche le statut de tous les systèmes
- Affiche les erreurs en temps réel

---

## ❓ FAQ Rapide

**Q: Comment démarrer rapidement ?**  
A: Suivez [QUICK_START.md](./QUICK_START.md) en 5 minutes.

**Q: Comment tester l'API ?**  
A: Consultez [TESTING.md](./TESTING.md) section "Tests API".

**Q: Comment utiliser les outils de test ?**  
A: Voir [TEST_TOOLS.md](./TEST_TOOLS.md) pour les détails.

**Q: Le backend ne démarre pas, pourquoi ?**  
A: Vérifiez [TESTING.md](./TESTING.md) - Dépannage.

**Q: Comment je développe une nouvelle feature ?**  
A: D'abord lancer avec `npm run start:dev`, puis modifier le code, les changements se chargent automatiquement.

---

## 📞 Besoin d'aide ?

1. **Démarrage ?** → Consultez [QUICK_START.md](./QUICK_START.md)
2. **Tests ?** → Consultez [TESTING.md](./TESTING.md)
3. **Erreurs ?** → Section "Dépannage" de [TESTING.md](./TESTING.md)
4. **Outils ?** → Consultez [TEST_TOOLS.md](./TEST_TOOLS.md)

---

**Bonne chance et amusez-vous bien avec Buzzer ! 🚀🔔**

Dernière mise à jour: 23 janvier 2026
