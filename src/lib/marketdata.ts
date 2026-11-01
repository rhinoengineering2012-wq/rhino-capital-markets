// Rhino Capital Markets - Market Data - ULTIMATE - No More Errors
export type AssetClass = 'forex' | 'crypto' | 'stock' | 'commodities' | 'bonds' | 'etfs' | 'africa';

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  forex: 'Forex', crypto: 'Crypto', stock: 'Stocks',
  commodities: 'Commodities', bonds: 'Bonds', etfs: 'ETFs', africa: 'Markets',
};

export interface Instrument {
  symbol: string; name: string; assetClass: AssetClass; flag: string;
  price: number; prevPrice: number; high: number; low: number;
  volume: number; decimals: number; spark: number[]; currencyCode?: string;
}

export interface Candle {
  time: number; open: number; high: number; low: number; close: number; volume: number;
  timestamp?: number; // alias for compatibility
}

export type Timeframe = '1M' | '5M' | '15M' | '1H' | '4H' | '1D' | '1W' | '1M_TF';
export const TIMEFRAMES: Timeframe[] = ['1M', '5M', '15M', '1H', '4H', '1D', '1W', '1M_TF'];
export const Timeframes = TIMEFRAMES;
export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  '1M': '1 Minute', '5M': '5 Minutes', '15M': '15 Minutes',
  '1H': '1 Hour', '4H': '4 Hours', '1D': '1 Day', '1W': '1 Week', '1M_TF': '1 Month'
};

function genSpark(base: number, vol: number, points = 20): number[] {
  const arr: number[] = []; let v = base;
  for (let i = 0; i < points; i++) { v += (Math.random() - 0.5) * vol; arr.push(Number(v.toFixed(2))); }
  return arr;
}
function make(symbol: string, name: string, assetClass: AssetClass, flag: string, price: number, decimals: number, currencyCode?: string): Instrument {
  const prevPrice = price - (Math.random() - 0.5) * price * 0.01;
  return {
    symbol, name, assetClass, flag, price, prevPrice,
    high: Number((Math.max(price, prevPrice) + Math.random()*price*0.005).toFixed(decimals)),
    low: Number((Math.min(price, prevPrice) - Math.random()*price*0.005).toFixed(decimals)),
    volume: Math.floor(Math.random()*50000000)+1000000, decimals,
    spark: genSpark(price, price*0.005), currencyCode,
  };
}

export const INSTRUMENTS: Instrument[] = [
  make('EUR/USD','Euro / US Dollar','forex','🇪🇺',1.0854,4),
  make('GBP/USD','British Pound / US Dollar','forex','🇬🇧',1.2750,4),
  make('USD/JPY','US Dollar / Japanese Yen','forex','🇯🇵',152.34,2),
  make('USD/CHF','US Dollar / Swiss Franc','forex','🇨🇭',0.91,4),
  make('AUD/USD','Australian Dollar / US Dollar','forex','🇦🇺',0.66,4),
  make('USD/CAD','US Dollar / Canadian Dollar','forex','🇨🇦',1.36,4),
  make('USD/UGX','US Dollar / Ugandan Shilling','forex','🇺🇬',3720.50,2,'UGX'),
  make('USD/KES','US Dollar / Kenyan Shilling','forex','🇰🇪',129.45,2,'KES'),
  make('USD/NGN','US Dollar / Nigerian Naira','forex','🇳🇬',1620.75,2,'NGN'),
  make('USD/ZAR','US Dollar / South African Rand','forex','🇿🇦',18.65,2,'ZAR'),
  make('USD/GHS','US Dollar / Ghanaian Cedi','forex','🇬🇭',15.20,2,'GHS'),
  make('USD/EGP','US Dollar / Egyptian Pound','forex','🇪🇬',50.85,2,'EGP'),
  make('USD/RWF','US Dollar / Rwandan Franc','forex','🇷🇼',1320.10,2,'RWF'),
  make('USD/TZS','US Dollar / Tanzanian Shilling','forex','🇹🇿',2630.00,2,'TZS'),
  make('BTC/USD','Bitcoin','crypto','₿',67234.12,2),
  make('ETH/USD','Ethereum','crypto','Ξ',3421.55,2),
  make('SOL/USD','Solana','crypto','◎',145.20,2),
  make('AAPL','Apple Inc.','stock','🇺🇸',210.45,2),
  make('MSFT','Microsoft','stock','🇺🇸',445.12,2),
  make('NVDA','NVIDIA Corp','stock','🇺🇸',135.50,2),
  make('TSLA','Tesla Inc','stock','🇺🇸',268.90,2),
  make('XAU/USD','Gold / US Dollar','commodities','🪙',2650.45,2),
  make('WTI/USD','US Crude Oil','commodities','🛢️',78.45,2),
];

