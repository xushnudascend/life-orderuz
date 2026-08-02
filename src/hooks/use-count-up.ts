import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/motion-pref";

/**
 * Animate 0 → target on viewport entry, once. Reduced-motion shows target immediately.
 * `key` — sessionStorage key so it plays once per session even across navigations.
 */
export function useCountUp(target: number, duration = 1200, key?: string) {
  const storageKey = key ? `lo.countup.${key}` : null;
  const alreadyPlayed =
    storageKey && typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem(storageKey) === "1"
      : false;
  const [value, setValue] = useState(alreadyPlayed ? target : 0);
  const ref = useRef<HTMLElement | null>(null);
  const done = useRef(alreadyPlayed);

  useEffect(() => {
    if (done.current) return;
    const el = ref.current;
    if (!el) return;

    if (isReducedMotion()) {
      setValue(target);
      done.current = true;
      if (storageKey)
        try {
          sessionStorage.setItem(storageKey, "1");
        } catch {
          /* noop */
        }
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            io.disconnect();
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
              else if (storageKey)
                try {
                  sessionStorage.setItem(storageKey, "1");
                } catch {
                  /* noop */
                }
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, storageKey]);

  return { ref, value } as const;
}
