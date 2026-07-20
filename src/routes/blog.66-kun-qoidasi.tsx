import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/66-kun-qoidasi";
const TITLE = "66 kun qoidasi — odat qachon avtomatlashadi";
const DESCRIPTION =
  "Phillippa Lally (UCL, 2010) tadqiqoti: odat o'rtacha 66 kunda avtomatlashadi. Diapazon 18–254 kun. Nega 21 kun afsona — va nima ishlaydi.";

export const Route = createFileRoute("/blog/66-kun-qoidasi")({
  head: () => ({
    meta: [
      { title: `${TITLE} · Life Order` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "og:image", content: `${SITE_URL}/og/blog-66-kun.jpg` },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:image", content: `${SITE_URL}/og/blog-66-kun.jpg` },
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
          image: `${SITE_URL}/og/blog-66-kun.jpg`,
        }),
      },
    ],
  }),
  component: SixtySixDays,
});

function SixtySixDays() {
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
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Ilmiy asos · 6 daqiqa</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">{TITLE}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            "21 kunda odat quriladi" — bu afsona. Aslida London Universiteti kolleji tadqiqoti (Lally va boshq., 2010) o'rtacha vaqtni <strong>66 kun</strong> deb topgan. Ba'zilarga 18 kun yetadi, boshqalarga 254 kun kerak. Farq nimadan kelib chiqadi?
          </p>

          <h2 className="mt-12 font-serif text-2xl">Tadqiqot nima ko'rsatgan</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            96 ta ishtirokchi 12 hafta davomida bir xil sharoitda bir xil xatti-harakatni takrorlagan (masalan, tushlikdan keyin meva yeyish). Har kuni o'z his-tuyg'ularini yozib borgan: "avtomatlashdimi?", "kuch talab qildimi?". Egrilik chizig'i shakli aniq: <strong>boshida tez o'sish</strong>, keyin platoga chiqish. O'rtacha nuqta — 66-kun.
          </p>

          <h2 className="mt-10 font-serif text-2xl">Nima uchun diapazon shunchalik keng</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-muted-foreground">
            <li>• <strong>Murakkablik.</strong> "Bir stakan suv ichish" — 20 kun. "20 daqiqa yugurish" — 100+ kun.</li>
            <li>• <strong>Trigger aniqligi.</strong> Bir xil vaqt, bir xil kontekst = tez o'rganish.</li>
            <li>• <strong>Uzilishlar.</strong> Bir kunni tashlab qo'ysang — dunyo qulamaydi. Ikki kun ketma-ket tashlab qo'ysang — halqa buziladi.</li>
            <li>• <strong>Dopamin qaytalanish.</strong> Har muvaffaqiyatdan keyin miya "tasdiq" olishi kerak.</li>
          </ul>

          <h2 className="mt-10 font-serif text-2xl">Amaliy xulosa</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            21 kun — bu shunchaki boshlanish. 66 kun — bu maqsad. Life Order aynan shu diapazonda ishlaydi: <strong>7 kunlik sprint</strong> (issiqroq bosqich) yoki <strong>30 kunlik reset</strong> (chuqurroq singdirish). Har kunlik 3 mikro-vazifa, streak, Shield tizimi — bu 66 kunga yetib borish uchun mo'ljallangan.
          </p>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6">
            <p className="font-serif text-xl">Manba</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">
              Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., &amp; Wardle, J. (2010). <em>How are habits formed: Modelling habit formation in the real world.</em> European Journal of Social Psychology, 40(6), 998–1009.
            </p>
          </div>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">Bugundan boshla</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">Bepul. Kartasiz. 60 soniyada tashxis.</p>
            <Link to="/auth" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-ui text-sm font-semibold text-primary-foreground">Boshlash</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
