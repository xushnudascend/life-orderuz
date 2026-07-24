import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/motivatsiya-tuzogi";
const TITLE = "Motivatsiya tuzog'i — nega \"ertadan\" ishlamaydi";
const DESCRIPTION =
  "Motivatsiya — o'zgaruvchan holat. Tizim doim. BJ Fogg B=MAP formulasi va Kahneman ikki tizim modeli asosida — nima uchun rejalar buzila va nima ishlaydi.";

export const Route = createFileRoute("/blog/motivatsiya-tuzogi")({
  head: () => ({
    meta: [
      { title: `${TITLE} · Life Order` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "og:image", content: `${SITE_URL}/og/blog-motivatsiya.jpg` },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:image", content: `${SITE_URL}/og/blog-motivatsiya.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}${PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          inLanguage: "uz-UZ",
          author: { "@type": "Organization", name: "Life Order" },
          publisher: { "@type": "Organization", name: "Life Order" },
          mainEntityOfPage: `${SITE_URL}${PATH}`,
          image: `${SITE_URL}/og/blog-motivatsiya.jpg`,
        }),
      },
    ],
  }),
  component: MotivationTrap,
});

function MotivationTrap() {
  return (
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg font-bold tracking-tight">Life Order</Link>
          <Link to="/auth" className="font-ui text-sm text-muted-foreground hover:text-foreground">Boshlash</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-14">
        <article className="prose prose-invert max-w-none">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Xulq-atvor fani · 7 daqiqa</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">{TITLE}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            Har yil 1-yanvar. Har hafta dushanba. "Ertadan boshlayman" — va 3-hafta oxirida yana hech narsa qolmaydi. Bu — irodasizlik emas. Bu — motivatsiyaga ortiqcha ishonch.
          </p>

          <h2 className="mt-12 font-serif text-2xl">Motivatsiya — bu holat, xarakter emas</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            BJ Fogg (Stanford) o'ttiz yillik tadqiqotda aniq isbotladi: motivatsiya darajasi kun davomida <strong>o'nlab marta o'zgaradi</strong>. Ertalab 10 — kechqurun 3. Charchagan holatda — nolga tushishi mumkin. Reja motivatsiyaga tayansa — u charchagan momentda buziladi.
          </p>

          <h2 className="mt-10 font-serif text-2xl">B=MAP formulasi</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Xulq (Behavior) = Motivatsiya (M) × Qobiliyat (Ability) × Turtki (Prompt). Uchtasi bir vaqtda kerak. Motivatsiya past bo'lsa — <strong>qobiliyat</strong>ni oshirish shart (harakatni oson qilish). Bu Life Order'ning butun falsafasi.
          </p>

          <div className="mt-10 grid gap-3">
            <div className="rounded-[var(--radius)] border border-border/60 bg-card/40 p-5">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">Yomon</p>
              <p className="mt-2 font-serif text-lg">"Ertadan 1 soat yuguraman"</p>
              <p className="mt-1 font-ui text-sm text-muted-foreground">M kerak — juda katta. 3 kunda tashlab yuboriladi.</p>
            </div>
            <div className="rounded-[var(--radius)] border border-primary/40 bg-card/40 p-5">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">Yaxshi</p>
              <p className="mt-2 font-serif text-lg">"Nonushtadan keyin 5 daqiqa yuraman"</p>
              <p className="mt-1 font-ui text-sm text-muted-foreground">Trigger aniq (nonushtadan keyin). Hajm kichik (5 daqiqa). Motivatsiya kerak emas.</p>
            </div>
          </div>

          <h2 className="mt-10 font-serif text-2xl">Ikki tizim — Kahneman</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Miyada ikki tizim ishlaydi: Tizim 1 (avtomatik, tez, energiyasiz) va Tizim 2 (ongli, sekin, energiya talab). Reja Tizim 2'da yaratiladi — energiya bor payt. Amalga oshirish esa Tizim 1'ga topshirilishi kerak. Buning yagona yo'li — <strong>takrorlash orqali avtomatlashtirish</strong> (66 kun qoidasi haqida ham bor).
          </p>

          <h2 className="mt-10 font-serif text-2xl">Amalda nima qilish kerak</h2>
          <ol className="mt-3 space-y-2 leading-relaxed text-muted-foreground list-decimal pl-6">
            <li>Odatni <strong>eng kichik shaklda</strong> aniqla. "Har kuni bitta tirshak-bosish" ham bo'ladi.</li>
            <li>Aniq <strong>trigger</strong> yasa. "Tishimni yuvgandan keyin" — "kunning istalgan vaqti" emas.</li>
            <li>Har muvaffaqiyatdan keyin <strong>darhol nishonla</strong> (Fogg buni "Celebration" deydi). Miya bog'lanishni tez o'rganadi.</li>
            <li>Uzilishda o'zingni <strong>tanqid qilma</strong>. Ertadan davom et.</li>
          </ol>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">Tizim quruvchi mahsulot</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">Life Order motivatsiyaga tayanmaydi. Fogg formulasi bo'yicha odat quradi.</p>
            <Link to="/auth" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-ui text-sm font-semibold text-primary-foreground">Boshlash</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
