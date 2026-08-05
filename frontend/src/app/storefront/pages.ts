import { Component } from '@angular/core';

/**
 * Shell pages for the tenant storefront.
 * Each maps to an STF-* requirement in the BRD and its section in
 * Documents/Mockup/aura-living-storefront-mockup.html.
 */

function pageStyles(): string {
  return `
    .page { max-width: 1180px; margin: 0 auto; padding: 48px 28px; }
    h1 { font-size: 30px; margin: 0 0 8px; }
    p { color: var(--muted); font-size: 14px; }
  `;
}

@Component({
  selector: 'sf-store-home',
  template: `
    <div class="page">
      <div class="hero premium-band">
        <h1>Welcome to the store</h1>
        <p>Hero slider, category cards, featured &amp; new-arrival grids per STF-02 — data from GET /api/v1/store/home.</p>
      </div>
    </div>
  `,
  styles: `
    .page { max-width: 1180px; margin: 0 auto; padding: 26px 28px; }
    .hero { padding: 64px 56px; min-height: 240px; }
    .hero h1 { font-size: 38px; margin: 0 0 12px; }
    .hero p { opacity: 0.85; max-width: 480px; }
  `,
})
export class StoreHome {}

@Component({
  selector: 'sf-store-shop',
  template: `<div class="page"><h1>Shop All</h1><p>Filter sidebar (category, price, stock), sorting, and product grid per STF-03.</p></div>`,
  styles: pageStyles(),
})
export class StoreShop {}

@Component({
  selector: 'sf-store-product',
  template: `<div class="page"><h1>Product Detail</h1><p>Gallery, price with discount, quantity stepper, add-to-cart/wishlist, tabs, related products per STF-04.</p></div>`,
  styles: pageStyles(),
})
export class StoreProduct {}

@Component({
  selector: 'sf-store-wishlist',
  template: `<div class="page"><h1>Your Wishlist</h1><p>Saved products grid with empty state per STF-05.</p></div>`,
  styles: pageStyles(),
})
export class StoreWishlist {}

@Component({
  selector: 'sf-store-cart',
  template: `<div class="page"><h1>Your Cart</h1><p>Line items, save-for-later, and order summary (free shipping over $99) per STF-06.</p></div>`,
  styles: pageStyles(),
})
export class StoreCart {}

@Component({
  selector: 'sf-store-checkout',
  template: `<div class="page"><h1>Checkout</h1><p>Delivery details + payment method (Cash on Delivery default; card UI Phase 2) per STF-07, then confirmation per STF-08.</p></div>`,
  styles: pageStyles(),
})
export class StoreCheckout {}

@Component({
  selector: 'sf-store-track',
  template: `<div class="page"><h1>Your Orders</h1><p>Order list with visual status progress per STF-09 (Section 7 lifecycle).</p></div>`,
  styles: pageStyles(),
})
export class StoreTrack {}

@Component({
  selector: 'sf-store-contact',
  template: `<div class="page"><h1>We're here to help</h1><p>Store contact form with optional order number per STF-10.</p></div>`,
  styles: pageStyles(),
})
export class StoreContact {}
