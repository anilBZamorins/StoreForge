import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sf-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  name = signal('');
  email = signal('');
  orderNo = signal('');
  message = signal('');
  sent = signal(false);
  submitted = signal(false);

  valid = computed(() =>
    this.name().trim() !== '' && this.email().includes('@') && this.message().trim() !== '',
  );

  submit(): void {
    this.submitted.set(true);
    if (!this.valid()) return;
    // API mode: POST /api/v1/store/contact
    this.sent.set(true);
  }
}
