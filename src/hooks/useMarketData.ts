import { useEffect, useState } from 'react';
import { createInstruments, tickInstrument, type Instrument } from '@/lib/market-data';

const TICK_INTERVAL_MS = 2000;

export function useMarketData(): Instrument[] {
  const [instruments, setInstruments] = useState<Instrument[]>(createInstruments);

  useEffect(() => {
    const id = window.setInterval(() => {
      setInstruments((previous) => previous.map(tickInstrument));
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return instruments;
}
