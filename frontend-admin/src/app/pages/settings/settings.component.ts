import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MOCK_STORE } from '../../mock';

@Component({
  selector: 'sf-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  /** Theme presets from the Color & Design Token Guide (ADM-10). */
  colors = ['#FF5A36', '#2F80ED', '#1F9D55', '#D64545', '#6C4FCE'];

  storeName = signal(MOCK_STORE.name);
  domain = MOCK_STORE.domain;
  themeColor = signal(this.colors[0]);
  supportEmail = signal('support@auraliving.com');
  saved = signal(false);

  save(): void {
    // API mode: PUT /api/v1/admin/settings — mock mode just confirms.
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
