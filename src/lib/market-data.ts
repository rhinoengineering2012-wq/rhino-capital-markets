export interface Instrument {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  flag: string; // 🇺🇬 or $ etc
  type: 'forex' | 'crypto' | 'stock';
}

export const createInstruments = (): Instrument[] => [
  // AFRICA - WITH REAL FLAGS
  { symbol: 'USD/UGX', name: 'US Dollar / Ugandan Shilling', price: 3850, change: 0, changePercent: 0, flag: '🇺🇬', type: 'forex' },
  { symbol: 'USD/KES', name: 'US Dollar / Kenyan Shilling', price: 129.5, change: 0, changePercent: 0, flag: '🇰🇪', type: 'forex' },
  { symbol: 'USD/NGN', name: 'US Dollar / Nigerian Naira', price: 1650, change: 0, changePercent: 0, flag: '🇳🇬', type: 'forex' },
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', price: 18.43, change: 0, changePercent: 0, flag: '🇿🇦', type: 'forex' },

  // WORLD FOREX - WITH FLAGS
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0849, change: 0, changePercent: 0, flag: '🇪🇺', type: 'forex' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2724, change: 0, changePercent: 0, flag: '🇬🇧', type: 'forex' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 151.67, change: 0, changePercent: 0, flag: '🇯🇵', type: 'forex' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.6579, change: 0, changePercent: 0, flag: '🇦🇺', type: 'forex' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: 0.9025, change: 0, changePercent: 0, flag: '🇨🇭', type: 'forex' },

  // CRYPTO - HOW THEY APPEAR ON SCREENS
  { symbol: 'BTC', name: 'Bitcoin', price: 78000, change: 0, changePercent: 0, flag: '₿', type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3523, change: 0, changePercent: 0, flag: 'Ξ', type: 'crypto' },
  { symbol: 'SOL', name: 'Solana', price: 149.24, change: 0, changePercent: 0, flag: '◎', type: 'crypto' },
  { symbol: 'BNB', name: 'BNB', price: 586, change: 0, changePercent: 0, flag: 'B', type: 'crypto' },

  // STOCKS - TESLA GOOGLE ETC LIKE ON SCREENS
  { symbol: 'AAPL', name: 'Apple Inc.', price: 226.70, change: 0, changePercent: 0, flag: 'AAPL', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 241.86, change: 0, changePercent: 0, flag: 'TSLA', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 131.47, change: 0, changePercent: 0, flag: 'NVDA', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', price: 418.15, change: 0, changePercent: 0, flag: 'MSFT', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.12, change: 0, changePercent: 0, flag: 'AMZN', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 168.23, change: 0, changePercent: 0, flag: 'GOOGL', type: 'stock' },
];

export const tickInstrument = (inst: Instrument): Instrument => {
  const volatility = inst.type === 'forex' ? 0.002 : 0.005;
  const changeFactor = (Math.random() - 0.5) * volatility;
  const newPrice = inst.price * (1 + changeFactor);
  const diff = newPrice - inst.price;
  return { ...inst, price: newPrice, change: diff, changePercent: (diff / inst.price) * 100 };
};
