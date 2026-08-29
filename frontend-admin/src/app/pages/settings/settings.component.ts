import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'sf-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private data = inject(DataService);

  /** Theme presets from the Color & Design Token Guide (ADM-10). */
  colors = ['#FF5A36', '#2F80ED', '#1F9D55', '#D64545', '#6C4FCE'];

  storeName = signal('');
  domain = signal('');
  themeColor = signal(this.colors[0]);
  supportEmail = signal('');
  saved = signal(false);
  busy = signal(false);

  /** Loads settings — GET /api/v1/admin/settings in API mode. */
  ngOnInit(): void {
    this.data.getSettings().subscribe(s => {
      this.storeName.set(s.storeName);
      this.domain.set(s.domain);
      this.themeColor.set(s.themeColor || this.colors[0]);
      this.supportEmail.set(s.supportEmail ?? '');
    });
  }

  /** Saves settings — PUT /api/v1/admin/settings in API mode. */
  save(): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.data.saveSettings({
      storeName: this.storeName(),
      themeColor: this.themeColor(),
      supportEmail: this.supportEmail() || null,
    }).subscribe({
      next: () => {
        this.busy.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 2500);
      },
      error: () => this.busy.set(false),
    });
  }
}
