import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'sf-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">SF</span>
        <div>
          <div class="brand-name">{{ auth.user()?.tenantSlug ?? 'Your Store' }}</div>
          <div class="brand-sub">Store Admin Dashboard</div>
        </div>
      </div>
      <nav>
        <div class="navlabel">Overview</div>
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <div class="navlabel">Catalog</div>
        <a routerLink="/admin/products" routerLinkActive="active">Products</a>
        <a routerLink="/admin/categories" routerLinkActive="active">Categories</a>
        <a routerLink="/admin/banners" routerLinkActive="active">Banners</a>
        <div class="navlabel">Sales</div>
        <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/admin/carts" routerLinkActive="active">Abandoned Carts</a>
        <a routerLink="/admin/customers" routerLinkActive="active">Customers</a>
        <a routerLink="/admin/reports" routerLinkActive="active">Reports</a>
        <div class="navlabel">Account</div>
        <a routerLink="/admin/billing" routerLinkActive="active">Billing & Subscription</a>
        <a routerLink="/admin/settings" routerLinkActive="active">Store Settings</a>
      </nav>
      <button class="logout" (click)="auth.logout()">Log out</button>
    </aside>
    <main class="main">
      <router-outlet />
    </main>
  `,
  styles: `
    :host { display: flex; min-height: 100vh; background: var(--canvas-admin); }
    .sidebar {
      width: 236px; flex-shrink: 0; position: fixed; top: 0; left: 0; bottom: 0;
      display: flex; flex-direction: column; padding: 20px 12px;
      background:
        radial-gradient(ellipse at top left, rgba(255, 90, 54, 0.12) 0%, transparent 45%),
        var(--grad-ink-vertical);
      color: #c3cbdc;
    }
    .brand { display: flex; gap: 10px; align-items: center; padding: 0 8px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 12px; }
    .brand-mark {
      width: 34px; height: 34px; border-radius: 9px; background: var(--flame);
      display: inline-flex; align-items: center; justify-content: center;
      color: #fff; font-family: var(--font-display); font-weight: 800;
    }
    .brand-name { font-family: var(--font-display); font-weight: 700; color: #fff; font-size: 15px; }
    .brand-sub { font-size: 11px; color: #8b96ac; }
    nav { flex: 1; overflow-y: auto; }
    .navlabel { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #5c6b85; padding: 14px 10px 6px; font-weight: 600; }
    nav a { display: block; padding: 9px 11px; margin-bottom: 2px; border-radius: 8px; font-size: 13.6px; color: #c3cbdc; }
    nav a:hover { background: rgba(255,255,255,0.06); color: #fff; }
    nav a.active { background: rgba(255,90,54,0.16); color: #fff; }
    .logout {
      margin: 10px 8px 0; padding: 9px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
      background: transparent; color: #c3cbdc; cursor: pointer; font-family: var(--font-body); font-size: 13px;
    }
    .logout:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .main { margin-left: 236px; flex: 1; min-width: 0; padding: 26px 28px; }
  `,
})
export class AdminLayout {
  auth = inject(AuthService);
}
