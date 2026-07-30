import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://life-orderuz.lovable.app";
const PATH = "/blog/goal-tracking-apps";
const TITLE = "Goal tracking vs habit tracker — qaysi biri kerak";
const DESCRIPTION =
  "Best apps for goal setting: goal tracking ilovalar va habit trackerlar farqi. Uzoq muddatli maqsad va kundalik tizim — qaysi biri natija beradi va qanday birlashtiriladi.";

const rows = [
  {
    axis: "Vaqt gorizonti",
    goal: "3–12 oy (natija)",
    habit: "Har kun (jarayon)",
  },
  {
    axis: "O'lchov birligi",
    goal: "Foiz / bosqich (OKR)",
    habit: "Bajarildi / bajarilmadi",
  },
  {
    axis: "Motivatsiya manbai",
    goal: "Kelajakdagi mukofot",
    habit: "Zudlik bilan takrorlanish",
  },
  {
    axis: "Asosiy xavf",
    goal: "Maqsad uzoq → e'tibor so'nadi",
    habit: "Odat maqsadga bog'lanmagan → ma'nosiz",
  },
  {
    axis: "Ilmiy asos",
    goal: "Locke & Latham (2002), goal-setting theory",
    habit: "Lally (2010), Fogg B=MAP (2019)",
  },
];

export const Route = createFileRoute("/blog/goal-tracking-apps")({
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
          about: ["goal tracking", "habit tracker", "goal setting apps"],
        }),
      },
    ],
  }),
  component: GoalTrackingApps,
});

function GoalTrackingApps() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Goal tracking ilovalar va habit trackerlar: farqi nimada?
          </h1>
          <p className="mt-4 text-muted-foreground">
            &ldquo;Best apps for goal setting&rdquo; deb qidirayotganlarning
            aksariyati aslida ikki xil vositani bir deb o&apos;ylaydi. Goal
            tracking — <strong>natijani</strong> kuzatadi. Habit tracker —{" "}
            <strong>jarayonni</strong>. Ikkalasi bir-birini almashtira olmaydi:
            maqsadsiz odat ma&apos;nosiz, odatsiz maqsad esa bajarilmaydi.
          </p>

          <h2 className="mt-10 text-2xl font-semibold">Yonma-yon solishtirish</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-3">Mezon</th>
                  <th className="p-3">Goal tracking</th>
                  <th className="p-3">Habit tracker</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.axis} className="border-t border-border">
                    <td className="p-3 font-medium">{r.axis}</td>
                    <td className="p-3 text-muted-foreground">{r.goal}</td>
                    <td className="p-3 text-muted-foreground">{r.habit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-2xl font-semibold">
            Nega faqat maqsad qo&apos;yish yetarli emas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Locke va Latham (2002) ko&apos;rsatganidek, aniq va qiyin maqsad
            natijani oshiradi — lekin faqat <em>qayta aloqa</em> va{" "}
            <em>bajarish rejasi</em> mavjud bo&apos;lganda. Gollwitzer&apos;ning
            implementation intentions tadqiqoti (1999) bir qadam qo&apos;shadi:
            &ldquo;Agar X bo&apos;lsa, men Y qilaman&rdquo; formulasi bajarish
            ehtimolini ikki baravargacha oshiradi. Ya&apos;ni maqsad kundalik
            turtkiga aylantirilmasa, u shunchaki niyat bo&apos;lib qoladi.
          </p>

          <h2 className="mt-6 text-2xl font-semibold">
            Nega faqat odat kuzatish ham yetarli emas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Har kuni belgi qo&apos;yish — dopamin beradi, lekin yo&apos;nalish
            bermaydi. 3 oydan keyin ko&apos;pchilik &ldquo;streak&rdquo;ni
            saqlaydi, ammo hayotida o&apos;zgarish sezmaydi. Sabab: odat hech
            qanday o&apos;lchanadigan natijaga ulanmagan.
          </p>

          <h2 className="mt-6 text-2xl font-semibold">
            Ishlaydigan model: maqsad → soha → odat
          </h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <strong>1. Maqsad</strong> — 90 kunlik, o&apos;lchanadigan natija
              (masalan: 8 km yugurish).
            </li>
            <li>
              <strong>2. Soha</strong> — maqsad qaysi hayot o&apos;qiga tegishli
              (sog&apos;liq, ish, aloqalar).
            </li>
            <li>
              <strong>3. Odat</strong> — maqsadni harakatga aylantiruvchi eng
              kichik kundalik qadam (2 daqiqa qoidasi).
            </li>
            <li>
              <strong>4. Qayta aloqa</strong> — haftalik hisobot: odat bajarildi,
              lekin maqsad qimirlamadimi? Unda odat noto&apos;g&apos;ri tanlangan.
            </li>
          </ul>

          <h2 className="mt-6 text-2xl font-semibold">Qaysi ilovani tanlash</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <strong>Faqat OKR / loyiha kerak</strong> → Notion, Todoist yoki
              klassik goal tracker.
            </li>
            <li>
              <strong>Faqat kundalik belgi kerak</strong> → Streaks, Habitify.
            </li>
            <li>
              <strong>Ikkalasi bir tizimda kerak</strong> → Life Order: maqsad
              hayot sohasiga, soha esa kundalik odatga bog&apos;lanadi va haftalik
              hisobot ularni solishtiradi.
            </li>
          </ul>

          <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-semibold">Maqsad va odatni birlashtiring</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Free rejada 3 ta odat, kunlik jurnal va haftalik hisobot.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Bepul boshlash →
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Manbalar: Locke E. &amp; Latham G. <em>Building a practically useful
            theory of goal setting</em> (2002). Gollwitzer P.{" "}
            <em>Implementation intentions</em> (1999). Fogg BJ.{" "}
            <em>Tiny Habits</em> (2019).
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
