import { uz, type Dict } from "./uz";

/**
 * Minimal `t()` helper. Keyingi bosqichda i18next bilan almashtiriladi,
 * lekin `t("brand.tagline")` shakli o'zgarmaydi — refactor ehtiyoji yo'q.
 */
type DotPath<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotPath<T[K], P extends "" ? K : `${P}.${K}`>
    : P extends ""
      ? K
      : `${P}.${K}`;
}[keyof T & string];

export type TKey = DotPath<Dict>;

const dict: Dict = uz;

export function t(key: TKey): string {
  const value = key
    .split(".")
    .reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as object)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict);

  return typeof value === "string" ? value : key;
}

export { uz };
export const currentLocale = "uz" as const;
