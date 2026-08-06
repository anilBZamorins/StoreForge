import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, DataService } from '../../services/data.service';
import { Category, Product, Slide, finalPrice } from '../../models';

@Component({
  selector: 'sf-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private data = inject(DataService);
  cart = inject(CartService);

  slides = signal<Slide[]>([]);
  categories = signal<Category[]>([]);
  featured = signal<Product[]>([]);
  latest = signal<Product[]>([]);
  idx = signal(0);
  private timer: ReturnType<typeof setInterval> | undefined;

  finalPrice = finalPrice;

  /** Premium hero: flame glow layered over the slide's gradient (design guide v1.2). */
  heroBg = computed(() => {
    const s = this.slides()[this.idx()];
    return s
      ? `radial-gradient(ellipse at top right, rgba(255,90,54,0.18) 0%, transparent 55%), linear-gradient(135deg, ${s.c1}, ${s.c2})`
      : '';
  });

  next(): void { this.go(this.idx() + 1); }
  prev(): void { this.go(this.idx() - 1); }

  go(i: number): void {
    const n = this.slides().length;
    if (n) this.idx.set(((i % n) + n) % n);
    this.restartAutoplay();
  }

  private restartAutoplay(): void {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const n = this.slides().length;
      if (n) this.idx.set((this.idx() + 1) % n);
    }, 6000);
  }

  ngOnInit(): void {
    this.data.getSlides().subscribe(s => { this.slides.set(s); this.restartAutoplay(); });
    this.data.getCategories().subscribe(c => this.categories.set(c));
    this.data.getProducts().subscribe(ps => {
      this.featured.set(ps.filter(p => p.featured));
      this.latest.set(ps.filter(p => p.latest));
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
