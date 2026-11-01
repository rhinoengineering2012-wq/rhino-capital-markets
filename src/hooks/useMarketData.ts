import { useEffect, useState } from 'react';
import { createInstruments, type Instrument } from '@/lib/market-data';

// FREE REAL APIs — No credit card needed
// Crypto: Binance public (real-time)
// Stocks/Forex/Indices: TwelveData DEMO (replace with your free key later)
// Get free key at: https://twelvedata.com (800 req/day FREE)

const BINANCE_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const TWELVE_SYMBOLS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'EUR/USD', 'GBP/USD'];

const TWELVE_API_KEY = 'demo'; // TODO: Replace with your free key from twelvedata.com

async function fetchRealPrices(): Promise<Partial<Record<string, number>>> {
  const prices: Record<string, number> = {};

  try {
    // 1. Crypto from Binance (FREE, no key, real-time for international traders)
    const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price');
    if (binanceRes.ok) {
      const data: { symbol: string; price: string }[] = await binanceRes.json();
      data.forEach((item) => {
        if (BINANCE_SYMBOLS.includes(item.symbol)) {
          const clean = item.symbol.replace('USDT', '');
          prices[clean] = parseFloat(item.price);
          // Map to common symbols your app uses
          if (item.symbol === 'BTCUSDT') prices['BTC'] = prices[clean];
          if (item.symbol === 'ETHUSDT') prices['ETH'] = prices[clean];
          if (item.symbol === 'SOLUSDT') prices['SOL'] = prices[clean];
        }
      });
    }
  } catch (e) {
    console.warn('Binance fetch failed', e);
  }

  try {
    // 2. Stocks & Forex from TwelveData (FREE demo)
    for (const sym of TWELVE_SYMBOLS) {
      try {
        const res = await fetch(
          `https://api.twelvedata.com/price?symbol=${encodeURIComponent(sym)}&apikey=${TWELVE_API_KEY}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.price) {
            prices[sym] = parseFloat(json.price);
            // Map common
            if (sym === 'AAPL') prices['AAPL'] = parseFloat(json.price);
          }
        }
      } catch {}
      // Small delay to avoid rate limit
      await new Promise((r) => setTimeout(r, 200));
    }
  } catch (e) {
    console.warn('TwelveData fetch failed', e);
  }

  return prices;
}

export function useMarketData(): Instrument[] {
  const [instruments, setInstruments] = useState<Instrument[]>(() => createInstruments());

  useEffect(() => {
    let mounted = true;

    const updateWithReal = async () => {
      const realPrices = await fetchRealPrices();
      if (!mounted) return;
      
      setInstruments((prev) =>
        prev.map((inst) => {
          // Find real price by symbol
          const real = realPrices[inst.symbol] || realPrices[inst.id] || realPrices[inst.symbol.replace('/', '')];
          if (real && real > 0) {
            const change = real - inst.price;
            const changePercent = inst.price > 0 ? (change / inst.price) * 100 : 0;
            return {
              ...inst,
              price: real,
              change,
              changePercent,
              lastUpdated: Date.now(),
            };
          }
          return inst;
        })
      );
    };

    // Fetch immediately, then every 60 seconds (real markets don't need 2s)
    updateWithReal();
    const id = window.setInterval(updateWithReal, 60_000);

    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  return instruments;
}
