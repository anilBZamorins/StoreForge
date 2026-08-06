# StoreForge Backend — Laravel REST API

Multi-tenant Laravel API with **database-per-tenant** isolation, **Sanctum bearer-token**
auth, and **Stripe Checkout** for paid tenant registration.

- Central landlord database **`storeforge`** (SuperAdmin control): plans, all tenants
  (stores), users, subscription invoices, pending registrations.
- **One database per tenant** (`storeforge_{slug}`): that store's catalog, orders,
  customers, carts, banners, enquiries. Created automatically at provisioning.

Full endpoint + schema documentation: `../Documents/API-Reference.md`.

## Setup (PHP 8.3+, Composer, MySQL)

`composer.json`, `.env.example` and `.env` are included here. The Laravel framework
skeleton comes from a fresh app merged underneath:

```bash
# 1. Fresh Laravel skeleton + API scaffolding (network required)
composer create-project laravel/laravel /tmp/laravel-fresh
cd /tmp/laravel-fresh && php artisan install:api --no-interaction

# 2. Merge INTO this folder — files already here (composer.json, .env, routes,
#    config/database.php, app/*, database/*) always win
rsync -a --ignore-existing /tmp/laravel-fresh/ /path/to/StoreForge/backend/
#    Windows (PowerShell) equivalent — copies only files that do not exist yet:
#    robocopy C:\tmp\laravel-fresh D:\path\to\StoreForge\backend /E /XC /XN /XO

# 3. Install dependencies (brings laravel/framework, sanctum, stripe/stripe-php)
cd /path/to/StoreForge/backend
composer install
php artisan key:generate

# 4. Configure .env — DB credentials + Stripe keys
#    The MySQL user needs CREATE DATABASE privilege (tenant DBs are auto-created):
#    GRANT ALL PRIVILEGES ON `storeforge%`.* TO 'storeforge'@'localhost';

# 5. Landlord database + demo tenant (creates storeforge_auraliving automatically)
mysql -e "CREATE DATABASE IF NOT EXISTS storeforge"
php artisan migrate --seed

# 6. Run
php artisan serve                       # http://localhost:8000
```

## Self-contained migrations

The Laravel base migrations (users/sessions, cache, jobs, personal_access_tokens)
are included here with `Schema::hasTable` guards — `php artisan migrate --seed`
works even if the fresh skeleton's own migrations were not merged, and it will not
conflict with them if they were.

## Tenant databases

- Tenant schema lives in `database/migrations/tenant/`.
- New tenant → `App\Services\ProvisionTenant` creates `storeforge_{slug}`, migrates
  it, and seeds the default catalog. Triggered by trial registration or the Stripe
  webhook after payment.
- Apply new tenant migrations to every existing tenant DB:
  `php artisan tenants:migrate` (or `--store=auraliving` for one).

## Stripe registration checkout

- `POST /api/v1/register` with `trial: true` → provisions immediately, no card (BR-03).
- With `trial: false` → returns `{ checkoutUrl }` for a Stripe **subscription**
  Checkout Session (price built from the plan + billing cycle).
- `POST /api/v1/stripe/webhook` provisions the tenant on `checkout.session.completed`,
  records invoices on `invoice.paid`, cancels on `customer.subscription.deleted`.
- Local testing: `stripe listen --forward-to localhost:8000/api/v1/stripe/webhook`
  and put the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
- Frontend polls `GET /api/v1/register/status?session_id=…` after returning from Checkout.

## Seeded logins

| Account | Email | Password | Portal |
|---|---|---|---|
| Store Owner (Aura Living) | `owner@auraliving.com` | `password` | Store Admin |
| Super Admin | `admin@storeforge.io` | `password` | Super Admin |

## Notes

- Admin routes run behind `UseTenantDatabase` middleware — queries hit the caller's
  own tenant DB; isolation is physical (NFR-01).
- Storefront routes resolve the tenant via `X-Store` header / `?store=` / subdomain
  (`ResolveStore`), which also switches the tenant connection.
- `database/migrations/2026_08_06_000400_create_sales_tables.php` is a superseded
  no-op (tables moved to tenant DBs) — safe to delete.
- The old `app/Domain/*` placeholder folders from the first scaffold are superseded.
