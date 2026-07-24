/**
 * Archetype dinamik rang qatlami.
 *
 * Foydalanuvchining assessment natijasidagi arxetipiga qarab `--primary` va
 * `--primary-glow` hue'sini siljitadi (barcha boshqa token o'zgarmaydi —
 * kontrast, chuqurlik, tokenlar bir xil qoladi). Shaxsiylashtirish hissi
 * uchun — "har kim o'z rangini his qiladi" (Endowment effekti; Thaler 1980).
 *
 * Foydalanish: `<html>` element'iga `data-archetype="..."` atributi qo'yiladi;
 * CSS qatlami (`src/styles.css`) qolganini bajaradi.
 */

const KNOWN_ARCHETYPES = [
  "starter",
  "builder",
  "aspirant",
  "warrior",
  "sage",
  "explorer",
] as const;

export type Archetype = (typeof KNOWN_ARCHETYPES)[number];

export function applyArchetypeTheme(archetype: string | null | undefined) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (!archetype) {
    html.removeAttribute("data-archetype");
    return;
  }
  const normalized = archetype.trim().toLowerCase();
  const known = (KNOWN_ARCHETYPES as readonly string[]).includes(normalized)
    ? normalized
    : "starter";
  html.setAttribute("data-archetype", known);
}
