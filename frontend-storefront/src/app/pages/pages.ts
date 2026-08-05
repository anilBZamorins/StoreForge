import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, DataService } from '../services/data.service';
import { Category, Product, Slide, TrackedOrder, STATUS_FLOW, badgeClass, finalPrice } from '../models';

const GRID = `
  .page { max-width: 1180px; margin: 0 auto; padding: 30px 28px 60px; }
  h1 { font-size: 28px; margin: 0 0 18px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  @media (max-width: 1000px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  .pcard { border: 1px solid #e8e3db; border-radius: 16px; overflow: hidden; background: #fff; transition: box-shadow 0.15s, transform 0.15s; }
  .pcard:hover { box-shadow: 0 14px 30px rgba(32,32,28,0.08); transform: translateY(-2px); }
  .media { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 52px; background: #fbf9f5; cursor: pointer; position: relative; }
  .tag { position: absolute; top: 10px; left: 10px; background: var(--flame); color: #fff; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
  .body { padding: 13px 15px 15px; }
  .cat { font-size: 11px; color: #6b6558; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
  .name { font-size: 14px; font-weight: 600; margin-bottom: 6px; cursor: pointer; }
  .rate { font-size: 11.5px; color: #6b6558; margin-bottom: 8px; }
  .row { display: flex; align-items: center; justify-content: space-between; }
  .price { font-family: var(--font-display); font-weight: 700; font-size: 15.5px; }
  .old { font-size: 12px; color: #6b6558; text-decoration: line-through; font-weight: 500; margin-left: 6px; }
  .add { width: 32px; height: 32px; border-radius: 9px; background: #20201c; color: #fff; border: none; cursor: pointer; font-size: 15px; }
  .oos { font-size: 10.5px; font-weight: 700; color: #c4453e; margin-top: 6px; }
`;

