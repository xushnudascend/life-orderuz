/**
 * HeroOrnament — minimalist SVG orbital halqalar (nafas + orbita).
 * Life Order (Ascend) landing'idan portlangan.
 * Reduced-motion'da barcha animatsiyalar to'xtaydi.
 */
export function HeroOrnament({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Tashqi halqa — sekin orbita */}
        <g className="anim-orbit-slow" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="180" stroke="hsl(var(--border))" strokeWidth="1" />
          <circle cx="200" cy="20" r="2.5" fill="hsl(var(--primary))" />
        </g>
        {/* O'rta halqa — teskari orbita */}
        <g className="anim-orbit-reverse" style={{ transformOrigin: "200px 200px" }}>
          <circle
            cx="200"
            cy="200"
            r="130"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <circle cx="330" cy="200" r="2" fill="hsl(var(--foreground))" opacity="0.5" />
        </g>
        {/* Ichki halqa */}
        <g
          className="anim-orbit-slow"
          style={{ transformOrigin: "200px 200px", animationDuration: "36s" }}
        >
          <circle cx="200" cy="200" r="80" stroke="hsl(var(--border))" strokeWidth="1" />
          <circle cx="200" cy="120" r="1.8" fill="hsl(var(--muted-foreground))" />
        </g>
        {/* Diagonal chiziqlar */}
        <g stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5">
          <line x1="20" y1="200" x2="380" y2="200" />
          <line x1="200" y1="20" x2="200" y2="380" />
        </g>
        {/* Markaziy nuqta — nafas */}
        <circle cx="200" cy="200" r="6" fill="hsl(var(--primary))" className="anim-breathe" />
        <circle
          cx="200"
          cy="200"
          r="14"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          opacity="0.4"
          className="anim-breathe"
          style={{ animationDelay: "1.2s" }}
        />
      </svg>
    </div>
  );
}
