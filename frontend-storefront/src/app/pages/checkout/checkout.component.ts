import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, DataService } from '../../services/data.service';
import { finalPrice } from '../../models';

@Component({
  selector: 'sf-checkout',
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = inject(CartService);
  private data = inject(DataService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  phone = signal('');
  address = signal('');
  city = signal('');
  state = signal('');
  zip = signal('');
  payMethod = signal<'COD' | 'Card'>('COD');
  submitted = signal(false);
  placing = signal(false);
  orderId = signal<string | null>(null);

  finalPrice = finalPrice;

  /** Required-field validation before placing the order (STF-07). */
  valid = computed(() =>
    this.name().trim() !== '' && this.phone().trim() !== '' &&
    this.address().trim() !== '' && this.city().trim() !== '',
  );

  invalid(v: string): boolean {
    return this.submitted() && v.trim() === '';
  }

  placeOrder(): void {
    this.submitted.set(true);
    if (!this.valid() || !this.cart.items().length || this.placing()) return;
    this.placing.set(true);
    this.data.placeOrder({
      name: this.name(), email: this.email(), phone: this.phone(),
      address: this.address(), city: this.city(), state: this.state(), zip: this.zip(),
      items: this.cart.items().map(i => ({ productId: i.product.id, qty: i.qty })),
      paymentMethod: this.payMethod(),
      total: this.cart.total(),
    }).subscribe(r => {
      this.orderId.set(r.orderId);
      this.cart.clear();
      this.placing.set(false);
    });
  }

  eta(): string {
    return '5–8 business days';
  }
}
