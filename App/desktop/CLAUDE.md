# CLAUDE.md — Portfolio Tauri Template

## Contexte du projet

Conversion du portfolio web full-stack (React/Vite/NestJS) en application desktop Tauri.
Objectif final : un **template réutilisable** pour de futurs projets desktop.

Stack de base héritée du portfolio web :

- Frontend : React + TypeScript + Vite + Tailwind v4
- Backend : NestJS + TypeORM + SQLite
- Auth : JWT + Google OAuth
- Package manager : **npm**
- Monorepo : `backend/` + `frontend/` + `desktop/`

---

## Architecture réelle

```
App/
├── backend/                  # NestJS
│   ├── dist-bin/             # Bundle ncc (index.js + better_sqlite3.node)
│   └── .env                  # Variables d'environnement (ne pas committer)
├── frontend/                 # React + Vite
├── desktop/                  # Tauri
│   └── src-tauri/
│       ├── binaries/         # backend-x86_64-pc-windows-msvc.exe (pkg, non utilisé en dev)
│       ├── src/
│       │   ├── main.rs
│       │   └── lib.rs        # Démarre node avec dist-bin/index.js
│       └── tauri.conf.json
└── CLAUDE.md
```

Backend lancé via `node backend/dist-bin/index.js` au démarrage de l'app Tauri.
Le frontend appelle `localhost:3001` comme en dev web — aucun changement côté fetch/API.

---

## Prérequis

- **Rust** installé via `rustup` : https://rustup.rs
- **Visual Studio C++ Build Tools** (Windows)
- **WebView2** : pré-installé sur Windows 10/11
- Node.js + npm

---

## Roadmap

### Phase 1 — Bootstrap · ✅ FAIT

> Fenêtre desktop qui boot

- [x] `npm install -D @tauri-apps/cli` dans `desktop/`
- [x] `npx tauri init` dans `desktop/`
- [x] `tauri.conf.json` : window 1280×800, titre "Template", `devUrl` → `http://localhost:5173`, `frontendDist` → `../frontend/dist`
- [x] `beforeDevCommand` : `npm run dev:frontend --prefix ..`
- [x] `npx tauri dev` → fenêtre s'ouvre, frontend s'affiche

**Livrable** : ✅ fenêtre s'ouvre, frontend React s'affiche.

---

### Phase 2 — Sidecar NestJS · ✅ FAIT

> Backend NestJS démarré automatiquement par Tauri

- [x] `npm run build` puis `npx ncc build dist/main.js -o dist-bin` dans `backend/`
- [x] Entités TypeORM déclarées explicitement (plus de glob `.ts/.js`)
- [x] `tauri-plugin-shell` ajouté dans `Cargo.toml` et `lib.rs`
- [x] `lib.rs` démarre `node dist-bin/index.js` avec les variables d'env
- [x] Backend répond sur `localhost:3001`

**Notes importantes** :
- En dev : chemin absolu hardcodé dans `lib.rs` (à rendre dynamique en Phase 4)
- Variables d'env passées directement dans `lib.rs` via `.env()`
- Le `.env` de `backend/` est utilisé quand on lance le backend seul (`npm run start:dev`)
- `better_sqlite3.node` est inclus automatiquement par ncc dans `dist-bin/`
- `pkg` installé mais non utilisé en dev (problème compatibilité Node 18 vs 22)

**Commande rebuild backend** :
```bash
cd backend
npm run build
npx ncc build dist/main.js -o dist-bin
```

**Livrable** : ✅ backend démarre au lancement de l'app, API accessible sur localhost:3001.

---

### Phase 3 — Features natives · ⬜ À faire

> Objectif : comportement d'une vraie app native · ~2-3 jours

- [x] Fenêtre : taille min/max, title bar custom (frameless optionnel), fullscreen toggle
- [x] `@tauri-apps/plugin-window-state` — mémoriser position/taille
- [x] `@tauri-apps/plugin-notification` → hook `useNotification()` template
- [x] `@tauri-apps/plugin-fs` — exemple minimal export JSON (template exploitable)
- [x] System tray : icône + menu contextuel Ouvrir/Quitter (optionnel)

**Livrable** : app se comporte comme une vraie app native.

---

### Phase 4 — Build, packaging, template final · ⬜ À faire

> Objectif : binaire Windows distribuable + repo template propre · ~1-2 jours

- [ ] Rendre le chemin `backend/dist-bin/index.js` dynamique dans `lib.rs`
- [ ] Embarquer `dist-bin/` dans les resources Tauri (`tauri.conf.json > bundle > resources`)
- [ ] Variables d'env : stratégie prod (embarquées dans le bundle ou fichier config)
- [ ] `npx tauri build` → `.msi` + `.exe` (NSIS)
- [ ] CI GitHub Actions — Windows uniquement
- [ ] `@tauri-apps/plugin-updater` — vérification au démarrage via GitHub Releases
- [ ] Branche `template/tauri` + README dédié
- [ ] Checklist réutilisation documentée

**Livrable** : binaire `.msi` généré en CI, template clonable.

---

## Checklist réutilisation (future référence)

- [ ] Changer `identifier` dans `tauri.conf.json` (`com.monentreprise.monapp`)
- [ ] Changer le titre de la fenêtre et les icônes (`desktop/src-tauri/icons/`)
- [ ] Remplacer les credentials Google OAuth (Client ID + Secret)
- [ ] Mettre à jour `DATABASE_PATH` / nom de la base SQLite
- [ ] Mettre à jour l'endpoint de l'auto-updater
- [ ] Adapter les variables d'env dans `lib.rs`
- [ ] Mettre à jour le scheme deep link (`portfolio://` → nom réel)

---

## Commandes utiles

```bash
# Dev (depuis desktop/)
cd desktop && npx tauri dev

# Backend seul
cd backend && npm run start:dev

# Rebuild bundle backend (après modif backend)
cd backend && npm run build && npx ncc build dist/main.js -o dist-bin

# Build Tauri Windows (Phase 4)
cd desktop && npx tauri build
```

---

## État d'avancement global

| Phase                      | Statut     |
| -------------------------- | ---------- |
| Phase 1 — Bootstrap        | ✅ Fait    |
| Phase 2 — Sidecar + Auth   | ✅ Fait    |
| Phase 3 — Features natives | ✅ À faire |
| Phase 4 — Build + Template | ⬜ À faire |

> Mettre à jour ce fichier à chaque session.