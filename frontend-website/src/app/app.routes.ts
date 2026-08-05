import { Routes } from '@angular/router';
import { Layout } from './layout';
import { HomePage, FeaturesPage, PricingPage, ContactPage, RegisterPage, LoginPage } from './pages/pages';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomePage, title: 'StoreForge — Launch Your Store in Minutes' },
      { path: 'features', component: FeaturesPage, title: 'Features — StoreForge' },
      { path: 'pricing', component: PricingPage, title: 'Pricing — StoreForge' },
      { path: 'contact', component: ContactPage, title: 'Contact — StoreForge' },
      { path: 'register', component: RegisterPage, title: 'Start Free Trial — StoreForge' },
      { path: 'login', component: LoginPage, title: 'Log In — StoreForge' },
    ],
  },
  { path: '**', redirectTo: '' },
];
