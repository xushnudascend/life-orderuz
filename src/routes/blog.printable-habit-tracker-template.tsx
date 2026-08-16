import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/printable-habit-tracker-template";
const TITLE = "Printable Habit Tracker Template (PDF)";
const DESCRIPTION =
  "Bepul chop etiladigan habit tracker shabloni (PDF). 30-kun grid, 66-kun sprint va haftalik reflect varag'i — ilmiy asosda tuzilgan.";

// Data URL — kichik, lekin haqiqiy PDF: 1 sahifalik "Habit Tracker" shabloni.
// Foydalanuvchi <a download> orqali yuklab olishi mumkin — server yuki yo'q.
const PDF_HREF =
  "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjMgMCBvYmoKPDwvTGVuZ3RoIDIzMD4+CnN0cmVhbQpCVAovRjEgMTggVGYKNzIgNzgwIFRkCihMaWZlIE9yZGVyIC0tIEhhYml0IFRyYWNrZXIpIFRqCjAgLTM2IFRkCi9GMSAxMiBUZgooMzAta3VuIGdyaWQuIEt1biAvIE9kYXQgLyBHYWxvY2hrYS4pIFRqCjAgLTI0IFRkCihNYWtzaW1hbCAzIG9kYXQuIEJvc2ggcXVyb2xpbmc6IDIgZGFxaXFhLikgVGoKMCAtMjQgVGQKKDY2LWt1biBzcHJpbnQgOiA3IC8gMjEgLyA2NiAvIDEwMCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1s0IDAgUl0+PgplbmRvYmoKNCAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+L0NvbnRlbnRzIDMgMCBSPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMzMwIDAwMDAwIG4KMDAwMDAwMDM3NSAwMDAwMCBuCjAwMDAwMDAwMTUgMDAwMDAgbgowMDAwMDAwNDIzIDAwMDAwIG4KMDAwMDAwMDUyNiAwMDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKNTkyCiUlRU9G";

export const Route = createFileRoute("/blog/printable-habit-tracker-template")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "og:image", content: `${SITE_URL}/og/blog-printable-habit-tracker-template.jpg` },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:image", content: `${SITE_URL}/og/blog-printable-habit-tracker-template.jpg` },
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
          about: ["habit tracker printable", "printable pdf", "habit template"],
        }),
      },
    ],
  }),
  component: PrintableTemplate,
});

function PrintableTemplate() {
  return (
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <article className="prose prose-invert max-w-none">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Shablon · 4 daqiqa · Bepul PDF
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            Ba'zan qog'oz raqamlidan kuchli. Qog'ozdagi galochka miyaning motor korteksini yoqadi va
            odat izini chuqurroq qoldiradi (Mueller &amp; Oppenheimer, 2014). Quyida bepul, chop
            etiladigan Life Order habit tracker shabloni.
          </p>

          <div className="mt-8 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">30-kun grid + 66-kun sprint</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">
              1 sahifa · A4 · Kartasiz · Ro'yxatdan o'tishsiz
            </p>
            <a
              href={PDF_HREF}
              download="life-order-habit-tracker.pdf"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-ui text-sm font-semibold text-primary-foreground"
            >
              PDF yuklab olish
            </a>
          </div>

          <h2 className="mt-12 font-serif text-2xl">Qanday ishlatiladi</h2>
          <ol className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
            <li>
              <strong>1.</strong> Maksimal 3 ta odatni tanlang. Har biri "kulgili darajada oson"
              (Fogg, 2019).
            </li>
            <li>
              <strong>2.</strong> Har kuni galochka qo'ying — jismonan, qo'l bilan. Zanjir
              uzilmasin.
            </li>
            <li>
              <strong>3.</strong> Bir kun tashlab qo'ysangiz — davom eting. Ikki kun — Shield
              ishlating.
            </li>
            <li>
              <strong>4.</strong> 7 / 21 / 66 / 100 kunlarni belgilang: bu neyrobiologik bosqichlar.
            </li>
          </ol>

          <h2 className="mt-10 font-serif text-2xl">Nima uchun qog'oz + raqamli birga kuchli</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Qog'oz — <strong>ritual</strong> va <strong>haptik izi</strong>. Raqamli —{" "}
            <strong>analitika</strong>, <strong>eslatma</strong> va
            <strong> AI mentor</strong>. Ikkalasi bir vaqtda quloqning ikkala kanalidek — signal
            ikki barobar aniq keladi.
          </p>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">Raqamli versiyasi — bepul</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">
              Streak, Shield, Nadir AI mentor, haftalik hisobot.
            </p>
            <Link
              to="/auth"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-ui text-sm font-semibold text-primary-foreground"
            >
              Life Order'ga kirish
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
