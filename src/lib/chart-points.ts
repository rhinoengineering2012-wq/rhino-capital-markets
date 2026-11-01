import type { Candle } from '@/lib/market-data';

export interface ChartPoint {
  label: string;
  range: [number, number];
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma: number | null;
  ema: number | null;
}

export function toChartPoints(
  candles: Candle[],
  sma: (number | null)[],
  ema: (number | null)[],
  formatLabel: (time: number) => string
): ChartPoint[] {
  return candles.map((candle, index) => ({
    label: formatLabel(candle.time),
    range: [candle.low, candle.high],
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
    sma: sma[index],
    ema: ema[index],
  }));
}
