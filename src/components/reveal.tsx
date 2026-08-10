import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

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
  as?: ElementType;
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

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={
        "transition-[opacity,transform,filter] duration-[var(--dur-slow)] cubic-bezier(0.16, 1, 0.3, 1) will-change-[opacity,transform,filter] " +
        (shown ? "opacity-100 translate-y-0 scale-100 blur-0" : "opacity-0 translate-y-8 scale-[0.97] blur-[8px]") +
        (className ? " " + className : "")
      }
    >
      {children}
    </Component>
  );
}
