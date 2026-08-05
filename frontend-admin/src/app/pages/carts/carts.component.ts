import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Cart, CartState, Product, cartState } from '../../models';

@Component({
  selector: 'sf-carts',
  imports: [FormsModule],
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.scss',
})
export class CartsComponent implements OnInit {
  private data = inject(DataService);

  carts = signal<Cart[]>([]);
  products = signal<Product[]>([]);
  stateFilter = signal<'' | CartState>('');

  filtered = computed(() =>
    this.carts().filter(c => !this.stateFilter() || cartState(c.hoursIdle) === this.stateFilter()),
  );

  /** Total value sitting in carts (BR-07 visibility). */
  totalValue = computed(() => this.filtered().reduce((sum, c) => sum + this.cartValue(c), 0));

  cartState = cartState;

  /** Cart value from product prices with discounts applied. */
  cartValue(c: Cart): number {
    return c.items.reduce((sum, line) => {
      const p = this.products().find(x => x.id === line.pid);
      return p ? sum + Math.round(p.price * (1 - p.discount / 100)) * line.qty : sum;
    }, 0);
  }

  itemCount(c: Cart): number {
    return c.items.reduce((s, i) => s + i.qty, 0);
  }

  age(hours: number): string {
    return hours < 24 ? `${Math.round(hours)} hours ago` : `${Math.round(hours / 24)} days ago`;
  }

  stateBadge(c: Cart): string {
    const s = cartState(c.hoursIdle);
    return s === 'Active' ? 'b-processing' : s === 'Idle' ? 'b-pending' : 'b-cancelled';
  }

  ngOnInit(): void {
    this.data.getCarts().subscribe(c => this.carts.set(c));
    this.data.getProducts().subscribe(p => this.products.set(p));
  }
}
