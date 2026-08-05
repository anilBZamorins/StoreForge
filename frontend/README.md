# StoreForge Frontend (Angular)

Single Angular workspace serving all three surfaces as lazy-loaded areas:

| Route      | Area                  | Source              |
|------------|-----------------------|---------------------|
| `/`        | Marketing website     | `src/app/website/`  |
| `/admin`   | Store Admin Dashboard | `src/app/admin/`    |
| `/store`   | Tenant storefront     | `src/app/storefront/` |

## Run locally

```bash
npm install
npm start          # serves on http://localhost:4200, proxies /api → http://localhost:8000 (Laravel)
```

## Build for production

```bash
npm run build      # outputs to dist/storeforge-frontend/browser
```

## Structure

- `src/styles/_tokens.scss` — design tokens generated from `Documents/storeforge-color-guide.html` (v1.2): brand colors, premium gradients, status badges.
- `src/app/core/` — API service (`/api/v1`), auth service + interceptor + guard, tenant resolver ({slug}.storeforge.io → store).
- Each area has a layout component (navbar/sidebar per the mockups) and shell pages annotated with the BRD requirement IDs they implement.

## Notes

- Dev API proxy is configured in `proxy.conf.json`; production routing is handled by Nginx (`deploy/nginx/storeforge.conf`).
- Font inlining is disabled in the production build config (fonts load from Google Fonts at runtime).
