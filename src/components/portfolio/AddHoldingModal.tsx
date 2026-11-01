import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ASSET_CLASS_LABELS, formatPrice, type AssetClass, type Instrument } from '@/lib/market-data';
import type { NewHolding } from '@/lib/portfolio';

interface AddHoldingModalProps {
  instruments: Instrument[];
  onClose: () => void;
  onSave: (holding: NewHolding) => void;
}

const inputClass =
  'h-11 w-full rounded-xl border border-ink-600 bg-ink-850 px-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

export default function AddHoldingModal({ instruments, onClose, onSave }: AddHoldingModalProps) {
  const [symbol, setSymbol] = useState(instruments[0]?.symbol ?? '');
  const [quantity, setQuantity] = useState('');
  const [avgCost, setAvgCost] = useState(() => String(instruments[0]?.price ?? ''));
  const [error, setError] = useState<string | null>(null);

  const instrument = instruments.find((item) => item.symbol === symbol) ?? instruments[0];
  const qty = Number(quantity);
  const cost = Number(avgCost);
  const costBasis = qty > 0 && cost > 0 ? qty * cost : 0;
  const marketValue = qty > 0 ? qty * instrument.price : 0;

  const handleSymbolChange = (value: string) => {
    const next = instruments.find((item) => item.symbol === value);
    setSymbol(value);
    if (next) setAvgCost(String(next.price));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!(qty > 0)) {
      setError('Enter a quantity greater than zero.');
      return;
    }
    if (!(cost > 0)) {
      setError('Enter an average cost greater than zero.');
      return;
    }
    onSave({
      symbol: instrument.symbol,
      name: instrument.name,
      assetClass: instrument.assetClass,
      quantity: qty,
      avgCost: cost,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        onMouseDown={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="w-full max-w-md rounded-t-3xl border border-ink-700 bg-ink-900 p-6 shadow-2xl sm:rounded-3xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-holding-title"
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 id="add-holding-title" className="text-lg font-semibold text-ink-100">
                Add holding
              </h2>
              <p className="mt-1 text-sm text-ink-400">Record a position to track its live profit and loss.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-ink-400">Instrument</span>
              <select value={symbol} onChange={(event) => handleSymbolChange(event.target.value)} className={inputClass}>
                {(['forex', 'crypto', 'stock'] as AssetClass[]).map((assetClass) => (
                  <optgroup key={assetClass} label={ASSET_CLASS_LABELS[assetClass]}>
                    {instruments
                      .filter((item) => item.assetClass === assetClass)
                      .map((item) => (
                        <option key={item.symbol} value={item.symbol}>
                          {item.symbol} &middot; {item.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-ink-400">Quantity</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="0"
                  className={`tabular ${inputClass}`}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-ink-400">Avg. cost</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={avgCost}
                  onChange={(event) => setAvgCost(event.target.value)}
                  className={`tabular ${inputClass}`}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-ink-800 bg-ink-850 p-4 text-sm">
              <div>
                <p className="text-xs text-ink-400">Cost basis</p>
                <p className="tabular mt-1 font-semibold text-ink-100">
                  {costBasis > 0 ? formatPrice(costBasis, 2) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Value at live price</p>
                <p className="tabular mt-1 font-semibold text-ink-100">
                  {marketValue > 0 ? formatPrice(marketValue, 2) : '-'}
                </p>
              </div>
            </div>

            {error && <p className="text-sm text-down">{error}</p>}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-black transition hover:brightness-110"
            >
              Save holding
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
