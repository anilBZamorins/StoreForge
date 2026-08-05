import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';
import {
  AdminDashboard, AdminProducts, AdminCategories, AdminBanners, AdminOrders,
  AdminCarts, AdminCustomers, AdminReports, AdminBilling, AdminSettings,
} from './pages';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard, title: 'Dashboard — Store Admin' },
      { path: 'products', component: AdminProducts, title: 'Products — Store Admin' },
      { path: 'categories', component: AdminCategories, title: 'Categories — Store Admin' },
      { path: 'banners', component: AdminBanners, title: 'Banners — Store Admin' },
      { path: 'orders', component: AdminOrders, title: 'Orders — Store Admin' },
      { path: 'carts', component: AdminCarts, title: 'Abandoned Carts — Store Admin' },
      { path: 'customers', component: AdminCustomers, title: 'Customers — Store Admin' },
      { path: 'reports', component: AdminReports, title: 'Reports — Store Admin' },
      { path: 'billing', component: AdminBilling, title: 'Billing & Subscription — Store Admin' },
      { path: 'settings', component: AdminSettings, title: 'Store Settings — Store Admin' },
    ],
  },
];
