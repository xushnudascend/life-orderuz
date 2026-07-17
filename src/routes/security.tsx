import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

export const Route = createFileRoute("/security")({
  head: () => {
    const desc =
      "Life Order akkount va ma'lumotlar xavfsizligi: bcrypt parol xeshlash, Google kirish, Row-Level Security, buzilgan parol tekshiruvi va zaifliklarni xabar berish tartibi.";
    return {
      meta: [
        { title: `Xavfsizlik — ${uz.brand.name}` },
        { name: "description", content: desc },
        { property: "og:title", content: `Xavfsizlik — ${uz.brand.name}` },
        { property: "og:description", content: desc },
        { property: "og:url", content: "https://life-orderuz.lovable.app/security" },
      ],
      links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/security" }],
    };
  },
  component: () => (
    <LegalShell title="Xavfsizlik" updated="15-iyul, 2026">
      <p>
        Biz xavfsizlikni birinchi qadamdan boshlab loyihalashtirdik.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Autentifikatsiya</h2>
      <p>
        Parollar bcrypt orqali xeshlanadi. Google orqali kirish tavsiya
        etiladi. HIBP (buzilgan parol) tekshiruvi yoqilgan.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Ma'lumotlar bazasi</h2>
      <p>
        Har bir jadval Row-Level Security bilan himoyalangan. Foydalanuvchi
        faqat o'z ma'lumotlarini o'qiy va o'zgartira oladi. Server tomonidagi
        maxfiy kalitlar hech qachon brauzerga yuborilmaydi.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Zaifliklarni xabar berish</h2>
      <p>
        Xavfsizlik muammosini topsangiz: security@lifeorder.app. Mas'uliyatli
        oshkor qilish uchun rahmat aytamiz.
      </p>
    </LegalShell>
  ),
});
