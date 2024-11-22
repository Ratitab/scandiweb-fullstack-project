# Base PHP image
FROM php:8.2-cli

# Install necessary PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo_mysql zip

# Install Redis PHP extension
RUN pecl install redis && docker-php-ext-enable redis

# Copy application files
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Expose the PHP server port
EXPOSE 8000

# Run the PHP built-in server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
