import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://life-orderuz.lovable.app";
const TITLE = "Blog — xulq-atvor fani va odat protokollari";
const DESCRIPTION =
  "Life Order blogi: real tadqiqotlarga asoslangan protokollar. 66 kun qoidasi, uyqu ritmi, motivatsiya tuzog'i va boshqalar.";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  minutes: number;
  tag: string;
};

const POSTS: Post[] = [
  {
    slug: "66-kun-qoidasi",
    title: "66 kun qoidasi — odat qachon avtomatlashadi",
    excerpt:
      "UCL 2010 tadqiqoti: odat o'rtacha 66 kunda avtomatlashadi. Nima uchun 21 kun afsona — va nima ishlaydi.",
    minutes: 6,
    tag: "Ilmiy asos",
  },
  {
    slug: "motivatsiya-tuzogi",
    title: "Motivatsiya tuzog'i — nima uchun \"ertadan boshlayman\" ishlamaydi",
    excerpt:
      "Motivatsiya — o'zgaruvchan holat, tizim doim. BJ Fogg B=MAP formulasi va Kahneman ikki tizim modeli.",
    minutes: 7,
    tag: "Xulq-atvor",
  },
  {
    slug: "tungi-ritual",
    title: "Tungi ritual — miyani tinchlantirish va uyquga tayyorlash",
    excerpt:
      "90-daqiqalik protokol: ekran harorati, xona harorati, yorug'lik va nafas — sirkadiy ritmga mos.",
    minutes: 5,
    tag: "Protokol",
  },
  {
    slug: "hayot-sohalari",
    title: "Hayot sohalari — 8 kompas o'qi",
    excerpt:
      "Sog'liq, ish, aloqalar, o'sish — Life Order'ning hayot xaritasi. Har soha o'z pretsedenti bilan.",
    minutes: 4,
    tag: "Falsafa",
  },
];

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `${TITLE} · Life Order` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-primary">Blog</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Tizim quruvchilarga o'qish
        </h1>
        <p className="mt-4 max-w-2xl font-ui text-muted-foreground leading-relaxed">
          Har maqola real tadqiqot va tajribaga asoslangan. Motivatsion iqtiboslar emas — amaliy protokollar.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {POSTS.map((p) => (
            <a
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-[var(--radius)] border border-border/60 bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card/60"
            >
              <div className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.22em] text-primary">
                <span>{p.tag}</span>
                <span aria-hidden>·</span>
                <span className="text-muted-foreground">{p.minutes} daq</span>
              </div>
              <h2 className="mt-3 font-serif text-xl leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                {p.title}
              </h2>
              <p className="mt-3 font-ui text-sm leading-relaxed text-muted-foreground text-pretty">
                {p.excerpt}
              </p>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
