# Deploying StoreForge to DigitalOcean

Target: a single Ubuntu 24.04 droplet running Nginx + PHP-FPM 8.3 + MySQL,
serving the marketing site and every tenant storefront via wildcard subdomains.

## 1. Create the droplet
- Ubuntu 24.04 LTS, Basic plan (2 GB RAM minimum recommended for Laravel + MySQL).
- Add your SSH key. Note the droplet's public IP.

## 2. DNS (do this early — propagation takes time)
At your DNS provider (or DigitalOcean Networking → Domains):

| Type | Host | Value        |
|------|------|--------------|
| A    | @    | <droplet IP> |
| A    | www  | <droplet IP> |
| A    | *    | <droplet IP> |  ← wildcard: every tenant subdomain resolves here

## 3. Server setup (one-time)
```bash
ssh root@<droplet IP>
git clone https://github.com/anilBZamorins/StoreForge.git /var/www/storeforge
bash /var/www/storeforge/deploy/scripts/server-setup.sh
```
Edit the MySQL password inside the script (or change it after) and put the same
credentials in `.env`.

## 4. App configuration
```bash
cd /var/www/storeforge
cp .env.example .env && nano .env     # APP_URL, DB_*, MAIL_*, SESSION_DOMAIN=.storeforge.io
php artisan key:generate
bash deploy/scripts/deploy.sh
chown -R www-data:www-data storage bootstrap/cache
```

## 5. SSL (wildcard)
A wildcard cert (`*.storeforge.io`) requires a DNS-01 challenge:
```bash
apt install certbot python3-certbot-dns-digitalocean
# Create a DO API token, save to /root/.secrets/certbot/digitalocean.ini (dns_digitalocean_token=...)
chmod 600 /root/.secrets/certbot/digitalocean.ini
certbot certonly --dns-digitalocean \
  --dns-digitalocean-credentials /root/.secrets/certbot/digitalocean.ini \
  -d storeforge.io -d '*.storeforge.io'
```
Then add the `listen 443 ssl` block referencing the issued cert to
`/etc/nginx/sites-available/storeforge.conf` and reload Nginx.
(If your DNS is *hosted at DigitalOcean*, this plugin works out of the box.)

## 6. Ongoing deploys
```bash
ssh root@<droplet IP> 'bash /var/www/storeforge/deploy/scripts/deploy.sh'
```
Optionally wire this into a GitHub Action on push to `main` (.github/workflows/).

## 7. Backups
- Enable DigitalOcean droplet backups (weekly snapshots) in the control panel.
- Nightly DB dumps: `deploy/scripts/backup-db.sh` via cron (see file header).

## Notes for multi-tenancy
- All subdomains hit the same Laravel app; the `IdentifyTenant` middleware maps
  `{slug}.storeforge.io` → tenant and scopes every query (NFR-01).
- `SESSION_DOMAIN=.storeforge.io` lets sessions work across subdomains where needed.
- Tenant provisioning (PRV-*) runs as a queued job — workers are managed by
  Supervisor (`deploy/supervisor/storeforge-worker.conf`).
