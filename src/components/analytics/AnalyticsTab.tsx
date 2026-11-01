import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock } from 'lucide-react';
import FearGreedMeter from '@/components/analytics/FearGreedMeter';
import MoversList from '@/components/analytics/MoversList';
import NewsFeed from '@/components/analytics/NewsFeed';
import {
  changePercent,
  computeFearGreed,
  formatCompact,
  formatPercent,
  type Instrument,
} from '@/lib/market-data';
import { MARKET_NEWS } from '@/lib/news';

interface AnalyticsTabProps {
  instruments: Instrument[];
}

export default function AnalyticsTab({ instruments }: AnalyticsTabProps) {
  const stats = useMemo(() => {
    const sorted = [...instruments].sort((a, b) => changePercent(b) - changePercent(a));
    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();
    const advancers = instruments.filter((item) => changePercent(item) > 0).length;
    const average = instruments.reduce((sum, item) => sum + changePercent(item), 0) / instruments.length;
    const volumeLeaders = [...instruments].sort((a, b) => b.volume - a.volume).slice(0, 6);
    const maxVolume = volumeLeaders[0]?.volume ?? 1;
    return {
      gainers,
      losers,
      advancers,
      average,
      volumeLeaders,
      maxVolume,
      fearGreed: computeFearGreed(instruments),
    };
  }, [instruments]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">Market Analytics</h1>
        <p className="mt-1 text-sm text-ink-400">Breadth, momentum and sentiment across every market, updated live.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Advancers" value={`${stats.advancers} / ${instruments.length}`} tone="up" />
        <KpiCard label="Average change" value={formatPercent(stats.average)} tone={stats.average >= 0 ? 'up' : 'down'} />
        <KpiCard label="Top gainer" value={stats.gainers[0]?.symbol ?? '-'} tone="up" />
        <KpiCard label="Top loser" value={stats.losers[0]?.symbol ?? '-'} tone="down" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5 lg:col-span-1"
        >
          <h2 className="mb-2 text-sm font-semibold text-ink-100">Fear &amp; Greed</h2>
          <FearGreedMeter score={stats.fearGreed} />
          <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">
            Blends average move and breadth. Lower readings signal fear, higher readings signal greed.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          <MoversList title="Top Gainers" items={stats.gainers} tone="up" />
          <MoversList title="Top Losers" items={stats.losers} tone="down" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ink-100">Volume Leaders</h2>
          <ul className="space-y-4">
            {stats.volumeLeaders.map((item, index) => {
              const change = changePercent(item);
              const width = (item.volume / stats.maxVolume) * 100;
              return (
                <motion.li
                  key={item.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink-100">{item.symbol}</span>
                    <span className="tabular text-ink-300">
                      {formatCompact(item.volume)}{' '}
                      <span className={change >= 0 ? 'text-up' : 'text-down'}>{formatPercent(change)}</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-brand"
                    />
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <NewsFeed items={MARKET_NEWS} />
        </div>
      </div>

      {/* MONEY LOCKED CARDS - FORCES UPGRADE */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LockedCard
          title="Market Dominance"
          description="BTC dominance + sector rotation. Pro traders only."
          badge="PRO"
          preview="BTC.D 58.3% • ETH.D 18.2% • Altseason Risk: HIGH"
        />
        <LockedCard
          title="AI Sentiment Analysis"
          description="Real-time news + social sentiment score for every asset."
          badge="PRO"
          preview="Overall Sentiment: Bullish 72% • Fear zone ending • Buy signal"
        />
      </div>
    </section>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  tone: 'up' | 'down';
}

function KpiCard({ label, value, tone }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-4">
      <p className="text-xs uppercase tracking-wider text-ink-400">{label}</p>
      <p className={`tabular mt-1.5 text-xl font-bold ${tone === 'up' ? 'text-up' : 'text-down'}`}>{value}</p>
    </div>
  );
}

function LockedCard({ title, description, badge, preview }: { title: string; description: string; badge: string; preview: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-ink-900/80 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-100">{title}</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase text-black">
          <Crown className="h-3 w-3" />
          {badge}
        </span>
      </div>
      <p className="text-xs text-ink-400">{description}</p>
      
      <div className="relative mt-4 rounded-xl border border-ink-800 bg-black/50 p-4">
        <p className="blur-[6px] select-none text-sm text-ink-300">{preview}</p>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-[2px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-800">
            <Lock className="h-5 w-5 text-brand" />
          </div>
          <p className="text-xs font-semibold text-ink-100">Upgrade to unlock</p>
          <p className="text-[11px] text-ink-400">Weekly / Monthly / Yearly plan</p>
        </div>
      </div>
    </div>
  );
}
