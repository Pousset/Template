# 🧪 Fichiers de Test et Diagnostique

## Vue d'ensemble

Ce dossier contient les outils pour tester et diagnostiquer l'application Buzzer.

## Fichiers principaux

### 1. `test-helper.js`
**Localisation:** `frontend/public/test-helper.js`

Script injecté dans le navigateur pour faciliter les tests manuels dans la console.

**Fonctions disponibles:**
- `createTestSession(nom?)` - Créer une session de test
- `getSession(token?)` - Récupérer l'état d'une session
- `joinSession(token?, pseudo?)` - Rejoindre une session
- `checkHealth()` - Vérifier la santé du serveur
- `sendBuzz(token?)` - Envoyer un buzz
- `sendReset(token?)` - Envoyer un reset

**Utilisation:**
1. Ouvrir `http://localhost:3001` dans le navigateur
2. Appuyer sur `F12` pour ouvrir la console
3. Exécuter les commandes directement

**Exemple:**
```javascript
// Créer une session
createTestSession('Admin')

// Rejoin avec le token sauvegardé
joinSession()

// Envoyer un buzz
sendBuzz()
```

### 2. `useDiagnostics.ts`
**Localisation:** `frontend/src/hooks/useDiagnostics.ts`

Hook React pour diagnostiquer l'état de connexion avec le backend.

**Vérifie:**
- ✅ Santé du backend
- ✅ Accessibilité de l'API
- ✅ Temps de réponse
- ✅ Connexion WebSocket

**Utilisation:**
```typescript
import { useDiagnostics } from '@/hooks/useDiagnostics';

function MyComponent() {
  const diagnostics = useDiagnostics();
  
  return (
    <div>
      {diagnostics.backendHealth && <p>✅ Backend OK</p>}
      {diagnostics.errors.length > 0 && (
        <ul>
          {diagnostics.errors.map(e => <li>{e}</li>)}
        </ul>
      )}
    </div>
  );
}
```

### 3. `Diagnostics.tsx`
**Localisation:** `frontend/src/components/Diagnostics.tsx`

Composant React affichant un widget de diagnostique en bas à droite de la page.

**Affiche:**
- État du backend
- Accessibilité de l'API
- Temps de réponse
- État WebSocket
- Liste des problèmes détectés

**Utilisation:**
```typescript
import { Diagnostics } from '@/components/Diagnostics';

function App() {
  return (
    <div>
      <MainContent />
      <Diagnostics />
    </div>
  );
}
```

## 🚀 Guide de test complet

### Étape 1: Démarrer les serveurs

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

### Étape 2: Tester la santé du serveur

**Via cURL:**
```bash
curl http://localhost:3000/health
# Résponse: { "status": "ok" }
```

**Via navigateur:**
```
http://localhost:3000/health
```

### Étape 3: Tester via la console

1. Ouvrir `http://localhost:3001` dans le navigateur
2. Appuyer sur `F12`
3. Exécuter dans la console:

```javascript
// Vérifier la santé du serveur
checkHealth()

// Créer une session
createTestSession('TestAdmin')

// Vérifier la session est créée
getSession()

// Joindre la session
joinSession()

// Envoyer un buzz
sendBuzz()
```

### Étape 4: Tester le frontend

1. Créer une session depuis l'UI
2. Vérifier le widget diagnostique en bas à droite
3. Observer les logs de connexion WebSocket
4. Tester les interactions (buzz, reset, etc.)

## ✅ Checklist de vérification

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Page `/health` répond `{ "status": "ok" }`
- [ ] WebSocket se connecte (console WebSocket)
- [ ] Créer une session fonctionne
- [ ] Rejoindre une session fonctionne
- [ ] Buzz et Reset transmis via WebSocket
- [ ] Widget diagnostique affiche tout ✅

## 🐛 Dépannage

### "Backend unreachable"
- Vérifier que le backend démarre: `npm run start:dev` dans `backend/`
- Vérifier le port: doit être `3000`
- Vérifier CORS: `FRONTEND_URL=http://localhost:3001` dans `.env`

### "WebSocket connection timeout"
- Vérifier que le backend a Socket.io configuré
- Vérifier les logs du backend pour les erreurs de connexion
- Vérifier CORS dans la configuration WebSocket

### "API responded with status 404"
- Vérifier que l'endpoint `/health` existe dans le backend
- Vérifier l'URL: doit être `http://localhost:3000`

## 📊 Logs utiles

### Backend logs
```
Buzzer API running on http://localhost:3000
Client connected: socket-abc123def456
socket-abc123def456: buzz event received
```

### Frontend console logs
```
Connected to server
buzz sent
reset sent
```

## 📝 Notes importantes

- Le test-helper.js utilise Socket.io CDN (nécessite internet)
- Les données de test sont stockées en mémoire (réinitialisation au redémarrage)
- Pour les tests production, configurer une vraie base de données
- Les erreurs CORS indiquent souvent un problème de configuration d'URL

## 🔗 Ressources utiles

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [React Testing Library](https://testing-library.com/react)
- [Vite Documentation](https://vitejs.dev/)
