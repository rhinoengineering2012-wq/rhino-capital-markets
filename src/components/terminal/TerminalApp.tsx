import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnalyticsTab from '@/components/analytics/AnalyticsTab';
import BrandLockup from '@/components/brand/BrandLockup';
import ChartsTab from '@/components/charts/ChartsTab';
import LiveMarketsTab from '@/components/markets/LiveMarketsTab';
import PortfolioTab from '@/components/portfolio/PortfolioTab';
import SubscriptionTab from '@/components/subscription/SubscriptionTab';
import { DesktopTabBar, MobileTabBar, TerminalHeaderActions } from '@/components/terminal/TerminalNav';
import TickerTape from '@/components/terminal/TickerTape';
import { useMarketData } from '@/hooks/useMarketData';
import { getTrialStartedAt } from '@/lib/demo-session';
import type { TabId } from '@/lib/terminal-tabs';

interface TerminalAppProps {
  onLogout: () => void;
}

export default function TerminalApp({ onLogout }: TerminalAppProps) {
  const [tab, setTab] = useState<TabId>('markets');
  const instruments = useMarketData();
  const [trialStartedAt] = useState(getTrialStartedAt);

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-30 border-b border-ink-800 bg-black/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLockup compact />
          <TerminalHeaderActions identity="Demo account" onSignOut={onLogout} />
        </div>
      </header>

      <TickerTape instruments={instruments} />
      <DesktopTabBar active={tab} onChange={setTab} />

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 md:pb-12 md:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'markets' && <LiveMarketsTab instruments={instruments} />}
            {tab === 'charts' && <ChartsTab instruments={instruments} />}
            {tab === 'analytics' && <AnalyticsTab instruments={instruments} onUpgrade={() => setTab('subscription')} />}
            {tab === 'portfolio' && <PortfolioTab instruments={instruments} onUpgrade={() => setTab('subscription')} />}
            {tab === 'subscription' && <SubscriptionTab trialStartedAt={trialStartedAt} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileTabBar active={tab} onChange={setTab} />
    </div>
  );
}
