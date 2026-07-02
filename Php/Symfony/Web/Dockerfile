FROM php:8.3-cli-alpine

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

# Dépendances PHP (sans devDependencies)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Code source
COPY . .

# Autoloader optimisé
RUN composer dump-autoload --optimize --classmap-authoritative

EXPOSE 8080

# Au démarrage : migrations puis serveur PHP intégré
CMD ["sh", "-c", \
     "php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration && \
      php -S 0.0.0.0:8080 -t public public/router.php"]
