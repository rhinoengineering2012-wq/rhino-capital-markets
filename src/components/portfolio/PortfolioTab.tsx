import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Trash2, Crown, Lock, Zap } from 'lucide-react';
import AddHoldingModal from '@/components/portfolio/AddHoldingModal';
import LivePrice from '@/components/markets/LivePrice';
import { usePortfolio } from '@/hooks/usePortfolio';
import { holdingMetrics, type Holding } from '@/lib/portfolio';
import { ASSET_CLASS_LABELS, formatPercent, formatPrice, type Instrument } from '@/lib/market-data';

interface PortfolioTabProps {
  instruments: Instrument[];
}

const FREE_LIMIT = 2;
const QUICK_ADD = ['EUR/USD', 'BTC/USD', 'AAPL'];

export default function PortfolioTab({ instruments }: PortfolioTabProps) {
  const { holdings, addHolding, removeHolding } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const instrumentBySymbol = useMemo(
    () => new Map(instruments.map((item) => [item.symbol, item])),
    [instruments]
  );

  const rows = useMemo(
    () =>
      holdings.map((holding) => {
        const live = instrumentBySymbol.get(holding.symbol);
        const lastPrice = live?.price ?? holding.avgCost;
        return { holding, live, metrics: holdingMetrics(holding, lastPrice) };
      }),
    [holdings, instrumentBySymbol]
  );

  const totals = useMemo(() => {
    const marketValue = rows.reduce((sum, row) => sum + row.metrics.marketValue, 0);
    const costBasis = rows.reduce((sum, row) => sum + row.metrics.costBasis, 0);
    const profitLoss = marketValue - costBasis;
    return {
      marketValue,
      costBasis,
      profitLoss,
      profitLossPercent: costBasis === 0 ? 0 : (profitLoss / costBasis) * 100,
    };
  }, [rows]);

  const profitTone = totals.profitLoss >= 0 ? 'text-up' : 'text-down';
  const isFreeLimitReached = holdings.length >= FREE_LIMIT;

  const handleRemove = (holding: Holding) => {
    if (confirmId !== holding.id) {
      setConfirmId(holding.id);
      return;
    }
    setConfirmId(null);
    removeHolding(holding.id);
  };

  const handleAddClick = () => {
    if (isFreeLimitReached) {
      setShowUpgrade(true);
      return;
    }
    setModalOpen(true);
  };

  const handleQuickAdd = (symbol: string) => {
    if (isFreeLimitReached) {
      setShowUpgrade(true);
      return;
    }
    const instrument = instrumentBySymbol.get(symbol);
    if (!instrument) return;
    addHolding({
      symbol: instrument.symbol,
      name: instrument.name,
      assetClass: instrument.assetClass,
      quantity: 1,
      avgCost: instrument.price,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">Portfolio</h1>
          <p className="mt-1 text-sm text-ink-400">Your holdings valued at live prices. FREE: {holdings.length}/{FREE_LIMIT}</p>
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          disabled={instruments.length === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add holding
        </button>
      </div>

      {/* QUICK ADD BUTTONS */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-ink-400"><Zap className="h-3 w-3" /> Quick add:</span>
        {QUICK_ADD.map(sym => {
          const inst = instrumentBySymbol.get(sym);
          const added = holdings.some(h => h.symbol === sym);
          return (
            <button
              key={sym}
              onClick={() => handleQuickAdd(sym)}
              disabled={added}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${added ? 'border-ink-800 bg-ink-900 text-ink-500' : 'border-brand/30 bg-brand/10 text-brand hover:bg-brand hover:text-black'}`}
            >
              {added ? `${sym} ✓` : `+ ${sym} @ ${inst ? formatPrice(inst.price, inst.decimals) : ''}`}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total value" value={formatPrice(totals.marketValue, 2)} />
        <SummaryCard label="Cost basis" value={formatPrice(totals.costBasis, 2)} />
        <SummaryCard
          label="Total P/L"
          value={`${totals.profitLoss >= 0 ? '+' : '-'}${formatPrice(Math.abs(totals.profitLoss), 2)}`}
          tone={profitTone}
        />
        <SummaryCard label="Return" value={formatPercent(totals.profitLossPercent)} tone={profitTone} />
      </div>

      {isFreeLimitReached && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-amber-200">
            <Lock className="h-4 w-4" /> FREE limit reached ({FREE_LIMIT}/{FREE_LIMIT}). Upgrade for unlimited holdings.
          </p>
          <button onClick={() => setShowUpgrade(true)} className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-black">UPGRADE</button>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink-700 bg-ink-900/40 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Briefcase className="h-7 w-7" />
          </span>
          <div>
            <p className="font-semibold text-ink-100">No holdings yet</p>
            <p className="mt-1 max-w-sm text-sm text-ink-400">
              Add the forex pairs, coins or stocks you own to see your live profit and loss here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/60">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1.3fr_1.4fr_auto] gap-4 border-b border-ink-800 px-5 py-3 text-xs font-medium uppercase tracking-wider text-ink-400 md:grid">
            <span>Asset</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Avg cost</span>
            <span className="text-right">Last</span>
            <span className="text-right">Market value</span>
            <span className="text-right">P/L</span>
            <span className="w-8" />
          </div>
          <ul className="divide-y divide-ink-800">
            {rows.map(({ holding, live, metrics }, index) => {
              const decimals = live?.decimals ?? 2;
              const up = metrics.profitLoss >= 0;
              return (
                <motion.li
                  key={holding.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center gap-3 px-4 py-4 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1.3fr_1.4fr_auto] md:gap-4 md:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink-100">{holding.symbol}</p>
                    <p className="truncate text-xs text-ink-400">
                      {holding.name} &middot; {ASSET_CLASS_LABELS[holding.assetClass]}
                    </p>
                  </div>
                  <div className="text-right md:hidden">
                    <p className={`tabular text-sm font-bold ${up ? 'text-up' : 'text-down'}`}>
                      {up ? '+' : ''}
                      {formatPrice(metrics.profitLoss, 2)}
                    </p>
                    <p className={`tabular text-xs ${up ? 'text-up' : 'text-down'}`}>
                      {formatPercent(metrics.profitLossPercent)}
                    </p>
                  </div>
                  <p className="tabular hidden text-right text-sm text-ink-200 md:block">
                    {formatPrice(holding.quantity, 4)}
                  </p>
                  <p className="tabular hidden text-right text-sm text-ink-200 md:block">
                    {formatPrice(holding.avgCost, decimals)}
                  </p>
                  <div className="hidden text-right md:block">
                    {live ? (
                      <LivePrice value={live.price} decimals={decimals} up={live.price >= live.prevPrice} />
                    ) : (
                      <span className="tabular text-sm text-ink-400">{formatPrice(metrics.lastPrice, decimals)}</span>
                    )}
                  </div>
                  <p className="tabular hidden text-right text-sm text-ink-200 md:block">
                    {formatPrice(metrics.marketValue, 2)}
                  </p>
                  <div className="hidden text-right md:block">
                    <p className={`tabular text-sm font-bold ${up ? 'text-up' : 'text-down'}`}>
                      {up ? '+' : ''}
                      {formatPrice(metrics.profitLoss, 2)}
                    </p>
                    <p className={`tabular text-xs ${up ? 'text-up' : 'text-down'}`}>
                      {formatPercent(metrics.profitLossPercent)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(holding)}
                    aria-label={confirmId === holding.id ? `Confirm removing ${holding.symbol}` : `Remove ${holding.symbol}`}
                    className={`justify-self-end flex h-8 items-center justify-center rounded-lg transition ${
                      confirmId === holding.id
                        ? 'bg-down/15 px-3 text-xs font-semibold text-down'
                        : 'w-8 text-ink-500 hover:bg-ink-800 hover:text-down'
                    }`}
                  >
                    {confirmId === holding.id ? 'Confirm' : <Trash2 className="h-4 w-4" />}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      {modalOpen && (
        <AddHoldingModal
          instruments={instruments}
          onClose={() => setModalOpen(false)}
          onSave={addHolding}
        />
      )}

      <AnimatePresence>
        {showUpgrade && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm" onMouseDown={() => setShowUpgrade(false)}>
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} onMouseDown={e => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-brand/30 bg-ink-900 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/20"><Crown className="h-6 w-6 text-brand" /></div>
              <h3 className="mt-3 text-lg font-bold text-ink-100">FREE Limit Reached</h3>
              <p className="mt-2 text-sm text-ink-400">You have {FREE_LIMIT} holdings on FREE plan. Upgrade to Weekly (UGX 25k), Monthly (75k) or Yearly (650k) for UNLIMITED portfolio + AI analytics.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => setShowUpgrade(false)} className="h-11 rounded-xl border border-ink-700 text-sm text-ink-300">Maybe later</button>
                <button onClick={() => setShowUpgrade(false)} className="h-11 rounded-xl bg-brand text-sm font-bold text-black">View Plans</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  tone?: string;
}

function SummaryCard({ label, value, tone = 'text-ink-100' }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-4">
      <p className="text-xs uppercase tracking-wider text-ink-400">{label}</p>
      <p className={`tabular mt-1.5 text-lg font-bold sm:text-xl ${tone}`}>{value}</p>
    </div>
  );
    }
