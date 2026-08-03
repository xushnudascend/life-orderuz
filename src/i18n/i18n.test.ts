import { describe, it, expect, beforeEach, vi } from "vitest";
import { t, getLocale, setLocale } from "./index";
import { uz } from "./uz";
import { ru } from "./ru";
import { en } from "./en";

function flatKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === "object" ? flatKeys(v as Record<string, unknown>, path) : [path];
  });
}

describe("lug'atlar", () => {
  it("ru va en uz bilan bir xil kalitlarga ega", () => {
    const uzKeys = flatKeys(uz).sort();
    expect(flatKeys(ru).sort()).toEqual(uzKeys);
    expect(flatKeys(en).sort()).toEqual(uzKeys);
  });

  it("hech bir tarjima bo'sh emas", () => {
    for (const [name, dict] of [
      ["uz", uz],
      ["ru", ru],
      ["en", en],
    ] as const) {
      for (const key of flatKeys(dict)) {
        const value = key
          .split(".")
          .reduce<unknown>((a, p) => (a as Record<string, unknown>)?.[p], dict);
        expect(typeof value, `${name}.${key}`).toBe("string");
        expect((value as string).trim().length, `${name}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("t()", () => {
  it("berilgan tilda qaytaradi", () => {
    expect(t("brand.name", "uz")).toBe(uz.brand.name);
    expect(t("brand.tagline", "ru")).toBe(ru.brand.tagline);
    expect(t("brand.tagline", "en")).toBe(en.brand.tagline);
  });

  it("noma'lum kalitda kalitning o'zini qaytaradi", () => {
    expect(t("yoq.kalit" as never, "uz")).toBe("yoq.kalit");
  });
});

describe("locale saqlash", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
      },
      dispatchEvent: () => true,
    });
    vi.stubGlobal("CustomEvent", class {
      constructor(
        public type: string,
        public init?: unknown,
      ) {}
    });
  });

  it("tanlangan tilni saqlaydi va o'qiydi", () => {
    setLocale("ru");
    expect(getLocale()).toBe("ru");
    setLocale("en");
    expect(getLocale()).toBe("en");
  });
});
