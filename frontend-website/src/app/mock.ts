// ============================================================
// MOCK DATA — frontend-website
// Used when environment.useMocks === true.
// Source: Documents/Mockup/storeforge-website-mockup.html
// ============================================================
import { Plan } from './models';

export const MOCK_PLANS: Plan[] = [
  {
    name: 'Starter',
    description: 'For new stores getting started',
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: ['200 products', '1 admin user', 'Subdomain store URL', 'Email support'],
    featured: false,
  },
  {
    name: 'Growth',
    description: 'For growing stores that need more',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: ['2,000 products', '5 admin users', '1 custom domain', 'Priority support + chat'],
    featured: true,
  },
  {
    name: 'Enterprise',
    description: 'For high-volume stores',
    monthlyPrice: 129,
    yearlyPrice: 1290,
    features: ['Unlimited products', 'Unlimited admin users', 'Unlimited custom domains', 'Dedicated account manager'],
    featured: false,
  },
];

export const MOCK_TESTIMONIAL = {
  quote:
    '"We went from an idea to a fully working store in about ten minutes. Order tracking and the admin dashboard have been rock solid since day one."',
  who: '— Asha Menon, Founder, UrbanCart',
};
