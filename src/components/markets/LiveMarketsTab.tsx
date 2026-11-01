import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sparkline from '@/components/markets/Sparkline';
import LivePrice from '@/components/markets/LivePrice';
import {
  ASSET_CLASS_LABELS,
  changePercent,
  formatCompact,
  formatPercent,
  formatPrice,
  type AssetClass,
  type Instrument,
} from '@/lib/market-data';

type Filter = 'all' | AssetClass;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'forex', label: ASSET_CLASS_LABELS.forex },
  { id: 'crypto', label: ASSET_CLASS_LABELS.crypto },
  { id: 'stock', label: ASSET_CLASS_LABELS.stock },
];

interface LiveMarketsTabProps {
  instruments: Instrument[];
}

export default function LiveMarketsTab({ instruments }: LiveMarketsTabProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? instruments : instruments.filter((item) => item.assetClass === filter)),
    [filter, instruments]
  );

  const counts = useMemo(() => {
    const up = visible.filter((item) => changePercent(item) >= 0).length;
    return { up, down: visible.length - up };
  }, [visible]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">Live Markets</h1>
          <p className="mt-1 text-sm text-ink-400">
            Prices refresh every 2 seconds.{' '}
            <span className="text-up">{counts.up} up</span> &middot;{' '}
            <span className="text-down">{counts.down} down</span>
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-ink-700 bg-ink-900 p-1">
          {FILTERS.map((item) => {
            const active = item.id === filter;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'text-black' : 'text-ink-300 hover:text-ink-100'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="market-filter"
                    className="absolute inset-0 rounded-lg bg-brand"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60">
        <div className="hidden grid-cols-[2.2fr_1.3fr_1fr_1.1fr_1.1fr_1.2fr_1.6fr] gap-4 border-b border-ink-800 px-5 py-3 text-xs font-medium uppercase tracking-wider text-ink-400 md:grid">
          <span>Instrument</span>
          <span className="text-right">Last</span>
          <span className="text-right">Change</span>
          <span className="text-right">High</span>
          <span className="text-right">Low</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Trend</span>
        </div>

        <ul className="divide-y divide-ink-800">
          {visible.map((item, index) => {
            const change = changePercent(item);
            const up = item.price >= item.prevPrice;
            return (
              <motion.li
                key={item.symbol}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-ink-800/60 md:grid-cols-[2.2fr_1.3fr_1fr_1.1fr_1.1fr_1.2fr_1.6fr] md:gap-4 md:px-5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink-100">{item.symbol}</p>
                  <p className="truncate text-xs text-ink-400">
                    {item.name} &middot; {ASSET_CLASS_LABELS[item.assetClass]}
                  </p>
                </div>
                <div className="text-right md:hidden">
                  <LivePrice value={item.price} decimals={item.decimals} up={up} className="text-sm" />
                  <p className={`tabular text-xs ${change >= 0 ? 'text-up' : 'text-down'}`}>
                    {formatPercent(change)}
                  </p>
                </div>
                <div className="hidden text-right md:block">
                  <LivePrice value={item.price} decimals={item.decimals} up={up} />
                </div>
                <p
                  className={`tabular hidden text-right text-sm font-semibold md:block ${
                    change >= 0 ? 'text-up' : 'text-down'
                  }`}
                >
                  {formatPercent(change)}
                </p>
                <p className="tabular hidden text-right text-sm text-ink-300 md:block">
                  {formatPrice(item.high, item.decimals)}
                </p>
                <p className="tabular hidden text-right text-sm text-ink-300 md:block">
                  {formatPrice(item.low, item.decimals)}
                </p>
                <p className="tabular hidden text-right text-sm text-ink-300 md:block">
                  {formatCompact(item.volume)}
                </p>
                <div className="hidden justify-end md:flex">
                  <Sparkline data={item.spark} positive={change >= 0} />
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
