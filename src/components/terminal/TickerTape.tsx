import type { Instrument } from '@/lib/market-data';
import { changePercent, formatPercent, formatPrice } from '@/lib/market-data';

interface TickerTapeProps {
  instruments: Instrument[];
}

export default function TickerTape({ instruments }: TickerTapeProps) {
  const items = [...instruments, ...instruments];

  return (
    <div className="group relative overflow-hidden border-b border-ink-800 bg-ink-950 py-2">
      <div className="flex w-max animate-ticker group-hover:[animation-play-state:paused]">
        {items.map((instrument, index) => {
          const change = changePercent(instrument);
          const up = instrument.price >= instrument.prevPrice;
          return (
            <div key={`${instrument.symbol}-${index}`} className="flex items-center gap-3 px-5 text-xs">
              <span className="font-semibold text-ink-100">{instrument.symbol}</span>
              <span className={`tabular ${up ? 'text-up' : 'text-down'}`}>
                {formatPrice(instrument.price, instrument.decimals)}
              </span>
              <span className={`tabular ${change >= 0 ? 'text-up' : 'text-down'}`}>{formatPercent(change)}</span>
              <span className="h-3 w-px bg-ink-700" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
