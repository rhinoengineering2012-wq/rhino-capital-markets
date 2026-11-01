import { Activity, BarChart3, Briefcase, Crown, LineChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type TabId = 'markets' | 'charts' | 'analytics' | 'portfolio' | 'subscription';

export const TERMINAL_TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'markets', label: 'Live Markets', icon: Activity },
  { id: 'charts', label: 'Charts', icon: LineChart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'subscription', label: 'Subscription', icon: Crown },
];
