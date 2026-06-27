# Template

Monorepo de templates organises par technologie et cible.

```text
React/
+-- Web/              # Template web React + NestJS
+-- App/
    +-- Tauri/        # Template app desktop Tauri + React + NestJS

Php/
+-- Symfony/
    +-- Web/          # Template web Symfony
```

## Templates

- `React/Web` : version web React avec backend NestJS, authentification et espace admin.
- `React/App/Tauri` : version application desktop Tauri avec frontend React et backend embarque.
- `Php/Symfony/Web` : version web Symfony avec authentification, dashboard et calendrier exemple.

## Scripts npm

Des scripts npm existent a la racine pour piloter les templates :

```bash
npm run install:all
npm run dev:react:web
npm run dev:react:app
npm run dev:symfony
npm run lint
npm run test
```

Pour Symfony uniquement :

```bash
npm --prefix Php/Symfony/Web run setup
npm --prefix Php/Symfony/Web run dev
npm --prefix Php/Symfony/Web run lint
npm --prefix Php/Symfony/Web run test
```
