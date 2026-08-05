import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import {
  Banner, Cart, Category, Customer, Invoice, Order, Plan, Product,
  badgeClass, cartState, stockStatus,
} from '../models';
import { MOCK_KPIS } from '../mock';

const TABLE = `
  h1 { font-size: 22px; margin: 0 0 4px; }
  .sub { color: var(--muted); font-size: 13px; margin: 0 0 22px; }
  .tcard { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; font-size: 13.2px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); font-weight: 600; padding: 9px 12px; border-bottom: 1px solid var(--border); background: #fafbfd; }
  td { padding: 11px 12px; border-bottom: 1px solid var(--border); }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: #f8fafd; }
`;

// ---------- DASHBOARD ----------
@Component({
  selector: 'sf-dashboard',
  template: `
    <h1>Dashboard</h1>
    <p class="sub">Welcome back — here's how your store is doing today</p>
    <div class="kpis">
      @for (k of kpis(); track k.label) {
        <div class="kpi">
          <div class="row"><span class="lbl">{{ k.label }}</span><span class="ic">{{ k.icon }}</span></div>
          <div class="val">{{ k.value }}</div>
          <div class="delta" [class.up]="k.up" [class.down]="!k.up">{{ k.delta }}</div>
        </div>
      }
    </div>
    <div class="tcard">
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          @for (o of recentOrders(); track o.id) {
            <tr><td>{{ o.id }}</td><td>{{ o.customer }}</td><td>\${{ o.total }}</td>
              <td><span class="badge" [class]="'badge ' + badgeClass(o.status)">{{ o.status }}</span></td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: TABLE + `
    .kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 22px; }
    @media (max-width: 1100px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
    .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; }
    .row { display: flex; justify-content: space-between; align-items: center; }
    .lbl { font-size: 12px; color: var(--muted); font-weight: 500; }
    .ic { width: 32px; height: 32px; border-radius: 9px; background: var(--flame-dim); display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .val { font-family: var(--font-display); font-weight: 700; font-size: 22px; margin-top: 6px; }
    .delta { font-size: 11.5px; font-weight: 600; margin-top: 4px; }
    .up { color: var(--success); } .down { color: var(--danger); }
  `,
})
export class DashboardPage implements OnInit {
  private data = inject(DataService);
  kpis = signal<typeof MOCK_KPIS>([]);
  orders = signal<Order[]>([]);
  recentOrders = computed(() => this.orders().slice(-5).reverse());
  badgeClass = badgeClass;
  ngOnInit() {
    this.data.getKpis().subscribe(k => this.kpis.set(k));
    this.data.getOrders().subscribe(o => this.orders.set(o));
  }
}

// ---------- PRODUCTS ----------
@Component({
  selector: 'sf-products',
  template: `
    <h1>Products</h1>
    <p class="sub">Manage your product catalog, pricing and stock</p>
    <div class="tcard">
      <table>
        <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>SKU</th></tr></thead>
        <tbody>
          @for (p of products(); track p.id) {
            <tr>
              <td>{{ p.emoji }} {{ p.name }}</td>
              <td>\${{ p.price }}@if (p.discount) { <small class="disc">-{{ p.discount }}%</small> }</td>
              <td>{{ p.stock }}</td>
              <td><span [class]="'badge ' + badgeClass(stockStatus(p.stock))">{{ stockStatus(p.stock) }}</span></td>
              <td>{{ p.sku }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: TABLE + `.disc { color: var(--flame); font-weight: 700; margin-left: 6px; }`,
})
export class ProductsPage implements OnInit {
  private data = inject(DataService);
  products = signal<Product[]>([]);
  stockStatus = stockStatus;
  badgeClass = (s: string) => badgeClass(s === 'Active' ? 'delivered' : s === 'Low Stock' ? 'pending' : 'cancelled');
  ngOnInit() { this.data.getProducts().subscribe(p => this.products.set(p)); }
}

// ---------- CATEGORIES ----------
@Component({
  selector: 'sf-categories',
  template: `
    <h1>Categories</h1>
    <p class="sub">Organize categories and sub-categories</p>
    <div class="tcard tree">
      @for (c of categories(); track c.id) {
        <div class="parent">{{ c.name }}</div>
        @for (s of c.subs; track s.id) {
          <div class="child"><span>{{ s.name }}</span><span class="count">{{ s.count }} products</span></div>
        }
      }
    </div>
  `,
  styles: TABLE + `
    .tree { padding: 6px 0; }
    .parent { padding: 12px 16px; font-weight: 700; background: #fafbfd; border-bottom: 1px solid var(--border); font-size: 14px; }
    .child { padding: 10px 16px 10px 38px; display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); font-size: 13.2px; }
    .count { font-size: 11.5px; color: var(--muted); background: var(--canvas); padding: 2px 9px; border-radius: 20px; }
  `,
})
export class CategoriesPage implements OnInit {
  private data = inject(DataService);
  categories = signal<Category[]>([]);
  ngOnInit() { this.data.getCategories().subscribe(c => this.categories.set(c)); }
}

// ---------- BANNERS ----------
@Component({
  selector: 'sf-banners',
  template: `
    <h1>Banners</h1>
    <p class="sub">Manage homepage, category and offer banners</p>
    <div class="grid">
      @for (b of banners(); track b.id) {
        <div class="bcard">
          <div class="art" [style.background]="'linear-gradient(135deg,' + b.color1 + ',' + b.color2 + ')'">{{ b.title }}</div>
          <div class="info"><b>{{ b.kind }}</b><span>{{ b.sub }}</span><span class="badge b-delivered">{{ b.status }}</span></div>
        </div>
      }
    </div>
  `,
  styles: TABLE + `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 1100px) { .grid { grid-template-columns: 1fr; } }
    .bcard { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; background: var(--surface); }
    .art { height: 100px; display: flex; align-items: center; justify-content: center; color: #fff; font-family: var(--font-display); font-weight: 700; }
    .info { padding: 13px 15px; display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; color: var(--muted); }
    .info b { color: var(--text); font-size: 13.5px; }
    .info .badge { align-self: flex-start; }
  `,
})
export class BannersPage implements OnInit {
  private data = inject(DataService);
  banners = signal<Banner[]>([]);
  ngOnInit() { this.data.getBanners().subscribe(b => this.banners.set(b)); }
}

// ---------- ORDERS ----------
@Component({
  selector: 'sf-orders',
  template: `
    <h1>Orders</h1>
    <p class="sub">Track and fulfil customer orders</p>
    <div class="tcard">
      <table>
        <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          @for (o of orders(); track o.id) {
            <tr>
              <td><b>{{ o.id }}</b></td><td>{{ o.customer }}</td><td>{{ o.date }}</td>
              <td>{{ o.items }}</td><td>\${{ o.total }}</td>
              <td><span [class]="'badge ' + badgeClass(o.status)">{{ o.status }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: TABLE,
})
export class OrdersPage implements OnInit {
  private data = inject(DataService);
  orders = signal<Order[]>([]);
  badgeClass = badgeClass;
  ngOnInit() { this.data.getOrders().subscribe(o => this.orders.set(o)); }
}

// ---------- ABANDONED CARTS ----------
@Component({
  selector: 'sf-carts',
  template: `
    <h1>Abandoned Carts</h1>
    <p class="sub">Customers often come back days — even weeks — later. Follow up before they forget.</p>
    <div class="tcard">
      <table>
        <thead><tr><th>Customer</th><th>Items</th><th>Last Activity</th><th>Status</th></tr></thead>
        <tbody>
          @for (c of carts(); track c.id) {
            <tr>
              <td>{{ c.customer }}<br><small>{{ c.email }}</small></td>
              <td>{{ itemCount(c) }}</td>
              <td>{{ age(c.hoursIdle) }}</td>
              <td><span [class]="'badge ' + stateBadge(c.hoursIdle)">{{ cartState(c.hoursIdle) }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: TABLE + `small { color: var(--muted); }`,
})
export class CartsPage implements OnInit {
  private data = inject(DataService);
  carts = signal<Cart[]>([]);
  cartState = cartState;
  itemCount(c: Cart) { return c.items.reduce((s, i) => s + i.qty, 0); }
  age(h: number) { return h < 24 ? Math.round(h) + ' hours ago' : Math.round(h / 24) + ' days ago'; }
  stateBadge(h: number) {
    const s = cartState(h);
    return s === 'Active' ? 'b-processing' : s === 'Idle' ? 'b-pending' : 'b-cancelled';
  }
  ngOnInit() { this.data.getCarts().subscribe(c => this.carts.set(c)); }
}

// ---------- CUSTOMERS ----------
@Component({
  selector: 'sf-customers',
  template: `
    <h1>Customers</h1>
    <p class="sub">View customers and their order history</p>
    <div class="tcard">
      <table>
        <thead><tr><th>Customer</th><th>City</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
        <tbody>
          @for (c of customers(); track c.id) {
            <tr><td>{{ c.name }}<br><small>{{ c.email }}</small></td><td>{{ c.city }}</td>
              <td>{{ c.orders }}</td><td>\${{ c.spent }}</td><td>{{ c.joined }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: TABLE + `small { color: var(--muted); }`,
})
export class CustomersPage implements OnInit {
  private data = inject(DataService);
  customers = signal<Customer[]>([]);
  ngOnInit() { this.data.getCustomers().subscribe(c => this.customers.set(c)); }
}

// ---------- REPORTS ----------
@Component({
  selector: 'sf-reports',
  template: `
    <h1>Reports</h1>
    <p class="sub">Sales and order performance for your store</p>
    <div class="tcard pad">
      <h3>Orders by Status</h3>
      @for (s of statusCounts(); track s[0]) {
        <div class="rrow"><span [class]="'badge ' + badgeClass(s[0])">{{ s[0] }}</span><span>{{ s[1] }}</span></div>
      }
    </div>
  `,
  styles: TABLE + `
    .pad { padding: 20px; }
    h3 { margin: 0 0 14px; font-size: 15px; }
    .rrow { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border); font-size: 13.5px; }
    .rrow:last-child { border-bottom: none; }
  `,
})
export class ReportsPage implements OnInit {
  private data = inject(DataService);
  orders = signal<Order[]>([]);
  badgeClass = badgeClass;
  statusCounts = computed(() => {
    const m = new Map<string, number>();
    for (const o of this.orders()) m.set(o.status, (m.get(o.status) ?? 0) + 1);
    return [...m.entries()];
  });
  ngOnInit() { this.data.getOrders().subscribe(o => this.orders.set(o)); }
}

// ---------- BILLING ----------
@Component({
  selector: 'sf-billing',
  template: `
    <h1>Billing & Subscription</h1>
    <p class="sub">Manage your StoreForge plan and payment history</p>
    <div class="current premium-band">
      <div><div class="cp-meta">CURRENT PLAN</div><div class="cp-plan">Growth — $49/month</div>
        <div class="cp-meta">Renews on August 9, 2026 · Visa ending 4242</div></div>
    </div>
    <div class="tcard">
      <table>
        <thead><tr><th>Invoice</th><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          @for (i of invoices(); track i.id) {
            <tr><td>{{ i.id }}</td><td>{{ i.date }}</td><td>{{ i.plan }}</td><td>\${{ i.amount }}</td>
              <td><span class="badge b-delivered">{{ i.status }}</span></td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: TABLE + `
    .current { padding: 24px 28px; margin-bottom: 20px; }
    .cp-meta { font-size: 12px; color: #b9c2d6; }
    .cp-plan { font-family: var(--font-display); font-weight: 800; font-size: 22px; margin: 4px 0; }
  `,
})
export class BillingPage implements OnInit {
  private data = inject(DataService);
  invoices = signal<Invoice[]>([]);
  plans = signal<Plan[]>([]);
  ngOnInit() {
    this.data.getInvoices().subscribe(i => this.invoices.set(i));
    this.data.getPlans().subscribe(p => this.plans.set(p));
  }
}

// ---------- SETTINGS ----------
@Component({
  selector: 'sf-settings',
  template: `
    <h1>Store Settings</h1>
    <p class="sub">Branding, contact info, footer and social links</p>
    <div class="tcard pad">
      <label>Store Name <input value="Aura Living"></label>
      <label>Store Domain <input value="auraliving.storeforge.io" disabled></label>
      <label>Theme Color
        <span class="swatches">
          @for (c of colors; track c) { <span class="sw" [style.background]="c"></span> }
        </span>
      </label>
      <button class="btn btn-dark">Save Changes</button>
    </div>
  `,
  styles: TABLE + `
    .pad { padding: 22px; display: flex; flex-direction: column; gap: 16px; max-width: 480px; }
    label { font-size: 12.5px; font-weight: 600; color: var(--muted); display: flex; flex-direction: column; gap: 6px; }
    input { border: 1px solid var(--border); border-radius: 9px; padding: 10px 12px; font-size: 13.5px; font-family: var(--font-body); background: var(--canvas); outline: none; }
    input:focus { border-color: var(--flame); background: #fff; }
    .swatches { display: flex; gap: 8px; }
    .sw { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; display: inline-block; }
    .btn { align-self: flex-start; }
  `,
})
export class SettingsPage {
  colors = ['#FF5A36', '#2F80ED', '#1F9D55', '#D64545', '#6C4FCE'];
}
