import { useEffect, useRef } from "react";

/**
 * HeroBackdrop — pointer + scroll parallax fon qatlami.
 * Life Order (Ascend) landing'idan portlangan minimalist ornament.
 * Reduced-motion va coarse-pointer'ni hurmat qiladi.
 */
export function HeroBackdrop({ className = "" }: { className?: string }) {
  const orb = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const orbScrollK = 0.15;
    const gridScrollK = 0.05;
    const pointerAmp = 24;

    let tmx = 0,
      tmy = 0,
      cmx = 0,
      cmy = 0,
      sy = 0;
    let raf = 0;
    let running = true;

    const step = () => {
      raf = 0;
      cmx += (tmx - cmx) * 0.08;
      cmy += (tmy - cmy) * 0.08;
      if (orb.current) {
        orb.current.style.transform = `translate3d(${cmx.toFixed(1)}px, ${(cmy - sy * orbScrollK).toFixed(1)}px, 0)`;
      }
      if (grid.current) {
        grid.current.style.transform = `translate3d(0, ${(-sy * gridScrollK).toFixed(1)}px, 0)`;
      }
      if (Math.abs(tmx - cmx) > 0.1 || Math.abs(tmy - cmy) > 0.1) schedule();
    };
    const schedule = () => {
      if (raf || !running) return;
      raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      tmx = (e.clientX / window.innerWidth - 0.5) * pointerAmp;
      tmy = (e.clientY / window.innerHeight - 0.5) * pointerAmp;
      schedule();
    };
    const onScroll = () => {
      sy = Math.min(window.scrollY, 800);
      schedule();
    };

    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      running = false;
      if (fine) window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        ref={grid}
        className="absolute inset-0 opacity-[0.06] backdrop-grid will-change-transform"
      />
      <div
        ref={orb}
        className="absolute -top-40 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-25 will-change-transform"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 65%)" }}
      />
    </div>
  );
}
