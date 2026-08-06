# StoreForge — API Reference & Database Schema

**Version:** 1.1 · **Base URL:** `/api/v1` · **Auth:** Laravel Sanctum personal access tokens (`Authorization: Bearer <token>`)

**Architecture:** database-per-tenant. The central landlord database **`storeforge`** (SuperAdmin control) holds plans, all tenants, users, subscription invoices, and registrations. Every tenant gets its **own database** `storeforge_{slug}`, created automatically at provisioning — physical data isolation (NFR-01). Paid registrations run through **Stripe Checkout**; free trials provision instantly with no card.

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
| POST | `/register` | — | Tenant registration (PRV-01..06). Body: `{ businessName, name, email, password?, plan, billingCycle?, trial? }`.<br>**`trial: true`** → provisions immediately (creates the tenant database, default catalog, owner). Returns `201 { storeUrl, adminEmail, temporaryPassword }`.<br>**`trial: false`** → `password` required; creates a Stripe **subscription** Checkout Session and returns `{ checkoutUrl, sessionId }`. Provisioning happens on the webhook after payment. |
| GET | `/register/status?session_id=` | — | Poll after Stripe Checkout: `{ status: awaiting_payment \| completed \| failed, result?: { storeUrl, adminEmail } }`. |
| POST | `/stripe/webhook` | Stripe signature | Stripe events: `checkout.session.completed` → provision tenant DB + store + owner; `invoice.paid` → record subscription invoice; `customer.subscription.deleted` → mark tenant cancelled. |
| POST | `/contact` | — | Platform enquiry → landlord DB (WEB-04). Body: `{ name, email, phone?, topic?, message }`. Returns `201 { ok: true }`. |

---

## 3. Store Admin APIs (frontend-admin) — `Bearer` required

All routes run behind `UseTenantDatabase` middleware: queries execute against the **authenticated user's own tenant database** — isolation is physical, not just a WHERE clause (NFR-01). Invoices and settings read the landlord DB.

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

The tenant is resolved by `ResolveStore` middleware — `X-Store: auraliving` header → `?store=auraliving` query → `{slug}.storeforge.io` subdomain — which also switches the connection to that tenant's database. **Dev tip:** append `?store=auraliving`.

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

**Two levels of databases.** The landlord database `storeforge` is the SuperAdmin control plane; each tenant's commerce data lives in its own database `storeforge_{slug}` with **no `store_id` columns** — the database itself is the isolation boundary. Tenant DBs are created by `App\Services\ProvisionTenant` and migrated from `database/migrations/tenant/` (`php artisan tenants:migrate` applies new migrations to all of them).

### 5.1 Landlord database — `storeforge` (SuperAdmin / platform control)

| Table | Columns (key ones) | Purpose |
|---|---|---|
| `plans` | id, name ᵁ, description, monthly_price, yearly_price, product_limit ᴺ, admin_user_limit ᴺ, custom_domain_limit ᴺ, features (json), featured | Subscription plans (SUB-01). `NULL` limit = unlimited. |
| `stores` | id, name, slug ᵁ, **database** ᵁ, plan_id →plans, billing_cycle, status (trial/active/cancelled), trial_ends_at ᴺ, **stripe_customer_id** ᴺ, **stripe_subscription_id** ᴺ, theme_color, support_email, support_phone, address | Tenant registry — one row per store, pointing at its own database. |
| `users` | id, name, email ᵁ, password, **role** (super_admin/store_owner/store_admin), **store_id** →stores ᴺ | All logins (platform + store staff). Sanctum tokens in `personal_access_tokens`. |
| `invoices` | id, store_id →stores, number · unique(store, number), plan_name, amount, status, stripe_invoice_id ᴺ, issued_at | Subscription billing history (SUB-06), fed by Stripe `invoice.paid`. |
| `pending_registrations` | id, stripe_session_id ᵁᴺ, business_name, owner_name, email, password_hash ᴺ, plan_name, billing_cycle, status (awaiting_payment/completed/failed), result (json) ᴺ | Paid registrations awaiting Stripe Checkout completion. |
| `contact_messages` | id, name, email, phone ᴺ, topic ᴺ, message | Platform enquiries from the marketing site. |

### 5.2 Tenant databases — `storeforge_{slug}` (one per store)

| Table | Columns (key ones) | Purpose |
|---|---|---|
| `categories` | id, parent_id →categories ᴺ, name, slug ᵁ, description ᴺ | Two-level category tree (ADM-03). |
| `products` | id, category_id →categories, name, sku ᵁ, price, discount_percent, stock, emoji, image_url ᴺ, rating, featured, latest, short_description ᴺ, description ᴺ | Catalog (ADM-02 / STF-03). |
| `banners` | id, kind, title, subtitle ᴺ, color1, color2, active | Banners; also feed storefront hero slides (ADM-04). |
| `customers` | id, name, email ᵁ, phone ᴺ, city ᴺ, joined_at | Shoppers (ADM-07). |
| `orders` | id, customer_id ᴺ, number ᵁ (AL-3081), status, payment_method (COD/Card), total, tracking_number ᴺ, customer_name, customer_phone, delivery_address, placed_at | Order lifecycle per BRD §7. |
| `order_items` | id, order_id →orders, product_id ᴺ, name, quantity, unit_price | Line items at purchase-time prices. |
| `carts` / `cart_items` | carts: id, customer_id ᴺ, last_activity_at · cart_items: cart_id, product_id, quantity | Carts pending checkout; state derived from `last_activity_at` (ADM-06). |
| `contact_messages` | id, name, email, phone ᴺ, order_number ᴺ, message | Storefront enquiries (STF-10). |

ᵁ = unique · ᴺ = nullable · → = foreign key

### 5.3 Stripe registration flow

```
POST /register (trial:false) ──► pending_registrations (awaiting_payment)
        │                              │
        └─► Stripe Checkout Session ◄──┘   frontend redirects to checkoutUrl
                     │ payment
                     ▼
POST /stripe/webhook (checkout.session.completed)
        └─► ProvisionTenant: CREATE DATABASE storeforge_{slug}
            → migrate tenant schema → store + owner user (landlord)
            → pending_registrations.status = completed
                     ▲
GET /register/status?session_id=…  (frontend polls → { storeUrl, adminEmail })
```

---

## 6. Seed Data (`php artisan migrate --seed`)

`PlanSeeder` creates the three plans. `DemoStoreSeeder` provisions the **Aura Living** demo tenant — creating its own database `storeforge_auraliving`, migrating it, then seeding the *exact* dataset the Angular `mock.ts` files use — flip `useMocks: false` and the apps look identical:

3 parent categories with 7 sub-categories · 12 products (SKUs `AL-BED-101` … `AL-FUR-618`) · 13 customers · 8 orders (`AL-3081`–`AL-3088`) with line items and correct statuses · 5 pending carts at 5–487 hours idle · 3 banners · 4 invoices · owner + super-admin users.

Seeders use `updateOrCreate`, so re-running is safe.

---

## 7. Frontend Integration

Each Angular app has one switch in `src/environments/environment.ts`:

```ts
useMocks: false   // → all DataService calls hit this API at /api/v1
```

Dev proxying (`proxy.conf.json`) forwards `/api` → `http://localhost:8000`. The admin app attaches the Sanctum token via its auth interceptor after `POST /auth/login`. For the storefront in dev, requests should carry `?store=auraliving` (or an `X-Store` header) until subdomains exist locally.
