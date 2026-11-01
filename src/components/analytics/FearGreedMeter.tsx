import { motion } from 'framer-motion';
import { fearGreedLabel } from '@/lib/market-data';

interface FearGreedMeterProps {
  score: number;
}

function toneFor(score: number): string {
  if (score < 25) return '#EF4444';
  if (score < 45) return '#F97316';
  if (score < 55) return '#FFD60A';
  if (score < 75) return '#84CC16';
  return '#22C55E';
}

export default function FearGreedMeter({ score }: FearGreedMeterProps) {
  const color = toneFor(score);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 116" className="w-full max-w-[280px]" aria-label={`Fear and greed index ${score}`}>
        <path d="M 14 104 A 86 86 0 0 1 186 104" fill="none" stroke="#1A1A1F" strokeWidth={14} strokeLinecap="round" />
        <motion.path
          d="M 14 104 A 86 86 0 0 1 186 104"
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - score }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <text x="100" y="86" textAnchor="middle" className="fill-ink-100" style={{ fontSize: 34, fontWeight: 700 }}>
          {score}
        </text>
        <text x="100" y="106" textAnchor="middle" className="fill-ink-400" style={{ fontSize: 9, letterSpacing: 1.5 }}>
          FEAR &amp; GREED INDEX
        </text>
      </svg>
      <motion.p
        key={fearGreedLabel(score)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1 text-lg font-semibold"
        style={{ color }}
      >
        {fearGreedLabel(score)}
      </motion.p>
    </div>
  );
}
