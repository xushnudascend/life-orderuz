import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

const DESC = "Life Order shaxsiy ma'lumotlar xavfsizligi va maxfiylik tamoyillari. Sizning ma'lumotlaringiz — sizning nazoratingizda.";

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
  component: Privacy,
});

function Privacy() {
  return (
    <LegalShell title="Maxfiylik siyosati" updated="17-iyul, 2026">
      <p>
        Life Order platformasi sizning maxfiyligingizni qadrlaydi. Biz faqat xizmatni yetkazish uchun zarur bo'lgan ma'lumotlarni yig'amiz.
      </p>

      <h2 className="mt-8 font-serif text-2xl">1. Qanday ma'lumotlarni yig'amiz</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li><strong>Profil:</strong> Ism, email va tanlangan til.</li>
        <li><strong>Tarkib:</strong> Odatlar, kundalik yozuvlari va AI mentor bilan suhbatlar.</li>
        <li><strong>Texnik:</strong> Qurilma turi, operatsion tizim va anonimlashtirilgan foydalanish statistikasi.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">2. Ma'lumotlardan foydalanish</h2>
      <p>Sizning ma'lumotlaringiz quyidagi maqsadlarda ishlatiladi:</p>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Shaxsiy AI mentor tajribasini taqdim etish.</li>
        <li>Haftalik hisobotlarni tayyorlash.</li>
        <li>Xizmat sifatini yaxshilash va xavfsizlikni ta'minlash.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">3. Ma'lumotlar xavfsizligi</h2>
      <p>
        Barcha ma'lumotlar TLS 1.3 shifrlash orqali uzatiladi va AES-256 bilan bazada saqlanadi. 
        Biz sizning shaxsiy ma'lumotlaringizni uchinchi tomonlarga sotmaymiz.
      </p>

      <h2 className="mt-8 font-serif text-2xl">4. Sizning huquqlaringiz</h2>
      <p>
        Siz istalgan paytda o'z ma'lumotlaringizni eksport qilishingiz yoki hisobingizni butunlay o'chirib yuborishingiz mumkin.
      </p>

      <p className="mt-6">
        Savollar: <strong>privacy@lifeorder.app</strong>
      </p>
    </LegalShell>
  );
}

