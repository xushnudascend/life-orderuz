import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/habit-tracker-guide";
const TITLE = "Habit Tracker Guide — odat kuzatuvining ilmiy asosi";
const DESCRIPTION =
  "Habit tracker nima uchun ishlaydi: BJ Fogg B=MAP, James Clear Atomic Habits va Lally (2010) 66 kun qoidasi. Life Order tizimi bilan amaliy protokol.";

export const Route = createFileRoute("/blog/habit-tracker-guide")({
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
          about: ["habit tracker", "habit formation", "behavior design"],
        }),
      },
    ],
  }),
  component: HabitTrackerGuide,
});

function HabitTrackerGuide() {
  return (
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <article className="prose prose-invert max-w-none">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Qo'llanma · 9 daqiqa
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            Habit tracker — bu shunchaki galochka qo'yish emas. Bu miyaning
            mukofot tizimini boshqarish uslubi. Bu qo'llanmada nima uchun odat
            kuzatuvi ishlashini va uni Life Order tizimida qanday qo'llashni
            ko'rib chiqamiz.
          </p>

          <h2 className="mt-12 font-serif text-2xl">1. Nima uchun kuzatuv o'zi ishlaydi</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Kuzatuv uchta psixologik effektni yoqadi: <strong>Hawthorne
            effekti</strong> (o'lchanayotgan xatti-harakat yaxshilanadi),
            <strong> vizual progress bias</strong> (zanjir uzilmasligi kerak) va
            <strong> dopamin qaytishi</strong> (har galochka — kichik mukofot).
            Harvard Business School (Amabile &amp; Kramer, 2011) tadqiqoti
            "kichik yutuqlar tamoyili"ni tasdiqlagan: kunlik ko'rinadigan
            progress motivatsiyaning eng kuchli manbai.
          </p>

          <h2 className="mt-10 font-serif text-2xl">2. B=MAP formulasi (BJ Fogg, Stanford)</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Xatti-harakat = Motivatsiya × Qobiliyat × Trigger. Habit tracker
            uchalasini ham mustahkamlaydi:
          </p>
          <ul className="mt-3 space-y-2 leading-relaxed text-muted-foreground">
            <li>• <strong>Motivatsiya</strong> — streak va identity ("Men bu turdagi odamman")</li>
            <li>• <strong>Qobiliyat</strong> — mikro-vazifalar (2 daqiqa qoidasi)</li>
            <li>• <strong>Trigger</strong> — habit stacking ("Ertalab qahvadan keyin")</li>
          </ul>

          <h2 className="mt-10 font-serif text-2xl">3. 66 kun qoidasi (Lally, UCL 2010)</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Odat avtomatlashishi uchun o'rtacha <strong>66 kun</strong> kerak
            (diapazon 18–254). "21 kun" — bu afsona. Habit tracker sizga aynan
            shu diapazonni ko'rish imkonini beradi. Life Order bu vaqtni
            sprintlarga bo'ladi: 7 kun (issinish), 21 kun (o'rnashish), 66 kun
            (avtomatizatsiya), 100 kun (identitet).
          </p>

          <h2 className="mt-10 font-serif text-2xl">4. To'g'ri habit tracker qanday tuziladi</h2>
          <ol className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
            <li><strong>1. Aniqlik.</strong> "Sog'lom bo'lish" emas — "Har kuni soat 07:00da 10 daqiqa yurish".</li>
            <li><strong>2. Kichiklik.</strong> Boshlanishida vazifa "kulgili darajada oson" bo'lsin (Fogg).</li>
            <li><strong>3. Kontekst.</strong> Vaqt + joy + oldingi harakat. Bu trigger.</li>
            <li><strong>4. Zanjir.</strong> Ketma-ketlik motivatsiyadan kuchliroq (Seinfeld strategy).</li>
            <li><strong>5. Toqatlilik.</strong> Bir kun tashlab qo'ysang — zanjir uzilmagan. Ikki kun — uzilgan.</li>
          </ol>

          <h2 className="mt-10 font-serif text-2xl">5. Habit tracker'ning uch xatosi</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-muted-foreground">
            <li>• <strong>Ko'p odat birdaniga.</strong> 1–3 odat — maksimal. Ortiqchasi kognitiv yuk.</li>
            <li>• <strong>Faqat "streak"ka e'tibor.</strong> Uzilgan zanjirdan qo'rqish stressni oshiradi. Life Order Shield tizimi aynan shu uchun.</li>
            <li>• <strong>O'lchov noaniq.</strong> "Ko'proq o'qish" — kuzatib bo'lmaydi. "20 sahifa" — bo'ladi.</li>
          </ul>

          <h2 className="mt-10 font-serif text-2xl">6. Life Order habit tracker qanday farq qiladi</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Ko'pchilik ilovalar — galochka. Life Order — <strong>tizim</strong>:
          </p>
          <ul className="mt-3 space-y-2 leading-relaxed text-muted-foreground">
            <li>• Habit Stacking editor ("Agar X, unda Y" — Clear formulasi)</li>
            <li>• Shield — 2 marta uzilishga ruxsat (perfeksionizm tuzog'iga qarshi)</li>
            <li>• Streak, XP va Seasons — dopamin halqasi, lekin qimor emas</li>
            <li>• Nadir AI — har hafta natijalarga qarab protokolni sozlaydi</li>
            <li>• 45-daqiqa Rest Nudge — qaram bo'lib qolishga qarshi himoya</li>
          </ul>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6">
            <p className="font-serif text-xl">Manbalar</p>
            <ul className="mt-2 space-y-2 font-ui text-sm text-muted-foreground">
              <li>Fogg, B. J. (2019). <em>Tiny Habits: The Small Changes That Change Everything.</em> Houghton Mifflin.</li>
              <li>Clear, J. (2018). <em>Atomic Habits.</em> Avery.</li>
              <li>Lally, P. et al. (2010). <em>How are habits formed.</em> European Journal of Social Psychology, 40(6), 998–1009.</li>
              <li>Amabile, T., &amp; Kramer, S. (2011). <em>The Progress Principle.</em> Harvard Business Review Press.</li>
            </ul>
          </div>

          <div className="mt-10 rounded-[var(--radius)] border border-primary/40 bg-card/40 p-6 text-center">
            <p className="font-serif text-xl">Bugun boshla — bepul</p>
            <p className="mt-2 font-ui text-sm text-muted-foreground">
              60 soniyada tashxis. Kartasiz. Birinchi odat 2 daqiqada.
            </p>
            <Link
              to="/auth"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-ui text-sm font-semibold text-primary-foreground"
            >
              Tizimga kirish
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
