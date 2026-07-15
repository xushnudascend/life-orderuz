/**
 * Uch tema (Obsidian/Light/Blue) — CSS'da `.light`/`.blue` variantlar orqali ishlaydi.
 * Bu modul faqat `<html>` elementiga klass qo'yadi va localStorage'ga saqlaydi.
 * Anti-flash: dastlabki qiymat __root'ning inline script'i orqali sinxron o'rnatiladi.
 */

export type Theme = "obsidian" | "light" | "blue";
const STORAGE_KEY = "lo_theme";

const THEME_CLASS: Record<Theme, string> = {
  obsidian: "",
  light: "light",
  blue: "blue",
};

export const THEMES: { id: Theme; label: string; hint: string }[] = [
  { id: "obsidian", label: "Obsidian", hint: "Qorong'i, neon-sariq" },
  { id: "light", label: "Aurora", hint: "Yorug', monoxrom" },
  { id: "blue", label: "Premium Blue", hint: "Chuqur navy, elektr-ko'k" },
];

export function readTheme(): Theme {
  if (typeof window === "undefined") return "obsidian";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "blue" ? v : "obsidian";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "blue");
  const cls = THEME_CLASS[theme];
  if (cls) root.classList.add(cls);
}

export function setTheme(theme: Theme): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
  applyTheme(theme);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lo_theme_changed", { detail: theme }));
  }
}

/**
 * Inline script sifatida sahifa yuklanishidan avval bajariladi.
 * SSR paytida `<head>` ichiga qo'yiladi — flash of wrong theme'ni oldini oladi.
 */
export const THEME_INIT_SCRIPT = `
(function(){try{var v=localStorage.getItem('lo_theme');
var d=document.documentElement;d.classList.remove('light','blue');
if(v==='light')d.classList.add('light');else if(v==='blue')d.classList.add('blue');
}catch(e){}})();`;
