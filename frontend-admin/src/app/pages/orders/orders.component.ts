import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Order, OrderStatus, badgeClass } from '../../models';

const STATUS_FLOW: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const PAGE_SIZE = 6;

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
  page = signal(1);

  // ---------- Detail modal (ADM-05) ----------
  selected = signal<Order | null>(null);
  editStatus = signal<OrderStatus>('Pending');
  editTracking = signal('');

  flow = STATUS_FLOW;
  statuses: OrderStatus[] = [...STATUS_FLOW, 'Cancelled'];
  badgeClass = badgeClass;

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.orders().filter(o => {
      const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter() || o.status === this.statusFilter();
      return matchesSearch && matchesStatus;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  paged = computed(() => this.filtered().slice((this.page() - 1) * PAGE_SIZE, this.page() * PAGE_SIZE));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  /** Index of an order's status in the lifecycle (Cancelled → -1, no progress). */
  stepIndex(status: OrderStatus): number {
    return STATUS_FLOW.indexOf(status);
  }

  open(o: Order): void {
    this.selected.set(o);
    this.editStatus.set(o.status);
    this.editTracking.set(o.tracking);
  }

  close(): void {
    this.selected.set(null);
  }

  /** Apply the modal's status + tracking changes (API mode: PUT /api/v1/admin/orders/:id). */
  updateOrder(): void {
    const o = this.selected();
    if (!o) return;
    this.orders.set(this.orders().map(x =>
      x.id === o.id ? { ...x, status: this.editStatus(), tracking: this.editTracking() } : x,
    ));
    this.close();
  }

  setPage(p: number): void {
    this.page.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  ngOnInit(): void {
    this.data.getOrders().subscribe(o => this.orders.set(o));
  }
}
