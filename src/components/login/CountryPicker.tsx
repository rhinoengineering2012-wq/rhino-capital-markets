import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, flagFor, type Country } from '@/lib/countries';

interface CountryPickerProps {
  selected: Country;
  onSelect: (country: Country) => void;
}

export default function CountryPicker({ selected, onSelect }: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase().replace(/^\+/, '');
    if (!term) return COUNTRIES;
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(term) ||
        country.iso.toLowerCase().includes(term) ||
        country.dial.startsWith(term)
    );
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        className="flex h-12 items-center gap-2 rounded-xl border border-ink-600 bg-ink-850 px-3 text-sm font-medium text-ink-100 transition hover:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/40"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{flagFor(selected.iso)}</span>
        <span className="tabular">+{selected.dial}</span>
        <ChevronDown className={`h-4 w-4 text-ink-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onMouseDown={close} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute left-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-ink-600 bg-ink-850 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-2 border-b border-ink-700 px-3 py-2.5">
                <Search className="h-4 w-4 text-ink-400" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search country or code"
                  className="w-full bg-transparent text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none"
                />
              </div>
              <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-ink-400">No country matches that search</li>
                )}
                {results.map((country) => {
                  const isSelected = country.iso === selected.iso;
                  return (
                    <li key={country.iso}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelect(country);
                          close();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink-200 transition hover:bg-ink-700 hover:text-ink-100"
                      >
                        <span className="text-lg leading-none">{flagFor(country.iso)}</span>
                        <span className="flex-1 truncate">{country.name}</span>
                        <span className="tabular text-ink-400">+{country.dial}</span>
                        {isSelected && <Check className="h-4 w-4 text-brand" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
