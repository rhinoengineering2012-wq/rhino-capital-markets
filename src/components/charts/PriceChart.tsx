import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatPrice } from '@/lib/market-data';
import type { ChartPoint } from '@/lib/chart-points';

interface PriceChartProps {
  data: ChartPoint[];
  decimals: number;
  showSma: boolean;
  showEma: boolean;
}

interface CandleShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: ChartPoint;
}

function renderCandle(props: unknown) {
  const { x, y, width, height, payload } = props as CandleShapeProps;
  const range = payload.high - payload.low || 1;
  const scale = height / range;
  const yAt = (value: number) => y + (payload.high - value) * scale;
  const bodyTop = yAt(Math.max(payload.open, payload.close));
  const bodyBottom = yAt(Math.min(payload.open, payload.close));
  const color = payload.close >= payload.open ? '#22C55E' : '#EF4444';
  const centerX = x + width / 2;
  const bodyWidth = Math.max(2, width * 0.7);

  return (
    <g>
      <line x1={centerX} x2={centerX} y1={y} y2={y + height} stroke={color} strokeWidth={1} />
      <rect
        x={centerX - bodyWidth / 2}
        y={bodyTop}
        width={bodyWidth}
        height={Math.max(1, bodyBottom - bodyTop)}
        fill={color}
      />
    </g>
  );
}

interface TooltipPayloadEntry {
  payload?: ChartPoint;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function renderCandleTooltip(props: TooltipProps, decimals: number) {
  const point = props.payload?.[0]?.payload;
  if (!props.active || !point) return null;

  const rows: [string, number][] = [
    ['O', point.open],
    ['H', point.high],
    ['L', point.low],
    ['C', point.close],
  ];

  return (
    <div className="rounded-xl border border-ink-600 bg-ink-900/95 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-ink-300">{point.label}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {rows.map(([label, value]) => (
          <span key={label} className="tabular text-ink-200">
            <span className="text-ink-500">{label} </span>
            {formatPrice(value, decimals)}
          </span>
        ))}
      </div>
      <p className="tabular mt-1 text-ink-400">Vol {point.volume.toLocaleString('en-US')}</p>
    </div>
  );
}

export function PriceChart({ data, decimals, showSma, showEma }: PriceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#1A1A1F" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#6B6B76', fontSize: 11 }}
          axisLine={{ stroke: '#26262D' }}
          tickLine={false}
          minTickGap={36}
        />
        <YAxis
          orientation="right"
          domain={['auto', 'auto']}
          tickFormatter={(value: number) => formatPrice(value, decimals)}
          tick={{ fill: '#6B6B76', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={78}
        />
        <Tooltip
          content={(props: unknown) => renderCandleTooltip(props as TooltipProps, decimals)}
          cursor={{ stroke: '#3A3A44' }}
        />
        <Bar dataKey="range" shape={renderCandle} isAnimationActive={false} />
        {showSma && (
          <Line type="monotone" dataKey="sma" stroke="#FFD60A" strokeWidth={1.5} dot={false} connectNulls isAnimationActive={false} />
        )}
        {showEma && (
          <Line type="monotone" dataKey="ema" stroke="#60A5FA" strokeWidth={1.5} dot={false} connectNulls isAnimationActive={false} />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

interface VolumeChartProps {
  data: ChartPoint[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
        <XAxis dataKey="label" hide />
        <YAxis
          orientation="right"
          tick={{ fill: '#6B6B76', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={78}
          tickFormatter={(value: number) => (value >= 1000 ? `${Math.round(value / 1000)}k` : String(value))}
        />
        <Bar dataKey="volume" fill="#FFD60A" fillOpacity={0.35} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
