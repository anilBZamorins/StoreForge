# StoreForge — API Reference & Database Schema

**Version:** 1.0 · **Base URL:** `/api/v1` · **Auth:** Laravel Sanctum personal access tokens (`Authorization: Bearer <token>`)

This document covers every endpoint consumed by the three Angular apps (`frontend-website`, `frontend-admin`, `frontend-storefront`) and the full database schema. Implementation lives in `backend/` — see `backend/README.md` for setup.

---

## 1. Authentication (Sanctum Bearer Token)

Login returns a Sanctum personal access token. Send it on every protected request:

```
Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Body: `{ email, password, portal: "store" \| "super" }`. Returns `{ token, user: { id, name, email, role, tenantSlug } }`. Portal is validated against the user's role. |
| POST | `/auth/logout` | Bearer | Revokes the current token. |
| GET | `/auth/me` | Bearer | Returns the authenticated user. |

**Seeded logins:** Store Owner `owner@auraliving.com` / `password` · Super Admin `admin@storeforge.io` / `password`.

---

## 2. Public Platform APIs (frontend-website)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/plans` | — | All subscription plans. Superset shape serves both apps: `{ name, description, monthlyPrice, yearlyPrice, monthly, yearly, features, feats, featured, productLimit, adminUserLimit, customDomainLimit }`. |
| POST | `/register` | — | Tenant provisioning (PRV-01..06). Body: `{ businessName, name, email, password?, plan, billingCycle?, trial? }`. Creates store + slug + default category + owner user. Returns `201 { storeUrl, adminEmail, temporaryPassword }`. |
| POST | `/contact` | — | Platform enquiry (WEB-04). Body: `{ name, email, phone?, topic?, message }`. Returns `201 { ok: true }`. |

---

## 3. Store Admin APIs (frontend-admin) — `Bearer` required

All routes are scoped to the authenticated user's store (`users.store_id`) — tenant isolation is enforced server-side (NFR-01).

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard/kpis` | KPI cards computed from live data: `[{ label, value, delta, up, icon, bars[7] }]` (ADM-01). |

### Products (ADM-02)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/products` | `[{ id, name, sub, price, discount, stock, sku, emoji }]` — `sub` is the sub-category slug. |
| POST | `/admin/products` | Body: `{ name, sub, sku, price, discount?, stock, emoji?, shortDesc?, fullDesc? }`. |
| PUT | `/admin/products/{id}` | Same body; updates in place. |
| DELETE | `/admin/products/{id}` | Removes the product. |

Stock status is **derived**, never stored: `0 → Out of Stock`, `< 10 → Low Stock`, else `Active`.

### Categories (ADM-03)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/categories` | Two-level tree: `[{ id: slug, name, subs: [{ id, name, count }] }]` with live product counts. |
| POST | `/admin/categories` | Body: `{ name, description?, parentId? }` — `parentId` (parent slug) present ⇒ creates a sub-category. |
| PUT | `/admin/categories/{slug}` | Body: `{ name, description? }`. |
| DELETE | `/admin/categories/{slug}` | Cascades to children/products. |

### Orders (ADM-05)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/orders` | `[{ id: "AL-3081", orderId, customer, date, items, total, status, tracking, addr, phone, payment }]`. |
| PUT | `/admin/orders/{orderId}` | Body: `{ status?, tracking? }` — status lifecycle: Pending → Processing → Shipped → Out for Delivery → Delivered, plus Cancelled. |

### Customers / Carts / Banners / Invoices / Settings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/customers` | `[{ id, name, email, phone, city, orders, spent, joined }]` — spend is summed live (ADM-07). |
| GET | `/admin/carts` | Carts pending checkout: `[{ id, customer, email, phone, items: [{ pid, qty }], hoursIdle }]`. State derived client- or server-side: `< 24h Active`, `24h–7d Idle`, `> 7d Abandoned` (ADM-06). |
| GET | `/admin/banners` | `[{ id, kind, title, sub, color1, color2, status }]` (ADM-04). |
| POST | `/admin/banners` | Body: `{ kind, title, sub?, color1?, color2?, active? }`. |
| PUT | `/admin/banners/{id}` | Partial update — used to toggle `active`. |
| GET | `/admin/invoices` | `[{ id: "INV-0231", date, plan, amount, status }]` (SUB-06). |
| GET | `/admin/settings` | `{ storeName, domain, themeColor, supportEmail, supportPhone, address, plan, billingCycle, status }` (ADM-10). |
| PUT | `/admin/settings` | Partial update of the above. |

---

## 4. Storefront APIs (frontend-storefront) — public, tenant-resolved

