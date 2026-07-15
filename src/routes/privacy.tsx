import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Maxfiylik siyosati — ${uz.brand.name}` },
      { name: "description", content: "Ma'lumotlaringizni qanday saqlaymiz va himoyalaymiz." },
      { property: "og:title", content: `Maxfiylik siyosati — ${uz.brand.name}` },
      { property: "og:description", content: "Ma'lumotlaringizni qanday saqlaymiz va himoyalaymiz." },
      { property: "og:url", content: "https://life-orderuz.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/privacy" }],
  }),
  component: () => (
    <LegalShell title="Maxfiylik siyosati" updated="15-iyul, 2026">
      <p>
        Biz ma'lumotlaringizni jiddiy qabul qilamiz. Ushbu siyosat qanday
        ma'lumot yig'ishimiz va uni qanday himoyalashimizni tushuntiradi.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Nima yig'amiz</h2>
      <p>
        Hisob ma'lumotlari (email, ism), kundalik yozuvlar, odat va vazifa
        ma'lumotlari, Nadir bilan suhbat tarixi.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Qanday ishlatamiz</h2>
      <p>
        Xizmatni ko'rsatish, statistikani hisoblash, AI mentorga kontekst
        berish uchun. Ma'lumotlaringiz sotilmaydi.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Xavfsizlik</h2>
      <p>
        Barcha ma'lumotlar shifrlangan holda saqlanadi. Ma'lumotlar bazasi
        RLS (row-level security) siyosati bilan himoyalangan — faqat siz o'z
        ma'lumotlaringizni ko'ra olasiz.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Sizning huquqlaringiz</h2>
      <p>
        Istalgan paytda ma'lumotlaringizni yuklab olishingiz yoki akkountni
        o'chirishingiz mumkin. Buning uchun: support@lifeorder.app
      </p>
    </LegalShell>
  ),
});
