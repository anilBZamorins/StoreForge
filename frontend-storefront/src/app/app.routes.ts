import { Routes } from '@angular/router';
import { Layout } from './layout';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductComponent } from './pages/product/product.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TrackComponent } from './pages/track/track.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'track', component: TrackComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
