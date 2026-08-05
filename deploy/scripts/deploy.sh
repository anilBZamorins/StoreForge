#!/usr/bin/env bash
# Deploy: Angular build + Laravel API refresh. Run on the droplet after pushing to main.
set -euo pipefail
APP_DIR=/var/www/storeforge
cd $APP_DIR

git pull origin main

# --- Frontend (Angular) ---
cd $APP_DIR/frontend
npm ci --silent
npm run build

# --- Backend (Laravel API) ---
cd $APP_DIR/backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache && php artisan route:cache
php artisan queue:restart
supervisorctl restart storeforge-worker:* || true
systemctl reload php8.3-fpm
systemctl reload nginx
echo "Deployed $(git rev-parse --short HEAD) at $(date)"
