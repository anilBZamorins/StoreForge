import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Banner, Cart, Category, Customer, Invoice, Order, Plan, Product } from '../models';
import {
  MOCK_BANNERS, MOCK_CARTS, MOCK_CATEGORIES, MOCK_CUSTOMERS,
  MOCK_INVOICES, MOCK_KPIS, MOCK_ORDERS, MOCK_PLANS, MOCK_PRODUCTS,
} from '../mock';

/**
 * All Store Admin data flows through here.
 * environment.useMocks === true  → serves mock.ts data
 * environment.useMocks === false → calls the Laravel API
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/admin';

  private mock<T>(data: T): Observable<T> { return of(data).pipe(delay(120)); }

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
}
