import { useEffect, useState } from "react";
import { readTheme, setTheme, THEMES, type Theme } from "@/lib/theme";

/**
 * 3-tugma tema tanlagich. Settings sahifasida ishlatiladi.
 */
export function ThemeSwitcher() {
  const [theme, setThemeState] = useState<Theme>("obsidian");

  useEffect(() => {
    setThemeState(readTheme());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      if (detail) setThemeState(detail);
    };
    window.addEventListener("lo_theme_changed", onChange as EventListener);
    return () => window.removeEventListener("lo_theme_changed", onChange as EventListener);
  }, []);

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={
              "rounded-[var(--radius)] border p-4 text-left transition-colors " +
              (active
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-foreground/30")
            }
            aria-pressed={active}
          >
            <div className="flex items-center justify-between">
              <p className="font-serif text-lg">{t.label}</p>
              <span
                aria-hidden
                className={
                  active
                    ? "h-2.5 w-2.5 rounded-full bg-primary"
                    : "h-2.5 w-2.5 rounded-full border border-border"
                }
              />
            </div>
            <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t.hint}
            </p>
          </button>
        );
      })}
    </div>
  );
}
