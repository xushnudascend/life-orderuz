import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/best-habit-tracker-apps";
const TITLE = "Eng yaxshi habit tracker ilovalar 2026";
const DESCRIPTION =
  "Habitify, Productive, Habitica, Streaks va Life Order — 2026 yildagi eng yaxshi habit tracker ilovalar. Xususiyatlari, narxi va xulq-atvor fani asosidagi solishtiruv.";

const apps = [
  {
    name: "Habitify",
    strength: "Toza UI, statistika",
    weakness: "Motivatsiya tugashiga qarshi mexanizm yo'q",
    price: "Freemium",
    science: "Yo'q",
  },
  {
    name: "Productive",
    strength: "Chiroyli dizayn, eslatmalar",
    weakness: "Faqat kuzatuv — xatti-harakat dizayni yo'q",
    price: "Pullik",
    science: "Yo'q",
  },
  {
    name: "Habitica",
    strength: "Geymifikatsiya, RPG mexanikasi",
    weakness: "O'yin tugagach — odat ham tugaydi",
    price: "Freemium",
    science: "Qisman (mukofot ilmigacha)",
  },
  {
    name: "Streaks",
    strength: "Apple ekotizimi, minimalist",
    weakness: "Streakni yo'qotish → tashlab yuborish",
    price: "Bir martalik $5",
    science: "Yo'q",
  },
  {
    name: "Life Order",
    strength: "B=MAP, CBT, streak-shield, AI mentor",
    weakness: "O'zbek tilida (global tarjima kutilmoqda)",
    price: "Free + Pro (29 000 so'm/oy)",
    science: "Ha — BJ Fogg, James Clear, Lally (2010)",
  },
];

export const Route = createFileRoute("/blog/best-habit-tracker-apps")({
  head: () => ({
    meta: [
      { title: `${TITLE} · Life Order` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "twitter:card", content: "summary_large_image" },
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
          about: ["habit tracker", "behavior design", "comparison"],
        }),
      },
    ],
  }),
  component: BestHabitTrackerApps,
});

function BestHabitTrackerApps() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Eng yaxshi habit tracker ilovalar — 2026 taqqoslash
          </h1>
          <p className="mt-4 text-muted-foreground">
            Habit tracker tanlash — bu shunchaki UI tanlash emas. Bu qaysi xulq-atvor
            modeliga ishonish masalasi. Quyida 2026 yilning eng ko'p ishlatiladigan
            5 ta ilovasini xulq-atvor fani nuqtai nazaridan solishtirdik.
          </p>

          <h2 className="mt-10 text-2xl font-semibold">Qisqacha solishtirish</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-3">Ilova</th>
                  <th className="p-3">Kuchli tomoni</th>
                  <th className="p-3">Zaif tomoni</th>
                  <th className="p-3">Narxi</th>
                  <th className="p-3">Ilmiy asos</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.name} className="border-t border-border">
                    <td className="p-3 font-medium">{a.name}</td>
                    <td className="p-3 text-muted-foreground">{a.strength}</td>
                    <td className="p-3 text-muted-foreground">{a.weakness}</td>
                    <td className="p-3 text-muted-foreground">{a.price}</td>
                    <td className="p-3 text-muted-foreground">{a.science}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-2xl font-semibold">Motivatsiya tuzog'i</h2>
          <p className="mt-3 text-muted-foreground">
            Ko'pchilik habit tracker faqat <strong>kuzatadi</strong> — lekin
            motivatsiya tabiiy ravishda tebranadi (Fogg, 2019). Ilova sizga
            &ldquo;bugun bajarding&rdquo; deb belgi qo'yishga imkon beradi, ammo
            motivatsiya tushganda nima qilishni bilmaydi. Natijada: 30 kundan
            keyin ilovani ochish o'zi odatga aylanadi, harakat esa yo'q.
          </p>

          <h2 className="mt-6 text-2xl font-semibold">B=MAP: nima farq qiladi</h2>
          <p className="mt-3 text-muted-foreground">
            BJ Fogg formulasi: <em>Xatti-harakat = Motivatsiya × Qobiliyat × Turtki</em>.
            Life Order motivatsiya tushganda <strong>Qobiliyat</strong>ni oshiradi —
            odatni kichraytiradi (2 daqiqa qoidasi), <strong>Turtki</strong>ni
            kontekstga bog'laydi (habit stacking) va streak yo'qolganda
            <em> shield</em> beradi. Shu sababli 66 kunlik avtomatlashuv oynasidan
            (Lally, 2010) o'tish ehtimoli yuqoriroq.
          </p>

          <h2 className="mt-6 text-2xl font-semibold">Qaysi birini tanlash kerak?</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <strong>Faqat kuzatuv kerak</strong> → Habitify yoki Streaks.
            </li>
            <li>
              <strong>O'yin elementi yoqadi</strong> → Habitica (lekin motivatsiya
              tugashi xavfli).
            </li>
            <li>
              <strong>Xulq-atvor tizimi kerak</strong> → Life Order. Sabab: shunchaki
              belgilash emas, motivatsiya tugagach ham ishlaydigan protokol.
            </li>
          </ul>

          <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-semibold">Life Order&apos;ni sinab ko'ring</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Free rejada 3 ta odat va kunlik jurnal. B=MAP asosida qurilgan.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Bepul boshlash →
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Manbalar: Fogg BJ. <em>Tiny Habits</em> (2019). Clear J.{" "}
            <em>Atomic Habits</em> (2018). Lally P. et al.{" "}
            <em>How are habits formed</em>. Eur J Soc Psychol (2010).
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
