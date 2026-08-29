import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'sf-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  busy = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  mockMode = environment.useMocks;

  submit(): void {
    if (this.busy()) return;
    if (!this.email().trim() || !this.password()) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);

    this.auth.login(this.email().trim(), this.password()).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'Login failed. Please check your credentials and try again.');
      },
    });
  }
}
