import { Routes } from '@angular/router';
import { Layout } from './layout';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BannersComponent } from './pages/banners/banners.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CartsComponent } from './pages/carts/carts.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { BillingComponent } from './pages/billing/billing.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: DashboardComponent, title: 'Dashboard — Store Admin' },
      { path: 'products', component: ProductsComponent, title: 'Products — Store Admin' },
      { path: 'categories', component: CategoriesComponent, title: 'Categories — Store Admin' },
      { path: 'banners', component: BannersComponent, title: 'Banners — Store Admin' },
      { path: 'orders', component: OrdersComponent, title: 'Orders — Store Admin' },
      { path: 'carts', component: CartsComponent, title: 'Abandoned Carts — Store Admin' },
      { path: 'customers', component: CustomersComponent, title: 'Customers — Store Admin' },
      { path: 'reports', component: ReportsComponent, title: 'Reports — Store Admin' },
      { path: 'billing', component: BillingComponent, title: 'Billing & Subscription — Store Admin' },
      { path: 'settings', component: SettingsComponent, title: 'Store Settings — Store Admin' },
    ],
  },
  { path: '**', redirectTo: '' },
];
