import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'store',
    loadChildren: () => import('./storefront/storefront.routes').then(m => m.STOREFRONT_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./website/website.routes').then(m => m.WEBSITE_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
