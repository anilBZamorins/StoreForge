import { Routes } from '@angular/router';
import { StorefrontLayout } from './storefront-layout';
import {
  StoreHome, StoreShop, StoreProduct, StoreWishlist, StoreCart,
  StoreCheckout, StoreTrack, StoreContact,
} from './pages';

export const STOREFRONT_ROUTES: Routes = [
  {
    path: '',
    component: StorefrontLayout,
    children: [
      { path: '', component: StoreHome },
      { path: 'shop', component: StoreShop },
      { path: 'product/:id', component: StoreProduct },
      { path: 'wishlist', component: StoreWishlist },
      { path: 'cart', component: StoreCart },
      { path: 'checkout', component: StoreCheckout },
      { path: 'track', component: StoreTrack },
      { path: 'contact', component: StoreContact },
    ],
  },
];
