import { Routes } from '@angular/router';
import { WebsiteLayout } from './website-layout';
import { WebsiteHome, WebsiteFeatures, WebsitePricing, WebsiteContact, WebsiteRegister, WebsiteLogin } from './pages';

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: WebsiteLayout,
    children: [
      { path: '', component: WebsiteHome, title: 'StoreForge — Launch Your Store in Minutes' },
      { path: 'features', component: WebsiteFeatures, title: 'Features — StoreForge' },
      { path: 'pricing', component: WebsitePricing, title: 'Pricing — StoreForge' },
      { path: 'contact', component: WebsiteContact, title: 'Contact — StoreForge' },
      { path: 'register', component: WebsiteRegister, title: 'Start Free Trial — StoreForge' },
      { path: 'login', component: WebsiteLogin, title: 'Log In — StoreForge' },
    ],
  },
];
