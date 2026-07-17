import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

export const Route = createFileRoute("/refund")({
  head: () => {
    const desc =
      "Life Order Pro obunasi uchun to'lovni qaytarish shartlari: 14 kunlik to'liq qaytarish kafolati, so'rov yuborish tartibi va istisnolar.";
    return {
      meta: [
        { title: `To'lovni qaytarish — ${uz.brand.name}` },
        { name: "description", content: desc },
        { property: "og:title", content: `To'lovni qaytarish — ${uz.brand.name}` },
        { property: "og:description", content: desc },
        { property: "og:url", content: "https://life-orderuz.lovable.app/refund" },
      ],
      links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/refund" }],
    };
  },
  component: () => (
    <LegalShell title="To'lovni qaytarish" updated="15-iyul, 2026">
      <p>
        Life Order Pro obunasidan mamnun bo'lmasangiz, birinchi to'lovdan keyin
        14 kun ichida to'liq qaytarishni so'rashingiz mumkin.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Qanday so'rash mumkin</h2>
      <p>
        support@lifeorder.app ga yozing va akkount emailingizni ko'rsating.
        Odatda 3–5 ish kuni ichida qayta ishlaymiz.
      </p>
      <h2 className="mt-8 font-serif text-2xl">Istisnolar</h2>
      <p>
        14 kundan keyingi to'lovlar va yillik obunaning ikkinchi yildan
        boshlab qismi qaytarilmaydi, biroq keyingi davr uchun bekor qila
        olasiz.
      </p>
    </LegalShell>
  ),
});
