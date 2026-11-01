import type { AssetClass } from '@/lib/market-data';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  quantity: number;
  avgCost: number;
}

export type NewHolding = Omit<Holding, 'id'>;

export interface HoldingMetrics {
  lastPrice: number;
  marketValue: number;
  costBasis: number;
  profitLoss: number;
  profitLossPercent: number;
}

export function holdingMetrics(holding: Holding, lastPrice: number): HoldingMetrics {
  const marketValue = holding.quantity * lastPrice;
  const costBasis = holding.quantity * holding.avgCost;
  const profitLoss = marketValue - costBasis;
  return {
    lastPrice,
    marketValue,
    costBasis,
    profitLoss,
    profitLossPercent: costBasis === 0 ? 0 : (profitLoss / costBasis) * 100,
  };
}