// ---------- HOME ----------
@Component({
  selector: 'sf-home',
  imports: [RouterLink],
  template: `
    <div class="page">
      @if (slides().length) {
        <div class="hero" [style.background]="heroBg()">
          <div class="inner">
            <div class="eyebrow">{{ slides()[idx()].eyebrow }}</div>
            <h1>{{ slides()[idx()].title }}</h1>
            <p>{{ slides()[idx()].sub }}</p>
            <a class="btn btn-flame btn-lg" routerLink="/shop">Shop Now</a>
          </div>
          <div class="dots">
            @for (s of slides(); track $index) {
              <button [class.on]="$index === idx()" (click)="idx.set($index)"></button>
            }
          </div>
        </div>
      }
      <h2>Shop by category</h2>
      <div class="cats">
        @for (c of categories(); track c.id) {
          <a class="ccard" routerLink="/shop" [style.background]="'linear-gradient(135deg,' + c.color1 + ',' + c.color2 + ')'">{{ c.name }}</a>
        }
      </div>
      <h2>Featured products</h2>
      <div class="grid">
        @for (p of featured(); track p.id) {
          <div class="pcard">
            <div class="media" [routerLink]="['/product', p.id]">{{ p.emoji }}@if (p.discount) { <span class="tag">-{{ p.discount }}%</span> }</div>
            <div class="body">
              <div class="cat">{{ p.sub }}</div>
              <div class="name" [routerLink]="['/product', p.id]">{{ p.name }}</div>
              <div class="rate">★ {{ p.rating }}</div>
              <div class="row">
                <span class="price">\${{ finalPrice(p) }}@if (p.discount) { <span class="old">\${{ p.price }}</span> }</span>
                <button class="add" (click)="cart.add(p)">+</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: GRID + `
    .hero { border-radius: 20px; padding: 64px 56px; color: #fff; min-height: 260px; position: relative; margin-bottom: 40px; }
    .inner { max-width: 440px; }
    .eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.85; margin-bottom: 12px; }
    .hero h1 { font-size: 38px; line-height: 1.15; margin: 0 0 14px; }
    .hero p { font-size: 15px; opacity: 0.9; margin: 0 0 24px; line-height: 1.6; }
    .dots { position: absolute; bottom: 20px; left: 56px; display: flex; gap: 7px; }
    .dots button { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); border: none; cursor: pointer; padding: 0; }
    .dots button.on { background: #fff; width: 22px; border-radius: 6px; }
    h2 { margin: 34px 0 18px; font-size: 24px; }
    .cats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    @media (max-width: 800px) { .cats { grid-template-columns: 1fr; } }
    .ccard { border-radius: 16px; padding: 60px 26px 24px; color: #fff; font-family: var(--font-display); font-weight: 700; font-size: 19px; }
  `,
})
export class HomePage implements OnInit {
  private data = inject(DataService);
  cart = inject(CartService);
  slides = signal<Slide[]>([]);
  categories = signal<Category[]>([]);
  featured = signal<Product[]>([]);
  idx = signal(0);
  finalPrice = finalPrice;
  heroBg = computed(() => {
    const s = this.slides()[this.idx()];
    return s ? `radial-gradient(ellipse at top right, rgba(255,90,54,0.18) 0%, transparent 55%), linear-gradient(135deg, ${s.c1}, ${s.c2})` : '';
  });
  ngOnInit() {
    this.data.getSlides().subscribe(s => this.slides.set(s));
    this.data.getCategories().subscribe(c => this.categories.set(c));
    this.data.getFeatured().subscribe(p => this.featured.set(p));
  }
}

// ---------- SHOP ----------
@Component({
  selector: 'sf-shop',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page">
      <h1>Shop All</h1>
      <div class="bar">
        <span>{{ filtered().length }} products</span>
        <select [(ngModel)]="sort">
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <div class="grid">
        @for (p of filtered(); track p.id) {
          <div class="pcard">
            <div class="media" [routerLink]="['/product', p.id]">{{ p.emoji }}@if (p.discount) { <span class="tag">-{{ p.discount }}%</span> }</div>
            <div class="body">
              <div class="cat">{{ p.sub }}</div>
              <div class="name" [routerLink]="['/product', p.id]">{{ p.name }}</div>
              <div class="rate">★ {{ p.rating }}</div>
              <div class="row">
                <span class="price">\${{ finalPrice(p) }}@if (p.discount) { <span class="old">\${{ p.price }}</span> }</span>
                @if (p.stock > 0) { <button class="add" (click)="cart.add(p)">+</button> }
              </div>
              @if (p.stock === 0) { <div class="oos">Out of stock</div> }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: GRID + `
    .bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; font-size: 13px; color: #6b6558; }
    select { border: 1px solid #e8e3db; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: var(--font-body); background: #fff; }
  `,
})
export class ShopPage implements OnInit {
  private data = inject(DataService);
  cart = inject(CartService);
  products = signal<Product[]>([]);
  sort = 'featured';
  finalPrice = finalPrice;
  filtered = computed(() => {
    const list = [...this.products()];
    if (this.sort === 'price-asc') list.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (this.sort === 'price-desc') list.sort((a, b) => finalPrice(b) - finalPrice(a));
    return list;
  });
  ngOnInit() { this.data.getProducts().subscribe(p => this.products.set(p)); }
}

// ---------- PRODUCT DETAIL ----------
@Component({
  selector: 'sf-product',
  imports: [RouterLink],
  template: `
    @if (product(); as p) {
      <div class="page pd">
        <div class="media-lg">{{ p.emoji }}</div>
        <div>
          <div class="cat">{{ p.sub }}</div>
          <h1>{{ p.name }}</h1>
          <div class="rate">★ {{ p.rating }} · {{ p.stock > 0 ? p.stock + ' in stock' : 'Out of stock' }}</div>
          <div class="price">\${{ finalPrice(p) }}@if (p.discount) { <span class="old">\${{ p.price }}</span> <span class="chip">Save {{ p.discount }}%</span> }</div>
          <p class="desc">{{ p.desc }}</p>
          <div class="qty">
            <button (click)="qty.set(qty() > 1 ? qty() - 1 : 1)">−</button><span>{{ qty() }}</span><button (click)="qty.set(qty() + 1)">+</button>
          </div>
          <div class="actions">
            <button class="btn btn-dark btn-lg" [disabled]="p.stock === 0" (click)="cart.add(p, qty())">Add to Cart</button>
            <button class="btn btn-ghost btn-lg" (click)="cart.toggleWish(p)">{{ cart.isWished(p) ? '♥ Wishlisted' : '♡ Wishlist' }}</button>
          </div>
          <div class="meta"><span>🚚 Free shipping over $99</span><span>💵 Cash on Delivery</span><span>↩ 14-day returns</span></div>
        </div>
      </div>
    } @else {
      <div class="page"><p>Product not found. <a routerLink="/shop">Back to shop</a></p></div>
    }
  `,
  styles: `
    .page { max-width: 1180px; margin: 0 auto; padding: 40px 28px 60px; }
    .pd { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    @media (max-width: 860px) { .pd { grid-template-columns: 1fr; } }
    .media-lg { aspect-ratio: 1; border-radius: 18px; background: #fbf9f5; display: flex; align-items: center; justify-content: center; font-size: 110px; }
    .cat { font-size: 12px; color: #6b6558; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    .rate { font-size: 13px; color: #6b6558; margin-bottom: 16px; }
    .price { font-family: var(--font-display); font-weight: 800; font-size: 26px; margin-bottom: 14px; }
    .old { font-size: 15px; color: #6b6558; text-decoration: line-through; font-weight: 500; margin-left: 8px; }
    .chip { background: #ffe6db; color: var(--flame); font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-left: 8px; vertical-align: middle; }
    .desc { color: #6b6558; font-size: 14px; line-height: 1.7; margin-bottom: 22px; }
    .qty { display: inline-flex; align-items: center; border: 1px solid #e8e3db; border-radius: 9px; }
    .qty button { width: 38px; height: 42px; border: none; background: none; font-size: 16px; cursor: pointer; }
    .qty span { width: 40px; text-align: center; font-weight: 600; }
    .actions { display: flex; gap: 12px; margin-top: 20px; }
    .meta { display: flex; gap: 20px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e8e3db; font-size: 12.5px; color: #6b6558; flex-wrap: wrap; }
  `,
})
export class ProductPage implements OnInit {
  id = input.required<string>();
  private data = inject(DataService);
  cart = inject(CartService);
  product = signal<Product | undefined>(undefined);
  qty = signal(1);
  finalPrice = finalPrice;
  ngOnInit() { this.data.getProduct(Number(this.id())).subscribe(p => this.product.set(p)); }
}

// ---------- WISHLIST ----------
@Component({
  selector: 'sf-wishlist',
  imports: [RouterLink],
  template: `
    <div class="page">
      <h1>Your Wishlist</h1>
      @if (!cart.wishlist().length) {
        <div class="empty"><div class="ic">🤍</div><h3>Your wishlist is empty</h3><a class="btn btn-dark" routerLink="/shop">Browse the Shop</a></div>
      } @else {
        <div class="grid">
          @for (p of cart.wishlist(); track p.id) {
            <div class="pcard">
              <div class="media" [routerLink]="['/product', p.id]">{{ p.emoji }}</div>
              <div class="body">
                <div class="name">{{ p.name }}</div>
                <div class="row"><span class="price">\${{ finalPrice(p) }}</span><button class="add" (click)="cart.add(p)">+</button></div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: GRID + `.empty { text-align: center; padding: 70px 20px; } .ic { font-size: 48px; margin-bottom: 14px; }`,
})
export class WishlistPage {
  cart = inject(CartService);
  finalPrice = finalPrice;
}

// ---------- CART ----------
@Component({
  selector: 'sf-cart',
  imports: [RouterLink],
  template: `
    <div class="page">
      <h1>Your Cart</h1>
      @if (!cart.items().length) {
        <div class="empty"><div class="ic">🛒</div><h3>Your cart is empty</h3><a class="btn btn-dark" routerLink="/shop">Browse the Shop</a></div>
      } @else {
        <div class="layout">
          <div>
            @for (i of cart.items(); track i.product.id) {
              <div class="line">
                <div class="thumb">{{ i.product.emoji }}</div>
                <div class="info"><b>{{ i.product.name }}</b><span class="rm" (click)="cart.remove(i.product.id)">Remove</span></div>
                <div class="qty">
                  <button (click)="cart.setQty(i.product.id, i.qty - 1)">−</button><span>{{ i.qty }}</span><button (click)="cart.setQty(i.product.id, i.qty + 1)">+</button>
                </div>
                <div class="lt">\${{ finalPrice(i.product) * i.qty }}</div>
              </div>
            }
          </div>
          <div class="summary">
            <h3>Order Summary</h3>
            <div class="srow"><span>Subtotal</span><span>\${{ cart.subtotal() }}</span></div>
            <div class="srow"><span>Shipping</span><span>{{ cart.shipping() === 0 ? 'Free' : '$' + cart.shipping() }}</span></div>
            <div class="srow total"><span>Total</span><span>\${{ cart.total() }}</span></div>
            <a class="btn btn-flame btn-block btn-lg" routerLink="/checkout">Proceed to Checkout</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .page { max-width: 1180px; margin: 0 auto; padding: 40px 28px 60px; }
    h1 { font-size: 28px; margin: 0 0 22px; }
    .empty { text-align: center; padding: 70px 20px; } .ic { font-size: 48px; margin-bottom: 14px; }
    .layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 32px; align-items: start; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
    .line { display: flex; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid #e8e3db; }
    .thumb { width: 66px; height: 66px; border-radius: 12px; background: #fbf9f5; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .info { flex: 1; display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
    .rm { font-size: 12px; color: #c4453e; cursor: pointer; }
    .qty { display: inline-flex; align-items: center; border: 1px solid #e8e3db; border-radius: 8px; }
    .qty button { width: 28px; height: 32px; border: none; background: none; cursor: pointer; }
    .qty span { width: 28px; text-align: center; font-size: 13px; font-weight: 600; }
    .lt { width: 70px; text-align: right; font-weight: 700; font-size: 14px; }
    .summary { border: 1px solid #e8e3db; border-radius: 16px; padding: 24px; background: #fbf9f5; position: sticky; top: 96px; }
    .summary h3 { margin: 0 0 14px; font-size: 15px; }
    .srow { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13.8px; }
    .total { border-top: 1px solid #e8e3db; margin-top: 10px; padding-top: 14px; font-weight: 700; font-size: 16px; }
    .btn { margin-top: 14px; }
  `,
})
export class CartPage {
  cart = inject(CartService);
  finalPrice = finalPrice;
}

// ---------- CHECKOUT ----------
@Component({
  selector: 'sf-checkout',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      @if (!orderId()) {
        <h1>Checkout</h1>
        <div class="layout">
          <div class="form">
            <h3>1 · Delivery Details</h3>
            <input [(ngModel)]="name" placeholder="Full Name">
            <input [(ngModel)]="phone" placeholder="Phone">
            <input [(ngModel)]="address" placeholder="Address">
            <h3>2 · Payment Method</h3>
            <label class="pay sel"><input type="radio" checked> Cash on Delivery — pay when your order arrives</label>
            <button class="btn btn-flame btn-lg" (click)="place()" [disabled]="!cart.items().length">Place Order — \${{ cart.total() }}</button>
          </div>
        </div>
      } @else {
        <div class="confirm">
          <div class="check">✓</div>
          <h1>Order confirmed!</h1>
          <p>Your order <b>{{ orderId() }}</b> has been placed with Cash on Delivery.</p>
          <a class="btn btn-dark" routerLink="/track">Track Your Order</a>
        </div>
      }
    </div>
  `,
  styles: `
    .page { max-width: 720px; margin: 0 auto; padding: 40px 28px 60px; }
    h1 { font-size: 28px; margin: 0 0 22px; }
    h3 { font-size: 15px; margin: 18px 0 6px; }
    .form { display: flex; flex-direction: column; gap: 12px; }
    input[type="text"], input:not([type]) { border: 1px solid #e8e3db; border-radius: 9px; padding: 11px 13px; font-size: 13.8px; font-family: var(--font-body); background: #fbf9f5; outline: none; }
    .pay { display: flex; align-items: center; gap: 10px; border: 1px solid var(--flame); background: #ffe6db; border-radius: 10px; padding: 14px; font-size: 13.5px; }
    .btn { margin-top: 16px; align-self: flex-start; }
    .confirm { text-align: center; padding: 50px 0; }
    .check { width: 74px; height: 74px; border-radius: 50%; background: #e7eee3; color: #7c9473; font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
    .confirm p { color: #6b6558; margin-bottom: 22px; }
  `,
})
export class CheckoutPage {
  cart = inject(CartService);
  private data = inject(DataService);
  name = ''; phone = ''; address = '';
  orderId = signal<string | null>(null);
  place() {
    this.data.placeOrder({
      name: this.name, phone: this.phone, address: this.address,
      items: this.cart.items().map(i => ({ productId: i.product.id, qty: i.qty })),
      paymentMethod: 'COD',
    }).subscribe(r => { this.orderId.set(r.orderId); this.cart.clear(); });
  }
}

// ---------- TRACK ORDER ----------
@Component({
  selector: 'sf-track',
  template: `
    <div class="page">
      <h1>Your Orders</h1>
      @for (o of orders(); track o.id) {
        <div class="ocard">
          <div class="top"><b>{{ o.id }}</b><span [class]="'badge ' + badgeClass(o.status)">{{ o.status }}</span></div>
          <div class="sub">{{ o.date }} · {{ o.items }} items · \${{ o.total }}</div>
          <div class="steps">
            @for (s of flow; track s; let i = $index) {
              <div class="step" [class.done]="i <= stepIndex(o)" [class.now]="i === stepIndex(o)">
                <span class="dot"></span><span class="lbl">{{ s }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .page { max-width: 760px; margin: 0 auto; padding: 40px 28px 60px; }
    h1 { font-size: 28px; margin: 0 0 22px; }
    .ocard { border: 1px solid #e8e3db; border-radius: 16px; padding: 20px 22px; margin-bottom: 16px; background: #fff; }
    .top { display: flex; justify-content: space-between; align-items: center; }
    .sub { font-size: 12.5px; color: #6b6558; margin: 6px 0 16px; }
    .steps { display: flex; justify-content: space-between; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
    .dot { width: 20px; height: 20px; border-radius: 50%; background: #e8e3db; }
    .step.done .dot { background: #3f8f5f; }
    .step.now .dot { background: var(--flame); }
    .lbl { font-size: 10px; color: #6b6558; text-align: center; max-width: 66px; }
    .step.done .lbl, .step.now .lbl { color: #20201c; font-weight: 600; }
  `,
})
export class TrackPage implements OnInit {
  private data = inject(DataService);
  orders = signal<TrackedOrder[]>([]);
  flow = STATUS_FLOW;
  badgeClass = badgeClass;
  stepIndex(o: TrackedOrder) { return STATUS_FLOW.indexOf(o.status as (typeof STATUS_FLOW)[number]); }
  ngOnInit() { this.data.getOrders().subscribe(o => this.orders.set(o)); }
}

// ---------- CONTACT ----------
@Component({
  selector: 'sf-contact',
  imports: [FormsModule],
  template: `
    <div class="page">
      <h1>We're here to help</h1>
      @if (sent()) {
        <p class="ok">✓ Message sent — we'll reply within one business day.</p>
      } @else {
        <div class="form">
          <input [(ngModel)]="name" placeholder="Full Name">
          <input [(ngModel)]="email" placeholder="Email">
          <input [(ngModel)]="orderNo" placeholder="Order Number (optional)">
          <textarea [(ngModel)]="message" placeholder="How can we help?"></textarea>
          <button class="btn btn-flame" (click)="sent.set(true)">Send Message</button>
        </div>
      }
    </div>
  `,
  styles: `
    .page { max-width: 560px; margin: 0 auto; padding: 40px 28px 60px; }
    h1 { font-size: 28px; margin: 0 0 22px; }
    .form { display: flex; flex-direction: column; gap: 12px; }
    input, textarea { border: 1px solid #e8e3db; border-radius: 9px; padding: 11px 13px; font-size: 13.8px; font-family: var(--font-body); background: #fbf9f5; outline: none; }
    textarea { min-height: 110px; resize: vertical; }
    .btn { align-self: flex-start; }
    .ok { color: #3f8f5f; font-weight: 600; }
  `,
})
export class ContactPage {
  name = ''; email = ''; orderNo = ''; message = '';
  sent = signal(false);
}
