// Rhino Capital Markets - Market Data
export type AssetClass = 'stocks' | 'forex' | 'crypto' | 'commodities' | 'bonds' | 'etfs' | 'africa';

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  sparkline: number[];
  assetClass: AssetClass;
  flag?: string;
  currencyCode?: string;
}

function genSpark(base: number, vol: number, points = 24): number[] {
  const arr: number[] = []; let v = base;
  for (let i = 0; i < points; i++) { v += (Math.random() - 0.5) * vol; arr.push(Number(v.toFixed(2))); }
  return arr;
}

export const INSTRUMENTS: Instrument[] = [
  { id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc.', price: 210.45, change: 2.34, changePercent: 1.12, sparkline: genSpark(210, 2), assetClass: 'stocks', flag: '🇺🇸' },
  { id: 'MSFT', symbol: 'MSFT', name: 'Microsoft', price: 445.12, change: -1.23, changePercent: -0.27, sparkline: genSpark(445, 3), assetClass: 'stocks', flag: '🇺🇸' },
  { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA', price: 135.50, change: 3.20, changePercent: 2.41, sparkline: genSpark(135, 4), assetClass: 'stocks', flag: '🇺🇸' },
  { id: 'TSLA', symbol: 'TSLA', name: 'Tesla', price: 268.90, change: 5.67, changePercent: 2.15, sparkline: genSpark(268, 5), assetClass: 'stocks', flag: '🇺🇸' },

  { id: 'EURUSD', symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0854, change: 0.0021, changePercent: 0.19, sparkline: genSpark(1.08, 0.01), assetClass: 'forex', flag: '🇪🇺' },
  { id: 'GBPUSD', symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2750, change: -0.0012, changePercent: -0.09, sparkline: genSpark(1.27, 0.01), assetClass: 'forex', flag: '🇬🇧' },
  { id: 'USDJPY', symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 152.34, change: 0.45, changePercent: 0.29, sparkline: genSpark(152, 0.5), assetClass: 'forex', flag: '🇯🇵' },
  { id: 'USDCHF', symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: 0.91, change: 0.001, changePercent: 0.11, sparkline: genSpark(0.91, 0.005), assetClass: 'forex', flag: '🇨🇭' },
  { id: 'AUDUSD', symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.66, change: 0.002, changePercent: 0.30, sparkline: genSpark(0.66, 0.005), assetClass: 'forex', flag: '🇦🇺' },
  { id: 'USDCAD', symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: 1.36, change: -0.002, changePercent: -0.15, sparkline: genSpark(1.36, 0.01), assetClass: 'forex', flag: '🇨🇦' },

  { id: 'USD_UGX', symbol: 'USD/UGX', name: 'US Dollar / Ugandan Shilling', price: 3720.50, change: 15.2, changePercent: 0.41, sparkline: genSpark(3720, 10), assetClass: 'forex', flag: '🇺🇬', currencyCode: 'UGX' },
  { id: 'USD_KES', symbol: 'USD/KES', name: 'US Dollar / Kenyan Shilling', price: 129.45, change: -0.35, changePercent: -0.27, sparkline: genSpark(129, 1), assetClass: 'forex', flag: '🇰🇪', currencyCode: 'KES' },
  { id: 'USD_NGN', symbol: 'USD/NGN', name: 'US Dollar / Nigerian Naira', price: 1620.75, change: 8.5, changePercent: 0.52, sparkline: genSpark(1620, 15), assetClass: 'forex', flag: '🇳🇬', currencyCode: 'NGN' },
  { id: 'USD_ZAR', symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', price: 18.65, change: -0.12, changePercent: -0.64, sparkline: genSpark(18.6, 0.3), assetClass: 'forex', flag: '🇿🇦', currencyCode: 'ZAR' },
  { id: 'USD_GHS', symbol: 'USD/GHS', name: 'US Dollar / Ghanaian Cedi', price: 15.20, change: 0.05, changePercent: 0.33, sparkline: genSpark(15.2, 0.2), assetClass: 'forex', flag: '🇬🇭', currencyCode: 'GHS' },
  { id: 'USD_EGP', symbol: 'USD/EGP', name: 'US Dollar / Egyptian Pound', price: 50.85, change: 0.10, changePercent: 0.19, sparkline: genSpark(50, 0.5), assetClass: 'forex', flag: '🇪🇬', currencyCode: 'EGP' },
  { id: 'USD_RWF', symbol: 'USD/RWF', name: 'US Dollar / Rwandan Franc', price: 1320.10, change: 2.1, changePercent: 0.16, sparkline: genSpark(1320, 8), assetClass: 'forex', flag: '🇷🇼', currencyCode: 'RWF' },
  { id: 'USD_TZS', symbol: 'USD/TZS', name: 'US Dollar / Tanzanian Shilling', price: 2630.00, change: -5.0, changePercent: -0.19, sparkline: genSpark(2630, 12), assetClass: 'forex', flag: '🇹🇿', currencyCode: 'TZS' },

  { id: 'BTC', symbol: 'BTC/USD', name: 'Bitcoin', price: 67234.12, change: 1234.5, changePercent: 1.87, sparkline: genSpark(67234, 500), assetClass: 'crypto', flag: '₿' },
  { id: 'ETH', symbol: 'ETH/USD', name: 'Ethereum', price: 3421.55, change: -45.2, changePercent: -1.30, sparkline: genSpark(3421, 50), assetClass: 'crypto', flag: 'Ξ' },
  { id: 'SOL', symbol: 'SOL/USD', name: 'Solana', price: 145.20, change: 5.20, changePercent: 3.71, sparkline: genSpark(145, 5), assetClass: 'crypto', flag: '◎' },

  { id: 'XAUUSD', symbol: 'XAU/USD', name: 'Gold / US Dollar', price: 2650.45, change: 12.30, changePercent: 0.46, sparkline: genSpark(2650, 15), assetClass: 'commodities', flag: '🪙' },
  { id: 'XAGUSD', symbol: 'XAG/USD', name: 'Silver / US Dollar', price: 31.20, change: 0.25, changePercent: 0.80, sparkline: genSpark(31, 0.5), assetClass: 'commodities', flag: '🥈' },
  { id: 'USOIL', symbol: 'WTI/USD', name: 'US Crude Oil', price: 78.45, change: -1.20, changePercent: -1.50, sparkline: genSpark(78, 1.5), assetClass: 'commodities', flag: '🛢️' },

  { id: 'US10Y', symbol: 'US10Y', name: 'US 10-Year Treasury', price: 4.25, change: 0.02, changePercent: 0.47, sparkline: genSpark(4.25, 0.05), assetClass: 'bonds', flag: '🇺🇸' },
  { id: 'SPY', symbol: 'SPY', name: 'S&P 500 ETF', price: 475.20, change: 2.10, changePercent: 0.44, sparkline: genSpark(475, 3), assetClass: 'etfs', flag: '🇺🇸' },
];

export function fearGreedLabel(value: number): string {
  if (value < 25) return 'Extreme Fear'; if (value < 45) return 'Fear'; if (value < 55) return 'Neutral'; if (value < 75) return 'Greed'; return 'Extreme Greed';
}
export function fearGreedColor(value: number): string {
  if (value < 25) return '#ef4444'; if (value < 45) return '#f97316'; if (value < 55) return '#eab308'; if (value < 75) return '#22c55e'; return '#16a34a';
}
export const createInstruments = () => INSTRUMENTS;
export const tickInstrument = (inst: Instrument): Instrument => ({ ...inst, price: inst.price + (Math.random() - 0.5) * (inst.price * 0.001), sparkline: [...inst.sparkline.slice(1), inst.price] });
export const formatCompact = (n: number) => n.toLocaleString();
export const formatCurrency = (n: number) => `$${n.toLocaleString()}`;
export const formatPercent = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
