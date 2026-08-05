import { Routes } from '@angular/router';
import { Layout } from './layout';
import { HomePage, ShopPage, ProductPage, WishlistPage, CartPage, CheckoutPage, TrackPage, ContactPage } from './pages/pages';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomePage },
      { path: 'shop', component: ShopPage },
      { path: 'product/:id', component: ProductPage },
      { path: 'wishlist', component: WishlistPage },
      { path: 'cart', component: CartPage },
      { path: 'checkout', component: CheckoutPage },
      { path: 'track', component: TrackPage },
      { path: 'contact', component: ContactPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
