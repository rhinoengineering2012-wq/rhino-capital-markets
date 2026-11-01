import type { Candle } from '@/lib/market-data';

export function simpleMovingAverage(candles: Candle[], period: number): (number | null)[] {
  return candles.map((_, index) => {
    if (index < period - 1) return null;
    const window = candles.slice(index - period + 1, index + 1);
    return window.reduce((sum, candle) => sum + candle.close, 0) / period;
  });
}

export function exponentialMovingAverage(candles: Candle[], period: number): (number | null)[] {
  const multiplier = 2 / (period + 1);
  let previous: number | null = null;
  return candles.map((candle, index) => {
    if (index < period - 1) return null;
    if (previous === null) {
      const seed = candles.slice(0, period).reduce((sum, item) => sum + item.close, 0) / period;
      previous = seed;
      return seed;
    }
    previous = (candle.close - previous) * multiplier + previous;
    return previous;
  });
}
