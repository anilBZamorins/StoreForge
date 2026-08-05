import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Category, Product, StockStatus, stockStatus } from '../../models';

interface ProductForm {
  name: string;
  sub: string;
  sku: string;
  price: number | null;
  discount: number;
  stock: number | null;
  shortDesc: string;
  fullDesc: string;
}

@Component({
  selector: 'sf-products',
  imports: [FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private data = inject(DataService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  search = signal('');
  categoryFilter = signal('');
  statusFilter = signal<'' | StockStatus>('');

  // ---------- Add / Edit modal (ADM-02) ----------
  modalOpen = signal(false);
  editing = signal<Product | null>(null);
  form = signal<ProductForm>(this.emptyForm());

  stockStatus = stockStatus;

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.products().filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter() || stockStatus(p.stock) === this.statusFilter();
      const matchesCategory = !this.categoryFilter() || this.parentOf(p.sub)?.id === this.categoryFilter();
      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  /** Flattened "Parent / Sub" options for the modal dropdown. */
  subOptions = computed(() =>
    this.categories().flatMap(c => c.subs.map(s => ({ id: s.id, label: `${c.name} / ${s.name}` }))),
  );

  subLabel(subId: string): string {
    for (const c of this.categories()) {
      const s = c.subs.find(x => x.id === subId);
      if (s) return `${c.name} / ${s.name}`;
    }
    return subId;
  }

  parentOf(subId: string): Category | undefined {
    return this.categories().find(c => c.subs.some(s => s.id === subId));
  }

  finalPrice(p: Product): number {
    return Math.round(p.price * (1 - p.discount / 100));
  }

  stockBadge(p: Product): string {
    const s = stockStatus(p.stock);
    return s === 'Active' ? 'b-delivered' : s === 'Low Stock' ? 'b-pending' : 'b-cancelled';
  }

  // ---------- modal actions ----------
  openAdd(): void {
    this.editing.set(null);
    this.form.set(this.emptyForm());
    this.modalOpen.set(true);
  }

  openEdit(p: Product): void {
    this.editing.set(p);
    this.form.set({
      name: p.name, sub: p.sub, sku: p.sku, price: p.price,
      discount: p.discount, stock: p.stock, shortDesc: '', fullDesc: '',
    });
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  save(): void {
    const f = this.form();
    if (!f.name.trim() || f.price === null || f.stock === null) return;
    if (this.editing()) {
      const id = this.editing()!.id;
      this.products.set(this.products().map(p =>
        p.id === id ? { ...p, name: f.name, sub: f.sub, sku: f.sku, price: f.price!, discount: f.discount, stock: f.stock! } : p,
      ));
    } else {
      const nextId = Math.max(0, ...this.products().map(p => p.id)) + 1;
      this.products.set([
        ...this.products(),
        { id: nextId, name: f.name, sub: f.sub, sku: f.sku, price: f.price!, discount: f.discount, stock: f.stock!, emoji: '📦' },
      ]);
    }
    // API mode: POST/PUT /api/v1/admin/products via DataService.
    this.close();
  }

  patch<K extends keyof ProductForm>(key: K, value: ProductForm[K]): void {
    this.form.set({ ...this.form(), [key]: value });
  }

  private emptyForm(): ProductForm {
    return {
      name: '', sub: 'bedding',
      sku: 'AL-NEW-' + Math.floor(100 + Math.random() * 900),
      price: null, discount: 0, stock: null, shortDesc: '', fullDesc: '',
    };
  }

  ngOnInit(): void {
    this.data.getProducts().subscribe(p => this.products.set(p));
    this.data.getCategories().subscribe(c => this.categories.set(c));
  }
}
