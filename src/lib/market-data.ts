export type AssetClass = 'forex' | 'crypto' | 'stock';

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  forex: 'Forex',
  crypto: 'Crypto',
  stock: 'Stocks',
};

export interface Instrument {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  prevPrice: number;
  decimals: number;
  high: number;
  low: number;
  volume: number;
  spark: number[];
  flag: string;
}

const genSpark = (base: number) => Array.from({length: 20}, () => base + (Math.random()-0.5)*base*0.05);

export const INITIAL_INSTRUMENTS: Instrument[] = [
  // AFRICA — NEW!
  { symbol: 'USD/UGX', name: 'Ugandan Shilling', assetClass: 'forex', price: 3850.25, prevPrice: 3845, decimals: 2, high: 3860, low: 3830, volume: 1250000, spark: genSpark(3850), flag: '🇺🇬' },
  { symbol: 'USD/KES', name: 'Kenyan Shilling', assetClass: 'forex', price: 129.5, prevPrice: 129.1, decimals: 2, high: 130.2, low: 128.8, volume: 980000, spark: genSpark(129), flag: '🇰🇪' },
  { symbol: 'USD/NGN', name: 'Nigerian Naira', assetClass: 'forex', price: 1650.1, prevPrice: 1645, decimals: 2, high: 1660, low: 1640, volume: 2100000, spark: genSpark(1650), flag: '🇳🇬' },
  { symbol: 'USD/ZAR', name: 'South African Rand', assetClass: 'forex', price: 18.41, prevPrice: 18.35, decimals: 4, high: 18.5, low: 18.3, volume: 1500000, spark: genSpark(18.4), flag: '🇿🇦' },
  { symbol: 'USD/EGP', name: 'Egyptian Pound', assetClass: 'forex', price: 50.75, prevPrice: 50.60, decimals: 2, high: 51, low: 50.5, volume: 850000, spark: genSpark(50), flag: '🇪🇬' },
  { symbol: 'USD/GHS', name: 'Ghanaian Cedi', assetClass: 'forex', price: 15.2, prevPrice: 15.1, decimals: 2, high: 15.3, low: 15.0, volume: 760000, spark: genSpark(15), flag: '🇬🇭' },

  // FOREIGN — STILL THERE!
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', assetClass: 'forex', price: 1.0849, prevPrice: 1.0820, decimals: 4, high: 1.09, low: 1.08, volume: 5000000, spark: genSpark(1.08), flag: '🇪🇺' },
  { symbol: 'GBP/USD', name: 'British Pound', assetClass: 'forex', price: 1.2724, prevPrice: 1.2700, decimals: 4, high: 1.28, low: 1.26, volume: 4200000, spark: genSpark(1.27), flag: '🇬🇧' },
  { symbol: 'USD/JPY', name: 'Japanese Yen', assetClass: 'forex', price: 151.67, prevPrice: 151.20, decimals: 2, high: 152, low: 151, volume: 3800000, spark: genSpark(151), flag: '🇯🇵' },
  { symbol: 'AUD/USD', name: 'Australian Dollar', assetClass: 'forex', price: 0.6579, prevPrice: 0.6550, decimals: 4, high: 0.66, low: 0.65, volume: 2900000, spark: genSpark(0.65), flag: '🇦🇺' },
  { symbol: 'USD/CHF', name: 'Swiss Franc', assetClass: 'forex', price: 0.9025, prevPrice: 0.9010, decimals: 4, high: 0.905, low: 0.90, volume: 2100000, spark: genSpark(0.90), flag: '🇨🇭' },
  { symbol: 'USD/CAD', name: 'Canadian Dollar', assetClass: 'forex', price: 1.36, prevPrice: 1.355, decimals: 4, high: 1.365, low: 1.35, volume: 2300000, spark: genSpark(1.36), flag: '🇨🇦' },

  // CRYPTO
  { symbol: 'BTC', name: 'Bitcoin', assetClass: 'crypto', price: 67451, prevPrice: 67000, decimals: 2, high: 68000, low: 66500, volume: 8900000, spark: genSpark(67451), flag: '₿' },
  { symbol: 'ETH', name: 'Ethereum', assetClass: 'crypto', price: 3509, prevPrice: 3480, decimals: 2, high: 3550, low: 3450, volume: 6500000, spark: genSpark(3509), flag: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', assetClass: 'crypto', price: 148.66, prevPrice: 145, decimals: 2, high: 150, low: 144, volume: 3200000, spark: genSpark(148), flag: '◎' },

  // STOCKS
  { symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'stock', price: 226.69, prevPrice: 225, decimals: 2, high: 228, low: 224, volume: 4500000, spark: genSpark(226), flag: '🍎' },
  { symbol: 'TSLA', name: 'Tesla Inc.', assetClass: 'stock', price: 240.92, prevPrice: 238, decimals: 2, high: 242, low: 237, volume: 5200000, spark: genSpark(240), flag: '🚗' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', assetClass: 'stock', price: 131.86, prevPrice: 130, decimals: 2, high: 133, low: 129, volume: 6100000, spark: genSpark(131), flag: 'NVDA' },
];

export const changePercent = (item: Instrument) => ((item.price - item.prevPrice) / item.prevPrice) * 100;
export const formatPrice = (v: number, d: number) => v.toFixed(d);
export const formatPercent = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
export const formatCompact = (v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`;
