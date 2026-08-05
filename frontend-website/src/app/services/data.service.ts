import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Plan, RegistrationPayload, ProvisionResult } from '../models';
import { MOCK_PLANS } from '../mock';

/**
 * All website data flows through here.
 * environment.useMocks === true  → serves mock.ts data
 * environment.useMocks === false → calls the Laravel API
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getPlans(): Observable<Plan[]> {
    if (environment.useMocks) return of(MOCK_PLANS).pipe(delay(150));
    return this.http.get<Plan[]>(`${this.api}/plans`);
  }

  register(payload: RegistrationPayload): Observable<ProvisionResult> {
    if (environment.useMocks) {
      const slug = payload.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'yourstore';
      return of({
        storeUrl: `${slug}.storeforge.io`,
        adminEmail: payload.email || 'owner@yourbusiness.com',
        temporaryPassword: 'Tmp#' + Math.random().toString(36).slice(2, 8),
      }).pipe(delay(1800));
    }
    return this.http.post<ProvisionResult>(`${this.api}/register`, payload);
  }

  submitContact(form: Record<string, string>): Observable<{ ok: boolean }> {
    if (environment.useMocks) return of({ ok: true }).pipe(delay(300));
    return this.http.post<{ ok: boolean }>(`${this.api}/contact`, form);
  }
}
