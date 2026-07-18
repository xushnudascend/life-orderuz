import PptxGenJS from "pptxgenjs";

const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

const BG = "0A0A0A";
const FG = "FAFAFA";
const MUTED = "9CA3AF";
const AMBER = "F59E0B";
const CARD = "141414";
const BORDER = "262626";

function base(slide) {
  slide.background = { color: BG };
}
function eyebrow(slide, text) {
  slide.addText(text, {
    x: 0.6, y: 0.5, w: 6, h: 0.35,
    fontFace: "Arial", fontSize: 10, color: AMBER, bold: true, charSpacing: 4,
  });
}
function title(slide, text) {
  slide.addText(text, {
    x: 0.6, y: 0.95, w: 12, h: 1.2,
    fontFace: "Georgia", fontSize: 40, color: FG, bold: true,
  });
}
function foot(slide, n) {
  slide.addText(`Life Order · ${n}/12 · Konfidensial`, {
    x: 0.6, y: 7.05, w: 12, h: 0.3,
    fontFace: "Arial", fontSize: 9, color: MUTED, charSpacing: 3,
  });
}
function card(slide, x, y, w, h) {
  slide.addShape("roundRect", {
    x, y, w, h, fill: { color: CARD }, line: { color: BORDER, width: 1 },
    rectRadius: 0.08,
  });
}

// ---------- Slide 1: Cover ----------
{
  const s = pres.addSlide(); base(s);
  s.addText("LIFE ORDER", { x: 0.6, y: 0.55, w: 6, h: 0.4, fontFace: "Arial", fontSize: 11, color: AMBER, bold: true, charSpacing: 6 });
  s.addText("Motivatsiya tugaydi.", { x: 0.6, y: 2.4, w: 12, h: 1.2, fontFace: "Georgia", fontSize: 66, color: FG, bold: true });
  s.addText("Tizim qoladi.", { x: 0.6, y: 3.5, w: 12, h: 1.2, fontFace: "Georgia", fontSize: 66, color: AMBER, bold: true, italic: true });
  s.addText("Xulq-atvor fani asosidagi shaxsiy operatsion tizim — O'zbekiston uchun.", {
    x: 0.6, y: 5.0, w: 11, h: 0.5, fontFace: "Arial", fontSize: 18, color: MUTED,
  });
  s.addText("Pre-seed pitch · $20 000 · 12% · 18 oy · 2026", {
    x: 0.6, y: 6.6, w: 12, h: 0.4, fontFace: "Arial", fontSize: 12, color: AMBER, bold: true, charSpacing: 4,
  });
}

// ---------- Slide 2: Muammo ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "01 · MUAMMO"); title(s, "Odamlar o'zgara olmayapti");
  const items = [
    ["Motivatsiya yolg'on", "90% foydalanuvchi 3 haftada tashlab qo'yadi. Motivatsiya — o'zgaruvchi holat, tizim emas."],
    ["Umumiy maslahatlar", "YouTube va kitoblar shaxsiy kontekstni bilmaydi. \"Erta tur\" — kimga? qanday?"],
    ["Til va madaniyat bo'shlig'i", "O'zbek/rus tilida, mahalliy kontekstga moslashgan xulq-atvor mahsuloti yo'q."],
  ];
  items.forEach(([h, b], i) => {
    const x = 0.6 + i * 4.15; card(s, x, 2.5, 3.95, 3.8);
    s.addText(h, { x: x + 0.3, y: 2.75, w: 3.55, h: 0.7, fontFace: "Georgia", fontSize: 22, color: FG, bold: true });
    s.addText(b, { x: x + 0.3, y: 3.7, w: 3.55, h: 2.4, fontFace: "Arial", fontSize: 14, color: MUTED });
  });
  foot(s, 2);
}

