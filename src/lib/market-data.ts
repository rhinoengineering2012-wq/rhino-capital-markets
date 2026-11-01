export interface Instrument {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  flag: string;
  type: 'forex' | 'crypto' | 'stock';
}

export const createInstruments = () => [
  { symbol: 'USD/UGX', name: 'Ugandan Shilling', price: 3850.25, change: 0, changePercent: 0, flag: '🇺🇬', type: 'forex' as const },
  { symbol: 'USD/KES', name: 'Kenyan Shilling', price: 129.5, change: 0, changePercent: 0, flag: '🇰🇪', type: 'forex' as const },
  { symbol: 'USD/NGN', name: 'Nigerian Naira', price: 1650.1, change: 0, changePercent: 0, flag: '🇳🇬', type: 'forex' as const },
  { symbol: 'USD/ZAR', name: 'South African Rand', price: 18.41, change: 0, changePercent: 0, flag: '🇿🇦', type: 'forex' as const },
  { symbol: 'USD/EGP', name: 'Egyptian Pound', price: 50.75, change: 0, changePercent: 0, flag: '🇪🇬', type: 'forex' as const },
  { symbol: 'USD/GHS', name: 'Ghanaian Cedi', price: 15.2, change: 0, changePercent: 0, flag: '🇬🇭', type: 'forex' as const },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0849, change: 0, changePercent: 0, flag: '🇪🇺', type: 'forex' as const },
  { symbol: 'GBP/USD', name: 'British Pound', price: 1.2724, change: 0, changePercent: 0, flag: '🇬🇧', type: 'forex' as const },
  { symbol: 'USD/JPY', name: 'Japanese Yen', price: 151.67, change: 0, changePercent: 0, flag: '🇯🇵', type: 'forex' as const },
  { symbol: 'AUD/USD', name: 'Australian Dollar', price: 0.6579, change: 0, changePercent: 0, flag: '🇦🇺', type: 'forex' as const },
  { symbol: 'USD/CHF', name: 'Swiss Franc', price: 0.9025, change: 0, changePercent: 0, flag: '🇨🇭', type: 'forex' as const },
  { symbol: 'USD/CAD', name: 'Canadian Dollar', price: 1.36, change: 0, changePercent: 0, flag: '🇨🇦', type: 'forex' as const },
  { symbol: 'BTC', name: 'Bitcoin', price: 67451, change: 0, changePercent: 0, flag: '₿', type: 'crypto' as const },
  { symbol: 'ETH', name: 'Ethereum', price: 3509, change: 0, changePercent: 0, flag: 'Ξ', type: 'crypto' as const },
  { symbol: 'SOL', name: 'Solana', price: 148.66, change: 0, changePercent: 0, flag: '◎', type: 'crypto' as const },
  { symbol: 'BNB', name: 'BNB', price: 583.45, change: 0, changePercent: 0, flag: 'B', type: 'crypto' as const },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 226.69, change: 0, changePercent: 0, flag: 'AAPL', type: 'stock' as const },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 240.92, change: 0, changePercent: 0, flag: 'TSLA', type: 'stock' as const },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 131.86, change: 0, changePercent: 0, flag: 'NVDA', type: 'stock' as const },
  { symbol: 'MSFT', name: 'Microsoft', price: 418.11, change: 0, changePercent: 0, flag: 'MSFT', type: 'stock' as const },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.91, change: 0, changePercent: 0, flag: 'AMZN', type: 'stock' as const },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 168.01, change: 0, changePercent: 0, flag: 'GOOGL', type: 'stock' as const },
];

export const tickInstrument = (inst: any) => {
  const v = (Math.random()-0.5)*0.01;
  const np = inst.price*(1+v);
  const diff = np - inst.price;
  return { ...inst, price: np, change: diff, changePercent: (diff/inst.price)*100 };
};
