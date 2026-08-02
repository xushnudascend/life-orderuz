/**
 * Progress-ring (SVG 80×80).
 * Ichida "N/M bajarildi" raqami, atrofida sariq halqa foiz bo'yicha to'ladi.
 */
export function ProgressRing({
  value,
  total,
  size = 80,
  strokeWidth = 6,
}: {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const percent = total > 0 ? Math.min(1, value / total) : 0;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * percent;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dasharray] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-serif text-lg">
          {value}/{total}
        </span>
        <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          bajarildi
        </span>
      </div>
    </div>
  );
}
