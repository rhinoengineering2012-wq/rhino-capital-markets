export type PlanId = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  badge?: string;
  perks: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'daily',
    name: 'Daily',
    price: 5000,
    period: 'per day',
    perks: [
      'Full terminal access',
      'Live markets & charts',
      'Basic analytics',
      'Cancel anytime',
    ],
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: 25000,
    period: 'per week',
    badge: 'MOST POPULAR',
    perks: [
      'Everything in Daily',
      'Advanced analytics',
      'Portfolio tracking (5 assets)',
      'Priority support',
      'Save 28% vs daily',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 75000,
    period: 'per month',
    badge: 'BEST VALUE',
    perks: [
      'Everything in Weekly',
      'Unlimited portfolio',
      'AI sentiment analysis',
      'Market dominance tracker',
      'Export data',
      'Save 50% vs daily',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 650000,
    period: 'per year',
    badge: 'SAVE 64%',
    perks: [
      'Everything in Monthly',
      'VIP trader badge',
      '1-on-1 onboarding call',
      'Early feature access',
      'Save 64% vs daily - best deal',
    ],
  },
];

export function formatUgx(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(amount);
      }
