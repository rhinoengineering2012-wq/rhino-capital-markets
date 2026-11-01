import RhinoMark from '@/components/brand/RhinoMark';

interface BrandLockupProps {
  compact?: boolean;
}

export default function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 ring-1 ring-brand/30">
        <RhinoMark className="h-7 w-7" />
      </div>
      <div className="leading-none">
        <p className="text-base font-bold tracking-tight text-ink-100 sm:text-lg">
          Rhino <span className="text-brand">CAPITAL MARKETS</span>
        </p>
        {!compact && (
          <p className="mt-1 text-xs text-ink-300">Live markets from every nation. Global.</p>
        )}
      </div>
    </div>
  );
}
