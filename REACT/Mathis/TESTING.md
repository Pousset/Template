# 🧪 Guide de Test - Buzzer Application

## Prérequis

- Node.js 18+ et npm installés
- Les deux applications doivent être lancées

## 🚀 Démarrage rapide

### Option 1: Scripts automatiques

**Windows (Batch):**
```bash
cd c:\Users\tonol\OneDrive\Desktop\Buzzer
start.bat
```

**Windows (PowerShell):**
```powershell
cd c:\Users\tonol\OneDrive\Desktop\Buzzer
.\start.ps1
```

### Option 2: Manuel (dans deux terminaux différents)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ✅ Vérification de la connexion

### Backend (http://localhost:3000)

1. **Page de santé:**
   - URL: `http://localhost:3000/health`
   - Réponse attendue: `{ "status": "ok" }`

2. **Accueil API:**
   - URL: `http://localhost:3000/`
   - Réponse attendue: `"Welcome to Buzzer API!"`

### Frontend (http://localhost:3001)

1. Ouvrir: `http://localhost:3001`
2. Vérifier que la page charge correctement
3. Vérifier le statut WebSocket en bas de la page

## 🧬 Tests API

### 1. Créer une session

**Requête:**
```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "masterPseudo": "Admin",
    "config": {
      "matchDuration": 60,
      "responseTime": 5,
      "muteTime": 2,
      "defaultPoints": 100
    }
  }'
```

**Réponse attendue:**
```json
{
  "token": "ABC123",
  "session": { ... },
  "playerId": "player-123"
}
```

### 2. Récupérer une session

**Requête:**
```bash
curl -X GET http://localhost:3000/sessions/{token}
```

### 3. Rejoindre une session

**Requête:**
```bash
curl -X POST http://localhost:3000/sessions/{token}/join \
  -H "Content-Type: application/json" \
  -d '{ "pseudo": "Player1" }'
```

## 📱 Tests Frontend

### Test 1: Créer une partie
1. Accédez à http://localhost:3001
2. Cliquez sur "Créer une partie"
3. Entrez un pseudo
4. Vous devriez être redirigé vers le lobby

### Test 2: Communication WebSocket
1. Ouvrez la console du navigateur (F12)
2. Dans le terminal, vérifiez les logs de connexion WebSocket
3. Les messages "Connected to server" ou "Disconnected from server" devraient apparaître

### Test 3: Rejoindre une partie
1. Créez une partie et notez le token
2. Dans un autre onglet/fenêtre, accédez à: `http://localhost:3001/join/{token}`
3. Entrez un pseudo et cliquez sur "Rejoindre"

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifier que le port 3000 n'est pas utilisé
- Vérifier l'installation de npm: `npm -v`
- Vérifier les dépendances: `npm install`

### Frontend ne démarre pas
- Vérifier que le port 3001 n'est pas utilisé
- Nettoyer le cache: `rm -rf node_modules && npm install`
- Vérifier Vite: `npm list vite`

### WebSocket ne se connecte pas
- Vérifier la console du navigateur pour les erreurs
- Vérifier que le backend est bien lancé
- Vérifier la configuration CORS dans le backend
- Vérifier la variable `FRONTEND_URL` dans `.env`

### Erreurs CORS
- S'assurer que `FRONTEND_URL` dans `.env` du backend est correct
- S'assurer que le frontend essaie de se connecter au bon URL du backend

## 📊 Logs importants

### Backend - Chercher:
```
Buzzer API running on http://localhost:3000
Client connected: socket-id
Client disconnected: socket-id
```

### Frontend - Console:
```
Connected to server
Disconnected from server
buzz sent
reset sent
```

## 🎯 Prochaines étapes de test

- [ ] Tester la création de session depuis le frontend
- [ ] Tester la connexion WebSocket en temps réel
- [ ] Tester le buzz et le reset
- [ ] Tester la gestion des erreurs
- [ ] Tester la communication entre plusieurs clients

## 📝 Notes

- Les données sont actuellement stockées en mémoire/mock
- Pour la production, configurer une vraie base de données PostgreSQL
- Les sessions se réinitialisent au redémarrage du serveur
