# 🔔 START HERE - Buzzer Application

## ⚡ 30 secondes pour commencer

### 1. Ouvrir 2 terminaux

**Terminal 1:**
```bash
cd backend && npm install && npm run start:dev
```

**Terminal 2:**
```bash
cd frontend && npm install && npm run dev
```

### 2. Vérifier que tout fonctionne

- Backend: http://localhost:3000/health (doit afficher `{ "status": "ok" }`)
- Frontend: http://localhost:3001 (doit charger la page)

### 3. Tester dans la console navigateur

Appuyer sur `F12` et exécuter:

```javascript
checkHealth()              // Vérifier le serveur
createTestSession('Admin') // Créer une session
joinSession()              // Rejoindre
sendBuzz()                 // Tester le buzz
```

---

## 📖 Documentation

**Peu importe ce que vous cherchez, lisez dans cet ordre:**

1. **Vous commencez maintenant ?** → [QUICK_START.md](./QUICK_START.md)
2. **Besoin de tests complets ?** → [TESTING.md](./TESTING.md)
3. **Besoin des outils ?** → [TEST_TOOLS.md](./TEST_TOOLS.md)
4. **Résumé de ce qui a été fait ?** → [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
5. **Index de la doc** → [DOCS_INDEX.md](./DOCS_INDEX.md)

---

## 🎯 Status

✅ **Backend:** NestJS + TypeScript + Socket.io  
✅ **Frontend:** React + TypeScript + Tailwind + Vite  
✅ **Communication:** HTTP REST + WebSocket  
✅ **Documentation:** Complète avec exemples  
✅ **Outils de test:** Console + Diagnostique  

**Status global: 🟢 PRÊT À TESTER**

---

## 🚀 Commandes principales

```bash
# Backend
cd backend && npm run start:dev     # Mode développement
cd backend && npm run build          # Build production

# Frontend
cd frontend && npm run dev           # Mode développement
cd frontend && npm run build         # Build production

# Tout ensemble (PowerShell)
.\start.ps1

# Tout ensemble (Batch)
start.bat
```

---

## 🧪 Fonctions de test disponibles

Dans la console du navigateur (`F12`):

```javascript
checkHealth()                 // ✅ Vérifier le serveur
createTestSession('Nom')      // ✅ Créer une session
getSession(token)             // ✅ Récupérer la session
joinSession(token, pseudo)    // ✅ Rejoindre
sendBuzz(token)               // ✅ Envoyer un buzz
sendReset(token)              // ✅ Envoyer un reset
```

---

## 📊 Architecture

```
Frontend (React - 3001)
         ↓↕ HTTP + WebSocket
Backend (NestJS - 3000)
         ↓↕
Database (SQLite/PostgreSQL)
```

---

## ✨ Nouveautés synchronisation front-back

✅ Services API créés (sessionService, gameService)  
✅ Hook diagnostique (useDiagnostics)  
✅ Composant diagnostique (Diagnostics)  
✅ Outils de test console (test-helper.js)  
✅ Documentation complète  

---

## 🔗 Fichiers importants

| Fichier | Rôle |
|---------|------|
| `QUICK_START.md` | 🚀 Démarrage rapide |
| `TESTING.md` | 🧪 Tests complets |
| `TEST_TOOLS.md` | 🔧 Outils disponibles |
| `IMPLEMENTATION_SUMMARY.md` | 📋 Résumé complet |
| `backend/src/main.ts` | Backend entry point |
| `frontend/src/main.tsx` | Frontend entry point |
| `frontend/public/test-helper.js` | 💻 Test console |

---

## ⚠️ Besoin d'aide ?

**Le backend ne démarre pas ?**
```bash
cd backend
rm -rf node_modules
npm install
npm run start:dev
```

**Le frontend ne démarre pas ?**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

**WebSocket ne se connecte pas ?**
- Vérifier que le backend démarre sur le port 3000
- Vérifier la console pour les erreurs CORS
- Vérifier `.env` du backend

**Autre problème ?**
→ Consulter [TESTING.md](./TESTING.md) section "Dépannage"

---

## 🎉 Prochaines étapes

1. ✅ Lire ce fichier (vous êtes ici)
2. ✅ Exécuter les commandes de démarrage
3. ✅ Tester les 30 secondes
4. ✅ Lire [QUICK_START.md](./QUICK_START.md)
5. 🔄 Tester les fonctions console
6. 📚 Explorer le code
7. 💻 Commencer à développer

---

## 📞 Ressources

- [Documentation officielle](./DOCS_INDEX.md)
- [Guide de tests](./TESTING.md)
- [Outils disponibles](./TEST_TOOLS.md)
- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://react.dev/)
- [Socket.io Docs](https://socket.io/docs/)

---

**Êtes-vous prêt ? [Commencez maintenant !](./QUICK_START.md) 🚀**

---

Créé: 23 janvier 2026  
Dernière mise à jour: Aujourd'hui ✨
