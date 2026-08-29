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

  /** Activate/deactivate a banner — PUT /api/v1/admin/banners/{id} in API mode. */
  toggleStatus(b: Banner): void {
    const nextActive = b.status !== 'Active';
    this.data.updateBanner(b.id, { active: nextActive }).subscribe(() =>
      this.banners.set(
        this.banners().map(x => x.id === b.id ? { ...x, status: nextActive ? 'Active' : 'Inactive' } : x),
      ),
    );
  }

  gradient(b: Banner): string {
    return `linear-gradient(135deg, ${b.color1}, ${b.color2})`;
  }

  ngOnInit(): void {
    this.data.getBanners().subscribe(b => this.banners.set(b));
  }
}
