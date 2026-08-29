import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/** Attaches the Sanctum token as a Bearer header; kicks back to /login on 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (req.url.startsWith('/api/')) {
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
