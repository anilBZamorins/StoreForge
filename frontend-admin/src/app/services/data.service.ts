import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Banner, Cart, Category, Customer, Invoice, Order, Plan, Product } from '../models';
import {
  MOCK_BANNERS, MOCK_CARTS, MOCK_CATEGORIES, MOCK_CUSTOMERS,
  MOCK_INVOICES, MOCK_KPIS, MOCK_ORDERS, MOCK_PLANS, MOCK_PRODUCTS, MOCK_STORE,
} from '../mock';

export interface ProductPayload {
  name: string; sub: string; sku: string; price: number;
  discount: number; stock: number; emoji?: string; shortDesc?: string; fullDesc?: string;
}

export interface CategoryPayload { name: string; description?: string; parentId?: string; }

export interface StoreSettings {
  storeName: string; domain: string; themeColor: string;
  supportEmail: string | null; supportPhone: string | null; address: string | null;
  plan: string; billingCycle: string; status: string;
}

/**
 * All Store Admin data flows through here.
 * environment.useMocks === true  → mock.ts data; writes resolve locally (of(null))
 * environment.useMocks === false → Laravel API at /api/v1/admin (Sanctum bearer token
 *                                  attached by authInterceptor)
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/admin';

  private mock<T>(data: T): Observable<T> { return of(data).pipe(delay(120)); }

  // ---------- Reads ----------
  getKpis(): Observable<typeof MOCK_KPIS> {
    return environment.useMocks ? this.mock(MOCK_KPIS) : this.http.get<typeof MOCK_KPIS>(`${this.api}/dashboard/kpis`);
  }
  getProducts(): Observable<Product[]> {
    return environment.useMocks ? this.mock(MOCK_PRODUCTS) : this.http.get<Product[]>(`${this.api}/products`);
  }
  getCategories(): Observable<Category[]> {
    return environment.useMocks ? this.mock(MOCK_CATEGORIES) : this.http.get<Category[]>(`${this.api}/categories`);
  }
  getOrders(): Observable<Order[]> {
    return environment.useMocks ? this.mock(MOCK_ORDERS) : this.http.get<Order[]>(`${this.api}/orders`);
  }
  getCustomers(): Observable<Customer[]> {
    return environment.useMocks ? this.mock(MOCK_CUSTOMERS) : this.http.get<Customer[]>(`${this.api}/customers`);
  }
  getCarts(): Observable<Cart[]> {
    return environment.useMocks ? this.mock(MOCK_CARTS) : this.http.get<Cart[]>(`${this.api}/carts`);
  }
  getBanners(): Observable<Banner[]> {
    return environment.useMocks ? this.mock(MOCK_BANNERS) : this.http.get<Banner[]>(`${this.api}/banners`);
  }
  getPlans(): Observable<Plan[]> {
    return environment.useMocks ? this.mock(MOCK_PLANS) : this.http.get<Plan[]>(`${environment.apiUrl}/plans`);
  }
  getInvoices(): Observable<Invoice[]> {
    return environment.useMocks ? this.mock(MOCK_INVOICES) : this.http.get<Invoice[]>(`${this.api}/invoices`);
  }
  getSettings(): Observable<StoreSettings> {
    if (environment.useMocks) {
      return this.mock({
        storeName: MOCK_STORE.name, domain: MOCK_STORE.domain, themeColor: '#FF5A36',
        supportEmail: 'support@auraliving.com', supportPhone: '+1 (555) 220-4471',
        address: '221 Birchwood Lane, Austin, TX 78701',
        plan: MOCK_STORE.plan, billingCycle: 'monthly', status: 'active',
      });
    }
    return this.http.get<StoreSettings>(`${this.api}/settings`);
  }

  // ---------- Writes (ADM-02..05, ADM-10) ----------
  // Mock mode resolves immediately; components keep their local state in sync.
  createProduct(payload: ProductPayload): Observable<Product | null> {
    return environment.useMocks ? this.mock(null) : this.http.post<Product>(`${this.api}/products`, payload);
  }
  updateProduct(id: number, payload: ProductPayload): Observable<Product | null> {
    return environment.useMocks ? this.mock(null) : this.http.put<Product>(`${this.api}/products/${id}`, payload);
  }
  deleteProduct(id: number): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.delete(`${this.api}/products/${id}`);
  }

  createCategory(payload: CategoryPayload): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.post(`${this.api}/categories`, payload);
  }
  updateCategory(slug: string, payload: { name: string; description?: string }): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.put(`${this.api}/categories/${slug}`, payload);
  }
  deleteCategory(slug: string): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.delete(`${this.api}/categories/${slug}`);
  }

  updateOrder(orderId: number, payload: { status?: string; tracking?: string }): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.put(`${this.api}/orders/${orderId}`, payload);
  }

  updateBanner(id: number, payload: { active?: boolean; title?: string; sub?: string; kind?: string }): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.put(`${this.api}/banners/${id}`, payload);
  }

  saveSettings(payload: Partial<StoreSettings>): Observable<unknown> {
    return environment.useMocks ? this.mock(null) : this.http.put(`${this.api}/settings`, payload);
  }
}
