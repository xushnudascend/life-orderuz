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
      aria-label="men shu o'z saytimni real ko'rib chiq tahlil qil har taraflama chuqur juda juda juda chuqur tahlil qilish orqali saytimni 10 ballik shkalada har hil 10lab 100lab mezonlarda bahola faqat rostini real halol ayt\nI want you to really look at my website and analyze it, deeply, very very very deeply. Evaluate my site on a 10-point scale using dozens, hundreds of different criteria, and just tell the honest, real truth."
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
