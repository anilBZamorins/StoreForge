import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/data.service';
import { finalPrice } from '../../models';
import { MOCK_STORE } from '../../mock';

@Component({
  selector: 'sf-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart = inject(CartService);
  finalPrice = finalPrice;
  freeShippingOver = MOCK_STORE.freeShippingOver;

  /** How much more to add for free shipping — drives the nudge bar (STF-06). */
  get remainingForFree(): number {
    return Math.max(0, this.freeShippingOver - this.cart.subtotal());
  }

  get freeShipPct(): number {
    return Math.min(100, Math.round((this.cart.subtotal() / this.freeShippingOver) * 100));
  }
}
