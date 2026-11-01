import { motion } from 'framer-motion';
import { Globe, Sparkles, TrendingUp } from 'lucide-react';
import BrandLockup from '@/components/brand/BrandLockup';
import PhoneSignIn from '@/components/login/PhoneSignIn';

const HIGHLIGHTS = [
  { icon: Globe, label: 'Markets from every nation, live' },
  { icon: TrendingUp, label: 'Forex, crypto and stocks in one terminal' },
];

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.8 3.3-8.1z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.2-4.6H2.2v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2a11 11 0 0 0 0 9.8l3.6-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.6l3.2-3.2A11 11 0 0 0 2.2 7.1l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-12 px-6 py-12 lg:flex-row lg:items-center lg:gap-20 lg:px-10">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-8"
        >
          <BrandLockup />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink-100 sm:text-5xl">
              Trade with the <span className="text-brand">whole world</span> in view.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ink-300">
              Live quotes for currencies, crypto and equities, professional charts, and a portfolio that
              tracks your profit in real time.
            </p>
          </div>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-ink-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md rounded-3xl border border-ink-700 bg-ink-900/80 p-6 shadow-2xl shadow-black/60 backdrop-blur sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink-100">Sign in</h2>
              <p className="mt-1 text-sm text-ink-400">Continue to your terminal</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              3 days free trial
            </span>
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white font-semibold text-black transition hover:bg-ink-100"
          >
            <GoogleGlyph />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-ink-500">
            <span className="h-px flex-1 bg-ink-700" />
            or use phone
            <span className="h-px flex-1 bg-ink-700" />
          </div>

          <PhoneSignIn onSubmit={onLogin} />

          <p className="mt-6 text-center text-xs leading-relaxed text-ink-500">
            Your 3-day free trial starts the moment you create your account.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
