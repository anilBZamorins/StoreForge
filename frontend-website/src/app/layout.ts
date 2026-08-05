import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'sf-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="navbar">
      <div class="nav-inner">
        <a class="logo" routerLink="/"><span class="logo-mark">SF</span>StoreForge</a>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/features" routerLinkActive="active">Features</a>
          <a routerLink="/pricing" routerLinkActive="active">Pricing</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>
        <div class="nav-right">
          <a class="btn btn-ghost" routerLink="/login">Log In</a>
          <a class="btn btn-flame" routerLink="/register">Start Free Trial</a>
        </div>
      </div>
    </div>

    <router-outlet />

    <footer>
      <div class="wrap foot-inner">
        <span><span class="logo-mark sm">SF</span> StoreForge — The multi-tenant eCommerce platform.</span>
        <span>© 2026 StoreForge. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: `
    .navbar {
      position: sticky; top: 0; z-index: 50;
      background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      max-width: 1120px; margin: 0 auto; padding: 0 28px; height: 72px;
      display: flex; align-items: center; gap: 8px;
    }
    .logo { display: flex; align-items: center; gap: 9px; font-family: var(--font-display); font-weight: 800; font-size: 19px; }
    .logo-mark {
      width: 32px; height: 32px; border-radius: 9px; background: var(--grad-flame);
      display: inline-flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 800; font-size: 15px;
    }
    .logo-mark.sm { width: 24px; height: 24px; font-size: 11px; border-radius: 7px; vertical-align: middle; }
    .nav-links { display: flex; gap: 6px; margin-left: 36px; }
    .nav-links a { padding: 9px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--muted); }
    .nav-links a:hover { color: var(--text); background: var(--canvas); }
    .nav-links a.active { color: var(--text); font-weight: 600; }
    .nav-right { margin-left: auto; display: flex; gap: 10px; }
    footer {
      background: var(--grad-ink-vertical); color: #9aa5b8;
      padding: 26px 0; font-size: 13px; margin-top: 60px;
    }
    .foot-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
  `,
})
export class Layout {}
