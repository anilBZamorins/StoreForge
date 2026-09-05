import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Attaches the Sanctum token as a Bearer header on every API request —
 * whether apiUrl is relative (/api/v1, dev proxy) or an absolute URL
 * (e.g. https://bvoke.com/api/v1 in production) — and kicks back to
 * /login when the API answers 401.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isApiRequest =
    req.url.startsWith('/api/') || req.url.startsWith(environment.apiUrl);

  if (isApiRequest) {
    // Accept header makes Laravel return JSON 401s instead of redirecting to a
    // web login route that does not exist in an API-only backend.
    const headers: Record<string, string> = { Accept: 'application/json' };
    const token = auth.token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    req = req.clone({ setHeaders: headers });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && router.url !== '/login') {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
