import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { OrderStatus, STATUS_FLOW, TrackedOrder, badgeClass } from '../../models';

@Component({
  selector: 'sf-track',
  imports: [FormsModule],
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss',
})
export class TrackComponent implements OnInit {
  private data = inject(DataService);

  orders = signal<TrackedOrder[]>([]);
  search = signal('');

  flow = STATUS_FLOW;
  badgeClass = badgeClass;

  /** Look up orders by order number (STF-09). */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return q ? this.orders().filter(o => o.id.toLowerCase().includes(q)) : this.orders();
  });

  stepIndex(o: TrackedOrder): number {
    return STATUS_FLOW.indexOf(o.status as OrderStatus);
  }

  ngOnInit(): void {
    this.data.getOrders().subscribe(o => this.orders.set(o));
  }
}
