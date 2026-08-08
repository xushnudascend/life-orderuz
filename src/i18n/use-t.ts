import { useCallback, useEffect, useState } from "react";
import { getLocale, setLocale, t as translate, type Locale, type TKey } from "./index";

/**
 * Reaktiv i18n hook. `lo_locale_changed` hodisasiga obuna bo'ladi,
 * shuning uchun tilni almashtirganda butun UI qayta render bo'ladi.
 * SSR-safe: server tomonda doim "uz".
 */
export function useT() {
  const [locale, setLocaleState] = useState<Locale>("uz");

  useEffect(() => {
    setLocaleState(getLocale());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Locale>).detail;
      setLocaleState(detail ?? getLocale());
    };
    window.addEventListener("lo_locale_changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("lo_locale_changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const t = useCallback((key: TKey, params?: Record<string, string | number>) => translate(key, locale, params), [locale]);

  const change = useCallback((next: Locale) => {
    setLocale(next);
    setLocaleState(next);
  }, []);

  return { t, locale, setLocale: change };
}
