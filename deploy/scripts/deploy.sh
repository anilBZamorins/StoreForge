#!/usr/bin/env bash
# Deploy: build all three Angular apps + refresh the Laravel API.
set -euo pipefail
APP_DIR=/var/www/storeforge
cd $APP_DIR
git pull origin main

for APP in frontend-website frontend-admin frontend-storefront; do
  echo "==> Building $APP"
  cd $APP_DIR/$APP
  npm ci --silent
  npm run build
done

echo "==> Backend"
cd $APP_DIR/backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache && php artisan route:cache
php artisan queue:restart
supervisorctl restart storeforge-worker:* || true
systemctl reload php8.3-fpm && systemctl reload nginx
echo "Deployed $(git rev-parse --short HEAD) at $(date)"
