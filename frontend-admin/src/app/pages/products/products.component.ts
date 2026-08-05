import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Product, StockStatus, stockStatus } from '../../models';

@Component({
  selector: 'sf-products',
  imports: [FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private data = inject(DataService);

  products = signal<Product[]>([]);
  search = signal('');
  statusFilter = signal<'' | StockStatus>('');

  /** Search by name/SKU + filter by derived stock status (ADM-02). */
  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.products().filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter() || stockStatus(p.stock) === this.statusFilter();
      return matchesSearch && matchesStatus;
    });
  });

  lowStockCount = computed(() => this.products().filter(p => stockStatus(p.stock) !== 'Active').length);

  stockStatus = stockStatus;

  finalPrice(p: Product): number {
    return Math.round(p.price * (1 - p.discount / 100));
  }

  stockBadge(p: Product): string {
    const s = stockStatus(p.stock);
    return s === 'Active' ? 'b-delivered' : s === 'Low Stock' ? 'b-pending' : 'b-cancelled';
  }

  ngOnInit(): void {
    this.data.getProducts().subscribe(p => this.products.set(p));
  }
}
