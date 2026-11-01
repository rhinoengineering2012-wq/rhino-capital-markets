import { useEffect, useState } from 'react';
import { createInstruments, tickInstrument, type Instrument } from '@/lib/market-data';

export function useMarketData(): Instrument[] {
  const [instruments, setInstruments] = useState<Instrument[]>(createInstruments);

  // Blinking every 2 seconds
  useEffect(() => {
    const tickId = setInterval(() => {
      setInstruments((prev) => prev.map(tickInstrument));
    }, 2000);
    return () => clearInterval(tickId);
  }, []);

  // Real prices every 30 seconds
  useEffect(() => {
    const fetchReal = async () => {
      try {
        const [crypto, forex, gold] = await Promise.all([
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd').then(r=>r.json()),
          fetch('https://api.exchangerate-api.com/v4/latest/USD').then(r=>r.json()),
          fetch('https://api.gold-api.com/price/XAU').then(r=>r.json()).catch(()=>null)
        ]);

        setInstruments((prev) => prev.map((i) => {
          if (i.symbol==='BTC' && crypto.bitcoin?.usd) return {...i, price:crypto.bitcoin.usd};
          if (i.symbol==='ETH' && crypto.ethereum?.usd) return {...i, price:crypto.ethereum.usd};
          if (i.symbol==='SOL' && crypto.solana?.usd) return {...i, price:crypto.solana.usd};
          if (i.symbol==='EUR/USD' && forex.rates?.EUR) return {...i, price:1/forex.rates.EUR};
          if (i.symbol==='GBP/USD' && forex.rates?.GBP) return {...i, price:1/forex.rates.GBP};
          if (i.symbol==='USD/JPY' && forex.rates?.JPY) return {...i, price:forex.rates.JPY};
          if (i.symbol==='USD/UGX' && forex.rates?.UGX) return {...i, price:forex.rates.UGX};
          if (i.symbol==='USD/KES' && forex.rates?.KES) return {...i, price:forex.rates.KES};
          if (i.symbol==='USD/NGN' && forex.rates?.NGN) return {...i, price:forex.rates.NGN};
          if (i.symbol==='USD/ZAR' && forex.rates?.ZAR) return {...i, price:forex.rates.ZAR};
          if (i.symbol==='XAU/USD' && gold?.price) return {...i, price:gold.price};
          return i;
        }));
      } catch {}
    };

    fetchReal();
    const id = setInterval(fetchReal, 30000);
    return () => clearInterval(id);
  }, []);

  return instruments;
}
