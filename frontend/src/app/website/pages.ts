import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Shell pages for the marketing website.
 * Layouts, sections, and copy come from Documents/Mockup/storeforge-website-mockup.html.
 */

@Component({
  selector: 'sf-website-home',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="wrap">
        <span class="eyebrow">Now supporting Cash on Delivery checkout</span>
        <h1>Launch your online store <span class="hl">in minutes</span>, not months.</h1>
        <p>
          StoreForge is a multi-tenant eCommerce platform that gives every business its own fully
          branded storefront, admin dashboard, and order management system — no code required.
        </p>
        <div class="ctas">
          <a class="btn btn-flame btn-lg" routerLink="/register">Start Free Trial</a>
          <a class="btn hero-ghost btn-lg" routerLink="/pricing">View Pricing</a>
        </div>
        <div class="meta">
          <span><b>5 min</b> average setup</span>
          <span><b>99.9%</b> uptime</span>
          <span><b>No card required</b> for trial</span>
        </div>
      </div>
    </section>
    <section class="wrap placeholder">
      <h2>Everything you need to sell online</h2>
      <p>Feature grid, how-it-works steps, pricing preview, and testimonial sections are built from the approved mockup.</p>
    </section>
  `,
  styles: `
    .hero { background: var(--grad-premium-hero); color: #fff; padding: 90px 0 80px; }
    .eyebrow {
      display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16);
      color: var(--flame-pale); padding: 6px 13px; border-radius: var(--radius-pill);
      font-size: 12.5px; font-weight: 600; margin-bottom: 20px;
    }
    h1 { font-size: 46px; line-height: 1.08; margin: 0 0 18px; max-width: 640px; }
    .hl { color: #ff8a5c; }
    p { color: #9aa5b8; font-size: 17px; line-height: 1.6; max-width: 520px; margin: 0 0 30px; }
    .ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
    .hero-ghost { color: #fff; border-color: rgba(255,255,255,0.25); }
    .hero-ghost:hover { background: rgba(255,255,255,0.08); }
    .meta { display: flex; gap: 22px; font-size: 12.5px; color: #8b96ac; flex-wrap: wrap; }
    .meta b { color: #fff; }
    .placeholder { padding: 70px 28px; text-align: center; color: var(--muted); }
    .placeholder h2 { color: var(--text); }
  `,
})
export class WebsiteHome {}

@Component({
  selector: 'sf-website-features',
  template: `<div class="wrap page"><h1>Platform Features</h1><p>Feature grid per WEB-02 — build from the mockup's Features page.</p></div>`,
  styles: `.page { padding: 60px 28px; } p { color: var(--muted); }`,
})
export class WebsiteFeatures {}

@Component({
  selector: 'sf-website-pricing',
  template: `<div class="wrap page"><h1>Simple, transparent pricing</h1><p>Plan cards with monthly/yearly toggle, comparison table, and FAQ per WEB-03 / SUB-01.</p></div>`,
  styles: `.page { padding: 60px 28px; } p { color: var(--muted); }`,
})
export class WebsitePricing {}

@Component({
  selector: 'sf-website-contact',
  template: `<div class="wrap page"><h1>We'd love to hear from you</h1><p>Contact form and company info per WEB-04.</p></div>`,
  styles: `.page { padding: 60px 28px; } p { color: var(--muted); }`,
})
export class WebsiteContact {}

@Component({
  selector: 'sf-website-register',
  template: `<div class="wrap page"><h1>Create your account</h1><p>4-step wizard (Account → Plan → Billing → Confirmation) per WEB-05..07, calling POST /api/v1/register.</p></div>`,
  styles: `.page { padding: 60px 28px; max-width: 640px; } p { color: var(--muted); }`,
})
export class WebsiteRegister {}

@Component({
  selector: 'sf-website-login',
  template: `<div class="wrap page"><h1>Welcome back</h1><p>Store Owner / Super Admin login tabs per WEB-08 — wires to AuthService.login().</p></div>`,
  styles: `.page { padding: 60px 28px; max-width: 420px; } p { color: var(--muted); }`,
})
export class WebsiteLogin {}
