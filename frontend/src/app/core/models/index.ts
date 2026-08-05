// Domain models mirroring the BRD (Documents/StoreForge-BRD.docx)

export type OrderStatus =
  | 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type CartState = 'Active' | 'Idle' | 'Abandoned';
export type StockStatus = 'Active' | 'Low Stock' | 'Out of Stock';
export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: number;
  name: 'Starter' | 'Growth' | 'Enterprise';
  monthlyPrice: number;
  yearlyPrice: number;
  productLimit: number | null;      // null = unlimited
  adminUserLimit: number | null;
  customDomainLimit: number | null;
  features: string[];
}

export interface Tenant {
  id: number;
  businessName: string;
  slug: string;                     // {slug}.storeforge.io
  plan: Plan;
  billingCycle: BillingCycle;
  trialEndsAt: string | null;
  status: 'trial' | 'active' | 'cancelled';
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  productCount?: number;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  discountPercent: number;
  stock: number;
  sku: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
  featured?: boolean;
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;                       // e.g. AL-3081
  customerName: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'COD' | 'Card';
  status: OrderStatus;
  trackingNumber?: string;
  deliveryAddress?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  orderCount: number;
  totalSpent: number;
  joinedAt: string;
}

export interface Cart {
  id: number;
  customerName: string;
  items: OrderItem[];
  value: number;
  lastActivityAt: string;
  state: CartState;
}

export interface Banner {
  id: number;
  kind: 'Homepage' | 'Category' | 'Offer';
  title: string;
  subtitle?: string;
  active: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'store_owner' | 'store_admin' | 'super_admin' | 'customer';
  tenantSlug?: string;
}

export function stockStatus(stock: number): StockStatus {
  if (stock === 0) return 'Out of Stock';
  if (stock < 10) return 'Low Stock';
  return 'Active';
}

export function cartState(hoursIdle: number): CartState {
  if (hoursIdle < 24) return 'Active';
  if (hoursIdle < 168) return 'Idle';
  return 'Abandoned';
}
