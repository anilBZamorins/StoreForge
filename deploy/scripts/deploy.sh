#!/usr/bin/env bash
# Zero-fuss deploy: run on the droplet after pushing to main.
set -euo pipefail
APP_DIR=/var/www/storeforge
cd $APP_DIR

php artisan down --retry=30 || true
git pull origin main
composer install --no-dev --optimize-autoloader --no-interaction
npm ci --silent && npm run build
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
php artisan queue:restart
supervisorctl restart storeforge-worker:* || true
systemctl reload php8.3-fpm
php artisan up
echo "Deployed $(git rev-parse --short HEAD) at $(date)"
