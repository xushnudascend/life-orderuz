import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

const DESC =
  "Life Order Pro obunasi uchun to'lovni qaytarish shartlari: 14 kunlik to'liq qaytarish kafolati, qanday so'rash, qancha vaqtda qaytariladi va istisnolar.";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: `To'lovni qaytarish — ${uz.brand.name}` },
      { name: "description", content: DESC },
      { property: "og:title", content: `To'lovni qaytarish — ${uz.brand.name}` },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "https://life-orderuz.lovable.app/refund" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/refund" }],
  }),
  component: () => (
    <LegalShell title="To'lovni qaytarish" updated="17-iyul, 2026">
      <p>
        Pro obunadan mamnun bo'lmasangiz —{" "}
        <strong>14 kun ichida to'liq pulingizni qaytaramiz</strong>. Sababini tushuntirish shart
        emas.
      </p>

      <h2 className="mt-8 font-serif text-2xl">Kafolat shartlari</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Birinchi to'lovdan keyin <strong>14 kalendar kun</strong> davomida.
        </li>
        <li>To'liq summa, komissiyasiz.</li>
        <li>Bir hisobga bir marta amal qiladi.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Qanday so'rash</h2>
      <ol className="ml-5 list-decimal space-y-1.5">
        <li>
          <strong>support@lifeorder.app</strong> ga yozing.
        </li>
        <li>
          Sarlavha: <em>"Refund"</em>.
        </li>
        <li>Hisob email va (agar bo'lsa) to'lov ID'sini ilova qiling.</li>
        <li>Ixtiyoriy: yoqmagan joyni ayting — biz uchun bebaho.</li>
      </ol>

      <h2 className="mt-8 font-serif text-2xl">Vaqt</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Ko'rib chiqish — 3 ish kuni ichida.</li>
        <li>Qaytarish kartaga — 5-10 ish kuni (bank tezligiga bog'liq).</li>
        <li>Qaytarish tugagach, Pro imkoniyatlari o'chadi, Free rejaga o'tasiz.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">Istisnolar</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          14 kundan keyingi to'lovlar avtomatik qaytarilmaydi (biroq bekor qila olasiz — keyingi
          davr uchun to'lov olinmaydi).
        </li>
        <li>
          Yillik obuna: 1-yil uchun 14 kun qoida amal qiladi; keyingi yillar avtomatik
          yangilanishdan oldin bekor qilinishi kerak.
        </li>
        <li>Shartlar buzilgani uchun bloklangan hisoblar.</li>
      </ul>

      <p className="mt-6">
        Savollar: <strong>support@lifeorder.app</strong>. Odatda soatlar ichida javob beramiz.
      </p>
    </LegalShell>
  ),
});
