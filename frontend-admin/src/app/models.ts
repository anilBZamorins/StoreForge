export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type CartState = 'Active' | 'Idle' | 'Abandoned';
export type StockStatus = 'Active' | 'Low Stock' | 'Out of Stock';

export interface Category { id: string; name: string; subs: { id: string; name: string; count: number }[]; }
export interface Product { id: number; name: string; sub: string; price: number; discount: number; stock: number; sku: string; emoji: string; }
export interface Order { id: string; customer: string; date: string; items: number; total: number; status: OrderStatus; tracking: string; addr: string; phone: string; }
export interface Customer { id: number; name: string; email: string; phone: string; city: string; orders: number; spent: number; joined: string; }
export interface CartLine { pid: number; qty: number; }
export interface Cart { id: number; customer: string; email: string; phone: string; items: CartLine[]; hoursIdle: number; }
export interface Banner { id: number; kind: string; title: string; sub: string; color1: string; color2: string; status: string; }
export interface Plan { name: string; monthly: number; yearly: number; feats: string[]; }
export interface Invoice { id: string; date: string; plan: string; amount: number; status: string; }

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
export function badgeClass(status: string): string {
  return 'b-' + status.toLowerCase().replace(/ /g, '');
}
