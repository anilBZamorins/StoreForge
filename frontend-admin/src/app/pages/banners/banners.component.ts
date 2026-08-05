import { Component, OnInit, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Banner } from '../../models';

@Component({
  selector: 'sf-banners',
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
})
export class BannersComponent implements OnInit {
  private data = inject(DataService);

  banners = signal<Banner[]>([]);

  /** Activate/deactivate a banner in place (ADM-04). */
  toggleStatus(b: Banner): void {
    this.banners.set(
      this.banners().map(x => x.id === b.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x),
    );
  }

  gradient(b: Banner): string {
    return `linear-gradient(135deg, ${b.color1}, ${b.color2})`;
  }

  ngOnInit(): void {
    this.data.getBanners().subscribe(b => this.banners.set(b));
  }
}
