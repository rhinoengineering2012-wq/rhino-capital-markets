import { useEffect, useState } from 'react';
import { createInstruments, tickInstrument, type Instrument } from '@/lib/market-data';

export function useMarketData(): Instrument[] {
  const [instruments, setInstruments] = useState<Instrument[]>(createInstruments);

  useEffect(() => {
    const tickId = window.setInterval(() => {
      setInstruments((prev) => prev.map(tickInstrument));
    }, 2000);

    const realId = window.setInterval(async () => {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const j = await r.json();
        if (j.bitcoin?.usd) {
          setInstruments((prev) => prev.map(i => i.symbol === 'BTC' ? { ...i, price: j.bitcoin.usd } : i));
        }
      } catch {}
    }, 30000);

    return () => {
      clearInterval(tickId);
      clearInterval(realId);
    };
  }, []);

  return instruments;
}
