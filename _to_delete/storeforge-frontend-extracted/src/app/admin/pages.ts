import { Component } from '@angular/core';

/**
 * Shell pages for the Store Admin Dashboard.
 * Each maps to an ADM-* requirement in the BRD and its section in
 * Documents/Mockup/storeforge-admin-dashboard.html.
 */

function pageStyles(): string {
  return `
    h1 { font-size: 22px; margin: 0 0 4px; }
    .sub { color: var(--muted); font-size: 13px; margin: 0 0 22px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; color: var(--muted); font-size: 13.5px; }
  `;
}

@Component({
  selector: 'sf-admin-dashboard',
  template: `
    <h1>Dashboard</h1>
    <p class="sub">Welcome back — here's how your store is doing today</p>
    <div class="card">KPI cards, recent orders, plan usage, and carts pending checkout (ADM-01) — data from GET /api/v1/admin/dashboard.</div>
  `,
  styles: pageStyles(),
})
export class AdminDashboard {}

@Component({
  selector: 'sf-admin-products',
  template: `<h1>Products</h1><p class="sub">Manage your product catalog, pricing and stock</p><div class="card">Product table with search, category/status filters, pagination, and add/edit modal (ADM-02).</div>`,
  styles: pageStyles(),
})
export class AdminProducts {}

@Component({
  selector: 'sf-admin-categories',
  template: `<h1>Categories</h1><p class="sub">Organize categories and sub-categories</p><div class="card">Two-level category tree with product counts (ADM-03).</div>`,
  styles: pageStyles(),
})
export class AdminCategories {}

@Component({
  selector: 'sf-admin-banners',
  template: `<h1>Banners</h1><p class="sub">Manage homepage, category and offer banners</p><div class="card">Banner cards with type, artwork, and active status (ADM-04).</div>`,
  styles: pageStyles(),
})
export class AdminBanners {}

@Component({
  selector: 'sf-admin-orders',
  template: `<h1>Orders</h1><p class="sub">Track and fulfil customer orders</p><div class="card">Order table with status filter and detail modal driving the lifecycle: Pending → Processing → Shipped → Out for Delivery → Delivered (ADM-05).</div>`,
  styles: pageStyles(),
})
export class AdminOrders {}

@Component({
  selector: 'sf-admin-carts',
  template: `<h1>Abandoned Carts</h1><p class="sub">See what customers added to cart before leaving</p><div class="card">Carts with value, last activity, and state — Active &lt; 24h, Idle 24h–7d, Abandoned &gt; 7d (ADM-06).</div>`,
  styles: pageStyles(),
})
export class AdminCarts {}

@Component({
  selector: 'sf-admin-customers',
  template: `<h1>Customers</h1><p class="sub">View customers and their order history</p><div class="card">Customer directory with spend totals and drill-down (ADM-07).</div>`,
  styles: pageStyles(),
})
export class AdminCustomers {}

@Component({
  selector: 'sf-admin-reports',
  template: `<h1>Reports</h1><p class="sub">Sales and order performance for your store</p><div class="card">7-day sales bars, orders by status, top products by revenue (ADM-08).</div>`,
  styles: pageStyles(),
})
export class AdminReports {}

@Component({
  selector: 'sf-admin-billing',
  template: `<h1>Billing & Subscription</h1><p class="sub">Manage your StoreForge plan and payment history</p><div class="card">Current-plan card with usage bars, plan switcher with billing-cycle toggle, invoice history, cancel flow (ADM-09, SUB-04..07).</div>`,
  styles: pageStyles(),
})
export class AdminBilling {}

@Component({
  selector: 'sf-admin-settings',
  template: `<h1>Store Settings</h1><p class="sub">Branding, contact info, footer and social links</p><div class="card">Tabbed settings — General (logo, theme color presets), Contact, Footer, Social (ADM-10).</div>`,
  styles: pageStyles(),
})
export class AdminSettings {}
