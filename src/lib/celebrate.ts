import { isReducedMotion } from "./motion-pref";

/**
 * Confetti burst — respects reduced-motion.
 * canvas-confetti is dynamically imported so it never lands in the main bundle.
 */
export async function celebrate(intensity: "small" | "big" = "small") {
  if (isReducedMotion() || typeof window === "undefined") return;
  const { default: confetti } = await import("canvas-confetti");
  const count = intensity === "big" ? 160 : 60;
  confetti({
    particleCount: count,
    spread: intensity === "big" ? 90 : 60,
    origin: { y: 0.7 },
    colors: ["#f59e0b", "#fbbf24", "#fde68a", "#22c55e", "#e5e7eb"],
    scalar: intensity === "big" ? 1.1 : 0.85,
    disableForReducedMotion: true,
  });
}

/**
 * Floating "+N XP" toast anchored at a screen point.
 */
export function floatXp(x: number, y: number, amount: number) {
  if (typeof document === "undefined") return;
  const reduced = isReducedMotion();
  const el = document.createElement("div");
  el.textContent = `+${amount} XP`;
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9999;
    pointer-events:none;font-weight:800;font-size:14px;color:hsl(var(--primary));
    text-shadow:0 0 12px hsl(var(--primary) / .5);
    transition:transform ${reduced ? ".2s" : ".9s"} ease-out, opacity ${reduced ? ".2s" : ".9s"} ease-out;
    transform:translate(-50%,0)`;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = `translate(-50%,${reduced ? "-20px" : "-60px"})`;
    el.style.opacity = "0";
  });
  setTimeout(() => el.remove(), reduced ? 220 : 950);
}
