import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CreditCard, Crown, Smartphone, Sparkles, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PLANS, formatUgx, type Plan } from '@/lib/plans';

const TRIAL_DAYS = 3;
const DAY_MS = 86_400_000;

function trialDaysLeft(trialStartedAt: string | number): number {
  const startMs = typeof trialStartedAt === 'number' 
    ? trialStartedAt 
    : new Date(trialStartedAt).getTime();
  // If invalid date, assume trial just started now
  const validStart = isNaN(startMs) ? Date.now() : startMs;
  const end = validStart + TRIAL_DAYS * DAY_MS;
  return Math.max(0, Math.ceil((end - Date.now()) / DAY_MS));
}

interface SubscriptionTabProps {
  trialStartedAt: string | number;
}

export default function SubscriptionTab({ trialStartedAt }: SubscriptionTabProps) {
  const [selected, setSelected] = useState<Plan | null>(null);
  const daysLeft = useMemo(() => trialDaysLeft(trialStartedAt), [trialStartedAt]);

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-ink-900 via-ink-900 to-brand/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
              <Sparkles className="h-3.5 w-3.5" />
              {TRIAL_DAYS} days free trial
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">Subscription</h1>
            <p className="max-w-xl text-sm leading-relaxed text-ink-300">
              {daysLeft > 0
                ? `Your trial has ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left. Choose a plan before it ends to keep full access.`
                : 'Your free trial has ended. Choose a plan to keep full access to the terminal.'}
            </p>
          </div>
          <div className="rounded-2xl border border-ink-700 bg-black/40 px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-wider text-ink-400">Trial remaining</p>
            <p className="tabular mt-1 text-4xl font-bold text-brand">{daysLeft}</p>
            <p className="text-xs text-ink-400">{daysLeft === 1 ? 'day' : 'days'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan, index) => {
          const featured = plan.id === 'monthly';
          return (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                featured ? 'border-brand bg-ink-900' : 'border-ink-800 bg-ink-900/60 hover:border-ink-600'
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    featured ? 'bg-brand text-black' : 'border border-brand/40 bg-ink-900 text-brand'
                  }`}
                >
                  {plan.badge}
                </span>
              )}
              <h2 className="text-base font-semibold text-ink-100">{plan.name}</h2>
              <p className="tabular mt-4 text-2xl font-bold text-ink-100">{formatUgx(plan.price)}</p>
              <p className="text-xs text-ink-400">{plan.period}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-ink-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {perk}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setSelected(plan)}
                className={`mt-6 h-11 w-full rounded-xl font-semibold transition ${
                  featured
                    ? 'bg-brand text-black hover:brightness-110'
                    : 'border border-ink-600 text-ink-100 hover:border-brand hover:text-brand'
                }`}
              >
                Choose {plan.name}
              </button>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>{selected && <PlanCheckout plan={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}

interface PlanCheckoutProps {
  plan: Plan;
  onClose: () => void;
}

const PAYMENT_METHODS: { id: string; label: string; detail: string; icon: LucideIcon }[] = [
  { id: 'momo', label: 'MTN MoMo', detail: 'Pay from your mobile money wallet', icon: Smartphone },
  { id: 'card', label: 'Card', detail: 'Visa or Mastercard', icon: CreditCard },
];

function PlanCheckout({ plan, onClose }: PlanCheckoutProps) {
  const [method, setMethod] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="w-full max-w-md rounded-t-3xl border border-ink-700 bg-ink-900 p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-400">Checkout</p>
            <h2 id="checkout-title" className="mt-1 text-lg font-semibold text-ink-100">
              {plan.name} plan &middot; <span className="text-brand">{formatUgx(plan.price)}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-sm text-ink-300">Choose how you want to pay</p>
        <div className="space-y-3">
          {PAYMENT_METHODS.map(({ id, label, detail, icon: Icon }) => {
            const active = method === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                aria-pressed={active}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  active ? 'border-brand bg-brand/10' : 'border-ink-700 hover:border-ink-500'
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? 'bg-brand text-black' : 'bg-ink-800 text-ink-200'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-ink-100">{label}</span>
                  <span className="block text-xs text-ink-400">{detail}</span>
                </span>
                {active && <Crown className="h-4 w-4 text-brand" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-ink-700 bg-ink-850 p-4 text-sm leading-relaxed text-ink-300">
          {method
            ? 'Payments are not connected yet, so this plan cannot be purchased right now. Your trial continues until payments are available.'
            : 'Select a payment method to continue.'}
        </div>

        <button
          type="button"
          disabled
          className="mt-5 h-12 w-full cursor-not-allowed rounded-xl bg-brand font-semibold text-black opacity-40"
        >
          Pay {formatUgx(plan.price)}
        </button>
      </motion.div>
    </motion.div>
  );
                           }
