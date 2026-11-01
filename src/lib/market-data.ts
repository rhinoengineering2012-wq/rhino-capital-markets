export type AssetClass = 'forex' | 'crypto' | 'stock';

export interface Instrument {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  decimals: number;
  price: number;
  prevPrice: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  spark: number[];
}

interface InstrumentSeed {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  decimals: number;
  price: number;
}

const SEEDS: InstrumentSeed[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', assetClass: 'forex', decimals: 4, price: 1.0852 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', assetClass: 'forex', decimals: 4, price: 1.2714 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', assetClass: 'forex', decimals: 2, price: 151.26 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', assetClass: 'forex', decimals: 4, price: 0.6588 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', assetClass: 'forex', decimals: 4, price: 0.9012 },
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', assetClass: 'forex', decimals: 4, price: 18.42 },
  { symbol: 'BTC', name: 'Bitcoin', assetClass: 'crypto', decimals: 2, price: 67420.5 },
  { symbol: 'ETH', name: 'Ethereum', assetClass: 'crypto', decimals: 2, price: 3514.2 },
  { symbol: 'SOL', name: 'Solana', assetClass: 'crypto', decimals: 2, price: 148.6 },
  { symbol: 'BNB', name: 'BNB', assetClass: 'crypto', decimals: 2, price: 582.4 },
  { symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'stock', decimals: 2, price: 226.48 },
  { symbol: 'TSLA', name: 'Tesla Inc.', assetClass: 'stock', decimals: 2, price: 241.12 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', assetClass: 'stock', decimals: 2, price: 131.9 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', assetClass: 'stock', decimals: 2, price: 418.3 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', assetClass: 'stock', decimals: 2, price: 186.2 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', assetClass: 'stock', decimals: 2, price: 168.4 },
];

const TICK_VOLATILITY: Record<AssetClass, number> = {
  forex: 0.0004,
  crypto: 0.0012,
  stock: 0.0007,
};

const OPEN_SWING: Record<AssetClass, number> = {
  forex: 0.004,
  crypto: 0.04,
  stock: 0.02,
};

const SPARK_LENGTH = 40;

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  forex: 'Forex',
  crypto: 'Crypto',
  stock: 'Stocks',
};

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function randomShock(magnitude: number): number {
  return (Math.random() + Math.random() - 1) * magnitude;
}

function buildSpark(price: number, volatility: number, decimals: number): number[] {
  const points = [price];
  let current = price;
  for (let i = 1; i < SPARK_LENGTH; i++) {
    current = roundTo(current * (1 + randomShock(volatility * 3)), decimals);
    points.unshift(current);
  }
  return points;
}

export function createInstruments(): Instrument[] {
  return SEEDS.map((seed) => {
    const open = roundTo(seed.price * (1 + randomShock(OPEN_SWING[seed.assetClass])), seed.decimals);
    return {
      symbol: seed.symbol,
      name: seed.name,
      assetClass: seed.assetClass,
      decimals: seed.decimals,
      price: seed.price,
      prevPrice: open,
      open,
      high: roundTo(Math.max(open, seed.price) * 1.002, seed.decimals),
      low: roundTo(Math.min(open, seed.price) * 0.998, seed.decimals),
      volume: Math.round(50_000 + Math.random() * 500_000),
      spark: buildSpark(seed.price, TICK_VOLATILITY[seed.assetClass], seed.decimals),
    };
  });
}

export function tickInstrument(instrument: Instrument): Instrument {
  const price = roundTo(
    instrument.price * (1 + randomShock(TICK_VOLATILITY[instrument.assetClass])),
    instrument.decimals
  );
  return {
    ...instrument,
    prevPrice: instrument.price,
    price,
    high: Math.max(instrument.high, price),
    low: Math.min(instrument.low, price),
    volume: instrument.volume + Math.round(Math.random() * 4_000),
    spark: [...instrument.spark.slice(1), price],
  };
}

export function changePercent(instrument: Instrument): number {
  return ((instrument.price - instrument.open) / instrument.open) * 100;
}

export function formatPrice(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

export function computeFearGreed(instruments: Instrument[]): number {
  const changes = instruments.map(changePercent);
  const average = changes.reduce((sum, value) => sum + value, 0) / changes.length;
  const breadth = changes.filter((value) => value > 0).length / changes.length;
  const momentum = Math.min(100, Math.max(0, 50 + average * 12));
  return Math.round(momentum * 0.6 + breadth * 100 * 0.4);
}

export function fearGreedLabel(score: number): string {
  if (score < 25) return 'Extreme Fear';
  if (score < 45) return 'Fear';
  if (score < 55) return 'Neutral';
  if (score < 75) return 'Greed';
  return 'Extreme Greed';
}

export type Timeframe = '1m' | '5m' | '1h' | '1D';

export interface TimeframeOption {
  id: Timeframe;
  label: string;
  stepMs: number;
  count: number;
  volatility: number;
}

export const TIMEFRAMES: TimeframeOption[] = [
  { id: '1m', label: '1m', stepMs: 60_000, count: 120, volatility: 0.0006 },
  { id: '5m', label: '5m', stepMs: 300_000, count: 120, volatility: 0.0012 },
  { id: '1h', label: '1H', stepMs: 3_600_000, count: 120, volatility: 0.003 },
  { id: '1D', label: '1D', stepMs: 86_400_000, count: 180, volatility: 0.01 },
];

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function hashSeed(text: string): number {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildCandles(symbol: string, anchorPrice: number, timeframe: TimeframeOption, endTime: number): Candle[] {
  const random = createRandom(hashSeed(`${symbol}-${timeframe.id}`));
  const candles: Candle[] = [];
  let close = anchorPrice;
  const wick = timeframe.volatility * 0.8;

  for (let i = 0; i < timeframe.count; i++) {
    const open = close;
    close = open * (1 + (random() + random() - 1) * timeframe.volatility);
    const high = Math.max(open, close) * (1 + random() * wick);
    const low = Math.min(open, close) * (1 - random() * wick);
    candles.push({
      time: endTime - (timeframe.count - 1 - i) * timeframe.stepMs,
      open,
      high,
      low,
      close,
      volume: Math.round(200 + random() * 1800),
    });
  }
  return candles;
}

export function rescaleCandles(candles: Candle[], targetClose: number): Candle[] {
  const last = candles[candles.length - 1];
  if (!last) return candles;
  const factor = targetClose / last.close;
  return candles.map((candle) => ({
    ...candle,
    open: candle.open * factor,
    high: candle.high * factor,
    low: candle.low * factor,
    close: candle.close * factor,
  }));
}
