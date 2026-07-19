// Motion preferences: "auto" follows OS prefers-reduced-motion, "reduce" forces off, "full" forces on.

const KEY = "lifeorder.motion-pref";
export type MotionPref = "auto" | "reduce" | "full";

const listeners = new Set<() => void>();

export function getMotionPref(): MotionPref {
  if (typeof localStorage === "undefined") return "auto";
  const v = localStorage.getItem(KEY);
  return v === "reduce" || v === "full" ? v : "auto";
}

export function setMotionPref(p: MotionPref) {
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY, p);
  applyDocAttr();
  listeners.forEach((fn) => fn());
}

export function subscribeMotionPref(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function isReducedMotion(): boolean {
  const p = getMotionPref();
  if (p === "reduce") return true;
  if (p === "full") return false;
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function applyDocAttr() {
  if (typeof document === "undefined") return;
  const reduced = isReducedMotion();
  document.documentElement.setAttribute("data-motion", reduced ? "reduce" : "full");
}

if (typeof window !== "undefined") {
  applyDocAttr();
  try {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", () => {
      if (getMotionPref() === "auto") {
        applyDocAttr();
        listeners.forEach((fn) => fn());
      }
    });
  } catch {
    /* noop */
  }
}
