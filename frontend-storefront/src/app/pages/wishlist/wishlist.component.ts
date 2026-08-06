import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/data.service';
import { Product, finalPrice } from '../../models';

@Component({
  selector: 'sf-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  cart = inject(CartService);
  finalPrice = finalPrice;

  /** Move a wishlisted product into the cart and drop it from the wishlist. */
  moveToCart(p: Product): void {
    this.cart.add(p);
    this.cart.toggleWish(p);
  }
}
