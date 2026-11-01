import { motion } from 'framer-motion';
import type { NewsItem, Sentiment } from '@/lib/news';

const SENTIMENT_STYLES: Record<Sentiment, { label: string; className: string }> = {
  bullish: { label: 'Bullish', className: 'text-up bg-up/10 border-up/30' },
  bearish: { label: 'Bearish', className: 'text-down bg-down/10 border-down/30' },
  neutral: { label: 'Neutral', className: 'text-ink-300 bg-ink-800 border-ink-600' },
};

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

interface NewsFeedProps {
  items: NewsItem[];
}

export default function NewsFeed({ items }: NewsFeedProps) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-100">Market News</h2>
        <span className="text-[11px] uppercase tracking-wider text-ink-500">Sample feed</span>
      </div>
      <ul className="divide-y divide-ink-800">
        {items.map((item, index) => {
          const sentiment = SENTIMENT_STYLES[item.sentiment];
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="py-3.5 first:pt-0 last:pb-0"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                <span className="rounded-md bg-brand/10 px-2 py-0.5 font-semibold text-brand">{item.category}</span>
                <span
                  className={`rounded-md border px-2 py-0.5 font-medium ${sentiment.className}`}
                >
                  {sentiment.label}
                </span>
                <span>
                  {item.source} &middot; {timeAgo(item.minutesAgo)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-100">{item.headline}</p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
