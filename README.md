# StoreForge

Multi-tenant eCommerce SaaS platform — launch a fully branded online store in minutes.

**Stack:** Laravel (PHP 8.3) · MySQL · Nginx · DigitalOcean

## Project structure

```
StoreForge/
├── app/
│   ├── Domain/                # Business logic, organized by domain module
│   │   ├── Tenancy/           #   Tenant provisioning, subdomain resolution, data isolation
│   │   ├── Billing/           #   Plans, subscriptions, trials, invoices (SUB-* reqs)
│   │   ├── Catalog/           #   Products, categories, banners (ADM-02..04)
│   │   ├── Orders/            #   Orders, status lifecycle, carts (ADM-05..06, STF-06..09)
│   │   ├── Customers/         #   Customer profiles & wishlists
│   │   └── Reports/           #   Sales / order / top-product reports
│   └── Http/
│       ├── Controllers/
│       │   ├── Website/       # Marketing site: home, pricing, contact, register wizard
│       │   ├── StoreAdmin/    # Store Admin Dashboard (per tenant)
│       │   ├── Storefront/    # Customer-facing store (per tenant subdomain)
│       │   └── SuperAdmin/    # Platform operator console
│       └── Middleware/        # e.g. IdentifyTenant (resolves store from subdomain)
├── database/
│   ├── migrations/
│   │   ├── landlord/          # Platform tables: tenants, plans, subscriptions, invoices
│   │   └── tenant/            # Per-tenant tables: products, orders, customers, carts
│   └── seeders/               # Plan seeder, demo tenant (Aura Living)
├── resources/
│   ├── views/                 # Blade views per surface (website / storefront / admin / superadmin)
│   ├── css/                   # Design tokens from Documents/storeforge-color-guide.html
│   └── js/
├── routes/                    # web.php (website), tenant.php (storefront), admin.php, superadmin.php
├── public/
├── tests/                     # Feature & Unit tests
├── deploy/                    # DigitalOcean deployment kit — see deploy/README.md
│   ├── nginx/                 # Wildcard-subdomain server block
│   ├── supervisor/            # Queue worker config
│   └── scripts/               # server-setup.sh, deploy.sh, backup-db.sh
└── Documents/                 # BRD, color & design token guide, UI mockups
```

## Getting started (local)

1. Initialize Laravel into this skeleton (one-time):
   ```bash
   composer create-project laravel/laravel /tmp/laravel-fresh
   rsync -a --ignore-existing /tmp/laravel-fresh/ ./
   composer install
   ```
   Existing folders (`app/Domain`, `resources/views/*`, `deploy/`, …) merge cleanly — nothing is overwritten.
2. Copy `.env.example` → `.env`, set MySQL credentials, run `php artisan key:generate`.
3. `php artisan migrate --path=database/migrations/landlord`
4. `php artisan serve` and visit the marketing site.

## Deployment

See **`deploy/README.md`** for the full DigitalOcean droplet guide (Nginx + PHP-FPM + MySQL + wildcard subdomains + SSL).

## Reference documents

- `Documents/StoreForge-BRD.docx` — Business Requirements Document v1.0
- `Documents/storeforge-color-guide.html` — Color & Design Token Guide v1.2
- `Documents/Mockup/` — Approved Phase-1 UI mockups (website, admin, storefront)
