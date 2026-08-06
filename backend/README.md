# StoreForge Backend — Laravel REST API

Merge-ready Laravel API for the three Angular frontends. Auth is **Laravel Sanctum
personal access tokens** used as `Authorization: Bearer <token>`.

Full endpoint + schema documentation: `../Documents/API-Reference.md`.

## One-time setup (PHP 8.3+, Composer, MySQL)

```bash
# 1. Create a fresh Laravel app and add Sanctum + API routing
composer create-project laravel/laravel /tmp/laravel-fresh
cd /tmp/laravel-fresh
php artisan install:api --no-interaction        # requires network; installs laravel/sanctum

# 2. Merge the fresh app INTO this folder — existing files here win
rsync -a --ignore-existing /tmp/laravel-fresh/ /path/to/StoreForge/backend/

# 3. Install + configure
cd /path/to/StoreForge/backend
composer install
cp .env.example .env
php artisan key:generate
# .env: set DB_DATABASE=storeforge, DB_USERNAME, DB_PASSWORD

# 4. Database
php artisan migrate --seed

# 5. Run
php artisan serve                                # http://localhost:8000
```

The Angular apps proxy `/api` → `http://localhost:8000` in dev, so after seeding,
flip `useMocks: false` in each app's `src/environments/environment.ts` and the
apps run on this API with identical data to their mocks.

## Seeded logins

| Account | Email | Password | Portal |
|---|---|---|---|
| Store Owner (Aura Living) | `owner@auraliving.com` | `password` | Store Admin |
| Super Admin | `admin@storeforge.io` | `password` | Super Admin |

## Notes

- `routes/api.php` here replaces the one `install:api` generates (rsync keeps ours).
- `app/Models/User.php` here replaces the default (adds `HasApiTokens`, `role`, `store_id`).
- Storefront routes resolve the tenant from `X-Store` header / `?store=` query / subdomain
  (`app/Http/Middleware/ResolveStore.php`). In dev use `?store=auraliving`.
- The old `app/Domain/*` and `database/migrations/{landlord,tenant}` placeholder folders
  from the initial scaffold are superseded by this implementation — safe to delete.
