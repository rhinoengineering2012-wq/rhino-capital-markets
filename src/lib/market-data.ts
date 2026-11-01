export type Instrument = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'crypto' | 'forex' | 'forex-africa' | 'commodity' | 'stock' | 'index';
  flag?: string;
};

const BASE: Omit<Instrument, 'price' | 'change' | 'changePercent'>[] = [
  { symbol: 'USD/UGX', name: 'US Dollar / Uganda Shilling', category: 'forex-africa', flag: '🇺🇬' },
  { symbol: 'USD/KES', name: 'US Dollar / Kenya Shilling', category: 'forex-africa', flag: '🇰🇪' },
  { symbol: 'USD/NGN', name: 'US Dollar / Nigeria Naira', category: 'forex-africa', flag: '🇳🇬' },
  { symbol: 'USD/ZAR', name: 'US Dollar / South Africa Rand', category: 'forex-africa', flag: '🇿🇦' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', flag: '🇪🇺' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', flag: '🇬🇧' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', flag: '🇯🇵' },
  { symbol: 'XAU/USD', name: 'Gold', category: 'commodity', flag: '🥇' },
  { symbol: 'WTI', name: 'Crude Oil', category: 'commodity', flag: '🛢️' },
  { symbol: 'BTC', name: 'Bitcoin', category: 'crypto', flag: '₿' },
  { symbol: 'ETH', name: 'Ethereum', category: 'crypto', flag: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', category: 'crypto', flag: '◎' },
  { symbol: 'AAPL', name: 'Apple', category: 'stock', flag: '🍎' },
  { symbol: 'NVDA', name: 'NVIDIA', category: 'stock', flag: '💚' },
];

const PRICES: Record<string, number> = {
  'USD/UGX': 3850, 'USD/KES': 129, 'USD/NGN': 1650, 'USD/ZAR': 18.5,
  'EUR/USD': 1.085, 'GBP/USD': 1.27, 'USD/JPY': 154.2,
  'XAU/USD': 2350, 'WTI': 78.5, 'BTC': 67000, 'ETH': 3500, 'SOL': 150,
  'AAPL': 210, 'NVDA': 950,
};

export function createInstruments(): Instrument[] {
  return BASE.map(b => ({ ...b, price: PRICES[b.symbol] || 100, change: 0, changePercent: 0 }));
}

export function tickInstrument(inst: Instrument): Instrument {
  const v = inst.category === 'crypto' ? 0.008 : 0.003;
  const c = (Math.random() - 0.5) * v * inst.price;
  return { ...inst, price: Number((inst.price + c).toFixed(inst.price > 100 ? 2 : 4)), change: Number(c.toFixed(2)), changePercent: Number(((c / inst.price) * 100).toFixed(2)) };
}
