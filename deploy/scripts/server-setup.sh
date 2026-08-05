#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 24.04 DigitalOcean droplet.
# Run as root:  bash server-setup.sh
set -euo pipefail

APP_DIR=/var/www/storeforge

echo "==> System packages"
apt update && apt -y upgrade
apt -y install nginx mysql-server supervisor git unzip acl \
  php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl \
  php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl

echo "==> Composer"
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

echo "==> Node.js 20 (asset builds)"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt -y install nodejs

echo "==> MySQL database"
mysql -e "CREATE DATABASE IF NOT EXISTS storeforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'storeforge'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON storeforge.* TO 'storeforge'@'localhost'; FLUSH PRIVILEGES;"
# Tenant databases (if using DB-per-tenant) are created by the provisioning job,
# which needs CREATE privileges — grant separately when you reach PRV-02.

echo "==> App directory"
mkdir -p $APP_DIR && chown -R www-data:www-data $APP_DIR

echo "==> Nginx"
cp "$(dirname "$0")/../nginx/storeforge.conf" /etc/nginx/sites-available/storeforge.conf
ln -sf /etc/nginx/sites-available/storeforge.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Supervisor (queue workers)"
cp "$(dirname "$0")/../supervisor/storeforge-worker.conf" /etc/supervisor/conf.d/
supervisorctl reread && supervisorctl update

echo "==> Firewall"
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable

echo "==> Laravel scheduler cron"
( crontab -u www-data -l 2>/dev/null; echo "* * * * * cd $APP_DIR && php artisan schedule:run >> /dev/null 2>&1" ) | crontab -u www-data -

echo "Done. Next: clone the repo into $APP_DIR, configure .env, run deploy.sh, then set up SSL (see deploy/README.md)."
