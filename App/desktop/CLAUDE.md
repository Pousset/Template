# CLAUDE.md — Portfolio Tauri Template

## Contexte du projet

Conversion du portfolio web full-stack (React/Vite/NestJS) en application desktop Tauri.
Objectif final : un **template réutilisable** pour de futurs projets desktop.

Stack :
- Frontend : React + TypeScript + Vite + Tailwind v4
- Backend : NestJS + TypeORM + SQLite (better-sqlite3)
- Auth : JWT + Google OAuth
- Package manager : **npm**
- OS cible : **Windows uniquement**
- Monorepo : `backend/` + `frontend/` + `desktop/`

---

## Architecture réelle
App/
├── backend/
│   ├── dist-bin/             # Bundle ncc (index.js + better_sqlite3.node)
│   └── .env                  # Variables d'env pour npm run start:dev (non committé)
├── frontend/                 # React + Vite
├── desktop/
│   └── src-tauri/
│       ├── src/
│       │   ├── main.rs
│       │   └── lib.rs        # Sidecar backend, tray, notifications, chemins dynamiques
│       ├── capabilities/default.json
│       ├── Cargo.toml
│       └── tauri.conf.json
└── CLAUDE.md

Backend lancé via `node` (sidecar) au démarrage de l'app Tauri.
Le frontend appelle `localhost:3001` comme en dev web.

---

## Prérequis

- Rust via `rustup` : https://rustup.rs
- Visual Studio C++ Build Tools (Windows)
- WebView2 (pré-installé Windows 10/11)
- Node.js + npm

---

## Roadmap

### Phase 1 — Bootstrap ✅ FAIT
- Tauri initialisé dans `desktop/`
- `tauri.conf.json` : window 1280×800, `devUrl` → `localhost:5173`
- `npx tauri dev` fonctionne

### Phase 2 — Sidecar NestJS ✅ FAIT
- `npm run build` + `npx ncc build dist/main.js -o dist-bin` dans `backend/`
- Entités TypeORM déclarées explicitement (`[User]`)
- `tauri-plugin-shell` — `lib.rs` lance `node dist-bin/index.js`
- Backend répond sur `localhost:3001`

### Phase 3 — Features natives ✅ FAIT
- **Window state** : `tauri-plugin-window-state` (position/taille mémorisées)
- **System tray** : icône + menu "Afficher"/"Quitter", fermeture = hide (feature `tray-icon` activée dans `tauri`)
- **Notifications** : `tauri-plugin-notification` — notif au démarrage du backend

### Phase 4 — Build, packaging, template final 🟡 EN COURS

- [x] Chemin backend dynamique : `../../backend/dist-bin/index.js` (dev) / `resource_dir()/backend/index.js` (prod)
- [x] `resources` dans `tauri.conf.json` → embarque `dist-bin/` dans le bundle
- [x] `DATABASE_PATH` dynamique via `app_data_dir()` → `%APPDATA%\com.portfolio.app\app.sqlite`
- [x] `frontendDist` corrigé → `../../frontend/dist`
- [x] `targets: ["msi", "nsis"]`
- [x] `npx tauri build` → `.msi` + `.exe` (NSIS) générés avec succès
- [ ] Tester l'installeur `.exe` sur une machine propre (tray/notifs/backend OK)
- [ ] CI GitHub Actions — build Windows automatisé
- [ ] `tauri-plugin-updater` — vérification via GitHub Releases
- [ ] Branche `template/tauri` + README dédié
- [ ] Checklist réutilisation documentée
- [ ] Signature du binaire (optionnel) / mention SmartScreen dans le README

---

## Points d'attention

- **Variables d'env** (`JWT_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, etc.) : actuellement hardcodées en placeholder dans `lib.rs`. À externaliser proprement (Phase 4 restante).
- **SmartScreen** : le `.exe` non signé déclenchera un avertissement Windows Defender SmartScreen. Solutions : certificat (payant), GitHub Releases + VirusTotal (gratuit). À documenter dans le README.
- **Identifier** : `com.portfolio.app` génère un warning macOS (suffixe `.app`). Sans impact sur Windows, à corriger si besoin (`com.portfolio.template`).

---

## Cargo.toml — dépendances

```toml
tauri = { version = "2.11.2", features = ["tray-icon"] }
tauri-plugin-log = "2"
tauri-plugin-shell = "2"
tauri-plugin-window-state = "2"
tauri-plugin-notification = "2"
```

---

## Commandes utiles

```bash
# Dev (depuis desktop/)
npx tauri dev

# Rebuild bundle backend (après modif backend) — fermer l'app Tauri avant !
cd backend && npm run build && npx ncc build dist/main.js -o dist-bin

# Build Windows (.msi + .exe)
cd desktop && npx tauri build
```

Sortie du build :
desktop/src-tauri/target/release/bundle/
├── msi/App_0.1.0_x64_en-US.msi
└── nsis/App_0.1.0_x64-setup.exe

---

## Checklist réutilisation (future référence)

- [ ] Changer `identifier` dans `tauri.conf.json`
- [ ] Changer titre fenêtre + icônes (`desktop/src-tauri/icons/`)
- [ ] Remplacer credentials Google OAuth
- [ ] Adapter variables d'env dans `lib.rs`
- [ ] Mettre à jour endpoint auto-updater

---

## État d'avancement global

| Phase                      | Statut       |
| -------------------------- | ------------ |
| Phase 1 — Bootstrap        | ✅ Fait      |
| Phase 2 — Sidecar          | ✅ Fait      |
| Phase 3 — Features natives | ✅ Fait      |
| Phase 4 — Build + Template | 🟡 En cours  |

> Mettre à jour ce fichier à chaque session