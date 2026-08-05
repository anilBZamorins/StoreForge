import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem, Category, Product, Slide, TrackedOrder, finalPrice } from '../models';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SLIDES, MOCK_STORE, MOCK_TRACKED_ORDERS } from '../mock';

/**
 * All storefront data flows through here.
 * environment.useMocks === true  → serves mock.ts data
 * environment.useMocks === false → calls the Laravel API (tenant resolved server-side from subdomain)
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/store';

  store = MOCK_STORE;

  private mock<T>(data: T): Observable<T> { return of(data).pipe(delay(120)); }

  getSlides(): Observable<Slide[]> {
    return environment.useMocks ? this.mock(MOCK_SLIDES) : this.http.get<Slide[]>(`${this.api}/slides`);
  }
  getCategories(): Observable<Category[]> {
    return environment.useMocks ? this.mock(MOCK_CATEGORIES) : this.http.get<Category[]>(`${this.api}/categories`);
  }
  getProducts(): Observable<Product[]> {
    return environment.useMocks ? this.mock(MOCK_PRODUCTS) : this.http.get<Product[]>(`${this.api}/products`);
  }
  getProduct(id: number): Observable<Product | undefined> {
    return environment.useMocks
      ? this.mock(MOCK_PRODUCTS.find(p => p.id === id))
      : this.http.get<Product>(`${this.api}/products/${id}`);
  }
  getFeatured(): Observable<Product[]> {
    return this.getProducts().pipe(map(ps => ps.filter(p => p.featured)));
  }
  getOrders(): Observable<TrackedOrder[]> {
    return environment.useMocks ? this.mock(MOCK_TRACKED_ORDERS) : this.http.get<TrackedOrder[]>(`${this.api}/orders`);
  }
  placeOrder(payload: unknown): Observable<{ orderId: string }> {
    if (environment.useMocks) return of({ orderId: 'AL-' + (3100 + Math.floor(Math.random() * 900)) }).pipe(delay(600));
    return this.http.post<{ orderId: string }>(`${this.api}/orders`, payload);
  }
}

/** In-memory cart & wishlist (client state, same in mock and API modes). */
@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>([]);
  wishlist = signal<Product[]>([]);

  count = computed(() => this.items().reduce((s, i) => s + i.qty, 0));
  subtotal = computed(() => this.items().reduce((s, i) => s + finalPrice(i.product) * i.qty, 0));
  shipping = computed(() => (this.subtotal() >= MOCK_STORE.freeShippingOver || this.subtotal() === 0 ? 0 : 9));
  total = computed(() => this.subtotal() + this.shipping());

  add(product: Product, qty = 1) {
    const items = [...this.items()];
    const line = items.find(i => i.product.id === product.id);
    if (line) line.qty += qty; else items.push({ product, qty });
    this.items.set(items);
  }
  setQty(productId: number, qty: number) {
    this.items.set(this.items().map(i => i.product.id === productId ? { ...i, qty: Math.max(1, qty) } : i));
  }
  remove(productId: number) {
    this.items.set(this.items().filter(i => i.product.id !== productId));
  }
  clear() { this.items.set([]); }
  toggleWish(product: Product) {
    const w = this.wishlist();
    this.wishlist.set(w.some(p => p.id === product.id) ? w.filter(p => p.id !== product.id) : [...w, product]);
  }
  isWished(product: Product) { return this.wishlist().some(p => p.id === product.id); }
}
