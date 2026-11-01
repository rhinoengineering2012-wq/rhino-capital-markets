import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/market-data';

interface LivePriceProps {
  value: number;
  decimals: number;
  up: boolean;
  className?: string;
}

export default function LivePrice({ value, decimals, up, className = '' }: LivePriceProps) {
  const flash = up ? 'rgba(34, 197, 94, 0.22)' : 'rgba(239, 68, 68, 0.22)';

  return (
    <motion.span
      key={value}
      initial={{ backgroundColor: flash }}
      animate={{ backgroundColor: 'rgba(34, 197, 94, 0)' }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className={`tabular inline-block rounded px-1 font-semibold ${up ? 'text-up' : 'text-down'} ${className}`}
    >
      {formatPrice(value, decimals)}
    </motion.span>
  );
}
