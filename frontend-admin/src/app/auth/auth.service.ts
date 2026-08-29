import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MOCK_USER } from '../mock';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'store_owner' | 'store_admin' | 'super_admin';
  tenantSlug: string | null;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'sf_admin_token';
const USER_KEY = 'sf_admin_user';

/**
 * Sanctum bearer-token auth.
 * useMocks: true  → accepts the seeded demo credentials locally, fake token.
 * useMocks: false → POST /api/v1/auth/login (portal: 'store'), real Sanctum token.
 * The token is attached to every /api request by authInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _user = signal<AuthUser | null>(readStoredUser());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  get token(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    if (environment.useMocks) {
      if (email.trim().toLowerCase() === 'owner@auraliving.com' && password === 'password') {
        const res: LoginResponse = {
          token: 'mock-token-' + Math.random().toString(36).slice(2),
          user: { id: 1, name: MOCK_USER.name, email, role: 'store_owner', tenantSlug: 'auraliving' },
        };
        return of(res).pipe(delay(400), tap(r => this.persist(r)));
      }
      return throwError(() => ({ error: { message: 'Invalid credentials. (Mock mode: owner@auraliving.com / password)' } })).pipe(delay(400));
    }

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password, portal: 'store' })
      .pipe(tap(r => this.persist(r)));
  }

  logout(): void {
    if (!environment.useMocks && this.token) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    }
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch { /* storage unavailable */ }
    this._user.set(null);
    this.router.navigateByUrl('/login');
  }

  private persist(r: LoginResponse): void {
    try {
      localStorage.setItem(TOKEN_KEY, r.token);
      localStorage.setItem(USER_KEY, JSON.stringify(r.user));
    } catch { /* storage unavailable */ }
    this._user.set(r.user);
  }
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
