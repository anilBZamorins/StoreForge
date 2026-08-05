// ============================================================
// MOCK DATA — frontend-admin (demo tenant: Aura Living)
// Used when environment.useMocks === true.
// Source: Documents/Mockup/storeforge-admin-dashboard.html
// ============================================================
import { Banner, Cart, Category, Customer, Invoice, Order, Plan, Product } from './models';

export const MOCK_STORE = { name: 'Aura Living', domain: 'auraliving.storeforge.io', plan: 'Growth' };

export const MOCK_CATEGORIES: Category[] = [
  { id: 'textiles', name: 'Home Textiles', subs: [
    { id: 'bedding', name: 'Bedding & Linen', count: 18 },
    { id: 'rugs', name: 'Rugs & Throws', count: 14 },
  ]},
  { id: 'decor', name: 'Decor', subs: [
    { id: 'lighting', name: 'Lighting', count: 11 },
    { id: 'wallart', name: 'Wall Art', count: 9 },
    { id: 'vases', name: 'Vases & Planters', count: 16 },
  ]},
  { id: 'furniture', name: 'Furniture', subs: [
    { id: 'seating', name: 'Seating', count: 7 },
    { id: 'tables', name: 'Tables', count: 5 },
  ]},
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Linen Weave Duvet Set', sub: 'bedding', price: 129, discount: 10, stock: 52, sku: 'AL-BED-101', emoji: '🛏️' },
  { id: 2, name: 'Organic Cotton Pillowcases (Pair)', sub: 'bedding', price: 39, discount: 0, stock: 88, sku: 'AL-BED-114', emoji: '🛏️' },
  { id: 3, name: 'Handwoven Jute Area Rug', sub: 'rugs', price: 189, discount: 15, stock: 21, sku: 'AL-RUG-208', emoji: '🧶' },
  { id: 4, name: 'Chunky Knit Throw Blanket', sub: 'rugs', price: 69, discount: 0, stock: 9, sku: 'AL-RUG-219', emoji: '🧣' },
  { id: 5, name: 'Rattan Pendant Light Shade', sub: 'lighting', price: 99, discount: 0, stock: 34, sku: 'AL-LGT-303', emoji: '💡' },
  { id: 6, name: 'Ceramic Table Lamp', sub: 'lighting', price: 79, discount: 12, stock: 5, sku: 'AL-LGT-311', emoji: '🪔' },
  { id: 7, name: 'Abstract Line Art Print Set', sub: 'wallart', price: 59, discount: 0, stock: 62, sku: 'AL-ART-402', emoji: '🖼️' },
  { id: 8, name: 'Terracotta Wall Planter Trio', sub: 'vases', price: 45, discount: 8, stock: 0, sku: 'AL-VAS-517', emoji: '🪴' },
  { id: 9, name: 'Fluted Ceramic Vase, Large', sub: 'vases', price: 65, discount: 0, stock: 27, sku: 'AL-VAS-522', emoji: '🏺' },
  { id: 10, name: 'Boucle Accent Armchair', sub: 'seating', price: 449, discount: 5, stock: 6, sku: 'AL-FUR-601', emoji: '🛋️' },
  { id: 11, name: 'Oak Round Side Table', sub: 'tables', price: 219, discount: 0, stock: 14, sku: 'AL-FUR-612', emoji: '🪑' },
  { id: 12, name: 'Woven Rattan Bench', sub: 'seating', price: 279, discount: 10, stock: 3, sku: 'AL-FUR-618', emoji: '🪑' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'AL-3081', customer: 'Grace Kim', date: '06 Jul 2026', items: 2, total: 168, status: 'Delivered', tracking: 'USPS3384211', addr: '12 Willow St, Austin, TX 78701', phone: '+1 512 555 0142' },
  { id: 'AL-3082', customer: 'Marcus Cole', date: '07 Jul 2026', items: 1, total: 189, status: 'Out for Delivery', tracking: 'USPS3384255', addr: '44 Elmwood Ave, Denver, CO 80202', phone: '+1 720 555 0177' },
  { id: 'AL-3083', customer: 'Priya Chandran', date: '07 Jul 2026', items: 3, total: 243, status: 'Shipped', tracking: 'USPS3384299', addr: '7B Lakeview Dr, Seattle, WA 98101', phone: '+1 206 555 0118' },
  { id: 'AL-3084', customer: 'Daniel Osei', date: '08 Jul 2026', items: 1, total: 449, status: 'Processing', tracking: '', addr: '21 Cedar Ln, Portland, OR 97201', phone: '+1 503 555 0164' },
  { id: 'AL-3085', customer: 'Sofia Martinez', date: '08 Jul 2026', items: 2, total: 104, status: 'Pending', tracking: '', addr: '5 Ridge Rd, Austin, TX 78704', phone: '+1 512 555 0199' },
  { id: 'AL-3086', customer: "Liam O'Connor", date: '09 Jul 2026', items: 1, total: 79, status: 'Pending', tracking: '', addr: '18 Bayview St, San Diego, CA 92101', phone: '+1 619 555 0133' },
  { id: 'AL-3087', customer: 'Emma Fischer', date: '09 Jul 2026', items: 1, total: 65, status: 'Cancelled', tracking: '', addr: '9 Rose Ct, Nashville, TN 37201', phone: '+1 615 555 0121' },
  { id: 'AL-3088', customer: 'Ravi Desai', date: '09 Jul 2026', items: 2, total: 298, status: 'Processing', tracking: '', addr: '33 Highland Ave, Chicago, IL 60614', phone: '+1 312 555 0155' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Grace Kim', email: 'grace.kim@gmail.com', phone: '+1 512 555 0142', city: 'Austin', orders: 6, spent: 842, joined: '12 Jan 2025' },
  { id: 2, name: 'Marcus Cole', email: 'marcus.cole@gmail.com', phone: '+1 720 555 0177', city: 'Denver', orders: 3, spent: 512, joined: '03 Mar 2025' },
  { id: 3, name: 'Priya Chandran', email: 'priya.c@outlook.com', phone: '+1 206 555 0118', city: 'Seattle', orders: 4, spent: 698, joined: '21 May 2025' },
  { id: 4, name: 'Daniel Osei', email: 'daniel.osei@gmail.com', phone: '+1 503 555 0164', city: 'Portland', orders: 2, spent: 449, joined: '02 Sep 2025' },
  { id: 5, name: 'Sofia Martinez', email: 'sofia.m@yahoo.com', phone: '+1 512 555 0199', city: 'Austin', orders: 1, spent: 104, joined: '19 Nov 2025' },
  { id: 6, name: 'Ravi Desai', email: 'ravi.desai@gmail.com', phone: '+1 312 555 0155', city: 'Chicago', orders: 5, spent: 721, joined: '27 Jan 2025' },
];

export const MOCK_CARTS: Cart[] = [
  { id: 1, customer: 'Emily Zhang', email: 'emily.zhang@gmail.com', phone: '+1 415 555 0188', items: [{ pid: 1, qty: 1 }, { pid: 5, qty: 2 }], hoursIdle: 5 },
  { id: 2, customer: 'Noah Bennett', email: 'noah.bennett@gmail.com', phone: '+1 646 555 0102', items: [{ pid: 10, qty: 1 }], hoursIdle: 312 },
  { id: 3, customer: 'Aaliyah Brooks', email: 'aaliyah.b@outlook.com', phone: '+1 773 555 0141', items: [{ pid: 3, qty: 1 }, { pid: 9, qty: 1 }, { pid: 11, qty: 1 }], hoursIdle: 14 },
  { id: 4, customer: 'Chris Palmer', email: 'chris.palmer@gmail.com', phone: '+1 214 555 0176', items: [{ pid: 6, qty: 1 }], hoursIdle: 487 },
  { id: 5, customer: 'Isabella Turner', email: 'isabella.t@yahoo.com', phone: '+1 617 555 0193', items: [{ pid: 2, qty: 3 }, { pid: 7, qty: 1 }], hoursIdle: 22 },
];

export const MOCK_BANNERS: Banner[] = [
  { id: 1, kind: 'Homepage Banner', title: 'Summer Refresh', sub: 'Up to 20% off Bedding & Linen', color1: '#0F172A', color2: '#16213E', status: 'Active' },
  { id: 2, kind: 'Category Banner', title: 'New in Decor', sub: 'Lighting & wall art just landed', color1: '#3B2F6C', color2: '#6C4FCE', status: 'Active' },
  { id: 3, kind: 'Offer Banner', title: 'Free Shipping', sub: 'On orders over $99 this week', color1: '#B4790C', color2: '#FF5A36', status: 'Active' },
];

export const MOCK_PLANS: Plan[] = [
  { name: 'Starter', monthly: 19, yearly: 190, feats: ['200 products', '1 admin user', 'Subdomain store URL', 'Email support'] },
  { name: 'Growth', monthly: 49, yearly: 490, feats: ['2,000 products', '5 admin users', '1 custom domain', 'Priority support + chat'] },
  { name: 'Enterprise', monthly: 129, yearly: 1290, feats: ['Unlimited products', 'Unlimited admin users', 'Unlimited custom domains', 'Dedicated account manager'] },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-0231', date: '09 Jun 2026', plan: 'Growth', amount: 49, status: 'Paid' },
  { id: 'INV-0198', date: '09 May 2026', plan: 'Growth', amount: 49, status: 'Paid' },
  { id: 'INV-0165', date: '09 Apr 2026', plan: 'Starter', amount: 19, status: 'Paid' },
  { id: 'INV-0142', date: '09 Mar 2026', plan: 'Starter', amount: 19, status: 'Paid' },
];

export const MOCK_KPIS = [
  { label: 'Total Orders', value: '312', delta: '+6.4% vs last week', up: true, icon: '📦' },
  { label: 'Total Sales', value: '$28,940', delta: '+3.1% vs last week', up: true, icon: '💰' },
  { label: 'Total Products', value: '146', delta: '+4 new this week', up: true, icon: '🏷️' },
  { label: 'Total Customers', value: '218', delta: '+9 this week', up: true, icon: '🧑' },
  { label: 'Pending Orders', value: '6', delta: 'Needs attention', up: false, icon: '⏳' },
];
