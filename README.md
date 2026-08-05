# StoreForge

Multi-tenant eCommerce SaaS platform — launch a fully branded online store in minutes.

**Stack:** Angular (3 apps) · Laravel REST API · MySQL · Nginx · DigitalOcean

## Repository layout

```
StoreForge/
├── frontend-website/      # Marketing site  (storeforge.io)          — WEB-* reqs
├── frontend-admin/        # Store Admin Dashboard                    — ADM-* reqs
├── frontend-storefront/   # Tenant storefront ({slug}.storeforge.io) — STF-* reqs
├── backend/               # Laravel REST API (init: see below)
│   ├── app/Domain/        #   Tenancy, Billing, Catalog, Orders, Customers, Reports
│   └── database/migrations/  # landlord/ (platform) + tenant/ (per-store)
├── deploy/                # DigitalOcean kit — see deploy/README.md
└── Documents/             # BRD, color guide, UI mockups
```

## Mock data ↔ API switch

Every frontend app ships with mock data in `src/app/mock.ts` and runs **without a backend**.
One flag in `src/environments/environment.ts` controls the source:

```ts
useMocks: true    // → data served from src/app/mock.ts
useMocks: false   // → data fetched from the Laravel API at /api/v1
```

All data access goes through each app's `DataService`, so flipping the flag switches the
entire app — no component changes needed. In dev, API mode proxies `/api` to
`http://localhost:8000` (see each app's `proxy.conf.json`).

## Run an app locally (Node 20+)

```bash
cd frontend-admin        # or frontend-website / frontend-storefront
npm install
npm start                # http://localhost:4200
```

## Backend init (PHP 8.3 + Composer, one-time)

```bash
composer create-project laravel/laravel /tmp/laravel-fresh
rsync -a --ignore-existing /tmp/laravel-fresh/ backend/
cd backend && composer install
cp .env.example .env && php artisan key:generate
php artisan serve        # http://localhost:8000
```

## Deployment

See `deploy/README.md`. Nginx serves each built app by hostname —
website on the apex domain, storefront on tenant subdomains, admin on admin.storeforge.io —
and proxies `/api` to PHP-FPM.

## Reference documents

- `Documents/StoreForge-BRD.docx` — Business Requirements Document v1.0
- `Documents/storeforge-color-guide.html` — Color & Design Token Guide v1.2
- `Documents/Mockup/` — Approved Phase-1 UI mockups
