import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TenantService } from '../core/services/tenant.service';

@Component({
  selector: 'sf-storefront-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="announce">Free shipping on orders over <b>$99</b> · Cash on Delivery available at checkout</div>
    <div class="navbar">
      <div class="nav-inner">
        <a class="logo" routerLink="/store">
          <span class="logo-mark">{{ initial }}</span>{{ storeName }}
        </a>
        <nav class="nav-links">
          <a routerLink="/store" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/store/shop" routerLinkActive="active">Shop</a>
          <a routerLink="/store/track" routerLinkActive="active">Track Order</a>
          <a routerLink="/store/contact" routerLinkActive="active">Contact</a>
        </nav>
        <div class="nav-icons">
          <a routerLink="/store/wishlist" title="Wishlist">♡</a>
          <a routerLink="/store/cart" title="Cart">🛒</a>
        </div>
      </div>
    </div>

    <router-outlet />

    <footer>
      <div class="wrap foot-inner">
        <span>© 2026 {{ storeName }}.</span>
        <span>Powered by <b>StoreForge</b></span>
      </div>
    </footer>
  `,
  styles: `
    .announce {
      background: linear-gradient(90deg, #20201c, #3a3a34);
      color: #fff; text-align: center; font-size: 12.5px; padding: 9px 0;
    }
    .announce b { color: var(--flame-pale); }
    .navbar { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
    .nav-inner { max-width: 1180px; margin: 0 auto; padding: 0 28px; height: 72px; display: flex; align-items: center; gap: 20px; }
    .logo { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 800; font-size: 19px; }
    .logo-mark {
      width: 34px; height: 34px; border-radius: 10px; background: var(--grad-flame);
      display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 15px;
    }
    .nav-links { display: flex; gap: 4px; }
    .nav-links a { padding: 9px 14px; border-radius: 8px; font-size: 13.8px; color: var(--muted); }
    .nav-links a.active { color: var(--text); font-weight: 700; }
    .nav-icons { margin-left: auto; display: flex; gap: 8px; font-size: 18px; }
    .nav-icons a { width: 40px; height: 40px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; }
    .nav-icons a:hover { background: var(--canvas); }
    footer { background: #fbf9f5; border-top: 1px solid #e8e3db; padding: 26px 0; font-size: 13px; color: #6b6558; margin-top: 60px; }
    .foot-inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  `,
})
export class StorefrontLayout {
  private tenantSvc = inject(TenantService);
  get storeName(): string {
    return this.tenantSvc.tenant()?.businessName ?? this.tenantSvc.slug ?? 'Store';
  }
  get initial(): string {
    return this.storeName.charAt(0).toUpperCase();
  }
}
