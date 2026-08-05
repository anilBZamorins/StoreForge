import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Order, Product, badgeClass } from '../../models';

@Component({
  selector: 'sf-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  private data = inject(DataService);

  orders = signal<Order[]>([]);
  products = signal<Product[]>([]);

  badgeClass = badgeClass;

  /** Orders grouped by lifecycle status (ADM-08). */
  statusCounts = computed(() => {
    const m = new Map<string, number>();
    for (const o of this.orders()) m.set(o.status, (m.get(o.status) ?? 0) + 1);
    return [...m.entries()];
  });

  maxStatusCount = computed(() => Math.max(1, ...this.statusCounts().map(([, n]) => n)));

  /** Revenue booked in the current order book (excluding cancelled). */
  bookedRevenue = computed(() =>
    this.orders().filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0),
  );

  /** Top products by potential revenue (price × stock sold proxy). */
  topProducts = computed(() =>
    [...this.products()]
      .sort((a, b) => b.price * (100 - b.discount) - a.price * (100 - a.discount))
      .slice(0, 5),
  );

  ngOnInit(): void {
    this.data.getOrders().subscribe(o => this.orders.set(o));
    this.data.getProducts().subscribe(p => this.products.set(p));
  }
}
