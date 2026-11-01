import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { TERMINAL_TABS, type TabId } from '@/lib/terminal-tabs';

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function DesktopTabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="hidden border-b border-ink-800 bg-ink-950 md:block" aria-label="Terminal sections">
      <div className="mx-auto flex max-w-7xl gap-1 px-6">
        {TERMINAL_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                isActive ? 'text-brand' : 'text-ink-400 hover:text-ink-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {isActive && (
                <motion.span
                  layoutId="desktop-tab-indicator"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileTabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-800 bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Terminal sections"
    >
      <div className="grid grid-cols-5">
        {TERMINAL_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-brand' : 'text-ink-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular hidden text-xs text-ink-300 lg:inline">
      {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' })} UTC
    </span>
  );
}

interface TerminalHeaderProps {
  identity: string;
  onSignOut: () => void;
}

export function TerminalHeaderActions({ identity, onSignOut }: TerminalHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <LiveClock />
      <span className="inline-flex items-center gap-2 rounded-full border border-up/30 bg-up/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-up">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-up opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-up" />
        </span>
        Live
      </span>
      <span className="hidden max-w-[160px] truncate text-xs text-ink-400 xl:inline">{identity}</span>
      <button
        type="button"
        onClick={onSignOut}
        aria-label="Sign out"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700 text-ink-300 transition hover:border-down/60 hover:text-down"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