// ---------- Slide 3: Yechim ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "02 · YECHIM"); title(s, "Self-Control OS — 4 bosqich");
  const steps = [
    ["01", "Tashxis", "60 soniyalik onboarding — trigger va ritm."],
    ["02", "Protokol", "Kunlik 3 mikro-qadam (BJ Fogg formulasi)."],
    ["03", "Takror", "Streak, XP, Shield — dopamin halqasi."],
    ["04", "AI mentor", "Nadir — foydalanuvchi ma'lumotlariga ega."],
  ];
  steps.forEach(([n, h, b], i) => {
    const x = 0.6 + i * 3.1; card(s, x, 2.5, 2.9, 3.8);
    s.addText(n, { x: x + 0.3, y: 2.7, w: 2.5, h: 0.5, fontFace: "Arial", fontSize: 11, color: AMBER, bold: true, charSpacing: 3 });
    s.addText(h, { x: x + 0.3, y: 3.2, w: 2.5, h: 0.7, fontFace: "Georgia", fontSize: 22, color: FG, bold: true });
    s.addText(b, { x: x + 0.3, y: 4.0, w: 2.5, h: 2.1, fontFace: "Arial", fontSize: 13, color: MUTED });
  });
  foot(s, 3);
}

// ---------- Slide 4: Ilmiy asos ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "03 · ISBOT"); title(s, "Nima uchun bu ishlaydi");
  const proofs = [
    ["BJ Fogg (Stanford)", "Tiny Habits", "Kichik hajm + trigger + tasdiq = odat."],
    ["James Clear", "1% kunlik", "37x yillik natija — mikro-o'sish kuchi."],
    ["Phillippa Lally (UCL)", "66 kun", "Odat shakllanishi diapazoni: 18–254 kun."],
    ["Wendy Wood (USC)", "43%", "Kunlik xulqning yarmi — ongsiz odat."],
  ];
  proofs.forEach(([src, claim, detail], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15, y = 2.5 + row * 2.05;
    card(s, x, y, 5.95, 1.85);
    s.addText(src, { x: x + 0.3, y: y + 0.15, w: 5.5, h: 0.4, fontFace: "Arial", fontSize: 10, color: AMBER, bold: true, charSpacing: 3 });
    s.addText(claim, { x: x + 0.3, y: y + 0.5, w: 5.5, h: 0.5, fontFace: "Georgia", fontSize: 20, color: FG, bold: true });
    s.addText(detail, { x: x + 0.3, y: y + 1.05, w: 5.5, h: 0.75, fontFace: "Arial", fontSize: 13, color: MUTED });
  });
  foot(s, 4);
}

// ---------- Slide 5: Bozor ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "04 · BOZOR"); title(s, "MDH + O'zbekiston");
  const m = [
    ["TAM", "$4.2B", "Global habit + wellness bozori (2025, Grand View)"],
    ["SAM", "$180M", "MDH + Turkiya — behavioral wellness segmenti"],
    ["SOM", "$2M", "O'zbekiston + Qozog'iston — 3 yillik realistik erishish"],
  ];
  m.forEach(([tag, val, desc], i) => {
    const x = 0.6 + i * 4.15; card(s, x, 2.6, 3.95, 3.5);
    s.addText(tag, { x: x + 0.3, y: 2.85, w: 3.5, h: 0.5, fontFace: "Arial", fontSize: 12, color: AMBER, bold: true, charSpacing: 4 });
    s.addText(val, { x: x + 0.3, y: 3.4, w: 3.5, h: 1.1, fontFace: "Georgia", fontSize: 44, color: FG, bold: true });
    s.addText(desc, { x: x + 0.3, y: 4.7, w: 3.5, h: 1.3, fontFace: "Arial", fontSize: 12, color: MUTED });
  });
  s.addText("MDH mintaqasida 90M+ smartfon foydalanuvchisi. O'zbek/rus tilida raqib deyarli yo'q.", {
    x: 0.6, y: 6.3, w: 12, h: 0.4, fontFace: "Arial", fontSize: 12, color: MUTED, italic: true,
  });
  foot(s, 5);
}