// ===== ALL HELPERS =====
export function changePercent(item: Instrument): number { return item.prevPrice ? ((item.price-item.prevPrice)/item.prevPrice)*100 : 0; }
export function formatCompact(n: number): string { if(n>=1e9) return `${(n/1e9).toFixed(1)}B`; if(n>=1e6) return `${(n/1e6).toFixed(1)}M`; if(n>=1e3) return `${(n/1e3).toFixed(1)}K`; return n.toString(); }
export function formatPercent(n: number): string { return `${n>=0?'+':''}${n.toFixed(2)}%`; }
export function formatPrice(value: number, decimals = 2): string { return value.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals}); }
export function fearGreedLabel(v: number): string { if(v<25) return 'Extreme Fear'; if(v<45) return 'Fear'; if(v<55) return 'Neutral'; if(v<75) return 'Greed'; return 'Extreme Greed'; }
export function fearGreedColor(v: number): string { if(v<25) return '#ef4444'; if(v<45) return '#f97316'; if(v<55) return '#eab308'; if(v<75) return '#22c55e'; return '#16a34a'; }
export function computeFearGreed(value?: number): number { if(typeof value==='number') return value; return Math.floor(Math.random()*60)+20; }
export const computeFearAndGreed = computeFearGreed;

// ===== CANDLE BUILDERS - COVERS ALL POSSIBLE NAMES =====
export function buildCandles(instrument: Instrument, timeframe: Timeframe = '1H', count = 100): Candle[] {
  const candles: Candle[] = []; let price = instrument.price; const now = Date.now();
  const tfMs: Record<string, number> = {'1M':60*1000,'5M':5*60*1000,'15M':15*60*1000,'1H':60*60*1000,'4H':4*60*60*1000,'1D':24*60*60*1000,'1W':7*24*60*60*1000,'1M_TF':30*24*60*60*1000};
  const step = tfMs[timeframe] || 60*60*1000;
  for(let i=count-1;i>=0;i--){ const open=price; const close=open+(Math.random()-0.5)*price*0.01; const high=Math.max(open,close)+Math.random()*price*0.003; const low=Math.min(open,close)-Math.random()*price*0.003; candles.push({time:now-i*step,timestamp:now-i*step,open:Number(open.toFixed(instrument.decimals)),high:Number(high.toFixed(instrument.decimals)),low:Number(low.toFixed(instrument.decimals)),close:Number(close.toFixed(instrument.decimals)),volume:Math.floor(Math.random()*1e6)}); price=close; }
  return candles;
}
// Aliases so it NEVER fails again
export const getCandles = buildCandles;
export const generateCandles = buildCandles;
export const createCandles = buildCandles;
export const buildCandleData = buildCandles;
export const getCandleData = buildCandles;

export const createInstruments = () => INSTRUMENTS;
export const tickInstrument = (inst: Instrument): Instrument => {
  const newPrice = inst.price + (Math.random()-0.5)*inst.price*0.002;
  return {...inst, prevPrice:inst.price, price:Number(newPrice.toFixed(inst.decimals)), spark:[...inst.spark.slice(1),newPrice]};
};
export const formatCurrency = (n: number) => `$${n.toLocaleString()}`;
export const getInstrumentsByClass = (cls: AssetClass) => INSTRUMENTS.filter(i=>i.assetClass===cls);
export const getInstrumentBySymbol = (s: string) => INSTRUMENTS.find(i=>i.symbol===s);
export const INSTRUMENTS_BY_SYMBOL = Object.fromEntries(INSTRUMENTS.map(i=>[i.symbol,i]));
export default INSTRUMENTS;
