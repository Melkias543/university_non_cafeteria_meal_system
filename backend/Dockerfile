FROM php:8.2-apache

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# 2. Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# 3. Set Document Root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html
COPY . .

# 4. Composer & Permissions
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache

# Render uses the PORT env var; Apache defaults to 80, but Render maps it automatically.
EXPOSE 80
# Replace your current CMD with this:
# Add this to your Dockerfile temporarily
CMD php artisan db:wipe --force && php artisan migrate --force && apache2-foreground
# No need for 'php artisan serve', Apache starts by default in this image
