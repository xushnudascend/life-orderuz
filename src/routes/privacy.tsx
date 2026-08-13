import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { FounderPledge } from "@/components/legal-pledge";
import { uz } from "@/i18n";

const DESC =
  "Life Order maxfiylik siyosati: qanday ma'lumot yig'amiz, qayerda saqlaymiz, kim ko'ra oladi va foydalanuvchi huquqlari (yuklab olish, o'chirish).";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Maxfiylik siyosati — ${uz.brand.name}` },
      { name: "description", content: DESC },
      { property: "og:title", content: `Maxfiylik siyosati — ${uz.brand.name}` },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "https://life-orderuz.lovable.app/privacy" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://life-orderuz.lovable.app/og/privacy.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://life-orderuz.lovable.app/og/privacy.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/privacy" }],
  }),
  component: () => (
    <LegalShell title="Maxfiylik siyosati" updated="17-iyul, 2026">
      <p>
        Sizning ma'lumotingiz — sizniki. Biz uni sotmaymiz, reklama uchun ishlatmaymiz va uchinchi
        tomonga o'tkazmaymiz. Quyida aniq kim, nima va qancha vaqt.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Nima yig'amiz</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          <strong>Hisob:</strong> email, ism (ixtiyoriy), avatar.
        </li>
        <li>
          <strong>Kontent:</strong> odatlar, kundalik, kayfiyat, quest va streak.
        </li>
        <li>
          <strong>AI suhbat:</strong> Nadir bilan xabar tarixi (shaxsiy javob uchun).
        </li>
        <li>
          <strong>Texnik:</strong> qurilma turi, tili, xatolik tafsiloti (PII'siz).
        </li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Nima uchun</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Xizmatni yetkazish (odat, streak, XP hisoblash).</li>
        <li>Nadir AI mentorga sizni bilishi uchun kontekst berish.</li>
        <li>Xavfsizlik va burnout signalini oldindan sezish.</li>
        <li>Anonim agregat statistika (mahsulotni yaxshilash uchun).</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Kim ko'radi</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          <strong>Siz</strong> — barcha ma'lumot.
        </li>
        <li>
          <strong>Xizmat provayderlari:</strong> hosting (Cloudflare), backend (Supabase), AI
          (Lovable AI Gateway), monitoring (Sentry). Har biri DPA bilan bog'langan.
        </li>
        <li>
          Reklama tarmoqlari — <strong>yo'q</strong>. Ma'lumot broker'lari — <strong>yo'q</strong>.
        </li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Qancha saqlaymiz</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Faol hisobda — hisobingiz mavjud bo'lgan davrgacha.</li>
        <li>Hisob o'chirilsa — 30 kun ichida to'liq o'chiriladi (zaxirasidan ham).</li>
        <li>To'lov yozuvlari — qonun talabi bilan 5 yil (soliq).</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Sizning huquqlaringiz</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Barcha ma'lumotni JSON formatida yuklab olish.</li>
        <li>Xato ma'lumotni to'g'rilash yoki o'chirish.</li>
        <li>Hisobni bir bosishda o'chirish (Sozlamalar → Hisobni o'chirish).</li>
        <li>AI treningdan chiqish (default: chiqarilgan).</li>
      </ul>

      <p className="mt-6">
        Savol yoki so'rov: <strong>privacy@lifeorder.app</strong>. Odatda 3 ish kunida javob.
      </p>

      <FounderPledge
        will={[
          "Ma'lumotni faqat sizning tajribangizni yaxshilash uchun ishlatamiz.",
          "Barcha yozuvni JSON'da yuklab olish imkoni beramiz.",
          "Hisobni o'chirsangiz — 30 kun ichida to'liq tozalaymiz (zaxira ham).",
          "Buzilish bo'lsa — 72 soat ichida ochiq xabar beramiz.",
        ]}
        wont={[
          "Ma'lumotingizni sotmaymiz.",
          "Reklama tarmoqlariga bermaymiz.",
          "AI treningiga rozilingizsiz ishlatmaymiz.",
          "Shubhali ma'lumot broker'lar bilan ishlamaymiz.",
        ]}
      />
    </LegalShell>
  ),
});
