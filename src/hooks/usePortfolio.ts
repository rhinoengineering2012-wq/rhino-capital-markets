import { useCallback, useEffect, useState } from 'react';
import type { Holding, NewHolding } from '@/lib/portfolio';

const STORAGE_KEY = 'rhino_portfolio';

function readHoldings(): Holding[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Holding[]) : [];
  } catch {
    return [];
  }
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(readHoldings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  const addHolding = useCallback((holding: NewHolding) => {
    setHoldings((previous) => [...previous, { ...holding, id: crypto.randomUUID() }]);
  }, []);

  const removeHolding = useCallback((id: string) => {
    setHoldings((previous) => previous.filter((item) => item.id !== id));
  }, []);

  return { holdings, addHolding, removeHolding };
}
