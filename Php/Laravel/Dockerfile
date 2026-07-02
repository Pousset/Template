# ── Stage 1 : Build des assets Vite (Node.js) ──────────────────────────────
FROM node:22-alpine AS node-builder

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

COPY resources/ resources/
COPY vite.config.js ./
COPY public/ public/

RUN npm run build

# ── Stage 2 : Runtime PHP ──────────────────────────────────────────────────
FROM php:8.4-cli-alpine

# Extensions PHP nécessaires à Laravel
RUN apk add --no-cache \
        bash \
        git \
        curl \
        zip \
        unzip \
        sqlite-dev \
    && docker-php-ext-install pdo pdo_sqlite pcntl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Dépendances PHP + autoloader en une seule passe (--no-scripts évite
# les post-install qui nécessiteraient .env / DB)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --optimize-autoloader --prefer-dist --no-interaction

# Code source + assets compilés
COPY . .
COPY --from=node-builder /app/public/build ./public/build

# Créer les répertoires ignorés par .dockerignore et fixer les permissions
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views \
              storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

# Au démarrage : initialisation complète puis serveur
# (.env.example est copié à chaque démarrage si .env absent)
CMD ["sh", "-c", "\
  [ ! -f .env ] && cp .env.example .env ; \
  touch database/database.sqlite ; \
  php artisan key:generate --force ; \
  php artisan package:discover --ansi ; \
  php artisan migrate --force ; \
  php artisan serve --host=0.0.0.0 --port=8000 \
"]
