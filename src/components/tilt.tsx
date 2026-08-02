import { useRef, type ReactNode } from "react";
import { isReducedMotion } from "@/lib/motion-pref";

/**
 * Tilt — pointer-driven 3D-og'ish (max ±max°).
 * Reduced-motion, low-perf (data-perf="low") va touch qurilmalarda o'chadi.
 * Ascend/Life Order dan port qilingan.
 */
export function Tilt({
  children,
  max = 6,
  className = "",
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const disabled = () => {
    if (isReducedMotion()) return true;
    if (typeof document !== "undefined" && document.documentElement.dataset.perf === "low")
      return true;
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return true;
    return false;
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rx = (-py * max).toFixed(2);
    const ry = (px * max).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`tilt-target ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 240ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}
