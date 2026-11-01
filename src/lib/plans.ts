export interface Plan {
  id: 'daily' | 'weekly' | 'monthly' | 'yearly';
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
    perks: ['Live markets for every nation', 'Charts with all timeframes', 'Portfolio tracking'],
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: 20000,
    period: 'per week',
    perks: ['Everything in Daily', 'Analytics and market news', 'Live sentiment index'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 50000,
    period: 'per month',
    badge: 'Most popular',
    perks: ['Everything in Weekly', 'Moving-average indicators', 'Full portfolio tracking'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 400000,
    period: 'per year',
    badge: 'Save 33% vs monthly',
    perks: ['Everything in Monthly', 'Pay for 8 months, get 12', 'Best value for active traders'],
  },
];

export function formatUgx(amount: number): string {
  return `UGX ${amount.toLocaleString('en-US')}`;
}
