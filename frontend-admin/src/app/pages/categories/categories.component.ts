import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Category } from '../../models';

type ModalMode = 'add-category' | 'edit-category' | 'add-sub' | 'edit-sub';

interface CategoryForm {
  name: string;
  description: string;
  parentId: string;
}

@Component({
  selector: 'sf-categories',
  imports: [FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private data = inject(DataService);

  categories = signal<Category[]>([]);
  open = signal<Set<string>>(new Set());

  // ---------- Modal state (ADM-03) ----------
  modalMode = signal<ModalMode | null>(null);
  editingId = signal<string | null>(null);     // category id or sub id being edited
  editingParentId = signal<string | null>(null); // parent of the sub being edited
  form = signal<CategoryForm>({ name: '', description: '', parentId: '' });

  modalTitle = computed(() => {
    switch (this.modalMode()) {
      case 'add-category': return 'Add Category';
      case 'edit-category': return 'Edit Category';
      case 'add-sub': return 'Add Sub-category';
      case 'edit-sub': return 'Edit Sub-category';
      default: return '';
    }
  });

  isSubMode = computed(() => this.modalMode() === 'add-sub' || this.modalMode() === 'edit-sub');

  // ---------- tree ----------
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

  // ---------- modal open helpers ----------
  openAddCategory(): void {
    this.modalMode.set('add-category');
    this.editingId.set(null);
    this.form.set({ name: '', description: '', parentId: '' });
  }

  openEditCategory(c: Category, ev: Event): void {
    ev.stopPropagation();
    this.modalMode.set('edit-category');
    this.editingId.set(c.id);
    this.form.set({ name: c.name, description: '', parentId: '' });
  }

  openAddSub(): void {
    this.modalMode.set('add-sub');
    this.editingId.set(null);
    this.form.set({ name: '', description: '', parentId: this.categories()[0]?.id ?? '' });
  }

  openEditSub(parent: Category, subId: string, subName: string, ev: Event): void {
    ev.stopPropagation();
    this.modalMode.set('edit-sub');
    this.editingId.set(subId);
    this.editingParentId.set(parent.id);
    this.form.set({ name: subName, description: '', parentId: parent.id });
  }

  close(): void {
    this.modalMode.set(null);
  }

  // ---------- CRUD (mock in place; API mode: /api/v1/admin/categories) ----------
  save(): void {
    const f = this.form();
    if (!f.name.trim()) return;
    const mode = this.modalMode();
    const slug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (mode === 'add-category') {
      this.categories.set([...this.categories(), { id: slug, name: f.name, subs: [] }]);
      this.open.set(new Set([...this.open(), slug]));
    }
    if (mode === 'edit-category') {
      this.categories.set(this.categories().map(c => c.id === this.editingId() ? { ...c, name: f.name } : c));
    }
    if (mode === 'add-sub') {
      this.categories.set(this.categories().map(c =>
        c.id === f.parentId ? { ...c, subs: [...c.subs, { id: slug, name: f.name, count: 0 }] } : c,
      ));
    }
    if (mode === 'edit-sub') {
      this.categories.set(this.categories().map(c =>
        c.id === this.editingParentId()
          ? { ...c, subs: c.subs.map(s => s.id === this.editingId() ? { ...s, name: f.name } : s) }
          : c,
      ));
    }
    this.close();
  }

  deleteCategory(c: Category, ev: Event): void {
    ev.stopPropagation();
    this.categories.set(this.categories().filter(x => x.id !== c.id));
  }

  deleteSub(parent: Category, subId: string, ev: Event): void {
    ev.stopPropagation();
    this.categories.set(this.categories().map(c =>
      c.id === parent.id ? { ...c, subs: c.subs.filter(s => s.id !== subId) } : c,
    ));
  }

  patch<K extends keyof CategoryForm>(key: K, value: CategoryForm[K]): void {
    this.form.set({ ...this.form(), [key]: value });
  }

  ngOnInit(): void {
    this.data.getCategories().subscribe(c => {
      this.categories.set(c);
      this.open.set(new Set(c.map(x => x.id)));
    });
  }
}