// ---------- Slide 6: Biznes modeli ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "05 · BIZNES MODELI"); title(s, "Freemium → Pro");
  const tiers = [
    ["Free", "0", "Onboarding, 3 odat, Nadir 10 xabar/kun.", false],
    ["Pro", "49 000 so'm/oy", "Cheksiz odat, tahlil, Nadir cheksiz.", true],
    ["Team", "Q3 2026", "B2B kompaniyalar uchun — kelajakda.", false],
  ];
  tiers.forEach(([n, p, b, hi], i) => {
    const x = 0.6 + i * 4.15; 
    if (hi) {
      s.addShape("roundRect", { x, y: 2.5, w: 3.95, h: 3.8, fill: { color: "1F1408" }, line: { color: AMBER, width: 2 }, rectRadius: 0.08 });
    } else {
      card(s, x, 2.5, 3.95, 3.8);
    }
    s.addText(n, { x: x + 0.3, y: 2.75, w: 3.5, h: 0.5, fontFace: "Arial", fontSize: 11, color: hi ? AMBER : MUTED, bold: true, charSpacing: 4 });
    s.addText(p, { x: x + 0.3, y: 3.3, w: 3.5, h: 0.9, fontFace: "Georgia", fontSize: 26, color: FG, bold: true });
    s.addText(b, { x: x + 0.3, y: 4.4, w: 3.5, h: 1.7, fontFace: "Arial", fontSize: 13, color: MUTED });
  });
  s.addText("Prognoz: 5–8% Free→Pro konversiya · ARPU 588 000 so'm/yil · Infra ~$50/oy", {
    x: 0.6, y: 6.5, w: 12, h: 0.4, fontFace: "Arial", fontSize: 11, color: MUTED, italic: true,
  });
  foot(s, 6);
}

// ---------- Slide 7: Traksiya — Halol ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "06 · HALOL HOLAT"); title(s, "Traksiya — hozir");
  const rows = [
    ["Mahsulot", "Beta — 14+ modul jonli (odat, jurnal, AI mentor, MCP, PWA)"],
    ["Foydalanuvchi", "Yopiq pilot. Ommaviy raqamlar hali e'lon qilinmagan — shaffoflik uchun"],
    ["Daromad", "$0 — hali monetizatsiya yo'q. Free ochiq, Pro Q1 2026"],
    ["Jamoa", "1 asoschi (mahsulot + injener + dizayn)"],
    ["Burn", "~$50/oy (Cloudflare + Supabase + AI). Deyarli 0 xarajat"],
  ];
  rows.forEach(([k, v], i) => {
    const y = 2.5 + i * 0.75; card(s, 0.6, y, 12.15, 0.65);
    s.addText(k, { x: 0.9, y: y + 0.1, w: 2.5, h: 0.5, fontFace: "Arial", fontSize: 12, color: AMBER, bold: true, charSpacing: 3 });
    s.addText(v, { x: 3.5, y: y + 0.1, w: 9, h: 0.5, fontFace: "Arial", fontSize: 14, color: FG });
  });
  foot(s, 7);
}

// ---------- Slide 8: Mahsulot ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "07 · MAHSULOT"); title(s, "Nima ishlab bo'lingan");
  const feats = [
    "60 soniyalik onboarding (10 savol → profil)",
    "Nadir AI mentor — profil kontekstiga ega chat",
    "Odat + XP + Streak + Shield tizimi",
    "Cirkadiy jadval (kun ritmiga bog'liq vazifalar)",
    "Burnout detection — proaktiv AI ogohlantirish",
    "Kundalik + haftalik AI hisobot",
    "3 til (Uz, Ru, En) — MDH uchun tayyor",
    "PWA — offline ishlaydi, App Store'ga bog'liq emas",
    "MCP integratsiya — ChatGPT/Claude ulanishi",
    "RLS + JWT + OAuth 2.1 — enterprise xavfsizlik",
  ];
  feats.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15, y = 2.4 + row * 0.75;
    s.addShape("ellipse", { x: x + 0.2, y: y + 0.2, w: 0.2, h: 0.2, fill: { color: AMBER }, line: { color: AMBER } });
    s.addText(f, { x: x + 0.6, y: y, w: 5.4, h: 0.6, fontFace: "Arial", fontSize: 13, color: FG });
  });
  foot(s, 8);
}

