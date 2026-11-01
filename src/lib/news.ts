export type Sentiment = 'bullish' | 'bearish' | 'neutral';

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  category: 'Macro' | 'Crypto' | 'Equities' | 'Forex';
  minutesAgo: number;
  sentiment: Sentiment;
}

export const MARKET_NEWS: NewsItem[] = [
  {
    id: 'n1',
    headline: 'Central banks hold rates steady as inflation continues to cool',
    source: 'Global Desk',
    category: 'Macro',
    minutesAgo: 6,
    sentiment: 'neutral',
  },
  {
    id: 'n2',
    headline: 'Bitcoin spot volumes climb to a three-week high on heavy institutional flows',
    source: 'Crypto Wire',
    category: 'Crypto',
    minutesAgo: 14,
    sentiment: 'bullish',
  },
  {
    id: 'n3',
    headline: 'Chipmakers rally after upbeat data-center demand outlook',
    source: 'Equities Daily',
    category: 'Equities',
    minutesAgo: 27,
    sentiment: 'bullish',
  },
  {
    id: 'n4',
    headline: 'Dollar softens against majors ahead of the employment report',
    source: 'FX Review',
    category: 'Forex',
    minutesAgo: 41,
    sentiment: 'bearish',
  },
  {
    id: 'n5',
    headline: 'Emerging-market currencies find support as commodity prices firm',
    source: 'Global Desk',
    category: 'Forex',
    minutesAgo: 58,
    sentiment: 'bullish',
  },
  {
    id: 'n6',
    headline: 'Tech earnings season kicks off with mixed guidance across the sector',
    source: 'Equities Daily',
    category: 'Equities',
    minutesAgo: 75,
    sentiment: 'neutral',
  },
];
