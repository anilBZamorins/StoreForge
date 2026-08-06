import { Component, OnInit, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, DataService } from '../../services/data.service';
import { Product, finalPrice } from '../../models';

@Component({
  selector: 'sf-product',
  imports: [RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  id = input.required<string>();

  private data = inject(DataService);
  cart = inject(CartService);

  product = signal<Product | undefined>(undefined);
  all = signal<Product[]>([]);
  qty = signal(1);
  tab = signal<'desc' | 'ship'>('desc');
  added = signal(false);

  finalPrice = finalPrice;

  /** "You may also like": products from the same sub-category (STF-04). */
  related = computed(() => {
    const p = this.product();
    return p ? this.all().filter(x => x.sub === p.sub && x.id !== p.id).slice(0, 4) : [];
  });

  constructor() {
    // Re-load when navigating between related products (same route, new :id).
    effect(() => this.load(Number(this.id())));
  }

  private load(id: number): void {
    this.qty.set(1);
    this.tab.set('desc');
    this.added.set(false);
    this.data.getProduct(id).subscribe(p => this.product.set(p));
  }

  addToCart(): void {
    const p = this.product();
    if (!p || p.stock === 0) return;
    this.cart.add(p, this.qty());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }

  ngOnInit(): void {
    this.data.getProducts().subscribe(ps => this.all.set(ps));
  }
}
