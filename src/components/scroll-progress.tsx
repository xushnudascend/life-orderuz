import { useEffect, useState } from "react";

/**
 * Sahifa yuqorisidagi yupqa progress chizig'i (sunk-cost effekti — foydalanuvchi
 * qancha o'qiganini his qilsin). Landing'da qo'llaniladi.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
        setPct(p);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-[2px] pointer-events-none">
      <div
        aria-hidden
        className="h-full bg-primary origin-left transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
