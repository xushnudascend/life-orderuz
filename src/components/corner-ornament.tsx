import { cn } from "@/lib/utils";
import { isReducedMotion } from "@/lib/motion-pref";

/**
 * CornerOrnament — girih-uslubidagi geometrik burchak naqshi.
 *
 * Vizual imzo: markaziy-osiyo an'anaviy naqshiga ishora — nozik, past-opacity,
 * `--primary` rangida. Burchaklarga qo'yiladi (dashboard, auth, assessment
 * bo'sh burchaklari). `prefers-reduced-motion` bo'lsa — statik SVG.
 *
 * Fiziologik asos: periferik ko'rish sekin motion'ni "nafas" sifatida qabul
 * qiladi va parasympathetic tone'ni oshiradi (Uljarević & Hamilton, 2013) —
 * shuning uchun juda sekin (24s) va past amplituda.
 */
export function CornerOrnament({
  position = "top-right",
  size = 220,
  className,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  className?: string;
}) {
  const reduced = isReducedMotion();

  const positionClasses: Record<typeof position, string> = {
    "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
    "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
    "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
    "bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
  };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute select-none",
        positionClasses[position],
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        className={cn(
          "h-full w-full text-primary/[0.09]",
          !reduced && "corner-ornament-spin",
        )}
      >
        {/* 8-nurli girih yulduzi — 8 ta 45° burilgan kvadrat */}
        <g stroke="currentColor" strokeWidth="0.6">
          {[0, 22.5, 45, 67.5].map((deg) => (
            <rect
              key={deg}
              x="50"
              y="50"
              width="100"
              height="100"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
          {/* markaziy 12-nurli guldasta */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              transform={`rotate(${i * 30} 100 100)`}
              strokeWidth="0.4"
            />
          ))}
          {/* konsentrik doiralar */}
          <circle cx="100" cy="100" r="70" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="52" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="34" strokeWidth="0.35" />
          <circle cx="100" cy="100" r="16" strokeWidth="0.3" />
        </g>
        {/* markaziy nuqta */}
        <circle cx="100" cy="100" r="1.2" fill="currentColor" className="text-primary/25" />
      </svg>
    </div>
  );
}
