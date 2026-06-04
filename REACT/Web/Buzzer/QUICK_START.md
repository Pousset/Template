# 🚀 DÉMARRAGE RAPIDE - Buzzer

## 30 secondes pour tester

### Étape 1: Ouvrir 2 terminaux

**Terminal 1:**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2:**
```bash
cd frontend  
npm install
npm run dev
```

### Étape 2: Ouvrir le navigateur

- Backend: http://localhost:3000/health (doit afficher `{ "status": "ok" }`)
- Frontend: http://localhost:3001

### Étape 3: Tester dans la console

1. Appuyer sur `F12` dans le navigateur
2. Aller à l'onglet "Console"
3. Copier-coller:

```javascript
// 1. Vérifier la santé du serveur
checkHealth()

// 2. Créer une session test
createTestSession('Admin')

// 3. Rejoindre la session
joinSession()

// 4. Envoyer un buzz
sendBuzz()
```

## ✅ Vérifications importantes

- [ ] Backend démarre: `Buzzer API running on http://localhost:3000`
- [ ] Frontend démarre: `VITE v5.x ready in X ms`
- [ ] Console du navigateur montre: `Connected to server`
- [ ] Commandes console fonctionnent sans erreurs
- [ ] Console backend affiche les événements buzz

## 📊 Résultats attendus

### ✅ Tous les systèmes OK
```
✅ Backend Health: OK
✅ API Reachable: OK
✅ Response Time: 15ms
✅ WebSocket: Connected
```

### ❌ Problèmes courants

| Problème | Solution |
|----------|----------|
| Backend ne démarre | Vérifier port 3000 libre |
| Frontend ne démarre | Vérifier port 3001 libre |
| CORS error | Vérifier `.env` FRONTEND_URL |
| WebSocket timeout | Backend pas lancé ? |
| 404 /health | Endpoint manquant dans backend |

## 📁 Structure du projet

```
Buzzer/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── modules/
│   │       ├── session/
│   │       ├── player/
│   │       └── game/
│   ├── package.json
│   ├── .env
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   └── useDiagnostics.ts
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── TESTING.md         ← Guide complet des tests
├── TEST_TOOLS.md      ← Doc des outils de test
├── start.bat          ← Script Windows
├── start.ps1          ← Script PowerShell
└── README.md          ← Vue d'ensemble
```

## 🎯 Prochaines étapes après test

1. ✅ Vérifier que tout fonctionne avec ce guide
2. 📚 Lire `TESTING.md` pour les tests détaillés
3. 🔧 Lire `TEST_TOOLS.md` pour les outils disponibles
4. 💻 Explorer le code dans les dossiers `src/`
5. 🚀 Commencer à développer vos features

## 📞 Support

- Erreurs NestJS ? Vérifier `backend/src/main.ts`
- Erreurs React ? Vérifier `frontend/src/App.tsx`
- Problèmes WebSocket ? Vérifier `src/hooks/useSocket.ts`
- Erreurs CORS ? Vérifier `backend/.env`

## 🔐 Configuration

### Backend (.env)
```env
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### Frontend
Les variables se configurent dans `vite.config.ts` ou `.env.local`

## 📝 Notes

- Les données sont en mémoire (réinitialisées au redémarrage)
- La base de données est configurée mais pas nécessaire pour les tests
- Pour production, configurer PostgreSQL ou autre SGBD

---

**Besoin d'aide ?** Consultez `TESTING.md` ou `TEST_TOOLS.md` 🎉
