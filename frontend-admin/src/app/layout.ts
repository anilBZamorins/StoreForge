import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MOCK_SIDEBAR_COUNTS, MOCK_STORE, MOCK_USER } from './mock';

interface PageMeta { title: string; sub: string; }

const PAGE_META: Record<string, PageMeta> = {
  '': { title: 'Dashboard', sub: "Welcome back — here's how Aura Living is doing today" },
  'products': { title: 'Products', sub: 'Manage your product catalog, pricing and stock' },
  'categories': { title: 'Categories', sub: 'Organize categories and sub-categories' },
  'banners': { title: 'Banners', sub: 'Manage homepage, category and offer banners' },
  'orders': { title: 'Orders', sub: 'Track and fulfil customer orders' },
  'carts': { title: 'Abandoned Carts', sub: 'See what customers added to cart before leaving — some take weeks to come back' },
  'customers': { title: 'Customers', sub: 'View customers and their order history' },
  'reports': { title: 'Reports', sub: 'Sales and order performance for your store' },
  'billing': { title: 'Billing & Subscription', sub: 'Manage your StoreForge plan and payment history' },
  'settings': { title: 'Store Settings', sub: 'Branding, contact info, footer and social links' },
};

@Component({
  selector: 'sf-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private router = inject(Router);

  store = MOCK_STORE;
  counts = MOCK_SIDEBAR_COUNTS;
  user = MOCK_USER;
  meta = signal<PageMeta>(PAGE_META['']);

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const path = this.router.url.split('?')[0].replace(/^\//, '');
      this.meta.set(PAGE_META[path] ?? PAGE_META['']);
    });
  }
}
