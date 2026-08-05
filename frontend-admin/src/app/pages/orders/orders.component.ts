import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Order, OrderStatus, badgeClass } from '../../models';

const STATUS_FLOW: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

@Component({
  selector: 'sf-orders',
  imports: [FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private data = inject(DataService);

  orders = signal<Order[]>([]);
  search = signal('');
  statusFilter = signal<'' | OrderStatus>('');
  selected = signal<Order | null>(null);

  /** Search by order id / customer + status filter (ADM-05). */
  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.orders().filter(o => {
      const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter() || o.status === this.statusFilter();
      return matchesSearch && matchesStatus;
    });
  });

  badgeClass = badgeClass;
  statuses: OrderStatus[] = [...STATUS_FLOW, 'Cancelled'];

  /** Advance an order to its next lifecycle status (Section 7 of the BRD). */
  advance(o: Order): void {
    const i = STATUS_FLOW.indexOf(o.status);
    if (i < 0 || i === STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[i + 1];
    this.orders.set(this.orders().map(x => x.id === o.id ? { ...x, status: next } : x));
    if (this.selected()?.id === o.id) this.selected.set({ ...o, status: next });
  }

  canAdvance(o: Order): boolean {
    const i = STATUS_FLOW.indexOf(o.status);
    return i >= 0 && i < STATUS_FLOW.length - 1;
  }

  nextStatus(o: Order): OrderStatus | null {
    const i = STATUS_FLOW.indexOf(o.status);
    return this.canAdvance(o) ? STATUS_FLOW[i + 1] : null;
  }

  ngOnInit(): void {
    this.data.getOrders().subscribe(o => this.orders.set(o));
  }
}
