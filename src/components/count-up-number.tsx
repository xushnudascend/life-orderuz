import { useCountUp } from "@/hooks/use-count-up";

/**
 * Number that counts up from 0 to `value` on viewport entry.
 * Respects prefers-reduced-motion.
 */
export function CountUpNumber({
  value,
  suffix = "",
  duration,
  className,
  once,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  once?: string;
}) {
  const { ref, value: v } = useCountUp(value, duration, once);
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {v.toLocaleString("uz-UZ")}
      {suffix}
    </span>
  );
}
