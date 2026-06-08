# CLAUDE.md — Portfolio Tauri Template

## Contexte du projet

Conversion du portfolio web full-stack (React/Vite/NestJS) en application desktop Tauri.
Objectif final : un **template réutilisable** pour de futurs projets desktop.

Stack de base héritée du portfolio web :

- Frontend : React + TypeScript + Vite + Tailwind v4
- Backend : NestJS + TypeORM + SQLite
- Auth : JWT + Google OAuth
- Package manager : pnpm
- Monorepo : `backend/` + `frontend/`

---

## Architecture cible

```
root/
├── backend/          # NestJS existant (inchangé)
├── frontend/         # React/Vite existant
│   └── src-tauri/    # Ajouté par `create tauri-app`
└── CLAUDE.md
```

Backend lancé en **sidecar** (processus Node/NestJS externe géré par Tauri).
Le frontend appelle `localhost:3001` comme en dev web — aucun changement côté fetch/API.

---

## Roadmap

### Phase 1 — Bootstrap · [ ] EN COURS / [ ] FAIT

> Objectif : fenêtre desktop qui boot · ~1-2 jours

- [ ] `npm create tauri-app` dans `frontend/`, choisir Vite+React existant
- [ ] `tauri.conf.json` : window 1280×800, titre, icône, `devUrl` → `http://localhost:5173`, `frontendDist` → `../dist`
- [ ] `npm run tauri dev` → Home page s'affiche dans la fenêtre

**Livrable** : fenêtre s'ouvre, frontend s'affiche.

---

### Phase 2 — Sidecar NestJS + Auth · [ ] EN COURS / [ ] FAIT

> Objectif : auth fonctionnelle en desktop · ~2-3 jours

- [ ] Bundle NestJS avec `@vercel/ncc` → binaire Node standalone (`backend.js`)
- [ ] Déclarer le sidecar dans `tauri.conf.json` (`externalBin`)
- [ ] `DATABASE_PATH` dynamique via `appDataDir()` (AppData/Windows, ~/.config/Linux, ~/Library/macOS)
- [ ] JWT : rester en localStorage ou migrer vers `@tauri-apps/plugin-store`
- [ ] Google OAuth desktop : `shell.open()` pour le navigateur système + deep link `myapp://auth/callback` + scheme dans `tauri.conf.json` + URL enregistrée dans Google Console

**Livrable** : inscription, login, dashboard, admin fonctionnels.

**⚠ Note** : les `.env` ne suivent pas le binaire en prod — passer les variables via `tauri.conf.json > bundle > resources` ou les embarquer dans le bundle NestJS au moment du build.

---

### Phase 3 — Features natives · [ ] EN COURS / [ ] FAIT

> Objectif : comportement d'une vraie app native · ~2-3 jours

- [ ] Fenêtre : taille min/max, title bar custom (frameless optionnel), fullscreen toggle
- [ ] `@tauri-apps/plugin-window-state` — mémoriser position/taille
- [ ] `@tauri-apps/plugin-notification` → hook `useNotification()` template
- [ ] `@tauri-apps/plugin-fs` — exemple minimal export JSON (template exploitable)
- [ ] System tray : icône + menu contextuel Ouvrir/Quitter (optionnel)

**Livrable** : app se comporte comme une vraie app native.

---

### Phase 4 — Build, packaging, template final · [ ] EN COURS / [ ] FAIT

> Objectif : binaires distribuables + repo template propre · ~1-2 jours

- [ ] `npm run tauri build` → `.msi` / `.dmg` / `.deb` + `.AppImage`
- [ ] CI GitHub Actions — matrice OS (ubuntu/macos/windows)
- [ ] `@tauri-apps/plugin-updater` — vérification au démarrage via GitHub Releases
- [ ] Smoke tests CI : boot app, auth OK, sidecar start/stop propre
- [ ] Branche `template/tauri` + README dédié
- [ ] Checklist réutilisation documentée (voir section ci-dessous)

**Livrable** : binaires générés en CI, template clonable.

---

## Checklist réutilisation (future référence)

Lors d'un nouveau projet basé sur ce template :

- [ ] Changer `identifier` dans `tauri.conf.json` (`com.monentreprise.monapp`)
- [ ] Changer le titre de la fenêtre et les icônes
- [ ] Remplacer les credentials Google OAuth (Client ID + Secret)
- [ ] Mettre à jour `DATABASE_PATH` / nom de la base SQLite
- [ ] Mettre à jour l'endpoint de l'auto-updater
- [ ] Adapter les variables d'environnement embarquées dans le bundle NestJS
- [ ] Mettre à jour le scheme deep link (`myapp://` → nom réel)

---

## Commandes utiles

```bash
# Dev
pnpm --filter frontend tauri dev

# Build frontend seul
pnpm --filter frontend build

# Bundle backend (sidecar)
cd backend && npx ncc build src/main.ts -o dist-bin

# Build Tauri (all platforms via CI)
pnpm --filter frontend tauri build
```

---

## État d'avancement global

| Phase                      | Statut     |
| -------------------------- | ---------- |
| Phase 1 — Bootstrap        | ⬜ À faire |
| Phase 2 — Sidecar + Auth   | ⬜ À faire |
| Phase 3 — Features natives | ⬜ À faire |
| Phase 4 — Build + Template | ⬜ À faire |

> Mettre à jour ce fichier à chaque session.
