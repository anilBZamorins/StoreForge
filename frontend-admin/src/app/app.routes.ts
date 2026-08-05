import { Routes } from '@angular/router';
import { Layout } from './layout';
import {
  DashboardPage, ProductsPage, CategoriesPage, BannersPage, OrdersPage,
  CartsPage, CustomersPage, ReportsPage, BillingPage, SettingsPage,
} from './pages/pages';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: DashboardPage, title: 'Dashboard — Store Admin' },
      { path: 'products', component: ProductsPage, title: 'Products — Store Admin' },
      { path: 'categories', component: CategoriesPage, title: 'Categories — Store Admin' },
      { path: 'banners', component: BannersPage, title: 'Banners — Store Admin' },
      { path: 'orders', component: OrdersPage, title: 'Orders — Store Admin' },
      { path: 'carts', component: CartsPage, title: 'Abandoned Carts — Store Admin' },
      { path: 'customers', component: CustomersPage, title: 'Customers — Store Admin' },
      { path: 'reports', component: ReportsPage, title: 'Reports — Store Admin' },
      { path: 'billing', component: BillingPage, title: 'Billing & Subscription — Store Admin' },
      { path: 'settings', component: SettingsPage, title: 'Store Settings — Store Admin' },
    ],
  },
  { path: '**', redirectTo: '' },
];