The tenant is resolved by `ResolveStore` middleware, in priority order: `X-Store: auraliving` header → `?store=auraliving` query → `{slug}.storeforge.io` subdomain. **Dev tip:** append `?store=auraliving`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/store/slides` | Hero slides from active banners: `[{ eyebrow, title, sub, c1, c2 }]` (STF-02). |
| GET | `/store/categories` | Parent categories with gradient colors: `[{ id, name, color1, color2 }]`. |
| GET | `/store/products` | `[{ id, name, sub, price, discount, stock, emoji, rating, featured, latest, desc }]` — `sub` is the sub-category *label* here (STF-03). |
| GET | `/store/products/{id}` | Single product, same shape (STF-04). |
| GET | `/store/orders?email=` | Tracked orders: `[{ id, date, items, total, status }]` (STF-09). |
| POST | `/store/orders` | Place a COD order (STF-07/08). Body: `{ name, email?, phone, address, city, state?, zip?, paymentMethod: "COD", items: [{ productId, qty }] }`. Validates stock, decrements it, creates/attaches the customer, clears their pending cart. Returns `201 { orderId: "AL-3101" }`. |
| POST | `/store/contact` | Tenant enquiry with optional `orderNo` (STF-10). |

---

## 5. Database Schema

Single database, multi-tenant by `store_id` foreign key — every tenant-owned table cascades on store delete, and every admin query is scoped by the authenticated user's store (NFR-01).

| Table | Columns (key ones) | Purpose |
|---|---|---|
| `plans` | id, name ᵁ, description, monthly_price, yearly_price, product_limit ᴺ, admin_user_limit ᴺ, custom_domain_limit ᴺ, features (json), featured | Subscription plans (SUB-01). `NULL` limit = unlimited. |
| `stores` | id, name, slug ᵁ, plan_id →plans, billing_cycle, status (trial/active/cancelled), trial_ends_at ᴺ, theme_color, support_email, support_phone, address | Tenants. `slug` powers `{slug}.storeforge.io`. |
| `users` | id, name, email ᵁ, password, **role** (super_admin/store_owner/store_admin), **store_id** →stores ᴺ | All logins. Sanctum tokens live in `personal_access_tokens` (created by `install:api`). |
| `categories` | id, store_id →stores, parent_id →categories ᴺ, name, slug, description ᴺ · unique(store, slug) | Two-level category tree (ADM-03). |
| `products` | id, store_id, category_id →categories, name, sku, price, discount_percent, stock, emoji, image_url ᴺ, rating, featured, latest, short_description ᴺ, description ᴺ · unique(store, sku) | Catalog (ADM-02 / STF-03). |
| `banners` | id, store_id, kind, title, subtitle ᴺ, color1, color2, active | Homepage/Category/Offer banners; also feed storefront hero slides (ADM-04). |
| `customers` | id, store_id, name, email, phone ᴺ, city ᴺ, joined_at · unique(store, email) | Shoppers (ADM-07). |
| `orders` | id, store_id, customer_id →customers ᴺ, number (AL-3081) · unique(store, number), status, payment_method (COD/Card), total, tracking_number ᴺ, customer_name, customer_phone, delivery_address, placed_at | Order lifecycle per BRD §7. |
| `order_items` | id, order_id →orders, product_id ᴺ, name, quantity, unit_price | Line items; unit_price captures the discounted price at purchase time. |
| `carts` | id, store_id, customer_id ᴺ, last_activity_at | Carts pending checkout; state derived from `last_activity_at` (ADM-06). |
| `cart_items` | id, cart_id →carts, product_id, quantity | Cart lines. |
| `invoices` | id, store_id, number (INV-0231) · unique(store, number), plan_name, amount, status, issued_at | Subscription billing history (SUB-06). |
| `contact_messages` | id, store_id ᴺ (null = platform enquiry), name, email, phone ᴺ, topic ᴺ, order_number ᴺ, message | Contact forms from website and storefronts. |

ᵁ = unique · ᴺ = nullable · → = foreign key

---

## 6. Seed Data (`php artisan migrate --seed`)

`PlanSeeder` creates the three plans. `DemoStoreSeeder` creates the **Aura Living** demo tenant with the *exact* dataset the Angular `mock.ts` files use — flip `useMocks: false` and the apps look identical:

3 parent categories with 7 sub-categories · 12 products (SKUs `AL-BED-101` … `AL-FUR-618`) · 13 customers · 8 orders (`AL-3081`–`AL-3088`) with line items and correct statuses · 5 pending carts at 5–487 hours idle · 3 banners · 4 invoices · owner + super-admin users.

Seeders use `updateOrCreate`, so re-running is safe.

---

## 7. Frontend Integration

Each Angular app has one switch in `src/environments/environment.ts`:

```ts
useMocks: false   // → all DataService calls hit this API at /api/v1
```

Dev proxying (`proxy.conf.json`) forwards `/api` → `http://localhost:8000`. The admin app attaches the Sanctum token via its auth interceptor after `POST /auth/login`. For the storefront in dev, requests should carry `?store=auraliving` (or an `X-Store` header) until subdomains exist locally.
