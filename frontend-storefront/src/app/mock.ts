// ============================================================
// MOCK DATA — frontend-storefront (demo store: Aura Living)
// Used when environment.useMocks === true.
// Source: Documents/Mockup/aura-living-storefront-mockup.html
// ============================================================
import { Category, Product, Slide, TrackedOrder } from './models';

export const MOCK_STORE = { name: 'Aura Living', freeShippingOver: 99 };

export const MOCK_CATEGORIES: Category[] = [
  { id: 'textiles', name: 'Home Textiles', color1: '#8A6A4E', color2: '#B5673B' },
  { id: 'decor', name: 'Decor', color1: '#3B2F6C', color2: '#7C9473' },
  { id: 'furniture', name: 'Furniture', color1: '#20201C', color2: '#8A6A4E' },
];

export const MOCK_SLIDES: Slide[] = [
  { eyebrow: 'Summer Refresh', title: 'Up to 20% off Bedding & Linen', sub: 'Breathable, pre-washed linen made to soften with every wash.', c1: '#20201C', c2: '#4A4238' },
  { eyebrow: 'New In', title: 'Decor for a calmer home', sub: 'Fresh lighting, wall art and ceramics just landed.', c1: '#3B2F6C', c2: '#6C4FCE' },
  { eyebrow: 'This Week', title: 'Free shipping over $99', sub: 'On every order, no code needed — plus Cash on Delivery.', c1: '#B4790C', c2: '#FF5A36' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Linen Weave Duvet Set', sub: 'Bedding & Linen', price: 129, discount: 10, stock: 52, emoji: '🛏️', rating: 4.7, featured: true, latest: false,
    desc: 'Woven from pre-washed European linen, this duvet set softens with every wash while keeping its shape season after season.' },
  { id: 2, name: 'Organic Cotton Pillowcases (Pair)', sub: 'Bedding & Linen', price: 39, discount: 0, stock: 88, emoji: '🛏️', rating: 4.5, featured: false, latest: true,
    desc: 'A pair of breathable, GOTS-certified organic cotton pillowcases with a smooth sateen finish.' },
  { id: 3, name: 'Handwoven Jute Area Rug', sub: 'Rugs & Throws', price: 189, discount: 15, stock: 21, emoji: '🧶', rating: 4.6, featured: true, latest: false,
    desc: 'Handwoven by artisan partners using natural jute fiber — warmth and texture underfoot, durable for high-traffic rooms.' },
  { id: 4, name: 'Chunky Knit Throw Blanket', sub: 'Rugs & Throws', price: 69, discount: 0, stock: 9, emoji: '🧣', rating: 4.8, featured: false, latest: true,
    desc: 'Oversized and cable-knit from a soft acrylic-wool blend — turns any sofa into the best seat in the house.' },
  { id: 5, name: 'Rattan Pendant Light Shade', sub: 'Lighting', price: 99, discount: 0, stock: 34, emoji: '💡', rating: 4.4, featured: true, latest: false,
    desc: 'Hand-woven natural rattan casts warm, dappled light across any room. Fits standard pendant fittings.' },
  { id: 6, name: 'Ceramic Table Lamp', sub: 'Lighting', price: 79, discount: 12, stock: 5, emoji: '🪔', rating: 4.3, featured: false, latest: false,
    desc: 'A hand-glazed ceramic base paired with a soft linen shade — the calm anchor of a reading nook.' },
  { id: 7, name: 'Abstract Line Art Print Set', sub: 'Wall Art', price: 59, discount: 0, stock: 62, emoji: '🖼️', rating: 4.6, featured: false, latest: true,
    desc: 'A set of three minimalist line-art prints on archival matte paper, framed and ready to hang.' },
  { id: 8, name: 'Terracotta Wall Planter Trio', sub: 'Vases & Planters', price: 45, discount: 8, stock: 0, emoji: '🪴', rating: 4.2, featured: false, latest: false,
    desc: 'Three graduated terracotta planters with hidden wall mounts — greenery for any vertical space.' },
  { id: 9, name: 'Fluted Ceramic Vase, Large', sub: 'Vases & Planters', price: 65, discount: 0, stock: 27, emoji: '🏺', rating: 4.7, featured: true, latest: false,
    desc: 'A sculptural fluted vase in matte-glazed ceramic — beautiful empty, better with stems.' },
  { id: 10, name: 'Boucle Accent Armchair', sub: 'Seating', price: 449, discount: 5, stock: 6, emoji: '🛋️', rating: 4.8, featured: true, latest: true,
    desc: 'Curved boucle upholstery over a solid hardwood frame — a statement chair built for slow mornings.' },
  { id: 11, name: 'Oak Round Side Table', sub: 'Tables', price: 219, discount: 0, stock: 14, emoji: '🪑', rating: 4.5, featured: false, latest: true,
    desc: 'Solid white oak with a hand-oiled finish; a compact side table that ages beautifully.' },
  { id: 12, name: 'Woven Rattan Bench', sub: 'Seating', price: 279, discount: 10, stock: 3, emoji: '🪑', rating: 4.4, featured: false, latest: false,
    desc: 'A breezy rattan-and-teak bench for entryways and bedroom ends — light, sturdy, timeless.' },
];

export const MOCK_TRACKED_ORDERS: TrackedOrder[] = [
  { id: 'AL-3081', date: '06 Jul 2026', items: 2, total: 168, status: 'Delivered' },
  { id: 'AL-3083', date: '07 Jul 2026', items: 3, total: 243, status: 'Shipped' },
  { id: 'AL-3085', date: '08 Jul 2026', items: 2, total: 104, status: 'Pending' },
];
