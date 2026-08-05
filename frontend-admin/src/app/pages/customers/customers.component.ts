import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Customer } from '../../models';

type SortKey = 'name' | 'orders' | 'spent';

@Component({
  selector: 'sf-customers',
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private data = inject(DataService);

  customers = signal<Customer[]>([]);
  search = signal('');
  sortKey = signal<SortKey>('spent');

  /** Search + sortable directory (ADM-07). */
  filtered = computed(() => {
    const q = this.search().toLowerCase();
    const list = this.customers().filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q),
    );
    const key = this.sortKey();
    return [...list].sort((a, b) =>
      key === 'name' ? a.name.localeCompare(b.name) : (b[key] as number) - (a[key] as number),
    );
  });

  avgSpend = computed(() => {
    const list = this.customers();
    return list.length ? Math.round(list.reduce((s, c) => s + c.spent, 0) / list.length) : 0;
  });

  ngOnInit(): void {
    this.data.getCustomers().subscribe(c => this.customers.set(c));
  }
}
