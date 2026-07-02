# ── Runtime PHP + PostgreSQL ────────────────────────────────────────────────
FROM php:8.4-cli-alpine

# Extensions PHP nécessaires à Symfony + PostgreSQL
RUN apk add --no-cache \
        bash \
        git \
        curl \
        zip \
        unzip \
        libpq-dev \
        icu-dev \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Dépendances PHP — copier d'abord pour bénéficier du cache Docker
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-interaction

# Code source complet
COPY . .

# Autoloader optimisé + scripts post-install (cache, assets)
RUN composer dump-autoload --optimize --classmap-authoritative

# Créer les répertoires de cache/log et fixer les permissions
RUN mkdir -p var/cache var/log \
    && chmod -R 777 var

EXPOSE 8080

# Au démarrage : migrations → seed → serveur PHP intégré
CMD ["sh", "-c", \
     "php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration && \
      php bin/console app:seed --no-interaction && \
      php -S 0.0.0.0:8080 -t public public/index.php"]
