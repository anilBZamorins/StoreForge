import { Injectable, signal } from '@angular/core';
import { Tenant } from '../models';

/**
 * Resolves which store (tenant) the storefront is serving.
 * Production: {slug}.storeforge.io → slug from the hostname.
 * Development (localhost): falls back to a ?store= query param or a default demo slug.
 */
@Injectable({ providedIn: 'root' })
export class TenantService {
  private _tenant = signal<Tenant | null>(null);
  readonly tenant = this._tenant.asReadonly();

  readonly slug = resolveSlug();

  setTenant(t: Tenant): void {
    this._tenant.set(t);
  }
}

function resolveSlug(): string | null {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return new URLSearchParams(window.location.search).get('store') ?? 'auraliving';
  }
  const parts = host.split('.');
  // storeforge.io → marketing site (no tenant); {slug}.storeforge.io → tenant
  if (parts.length >= 3 && parts[0] !== 'www') return parts[0];
  return null;
}
