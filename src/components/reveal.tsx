import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Subtle scroll-triggered reveal. No gamification, no bounce.
 * Fades + rises 8px once when entering viewport. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as any;
  return (
    <Component
      ref={ref as any}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={
        "transition-[opacity,transform] duration-[700ms] ease-out will-change-[opacity,transform] " +
        (shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2") +
        (className ? " " + className : "")
      }
    >
      {children}
    </Component>
  );
}
