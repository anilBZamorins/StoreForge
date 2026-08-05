import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MOCK_STORE } from './mock';

@Component({
  selector: 'sf-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">{{ store.name.charAt(0) }}</span>
        <div>
          <div class="brand-name">{{ store.name }}</div>
          <div class="brand-sub">{{ store.domain }}</div>
          <span class="plan-tag">{{ store.plan }} Plan</span>
        </div>
      </div>
      <nav>
        <div class="navlabel">Overview</div>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <div class="navlabel">Catalog</div>
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/categories" routerLinkActive="active">Categories</a>
        <a routerLink="/banners" routerLinkActive="active">Banners</a>
        <div class="navlabel">Sales</div>
        <a routerLink="/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/carts" routerLinkActive="active">Abandoned Carts</a>
        <a routerLink="/customers" routerLinkActive="active">Customers</a>
        <a routerLink="/reports" routerLinkActive="active">Reports</a>
        <div class="navlabel">Account</div>
        <a routerLink="/billing" routerLinkActive="active">Billing & Subscription</a>
        <a routerLink="/settings" routerLinkActive="active">Store Settings</a>
      </nav>
    </aside>
    <main class="main"><router-outlet /></main>
  `,
  styles: `
    :host { display: flex; min-height: 100vh; background: var(--canvas-admin); }
    .sidebar {
      width: 236px; flex-shrink: 0; position: fixed; top: 0; left: 0; bottom: 0;
      display: flex; flex-direction: column; padding: 20px 12px; overflow-y: auto;
      background:
        radial-gradient(ellipse at top left, rgba(255, 90, 54, 0.12) 0%, transparent 45%),
        var(--grad-ink-vertical);
      color: #c3cbdc;
    }
    .brand { display: flex; gap: 10px; align-items: flex-start; padding: 0 8px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 12px; }
    .brand-mark { width: 34px; height: 34px; border-radius: 9px; background: var(--flame); display: inline-flex; align-items: center; justify-content: center; color: #fff; font-family: var(--font-display); font-weight: 800; flex-shrink: 0; }
    .brand-name { font-family: var(--font-display); font-weight: 700; color: #fff; font-size: 15px; }
    .brand-sub { font-size: 11px; color: #8b96ac; }
    .plan-tag { display: inline-block; margin-top: 6px; font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em; color: #ffcfc0; background: rgba(255,90,54,0.22); padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
    nav { flex: 1; }
    .navlabel { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #5c6b85; padding: 14px 10px 6px; font-weight: 600; }
    nav a { display: block; padding: 9px 11px; margin-bottom: 2px; border-radius: 8px; font-size: 13.6px; color: #c3cbdc; }
    nav a:hover { background: rgba(255,255,255,0.06); color: #fff; }
    nav a.active { background: rgba(255,90,54,0.16); color: #fff; }
    .main { margin-left: 236px; flex: 1; min-width: 0; padding: 26px 28px; }
  `,
})
export class Layout {
  store = MOCK_STORE;
}
