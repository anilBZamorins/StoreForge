export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Category { id: string; name: string; color1: string; color2: string; }
export interface Product {
  id: number; name: string; sub: string; price: number; discount: number;
  stock: number; emoji: string; rating: number; featured: boolean; latest: boolean; desc: string;
}
export interface Slide { eyebrow: string; title: string; sub: string; c1: string; c2: string; }
export interface TrackedOrder { id: string; date: string; items: number; total: number; status: OrderStatus; }
export interface CartItem { product: Product; qty: number; }

export function finalPrice(p: Product): number {
  return Math.round(p.price * (1 - p.discount / 100));
}
export function badgeClass(status: string): string {
  return 'b-' + status.toLowerCase().replace(/ /g, '');
}
export const STATUS_FLOW: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
