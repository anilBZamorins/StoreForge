# StoreForge

Multi-tenant eCommerce SaaS platform — launch a fully branded online store in minutes.

**Stack:** Angular (frontend) · Laravel REST API (backend) · MySQL · Nginx · DigitalOcean

## Repository layout

```
StoreForge/
├── frontend/                  # Angular workspace — one app, 3 lazy areas
│   └── src/app/
│       ├── website/           #   /        → marketing site (WEB-*)
│       ├── admin/             #   /admin   → Store Admin Dashboard (ADM-*)
│       ├── storefront/        #   /store   → tenant storefront (STF-*)
│       └── core/              #   API/auth services, tenant resolver, guard
├── backend/                   # Laravel REST API (initialize per backend/README below)
│   ├── app/Domain/            #   Tenancy, Billing, Catalog, Orders, Customers, Reports
│   ├── app/Http/Controllers/  #   Website / StoreAdmin / Storefront / SuperAdmin API controllers
│   └── database/migrations/   #   landlord/ (platform) + tenant/ (per-store)
├── deploy/                    # DigitalOcean kit — see deploy/README.md
└── Documents/                 # BRD, color & design token guide, UI mockups
```

## Quick start

**Frontend** (Node 20+):
```bash
cd frontend
npm install
npm start                      # http://localhost:4200, proxies /api → localhost:8000
```

**Backend** (PHP 8.3 + Composer) — one-time init:
```bash
composer create-project laravel/laravel /tmp/laravel-fresh
rsync -a --ignore-existing /tmp/laravel-fresh/ backend/
cd backend && composer install
cp .env.example .env && php artisan key:generate    # set DB creds; API-only: no Blade views needed
php artisan serve                                    # http://localhost:8000
```

## Deployment

See `deploy/README.md`. In production, Nginx serves the built Angular app
(`frontend/dist/storeforge-frontend/browser`) and proxies `/api` to PHP-FPM.

## Reference documents

- `Documents/StoreForge-BRD.docx` — Business Requirements Document v1.0
- `Documents/storeforge-color-guide.html` — Color & Design Token Guide v1.2
- `Documents/Mockup/` — Approved Phase-1 UI mockups
