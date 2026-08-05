import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Cart, Order, Product, badgeClass, cartState } from '../../models';
import { MOCK_KPIS, MOCK_PLAN_INFO } from '../../mock';

@Component({
  selector: 'sf-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private data = inject(DataService);

  kpis = signal<typeof MOCK_KPIS>([]);
  orders = signal<Order[]>([]);
  carts = signal<Cart[]>([]);
  products = signal<Product[]>([]);

  plan = MOCK_PLAN_INFO;
  badgeClass = badgeClass;
  cartState = cartState;

  /** Five most recent orders, newest first (mock data is chronological). */
  recentOrders = computed(() => this.orders().slice(0, 5));

  planUsagePct = computed(() => Math.round((this.plan.productsUsed / this.plan.productLimit) * 1000) / 10);

  initials(name: string): string {
    return name.split(' ').map(w => w.charAt(0)).slice(0, 2).join('').toUpperCase();
  }

  itemLabel(c: Cart): string {
    const n = c.items.reduce((s, i) => s + i.qty, 0);
    return `${n} item${n === 1 ? '' : 's'}`;
  }

  age(hours: number): string {
    return hours < 24 ? `${Math.round(hours)} hours ago` : `${Math.round(hours / 24)} days ago`;
  }

  cartValue(c: Cart): number {
    return c.items.reduce((sum, line) => {
      const p = this.products().find(x => x.id === line.pid);
      return p ? sum + Math.round(p.price * (1 - p.discount / 100)) * line.qty : sum;
    }, 0);
  }

  stateBadge(c: Cart): string {
    const s = cartState(c.hoursIdle);
    return s === 'Active' ? 'b-processing' : s === 'Idle' ? 'b-pending' : 'b-cancelled';
  }

  ngOnInit(): void {
    this.data.getKpis().subscribe(k => this.kpis.set(k));
    this.data.getOrders().subscribe(o => this.orders.set(o));
    this.data.getCarts().subscribe(c => this.carts.set(c));
    this.data.getProducts().subscribe(p => this.products.set(p));
  }
}
