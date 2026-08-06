import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService, DataService } from './services/data.service';

@Component({
  selector: 'sf-store-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="announce">Free shipping on orders over <b>\${{ data.store.freeShippingOver }}</b> · Cash on Delivery available at checkout</div>
    <div class="navbar">
      <div class="nav-inner">
        <a class="logo" routerLink="/"><span class="logo-mark">{{ data.store.name.charAt(0) }}</span>{{ data.store.name }}</a>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/shop" routerLinkActive="active">Shop</a>
          <a routerLink="/track" routerLinkActive="active">Track Order</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>
        <div class="nav-icons">
          <a routerLink="/wishlist" title="Wishlist">♡ @if (cart.wishlist().length) { <span class="pill">{{ cart.wishlist().length }}</span> }</a>
          <a routerLink="/cart" title="Cart">🛒 @if (cart.count()) { <span class="pill">{{ cart.count() }}</span> }</a>
        </div>
      </div>
    </div>
    <router-outlet />
    <footer>
      <div class="wrap foot"><span>© 2026 {{ data.store.name }}.</span><span>Powered by <b>StoreForge</b></span></div>
    </footer>
  `,
  styles: `
    .announce { background: linear-gradient(90deg, #20201c, #3a3a34); color: #fff; text-align: center; font-size: 12.5px; padding: 9px 0; }
    .announce b { color: var(--flame-pale); }
    .navbar { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px); border-bottom: 1px solid #e8e3db; }
    .nav-inner { max-width: 1180px; margin: 0 auto; padding: 0 28px; height: 72px; display: flex; align-items: center; gap: 20px; }
    .logo { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 800; font-size: 19px; }
    .logo-mark { width: 34px; height: 34px; border-radius: 10px; background: var(--grad-flame); display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; }
    .nav-links { display: flex; gap: 4px; }
    .nav-links a { padding: 9px 14px; border-radius: 8px; font-size: 13.8px; color: #6b6558; }
    .nav-links a.active { color: #20201c; font-weight: 700; }
    .nav-icons { margin-left: auto; display: flex; gap: 8px; font-size: 16px; }
    .nav-icons a { padding: 8px 12px; border-radius: 10px; display: inline-flex; align-items: center; gap: 5px; }
    .nav-icons a:hover { background: #fbf9f5; }
    .pill { background: var(--flame); color: #fff; font-size: 10.5px; font-weight: 700; min-width: 17px; height: 17px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; padding: 0 4px; }
    footer { background: #fbf9f5; border-top: 1px solid #e8e3db; padding: 26px 0; font-size: 13px; color: #6b6558; margin-top: 60px; }
    .wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
    .foot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  `,
})
export class Layout {
  data = inject(DataService);
  cart = inject(CartService);
}
