import { useState, type FormEvent } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import CountryPicker from '@/components/login/CountryPicker';
import { DEFAULT_COUNTRY, type Country } from '@/lib/countries';

interface PhoneSignInProps {
  onSubmit: () => void;
}

export default function PhoneSignIn({ onSubmit }: PhoneSignInProps) {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');

  const handleSendCode = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSendCode} className="space-y-4">
      <div className="flex gap-2">
        <CountryPicker selected={country} onSelect={setCountry} />
        <div className="relative flex-1">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="tabular h-12 w-full rounded-xl border border-ink-600 bg-ink-850 pl-9 pr-3 text-ink-100 placeholder:text-ink-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>
      <button
        type="submit"
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-black transition hover:brightness-110"
      >
        Send code
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
