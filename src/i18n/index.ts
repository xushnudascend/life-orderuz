import { uz, type Dict } from "./uz";
import { ru } from "./ru";
import { en } from "./en";

/**
 * Minimal i18n: uz manba, ru/en tarjimalar.
 * `t("brand.tagline")` shakli o'zgarmaydi.
 * Locale localStorage'da saqlanadi ("lo_locale") — SSR-safe.
 */
export type Locale = "uz" | "ru" | "en";
const DICTS: Record<Locale, Dict> = { uz, ru, en };

type DotPath<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotPath<T[K], P extends "" ? K : `${P}.${K}`>
    : P extends ""
      ? K
      : `${P}.${K}`;
}[keyof T & string];

export type TKey = DotPath<Dict>;

function readLocale(): Locale {
  if (typeof window === "undefined") return "uz";
  const v = window.localStorage.getItem("lo_locale");
  return v === "ru" || v === "en" ? v : "uz";
}

export function setLocale(l: Locale): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("lo_locale", l);
    window.dispatchEvent(new CustomEvent("lo_locale_changed", { detail: l }));
  }
}

export function getLocale(): Locale {
  return readLocale();
}

export function t(key: TKey, locale?: Locale): string {
  const loc = locale ?? readLocale();
  const dict = DICTS[loc];
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  if (typeof value === "string") return value;
  // Fallback to uz if translation missing
  if (loc !== "uz") {
    const fb = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as object)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, uz);
    if (typeof fb === "string") return fb;
  }
  return key;
}

export { uz };
export const currentLocale = "uz" as const;
