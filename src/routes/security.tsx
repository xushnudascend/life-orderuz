import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

const DESC =
  "Life Order xavfsizligi: bcrypt parollar, Row-Level Security, TLS 1.3, HIBP tekshiruvi va Sentry monitoring.";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: `Xavfsizlik — ${uz.brand.name}` },
      { name: "description", content: DESC },
      { property: "og:title", content: `Xavfsizlik — ${uz.brand.name}` },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "https://life-orderuz.lovable.app/security" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://life-orderuz.lovable.app/og/security.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://life-orderuz.lovable.app/og/security.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/security" }],
  }),
  component: () => (
    <LegalShell title="Xavfsizlik" updated="17-iyul, 2026">
      <p>
        Xavfsizlik keyin qo'shiladigan qatlam emas — birinchi qadamdan boshlab loyihaga
        singdirilgan. Quyida to'g'ridan-to'g'ri qo'llagan choralarimiz.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Autentifikatsiya</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Parollar <strong>bcrypt</strong> (cost 10+) bilan xeshlanadi — hech qachon ochiq
          saqlanmaydi.
        </li>
        <li>
          Ro'yxatdan o'tishda <strong>HIBP</strong> orqali buzilgan parollar rad etiladi.
        </li>
        <li>Google OAuth 2.0 — tavsiya etilgan usul (ikki bosqichli himoya bilan).</li>
        <li>JWT sessiya 1 soat, avtomatik refresh — o'g'irlangan token qisqa umr ko'radi.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Ma'lumotlar izolyatsiyasi</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Har jadval <strong>Row-Level Security</strong> siyosati bilan yopiq — foydalanuvchi faqat
          o'z qatorlarini ko'radi.
        </li>
        <li>Rollar (admin, moderator) alohida jadvalda — imtiyoz eskalatsiyasi imkonsiz.</li>
        <li>
          Server maxfiy kalitlari (<code>service_role</code>) brauzerga hech qachon yubormaydi.
        </li>
        <li>AI endpoint'lari Bearer JWT tekshiradi — anonim so'rov qabul qilinmaydi.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Transport va saqlash</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Barcha trafik <strong>TLS 1.3</strong> orqali shifrlanadi. HTTP → HTTPS majburiy redirect.
        </li>
        <li>Ma'lumotlar bazasi at-rest AES-256 bilan shifrlangan.</li>
        <li>Zaxira nusxalari kuniga bir marta olinadi, 30 kun saqlanadi.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Nazorat va monitoring</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Ishlab chiqarish xatoliklari <strong>Sentry</strong> orqali kuzatiladi — PII avtomatik
          filtrlanadi.
        </li>
        <li>Webhook'lar HMAC-SHA256 imzo bilan tekshiriladi.</li>
        <li>Rate-limiting — foydalanuvchi ID bo'yicha, IP soxtalashiga qarshi himoya.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Zaiflikni xabar berish</h2>
      <p>
        Xavfsizlik muammosini topsangiz — iltimos, <strong>security@lifeorder.app</strong> ga
        yozing. Ommaviy oshkor qilishdan avval 90 kun beramiz. Mas'uliyatli xabar bergan
        tadqiqotchilarga rahmatnoma va (imkoni bo'lsa) mukofot beriladi.
      </p>
    </LegalShell>
  ),
});
