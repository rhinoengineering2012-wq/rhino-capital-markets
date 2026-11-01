import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import LivePrice from '@/components/markets/LivePrice';
import { ASSET_CLASS_LABELS, changePercent, formatPercent, type Instrument } from '@/lib/market-data';

interface MoversListProps {
  title: string;
  items: Instrument[];
  tone: 'up' | 'down';
}

export default function MoversList({ title, items, tone }: MoversListProps) {
  const Icon = tone === 'up' ? ArrowUpRight : ArrowDownRight;
  const colorClass = tone === 'up' ? 'text-up' : 'text-down';
  const bgClass = tone === 'up' ? 'bg-up/10' : 'bg-down/10';

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${bgClass} ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold text-ink-100">{title}</h2>
      </div>
      <ul className="space-y-1">
        {items.map((item, index) => {
          const change = changePercent(item);
          return (
            <motion.li
              key={item.symbol}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-ink-800/70"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink-100">{item.symbol}</p>
                <p className="truncate text-xs text-ink-400">{ASSET_CLASS_LABELS[item.assetClass]}</p>
              </div>
              <div className="flex items-center gap-4">
                <LivePrice value={item.price} decimals={item.decimals} up={item.price >= item.prevPrice} className="text-sm" />
                <span className={`tabular w-20 text-right text-sm font-bold ${colorClass}`}>
                  {formatPercent(change)}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