// ---------- Slide 9: Raqobat ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "08 · POZITSIYA"); title(s, "Nima uchun biz");
  const cmp = [
    ["Fabulous / Headspace", "Inglizcha, G'arb kontekst, umumiy AI yo'q", "Uz/Ru til, mahalliy kontekst, shaxsiy AI"],
    ["Notion / Todoist", "Vazifa boshqarish, xulq-atvor yo'q", "Behavioral science — odat shakllantirish"],
    ["Google Fit / Yandex", "Faqat ma'lumot, aksiya yo'q", "Kunlik protokol + AI mentor"],
  ];
  card(s, 0.6, 2.5, 12.15, 4);
  s.addText("Raqib", { x: 0.9, y: 2.7, w: 3.5, h: 0.4, fontFace: "Arial", fontSize: 11, color: AMBER, bold: true, charSpacing: 3 });
  s.addText("Cheklov", { x: 4.7, y: 2.7, w: 4, h: 0.4, fontFace: "Arial", fontSize: 11, color: AMBER, bold: true, charSpacing: 3 });
  s.addText("Life Order farqi", { x: 8.9, y: 2.7, w: 3.8, h: 0.4, fontFace: "Arial", fontSize: 11, color: AMBER, bold: true, charSpacing: 3 });
  cmp.forEach(([r, l, d], i) => {
    const y = 3.2 + i * 1.05;
    s.addShape("line", { x: 0.9, y: y - 0.05, w: 11.7, h: 0, line: { color: BORDER, width: 0.5 } });
    s.addText(r, { x: 0.9, y: y, w: 3.7, h: 0.9, fontFace: "Georgia", fontSize: 15, color: FG, bold: true });
    s.addText(l, { x: 4.7, y: y, w: 4.1, h: 0.9, fontFace: "Arial", fontSize: 12, color: MUTED });
    s.addText(d, { x: 8.9, y: y, w: 3.8, h: 0.9, fontFace: "Arial", fontSize: 12, color: FG });
  });
  foot(s, 9);
}

// ---------- Slide 10: SO'ROV — ASK ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "09 · SO'ROV"); title(s, "Pre-seed investitsiya");
  // Big three
  const t = [["$20 000", "Miqdor"], ["12%", "Ulush"], ["18 oy", "Runway"]];
  t.forEach(([v, l], i) => {
    const x = 0.6 + i * 4.15;
    s.addShape("roundRect", { x, y: 2.5, w: 3.95, h: 2.2, fill: { color: "1F1408" }, line: { color: AMBER, width: 2 }, rectRadius: 0.08 });
    s.addText(v, { x: x + 0.3, y: 2.7, w: 3.5, h: 1.2, fontFace: "Georgia", fontSize: 52, color: AMBER, bold: true, align: "center" });
    s.addText(l, { x: x + 0.3, y: 3.95, w: 3.5, h: 0.5, fontFace: "Arial", fontSize: 12, color: MUTED, bold: true, charSpacing: 4, align: "center" });
  });
  // Distribution
  s.addText("TAQSIMOT (18 OY)", { x: 0.6, y: 5.0, w: 12, h: 0.4, fontFace: "Arial", fontSize: 11, color: AMBER, bold: true, charSpacing: 4 });
  const dist = [
    "40% · $8 000 — Marketing va foydalanuvchi jalb qilish",
    "25% · $5 000 — AI, infratuzilma, servis xarajatlari",
    "20% · $4 000 — Kontraktor (dizayn/injener yordami)",
    "10% · $2 000 — Yuridik, ro'yxatdan o'tish, litsenziyalar",
    "5%  · $1 000 — Zaxira / kutilmagan xarajat",
  ];
  dist.forEach((d, i) => {
    s.addText(d, { x: 0.9, y: 5.45 + i * 0.28, w: 11, h: 0.28, fontFace: "Arial", fontSize: 12, color: FG });
  });
  s.addText("Baholov: ~$167K post-money. Bir martalik pre-seed, SAFE yoki equity.", {
    x: 0.6, y: 7.0, w: 12, h: 0.3, fontFace: "Arial", fontSize: 11, color: MUTED, italic: true,
  });
  foot(s, 10);
}

