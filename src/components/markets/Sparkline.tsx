import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
  data: number[];
  positive: boolean;
}

export default function Sparkline({ data, positive }: SparklineProps) {
  const id = useId().replace(/:/g, '');
  const color = positive ? '#22C55E' : '#EF4444';
  const points = data.map((value, index) => ({ index, value }));

  return (
    <div className="h-10 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 3, right: 0, bottom: 3, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${id})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
