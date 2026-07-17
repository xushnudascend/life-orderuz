import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/hayot-sohalari";
const TITLE = "Hayotning 8 sohasi — odat qurish qo'llanmasi";
const DESCRIPTION =
  "Hayotning 8 asosiy sohasi: sog'liq, karyera, ruhiy holat, munosabatlar va boshqalar — odat qurishda muvozanat uchun qo'llanma.";

const AREAS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Sog'liq va fizik holat", body: "Uyqu, ovqatlanish, harakat. Kunlik 20 daqiqa yurish yoki 10 daqiqa cho'zilish — asos." },
  { n: "02", title: "Ruhiy salomatlik", body: "Meditatsiya, journal, stress bilan ishlash. Kuniga 5 daqiqa nafas mashqi ko'p narsani o'zgartiradi." },
  { n: "03", title: "Karyera va kasb", body: "Ko'nikmalar, portfolio, tarmoqlashtirish. Haftada bitta yangi narsa o'rganish." },
  { n: "04", title: "Moliya", body: "Byudjet, jamg'arma, investitsiya. Har oy daromadning 10% ini chetga qo'yish." },
  { n: "05", title: "Munosabatlar", body: "Oila, do'stlar, sherik. Haftada bitta chuqur suhbat rejalashtirilgan bo'lsin." },
  { n: "06", title: "Shaxsiy o'sish", body: "Kitob, kurs, refleksiya. Kuniga 20 daqiqa kitob yoki podkast." },
  { n: "07", title: "Dam olish va o'yin", body: "Hobbi, sport, ijod. Ekran vaqtidan tashqari faoliyat majburiy." },
  { n: "08", title: "Muhit va tartib", body: "Uy, ish stoli, raqamli tozalik. Haftada bir marta 15 daqiqa tartibga solish." },
];

export const Route = createFileRoute("/blog/hayot-sohalari")({
  head: () => ({
    meta: [
      { title: `${TITLE} · Life Order` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "og:image", content: `${SITE_URL}/og/blog-hayot-sohalari.jpg` },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:image", content: `${SITE_URL}/og/blog-hayot-sohalari.jpg` },
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
          image: `${SITE_URL}/og/blog-hayot-sohalari.jpg`,
        }),
      },
    ],
  }),
  component: AspectsGuide,
});

function AspectsGuide() {
  return (
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg font-bold tracking-tight">
            Life Order
          </Link>
          <Link to="/auth" className="font-ui text-sm text-muted-foreground hover:text-foreground">
            Boshlash
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-14">
        <article className="prose prose-invert max-w-none">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Qo'llanma · 5 daqiqa o'qish
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">{TITLE}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            Odat qurishda eng katta xato — bitta yo'nalishga haddan tashqari e'tibor berish. Hayot 8 asosiy sohaga bo'linadi; muvozanatli o'sish uchun har bir sohaga kichik qadam kerak.
          </p>

          <div className="mt-12 grid gap-4">
            {AREAS.map((a) => (
              <section key={a.n} className="rounded-[var(--radius)] border border-border/60 bg-card/40 p-6">
                <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">{a.n}</p>
                <h2 className="mt-3 font-serif text-2xl">{a.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.body}</p>
              </section>
            ))}
          </div>

          <h2 className="mt-14 font-serif text-2xl">Qanday amalda qo'llash?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Life Order'da har kuni uchta missiya olasan. Ularni turli sohalardan tanla — masalan, bittasi sog'liq, bittasi shaxsiy o'sish, bittasi munosabatlardan. Bu tizim 60 kun ichida barcha sohalarda o'sishni ta'minlaydi.
          </p>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">Bugundan boshla</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">
              Bepul. Kartasiz. 60 soniyada tashxis.
            </p>
            <Link
              to="/auth"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-ui text-sm font-semibold text-primary-foreground"
            >
              Boshlash
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