// ---------- Slide 11: Roadmap ----------
{
  const s = pres.addSlide(); base(s);
  eyebrow(s, "10 · ROADMAP"); title(s, "18 oylik yo'l xarita");
  const rmp = [
    ["0–3 oy", "Public launch · Uzbekistonda beta yopiq guruhdan chiqish · SEO"],
    ["3–6 oy", "1 000 faol foydalanuvchi · Pro tarif (Click/Payme)"],
    ["6–12 oy", "5 000 foydalanuvchi · Birinchi $1K MRR · Rus versiya"],
    ["12–18 oy", "B2B pilot (2–3 kompaniya) · Seed/Series A metrikalar"],
  ];
  rmp.forEach(([p, m], i) => {
    const y = 2.5 + i * 1.0; card(s, 0.6, y, 12.15, 0.9);
    s.addText(p, { x: 0.9, y: y + 0.2, w: 2.2, h: 0.5, fontFace: "Georgia", fontSize: 20, color: AMBER, bold: true });
    s.addText(m, { x: 3.3, y: y + 0.2, w: 9.2, h: 0.5, fontFace: "Arial", fontSize: 14, color: FG });
  });
  s.addText("Prognoz, kafolat emas. Har chorak — investorga hisobot.", {
    x: 0.6, y: 6.7, w: 12, h: 0.3, fontFace: "Arial", fontSize: 11, color: MUTED, italic: true,
  });
  foot(s, 11);
}

// ---------- Slide 12: Contact ----------
{
  const s = pres.addSlide(); base(s);
  s.addText("Suhbat", { x: 0.6, y: 2.5, w: 12, h: 1.2, fontFace: "Georgia", fontSize: 66, color: FG, bold: true });
  s.addText("30 daqiqa — demo, savol-javob, batafsil model.", {
    x: 0.6, y: 3.8, w: 12, h: 0.5, fontFace: "Arial", fontSize: 18, color: MUTED,
  });
  s.addShape("roundRect", { x: 0.6, y: 4.8, w: 6, h: 1.4, fill: { color: CARD }, line: { color: BORDER, width: 1 }, rectRadius: 0.08 });
  s.addText("EMAIL", { x: 0.9, y: 5.0, w: 5, h: 0.3, fontFace: "Arial", fontSize: 10, color: AMBER, bold: true, charSpacing: 4 });
  s.addText("investors@life-order.uz", { x: 0.9, y: 5.35, w: 5.4, h: 0.7, fontFace: "Georgia", fontSize: 22, color: FG, bold: true });
  s.addShape("roundRect", { x: 6.9, y: 4.8, w: 6, h: 1.4, fill: { color: CARD }, line: { color: BORDER, width: 1 }, rectRadius: 0.08 });
  s.addText("WEB", { x: 7.2, y: 5.0, w: 5, h: 0.3, fontFace: "Arial", fontSize: 10, color: AMBER, bold: true, charSpacing: 4 });
  s.addText("life-orderuz.lovable.app", { x: 7.2, y: 5.35, w: 5.4, h: 0.7, fontFace: "Georgia", fontSize: 22, color: FG, bold: true });
  s.addText("Life Order · 2026 · Toshkent, O'zbekiston", {
    x: 0.6, y: 7.05, w: 12, h: 0.3, fontFace: "Arial", fontSize: 10, color: MUTED, charSpacing: 3,
  });
}

await pres.writeFile({ fileName: "public/investor/life-order-deck.pptx" });
console.log("OK deck");
