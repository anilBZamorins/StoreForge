import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Invoice, Plan } from '../../models';
import { MOCK_STORE } from '../../mock';

@Component({
  selector: 'sf-billing',
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent implements OnInit {
  private data = inject(DataService);

  invoices = signal<Invoice[]>([]);
  plans = signal<Plan[]>([]);
  yearly = signal(false);
  currentPlan = signal(MOCK_STORE.plan);

  totalPaid = computed(() => this.invoices().reduce((s, i) => s + i.amount, 0));

  price(p: Plan): string {
    return this.yearly() ? `$${p.yearly}/yr` : `$${p.monthly}/mo`;
  }

  /** Switch plan (SUB-04): upgrade immediate, downgrade at next cycle — mocked in place. */
  choosePlan(p: Plan): void {
    this.currentPlan.set(p.name);
  }

  ngOnInit(): void {
    this.data.getInvoices().subscribe(i => this.invoices.set(i));
    this.data.getPlans().subscribe(p => this.plans.set(p));
  }
}
