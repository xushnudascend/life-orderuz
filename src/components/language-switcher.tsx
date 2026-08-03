import { useT } from "@/i18n/use-t";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const LOCALES: { id: Locale; label: string }[] = [
  { id: "uz", label: "UZ" },
  { id: "ru", label: "RU" },
  { id: "en", label: "EN" },
];

/**
 * Ixcham til almashtirgich — segment tugmalar.
 * Tanlov localStorage'da saqlanadi va butun app'ga hodisa orqali tarqaladi.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useT();

  return (
    <div
      role="group"
      aria-label="Til / Язык / Language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-card/60 p-0.5 font-ui text-[11px]",
        className,
      )}
    >
      {LOCALES.map((l) => {
        const active = locale === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2 py-1 font-semibold tracking-wide transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
