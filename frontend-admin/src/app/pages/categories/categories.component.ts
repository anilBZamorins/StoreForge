import { Component, OnInit, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Category } from '../../models';

@Component({
  selector: 'sf-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private data = inject(DataService);

  categories = signal<Category[]>([]);
  /** Expanded/collapsed state per parent category (ADM-03 tree behaviour). */
  open = signal<Set<string>>(new Set());

  toggle(id: string): void {
    const next = new Set(this.open());
    next.has(id) ? next.delete(id) : next.add(id);
    this.open.set(next);
  }

  isOpen(id: string): boolean {
    return this.open().has(id);
  }

  totalProducts(c: Category): number {
    return c.subs.reduce((sum, s) => sum + s.count, 0);
  }

  ngOnInit(): void {
    this.data.getCategories().subscribe(c => {
      this.categories.set(c);
      this.open.set(new Set(c.map(x => x.id))); // start expanded
    });
  }
}
