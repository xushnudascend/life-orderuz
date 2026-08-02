import { isReducedMotion } from "@/lib/motion-pref";

/**
 * AuthCompanions — Auth sahifasi orqasida nafas oluvchi 3 ta blob-maskot.
 *
 * Asos: sekin, ritmik motion parasympathetic nervous system'ni faollashtiradi
 * (Zaccaro et al., 2018 — Frontiers in Human Neuroscience) — foydalanuvchi
 * hisob yaratayotgan taranglik daqiqada mikro-tinchlantirish beradi.
 *
 * MUHIM: mobil viewport'da ham ko'rinadi (eski loyihaning `hidden lg:block`
 * xatosi qaytarilmadi). Reduced-motion bo'lsa — statik, animatsiyasiz.
 */
export function AuthCompanions() {
  const reduced = isReducedMotion();
  const animClass = reduced ? "" : "orb-breathe";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Orb 1 — yuqori chap, primary hue */}
      <div
        className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl sm:h-80 sm:w-80 ${animClass}`}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.28), hsl(var(--primary) / 0.05) 60%, transparent 75%)",
          animationDelay: "0s",
        }}
      />
      {/* Orb 2 — pastki o'ng, iliqroq */}
      <div
        className={`absolute -bottom-32 -right-20 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96 ${animClass}`}
        style={{
          background:
            "radial-gradient(circle at 60% 60%, hsl(35 92% 60% / 0.18), hsl(35 92% 60% / 0.04) 60%, transparent 75%)",
          animationDelay: "3s",
        }}
      />
      {/* Orb 3 — markazdan yuqorida, kichkina */}
      <div
        className={`absolute left-1/2 top-1/4 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl sm:h-56 sm:w-56 ${animClass}`}
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.14), transparent 70%)",
          animationDelay: "6s",
        }}
      />
    </div>
  );
}
