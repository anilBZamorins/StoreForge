export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  name: 'Starter' | 'Growth' | 'Enterprise';
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  featured: boolean;
}

export interface RegistrationPayload {
  businessName: string;
  name: string;
  email: string;
  password: string;
  plan: string;
  billingCycle: BillingCycle;
  trial: boolean;
}

export interface ProvisionResult {
  storeUrl: string;
  adminEmail: string;
  temporaryPassword: string;
}
