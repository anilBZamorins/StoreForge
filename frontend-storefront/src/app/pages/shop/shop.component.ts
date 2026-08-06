import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, DataService } from '../../services/data.service';
import { Category, Product, finalPrice } from '../../models';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const SUBS_BY_CATEGORY: Record<string, string[]> = {
  textiles: ['Bedding & Linen', 'Rugs & Throws'],
  decor: ['Lighting', 'Wall Art', 'Vases & Planters'],
  furniture: ['Seating', 'Tables'],
};

@Component({
  selector: 'sf-shop',
  imports: [RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);
  cart = inject(CartService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  categoryFilter = signal('');
  priceBand = signal('');          // '', '0-50', '50-150', '150-300', '300-9999'
  inStockOnly = signal(false);
  sort = signal<SortKey>('featured');

  finalPrice = finalPrice;

  /** Category + price band + availability filters, then sorting (STF-03). */
  filtered = computed(() => {
    let list = this.products();

    const cat = this.categoryFilter();
    if (cat) list = list.filter(p => (SUBS_BY_CATEGORY[cat] ?? []).includes(p.sub));

    const band = this.priceBand();
    if (band) {
      const [min, max] = band.split('-').map(Number);
      list = list.filter(p => finalPrice(p) >= min && finalPrice(p) <= max);
    }

    if (this.inStockOnly()) list = list.filter(p => p.stock > 0);

    const sorted = [...list];
    switch (this.sort()) {
      case 'price-asc': sorted.sort((a, b) => finalPrice(a) - finalPrice(b)); break;
      case 'price-desc': sorted.sort((a, b) => finalPrice(b) - finalPrice(a)); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      default: sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  });

  clearFilters(): void {
    this.categoryFilter.set('');
    this.priceBand.set('');
    this.inStockOnly.set(false);
    this.sort.set('featured');
  }

  ngOnInit(): void {
    // Deep link support: /shop?category=decor from the home category cards.
    this.route.queryParamMap.subscribe(q => this.categoryFilter.set(q.get('category') ?? ''));
    this.data.getProducts().subscribe(p => this.products.set(p));
    this.data.getCategories().subscribe(c => this.categories.set(c));
  }
}
