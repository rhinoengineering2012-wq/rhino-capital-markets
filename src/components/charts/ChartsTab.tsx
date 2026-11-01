import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, X } from 'lucide-react';
import { PriceChart, VolumeChart } from '@/components/charts/PriceChart';
import LivePrice from '@/components/markets/LivePrice';
import { toChartPoints } from '@/lib/chart-points';
import { exponentialMovingAverage, simpleMovingAverage } from '@/lib/indicators';
import {
  buildCandles,
  changePercent,
  formatPercent,
  formatPrice,
  rescaleCandles,
  TIMEFRAMES,
  type Instrument,
  type Timeframe,
} from '@/lib/market-data';

interface ChartsTabProps {
  instruments: Instrument[];
}

function formatCandleLabel(time: number, timeframe: Timeframe): string {
  const date = new Date(time);
  if (timeframe === '1D') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

export default function ChartsTab({ instruments }: ChartsTabProps) {
  const [symbol, setSymbol] = useState(instruments[0]?.symbol ?? 'BTC');
  const [timeframeId, setTimeframeId] = useState<Timeframe>('5m');
  const [showSma, setShowSma] = useState(true);
  const [showEma, setShowEma] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [compareSymbol, setCompareSymbol] = useState<string | null>(null);

  const instrument = instruments.find((item) => item.symbol === symbol) ?? instruments[0];
  const timeframe = TIMEFRAMES.find((item) => item.id === timeframeId) ?? TIMEFRAMES[1];
  const compareInstrument = compareSymbol ? instruments.find(i => i.symbol === compareSymbol) : null;

  const baseCandles = useMemo(
    () => buildCandles(instrument.symbol, instrument.open, timeframe, Date.now()),
    [instrument.symbol, instrument.open, timeframe]
  );

  const candles = useMemo(
    () => rescaleCandles(baseCandles, instrument.price),
    [baseCandles, instrument.price]
  );

  const compareCandlesData = useMemo(() => {
    if (!compareInstrument) return null;
    const base = buildCandles(compareInstrument.symbol, compareInstrument.open, timeframe, Date.now());
    return rescaleCandles(base, compareInstrument.price);
  }, [compareInstrument, timeframe]);

  const points = useMemo(() => {
    const sma = simpleMovingAverage(candles, 20);
    const ema = exponentialMovingAverage(candles, 50);
    return toChartPoints(candles, sma, ema, (time) => formatCandleLabel(time, timeframe.id));
  }, [candles, timeframe.id]);

  const comparePoints = useMemo(() => {
    if (!compareCandlesData) return null;
    const sma = simpleMovingAverage(compareCandlesData, 20);
    const ema = exponentialMovingAverage(compareCandlesData, 50);
    return toChartPoints(compareCandlesData, sma, ema, (time) => formatCandleLabel(time, timeframe.id));
  }, [compareCandlesData, timeframe.id]);

  const lastCandle = candles[candles.length - 1];
  const change = changePercent(instrument);
  const up = instrument.price >= instrument.prevPrice;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={instrument.symbol}
            onChange={(event) => setSymbol(event.target.value)}
            aria-label="Instrument"
            className="h-10 rounded-xl border border-ink-600 bg-ink-900 px-3 text-sm font-semibold text-ink-100 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {instruments.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.symbol} &middot; {item.name}
              </option>
            ))}
          </select>
          <div>
            <LivePrice value={instrument.price} decimals={instrument.decimals} up={up} className="text-2xl" />
            <span className={`tabular ml-3 text-sm font-semibold ${change >= 0 ? 'text-up' : 'text-down'}`}>
              {formatPercent(change)}
            </span>
          </div>
          {/* COMPARE BUTTON */}
          <button
            onClick={() => setCompareSymbol(compareSymbol ? null : instruments[1]?.symbol ?? 'ETH/USD')}
            className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${compareSymbol ? 'border-brand bg-brand text-black' : 'border-ink-700 bg-ink-900 text-ink-300 hover:border-brand'}`}
          >
            <GitCompare className="h-4 w-4" />
            {compareSymbol ? 'Comparing' : 'Compare'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-ink-700 bg-ink-900 p-1">
            {TIMEFRAMES.map((item) => {
              const active = item.id === timeframe.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimeframeId(item.id)}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active ? 'text-black' : 'text-ink-300 hover:text-ink-100'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="timeframe"
                      className="absolute inset-0 rounded-lg bg-brand"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>
          <IndicatorToggle label="SMA 20" active={showSma} onToggle={() => setShowSma((value) => !value)} color="#FFD60A" />
          <IndicatorToggle label="EMA 50" active={showEma} onToggle={() => setShowEma((value) => !value)} color="#60A5FA" />
          <IndicatorToggle label="Volume" active={showVolume} onToggle={() => setShowVolume((value) => !value)} color="#FFD60A" />
        </div>
      </div>

      {/* COMPARE SELECTOR BAR */}
      {compareSymbol && compareInstrument && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3">
          <span className="text-xs font-bold text-brand">VS</span>
          <select
            value={compareSymbol}
            onChange={(e) => setCompareSymbol(e.target.value)}
            className="h-8 rounded-lg border border-ink-600 bg-ink-900 px-2 text-xs font-semibold text-ink-100"
          >
            {instruments.filter(i => i.symbol !== symbol).map(item => (
              <option key={item.symbol} value={item.symbol}>{item.symbol}</option>
            ))}
          </select>
          <span className="tabular text-xs text-ink-300">
            {compareInstrument.name} {formatPercent(changePercent(compareInstrument))} • {formatPrice(compareInstrument.price, compareInstrument.decimals)}
          </span>
          <button onClick={() => setCompareSymbol(null)} className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 text-ink-300 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {lastCandle &&
          [
            ['Open', lastCandle.open],
            ['High', lastCandle.high],
            ['Low', lastCandle.low],
            ['Close', lastCandle.close],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-ink-400">{label}</p>
              <p className="tabular mt-1 text-lg font-semibold text-ink-100">
                {formatPrice(value as number, instrument.decimals)}
              </p>
            </div>
          ))}
      </div>

      <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between text-xs text-ink-400">
          <span>
            {instrument.name} {compareInstrument ? ` vs ${compareInstrument.name}` : ''} &middot; {timeframe.label} candles
          </span>
          <span className="hidden sm:inline">
            {showSma && <span className="mr-3 text-brand">&#9632; SMA 20</span>}
            {showEma && <span className="text-[#60A5FA]">&#9632; EMA 50</span>}
            {compareInstrument && <span className="ml-3 text-purple-400">&#9632; {compareInstrument.symbol}</span>}
          </span>
        </div>
        <div className="h-[320px] sm:h-[420px]">
          <PriceChart data={points} decimals={instrument.decimals} showSma={showSma} showEma={showEma} />
        </div>
        {comparePoints && (
          <div className="mt-4 h-[180px] border-t border-ink-800 pt-4">
            <p className="mb-2 text-xs text-ink-400">Compare: {compareInstrument?.symbol} {timeframe.label}</p>
            <div className="h-[160px]"><PriceChart data={comparePoints} decimals={compareInstrument?.decimals ?? 2} showSma={showSma} showEma={showEma} /></div>
          </div>
        )}
        {showVolume && (
          <div className="mt-2 h-[90px] border-t border-ink-800 pt-2">
            <VolumeChart data={points} />
          </div>
        )}
      </div>
    </section>
  );
}

interface IndicatorToggleProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  color: string;
}

function IndicatorToggle({ label, active, onToggle, color }: IndicatorToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors ${
        active ? 'border-ink-500 bg-ink-800 text-ink-100' : 'border-ink-700 text-ink-400 hover:text-ink-200'
      }`}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active ? color : '#3A3A44' }} />
      {label}
    </button>
  );
                                             }
