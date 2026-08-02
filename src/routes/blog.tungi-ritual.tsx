import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/tungi-ritual";
const TITLE = "Tungi ritual — miyani tinchlantirish va uyquga tayyorlash";
const DESCRIPTION =
  "Sirkadiy ritm bo'yicha kechqurun tayyorgarlik uyqu sifatini 30-40% oshiradi. Ekran, harorat, yorug'lik — nima ta'sir qiladi va nima qilish kerak.";

export const Route = createFileRoute("/blog/tungi-ritual")({
  head: () => ({
    meta: [
      { title: `${TITLE} · Life Order` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "og:image", content: `${SITE_URL}/og/blog-tungi-ritual.jpg` },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:image", content: `${SITE_URL}/og/blog-tungi-ritual.jpg` },
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
          image: `${SITE_URL}/og/blog-tungi-ritual.jpg`,
        }),
      },
    ],
  }),
  component: NightRitual,
});

const STEPS: { time: string; title: string; body: string }[] = [
  {
    time: "21:00",
    title: "Ekran haroratini pasaytir",
    body: "Ko'k yorug'lik melatoninni 50%gacha bostiradi (Harvard, 2015). Night Shift / f.lux yoqing. Telefonni boshqa xonaga qo'ying.",
  },
  {
    time: "21:30",
    title: "Xonani sovut",
    body: "Ideal uyqu harorati 16-19°C. Isitilgan tanada uyqu fazasi kechikadi. Deraza oching yoki kondisioner sozlang.",
  },
  {
    time: "22:00",
    title: "Yorug'likni kamaytir",
    body: 'Faqat iliq (sariq) chiroqlar. Yotoqxonada bosh chiroqni butunlay o\'chiring. Miya "kun tugadi" signalini oladi.',
  },
  {
    time: "22:15",
    title: "Yozma refleksiya (3 daqiqa)",
    body: 'Bugun 3 muvaffaqiyat, ertaga 1 asosiy vazifa. Miya "tugallanmagan ish" halqasidan chiqadi (Zeigarnik effekti).',
  },
  {
    time: "22:30",
    title: "Nafas 4-7-8",
    body: "4 soniya nafas — 7 soniya ushlash — 8 soniya chiqarish. Parasimpatik tizimni faollashtiradi. 3-4 marta yetadi.",
  },
];

function NightRitual() {
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
            Protokol · 5 daqiqa
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            Uyqusizlik motivatsiya, xotira va irodalilikning eng katta dushmani. Yaxshi xabar:
            uyquga 90 daqiqa oldin boshlanadigan aniq ritual sifatni sezilarli oshiradi. Bu —
            laboratoriya emas, real hayotda ishlaydigan 90-daqiqalik jadval.
          </p>

          <div className="mt-12 grid gap-4">
            {STEPS.map((s) => (
              <section
                key={s.time}
                className="rounded-[var(--radius)] border border-border/60 bg-card/40 p-6"
              >
                <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary tabular-nums">
                  {s.time}
                </p>
                <h2 className="mt-3 font-serif text-2xl">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </section>
            ))}
          </div>

          <h2 className="mt-14 font-serif text-2xl">Nima qilma</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-muted-foreground">
            <li>
              • <strong>21:00dan keyin kofein.</strong> Yarim umri 5-7 soat — tunda ham qonda.
            </li>
            <li>
              • <strong>Kechki mashg'ulot.</strong> Intensiv sport — kortizolni ko'taradi, uyquni
              orqaga suradi.
            </li>
            <li>
              • <strong>Katta ovqat.</strong> Yotishdan 3 soat oldin oxirgi ovqat.
            </li>
            <li>
              • <strong>Yangilikni telefondan o'qish.</strong> Miyaga stress signali. Kitob yoki
              ovozli podkast — yaxshiroq.
            </li>
          </ul>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">Tungi ritualni sinab ko'r</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">
              Life Order ushbu protokolni sizning ritmingiz asosida qurib beradi.
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
