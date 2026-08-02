import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { FounderPledge } from "@/components/legal-pledge";
import { uz } from "@/i18n";

const DESC =
  "Life Order foydalanish shartlari: xizmat tavsifi, hisob va yosh cheklovi, to'lovlar, bekor qilish, javobgarlik chegaralari va nizolar tartibi.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Foydalanish shartlari — ${uz.brand.name}` },
      { name: "description", content: DESC },
      { property: "og:title", content: `Foydalanish shartlari — ${uz.brand.name}` },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "https://life-orderuz.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/terms" }],
  }),
  component: () => (
    <LegalShell title="Foydalanish shartlari" updated="17-iyul, 2026">
      <p>
        Xizmatdan foydalanib, siz quyidagilarga rozilik bildirasiz. Muhim joylari qalin ajratildi.
      </p>

      <h2 className="mt-8 font-serif text-2xl">1. Xizmat nima va nima emas</h2>
      <p>
        Life Order — o'z-o'zini boshqarish uchun raqamli vosita. Bu{" "}
        <strong>tibbiy, psixologik yoki huquqiy maslahat emas</strong>. Ruhiy yoki jismoniy
        holatingiz bilan bog'liq jiddiy savollarda mutaxassisga murojaat qiling.
      </p>

      <h2 className="mt-8 font-serif text-2xl">2. Hisob va yosh</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Minimal yosh — <strong>13</strong>. 18 yoshgacha ota-ona ruxsati talab qilinadi.
        </li>
        <li>Bir kishiga bitta hisob. Ma'lumot haqiqiy va yangilangan bo'lishi kerak.</li>
        <li>Parol va kirish ma'lumotlarining maxfiyligi — sizning javobgarligingiz.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">3. Tarkib egaligi</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          Siz yozgan kundalik, odat va suhbatlar — <strong>sizga tegishli</strong>.
        </li>
        <li>
          Bizga faqat xizmatni yetkazish uchun cheklangan litsenziya berasiz (o'qish, ko'rsatish, AI
          kontekst).
        </li>
        <li>Nafrat, zo'ravonlik, spam yoki noqonuniy kontent — taqiqlangan.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">4. To'lovlar va bekor qilish</h2>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>Pro obuna oldindan to'lanadi (oy yoki yil).</li>
        <li>Istalgan paytda bekor qilinadi — joriy davr oxirigacha kirish saqlanadi.</li>
        <li>
          14 kunlik qaytarish kafolati — batafsil <strong>/refund</strong>.
        </li>
        <li>Narx o'zgarsa — 30 kun oldin xabar beriladi.</li>
      </ul>

      <h2 className="mt-8 font-serif text-2xl">5. Javobgarlik chegarasi</h2>
      <p>
        Xizmat "borligicha" (<em>as is</em>) taqdim etiladi. Biz uzluksiz ishlashni kafolatlay
        olmaymiz. AI javoblari xato bo'lishi mumkin — muhim qarorlar uchun tekshiring. Maksimal
        javobgarligimiz — oxirgi 12 oyda to'lagan summangiz miqdorida.
      </p>

      <h2 className="mt-8 font-serif text-2xl">6. Nizolar</h2>
      <p>
        Avval do'stona hal qilishga urinamiz — <strong>legal@lifeorder.app</strong>. Kelishuv
        bo'lmasa, O'zbekiston Respublikasi qonunlari va sudlari yurisdiksiyasida ko'riladi.
      </p>

      <h2 className="mt-8 font-serif text-2xl">7. O'zgarishlar</h2>
      <p>
        Shartlar o'zgarsa — 14 kun oldin email va sayt orqali xabar beriladi. Davom etib foydalanish
        — yangi shartlarga rozilik demakdir.
      </p>

      <p className="mt-6">
        Aloqa: <strong>support@lifeorder.app</strong>
      </p>

      <FounderPledge
        will={[
          "Narx o'zgarsa — 30 kun oldin ochiq xabar beramiz.",
          "14 kun ichida so'roqsiz pul qaytaramiz.",
          "Xizmat ishlamasa — pro-rata kredit beramiz.",
          "Har o'zgarish tarixi ochiq: changelog + email.",
        ]}
        wont={[
          "Bekor qilishni yashirmaymiz — bir bosishda.",
          "Karta ma'lumotini o'zimizda saqlamaymiz.",
          "Kichik shrift bilan sirli shart yashirmaymiz.",
          "AI javobini tibbiy/psixologik maslahat sifatida taqdim etmaymiz.",
        ]}
      />
    </LegalShell>
  ),
});
