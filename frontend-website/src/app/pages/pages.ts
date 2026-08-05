import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Plan, ProvisionResult } from '../models';
import { MOCK_TESTIMONIAL } from '../mock';

// ---------- HOME ----------
@Component({
  selector: 'sf-home',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="wrap">
        <span class="eyebrow">Now supporting Cash on Delivery checkout</span>
        <h1>Launch your online store <span class="hl">in minutes</span>, not months.</h1>
        <p>StoreForge is a multi-tenant eCommerce platform that gives every business its own fully branded storefront, admin dashboard, and order management system — no code required.</p>
        <div class="ctas">
          <a class="btn btn-flame btn-lg" routerLink="/register">Start Free Trial</a>
          <a class="btn hero-ghost btn-lg" routerLink="/pricing">View Pricing</a>
        </div>
        <div class="meta">
          <span><b>5 min</b> average setup</span><span><b>99.9%</b> uptime</span><span><b>No card required</b> for trial</span>
        </div>
      </div>
    </section>
    <section class="wrap plans-preview">
      <h2>Plans that grow with your business</h2>
      <div class="plan-grid">
        @for (p of plans(); track p.name) {
          <div class="card plan" [class.featured]="p.featured">
            @if (p.featured) { <span class="pop">Most Popular</span> }
            <h3>{{ p.name }}</h3>
            <p class="desc">{{ p.description }}</p>
            <div class="price">\${{ p.monthlyPrice }}<span> / month</span></div>
            <ul>@for (f of p.features; track f) { <li>✓ {{ f }}</li> }</ul>
            <a class="btn btn-block" [class.btn-flame]="p.featured" [class.btn-ghost]="!p.featured" routerLink="/register">Get Started</a>
          </div>
        }
      </div>
    </section>
    <section class="wrap">
      <div class="premium-band quote">
        <blockquote>{{ testimonial.quote }}</blockquote>
        <div class="who">{{ testimonial.who }}</div>
      </div>
    </section>
  `,
  styles: `
    .hero { background: var(--grad-premium-hero); color: #fff; padding: 90px 0 80px; }
    .eyebrow { display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); color: var(--flame-pale); padding: 6px 13px; border-radius: var(--radius-pill); font-size: 12.5px; font-weight: 600; margin-bottom: 20px; }
    h1 { font-size: 46px; line-height: 1.08; margin: 0 0 18px; max-width: 640px; }
    .hl { color: #ff8a5c; }
    .hero p { color: #9aa5b8; font-size: 17px; line-height: 1.6; max-width: 520px; margin: 0 0 30px; }
    .ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
    .hero-ghost { color: #fff; border-color: rgba(255,255,255,0.25); }
    .hero-ghost:hover { background: rgba(255,255,255,0.08); }
    .meta { display: flex; gap: 22px; font-size: 12.5px; color: #8b96ac; flex-wrap: wrap; }
    .meta b { color: #fff; }
    .plans-preview { padding: 70px 28px; }
    .plans-preview h2 { text-align: center; margin: 0 0 32px; }
    .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 860px) { .plan-grid { grid-template-columns: 1fr; } }
    .plan { position: relative; display: flex; flex-direction: column; }
    .plan.featured { border-color: var(--flame); box-shadow: 0 0 0 3px var(--flame-dim); }
    .pop { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--flame); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: var(--radius-pill); }
    .desc { color: var(--muted); font-size: 13px; min-height: 32px; }
    .price { font-family: var(--font-display); font-weight: 800; font-size: 34px; }
    .price span { font-size: 13px; font-weight: 500; color: var(--muted); }
    ul { list-style: none; padding: 0; margin: 18px 0; flex: 1; font-size: 13.5px; display: flex; flex-direction: column; gap: 9px; color: var(--text); }
    .quote { padding: 50px; text-align: center; margin-bottom: 40px; }
    blockquote { font-family: var(--font-display); font-size: 21px; font-weight: 600; max-width: 680px; margin: 0 auto 18px; line-height: 1.5; }
    .who { font-size: 13px; color: #9aa5b8; }
  `,
})
export class HomePage implements OnInit {
  private data = inject(DataService);
  plans = signal<Plan[]>([]);
  testimonial = MOCK_TESTIMONIAL;
  ngOnInit() { this.data.getPlans().subscribe(p => this.plans.set(p)); }
}

// ---------- FEATURES ----------
@Component({
  selector: 'sf-features',
  template: `
    <div class="wrap page">
      <h1>Built for store owners, powered by StoreForge</h1>
      <div class="grid">
        @for (f of features; track f[0]) {
          <div class="card"><div class="ic">{{ f[0] }}</div><h3>{{ f[1] }}</h3><p>{{ f[2] }}</p></div>
        }
      </div>
    </div>
  `,
  styles: `
    .page { padding: 60px 28px; }
    h1 { text-align: center; margin-bottom: 36px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
    .ic { width: 42px; height: 42px; border-radius: 11px; background: var(--flame-dim); display: flex; align-items: center; justify-content: center; font-size: 19px; margin-bottom: 14px; }
    h3 { font-size: 16px; margin: 0 0 8px; }
    p { font-size: 13.5px; color: var(--muted); line-height: 1.6; margin: 0; }
  `,
})
export class FeaturesPage {
  features: [string, string, string][] = [
    ['🏬', 'Instant Store Provisioning', 'Your isolated store environment is created automatically the moment your subscription is confirmed.'],
    ['🛒', 'Full Storefront', 'Home page, categories, product details, wishlist, cart and checkout — ready out of the box.'],
    ['📦', 'Order Management', 'Track every order from placed to delivered, with status updates your customers can see.'],
    ['🎨', 'Your Branding', "Upload your logo, choose your colors, and customize banners — it's your store, your identity."],
    ['📊', 'Sales Reports', "Understand what's selling with built-in sales, order, and customer reports."],
    ['🔒', 'Secure & Isolated', 'Your data is fully isolated from every other tenant, with role-based access control.'],
  ];
}

// ---------- PRICING ----------
@Component({
  selector: 'sf-pricing',
  imports: [RouterLink],
  template: `
    <div class="wrap page">
      <h1>Simple, transparent pricing</h1>
      <div class="toggle">
        <span [class.on]="!yearly()">Monthly</span>
        <button class="switch" [class.yearly]="yearly()" (click)="yearly.set(!yearly())"><span class="knob"></span></button>
        <span [class.on]="yearly()">Yearly</span>
        <span class="save">Save 20%</span>
      </div>
      <div class="plan-grid">
        @for (p of plans(); track p.name) {
          <div class="card plan" [class.featured]="p.featured">
            @if (p.featured) { <span class="pop">Most Popular</span> }
            <h3>{{ p.name }}</h3>
            <p class="desc">{{ p.description }}</p>
            <div class="price">\${{ yearly() ? p.yearlyPrice : p.monthlyPrice }}<span> / {{ yearly() ? 'year' : 'month' }}</span></div>
            <ul>@for (f of p.features; track f) { <li>✓ {{ f }}</li> }</ul>
            <a class="btn btn-block" [class.btn-flame]="p.featured" [class.btn-ghost]="!p.featured" routerLink="/register">Get Started</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .page { padding: 60px 28px; }
    h1 { text-align: center; margin: 0 0 20px; }
    .toggle { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 38px; font-size: 14px; font-weight: 600; color: var(--muted); }
    .toggle .on { color: var(--text); }
    .switch { position: relative; width: 52px; height: 28px; background: var(--border); border-radius: 20px; border: none; cursor: pointer; }
    .switch.yearly { background: var(--flame); }
    .knob { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
    .switch.yearly .knob { transform: translateX(24px); }
    .save { background: var(--flame-dim); color: var(--flame); font-size: 11.5px; font-weight: 700; padding: 2px 9px; border-radius: 20px; }
    .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 860px) { .plan-grid { grid-template-columns: 1fr; } }
    .plan { position: relative; display: flex; flex-direction: column; }
    .plan.featured { border-color: var(--flame); box-shadow: 0 0 0 3px var(--flame-dim); }
    .pop { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--flame); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 20px; }
    .desc { color: var(--muted); font-size: 13px; min-height: 32px; }
    .price { font-family: var(--font-display); font-weight: 800; font-size: 34px; }
    .price span { font-size: 13px; font-weight: 500; color: var(--muted); }
    ul { list-style: none; padding: 0; margin: 18px 0; flex: 1; font-size: 13.5px; display: flex; flex-direction: column; gap: 9px; }
  `,
})
export class PricingPage implements OnInit {
  private data = inject(DataService);
  plans = signal<Plan[]>([]);
  yearly = signal(false);
  ngOnInit() { this.data.getPlans().subscribe(p => this.plans.set(p)); }
}

// ---------- CONTACT ----------
@Component({
  selector: 'sf-contact',
  imports: [FormsModule],
  template: `
    <div class="wrap page">
      <h1>We'd love to hear from you</h1>
      @if (sent()) {
        <div class="card ok">✓ Message sent — we'll be in touch within one business day.</div>
      } @else {
        <div class="card form">
          <label>Full Name <input [(ngModel)]="form.name" placeholder="Jane Cooper"></label>
          <label>Email <input [(ngModel)]="form.email" placeholder="jane@business.com"></label>
          <label>Message <textarea [(ngModel)]="form.message" placeholder="Tell us a bit about your business…"></textarea></label>
          <button class="btn btn-flame btn-block" (click)="submit()">Send Message</button>
        </div>
      }
    </div>
  `,
  styles: `
    .page { padding: 60px 28px; max-width: 560px; }
    .form { display: flex; flex-direction: column; gap: 14px; }
    label { font-size: 12.5px; font-weight: 600; color: var(--muted); display: flex; flex-direction: column; gap: 6px; }
    input, textarea { border: 1px solid var(--border); border-radius: 9px; padding: 11px 13px; font-size: 13.8px; font-family: var(--font-body); background: var(--canvas); outline: none; }
    input:focus, textarea:focus { border-color: var(--flame); background: #fff; }
    textarea { min-height: 100px; resize: vertical; }
    .ok { color: var(--success); font-weight: 600; }
  `,
})
export class ContactPage {
  private data = inject(DataService);
  form = { name: '', email: '', message: '' };
  sent = signal(false);
  submit() { this.data.submitContact(this.form).subscribe(() => this.sent.set(true)); }
}

// ---------- REGISTER (simplified wizard) ----------
@Component({
  selector: 'sf-register',
  imports: [FormsModule],
  template: `
    <div class="wrap page">
      @if (!result()) {
        <div class="card form">
          <h1>Create your account</h1>
          <label>Business Name <input [(ngModel)]="businessName" placeholder="e.g. Aura Living"></label>
          <label>Your Name <input [(ngModel)]="name" placeholder="Jane Cooper"></label>
          <label>Email <input [(ngModel)]="email" placeholder="jane@business.com"></label>
          <label>Password <input type="password" [(ngModel)]="password" placeholder="Create a password"></label>
          <label>Plan
            <select [(ngModel)]="plan">
              <option>Starter</option><option>Growth</option><option>Enterprise</option>
            </select>
          </label>
          <label class="trial"><input type="checkbox" [(ngModel)]="trial"> Start with a 14-day free trial — no payment required today</label>
          <button class="btn btn-flame btn-block btn-lg" (click)="submit()" [disabled]="busy()">
            {{ busy() ? 'Setting up your store…' : 'Complete Registration' }}
          </button>
        </div>
      } @else {
        <div class="card done">
          <h1>🎉 Your store is live!</h1>
          <p>Save these details — you'll need them to log in to your Store Admin Dashboard.</p>
          <div class="cred"><span>Store URL</span><code>{{ result()!.storeUrl }}</code></div>
          <div class="cred"><span>Admin Login</span><code>{{ result()!.adminEmail }}</code></div>
          <div class="cred"><span>Temporary Password</span><code>{{ result()!.temporaryPassword }}</code></div>
        </div>
      }
    </div>
  `,
  styles: `
    .page { padding: 60px 28px; max-width: 560px; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    .form { display: flex; flex-direction: column; gap: 14px; }
    label { font-size: 12.5px; font-weight: 600; color: var(--muted); display: flex; flex-direction: column; gap: 6px; }
    input, select { border: 1px solid var(--border); border-radius: 9px; padding: 11px 13px; font-size: 13.8px; font-family: var(--font-body); background: var(--canvas); outline: none; }
    input:focus { border-color: var(--flame); background: #fff; }
    .trial { flex-direction: row; align-items: center; gap: 10px; background: #eaf6ef; border: 1px solid #cdebd9; border-radius: 10px; padding: 12px 14px; color: #166b3c; font-size: 13px; }
    .trial input { width: 16px; height: 16px; accent-color: var(--success); }
    .done p { color: var(--muted); font-size: 13.5px; }
    .cred { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; font-size: 13.3px; border-bottom: 1px dashed var(--border); }
    .cred:last-child { border-bottom: none; }
    code { background: var(--canvas); border: 1px solid var(--border); padding: 4px 9px; border-radius: 6px; font-size: 12.5px; }
  `,
})
export class RegisterPage {
  private data = inject(DataService);
  businessName = ''; name = ''; email = ''; password = '';
  plan = 'Growth'; trial = true;
  busy = signal(false);
  result = signal<ProvisionResult | null>(null);
  submit() {
    this.busy.set(true);
    this.data.register({
      businessName: this.businessName, name: this.name, email: this.email,
      password: this.password, plan: this.plan, billingCycle: 'monthly', trial: this.trial,
    }).subscribe(r => { this.result.set(r); this.busy.set(false); });
  }
}

// ---------- LOGIN ----------
@Component({
  selector: 'sf-login',
  imports: [FormsModule],
  template: `
    <div class="wrap page">
      <div class="card">
        <div class="tabs">
          <button [class.active]="tab() === 'store'" (click)="tab.set('store')">Store Owner</button>
          <button [class.active]="tab() === 'super'" (click)="tab.set('super')">Super Admin</button>
        </div>
        <h1>Welcome back</h1>
        <p>{{ tab() === 'store' ? 'Log in to manage your store.' : 'Log in to the platform Super Admin console.' }}</p>
        <label>Email <input [(ngModel)]="email" placeholder="you@business.com"></label>
        <label>Password <input type="password" [(ngModel)]="password" placeholder="••••••••"></label>
        <button class="btn btn-flame btn-block">Log In</button>
      </div>
    </div>
  `,
  styles: `
    .page { padding: 70px 28px; max-width: 420px; }
    .card { display: flex; flex-direction: column; gap: 14px; }
    .tabs { display: flex; background: var(--canvas); border-radius: 10px; padding: 4px; }
    .tabs button { flex: 1; padding: 9px; border-radius: 8px; border: none; background: none; font-size: 13.3px; font-weight: 600; color: var(--muted); cursor: pointer; font-family: var(--font-body); }
    .tabs button.active { background: #fff; color: var(--text); box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
    h1 { margin: 0; font-size: 20px; }
    p { margin: 0; color: var(--muted); font-size: 13.3px; }
    label { font-size: 12.5px; font-weight: 600; color: var(--muted); display: flex; flex-direction: column; gap: 6px; }
    input { border: 1px solid var(--border); border-radius: 9px; padding: 11px 13px; font-size: 13.8px; font-family: var(--font-body); background: var(--canvas); outline: none; }
    input:focus { border-color: var(--flame); background: #fff; }
  `,
})
export class LoginPage {
  email = ''; password = '';
  tab = signal<'store' | 'super'>('store');
}
