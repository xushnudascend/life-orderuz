import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { uz } from "@/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Foydalanish shartlari — ${uz.brand.name}` },
      { name: "description", content: "Life Order xizmatidan foydalanish shartlari." },
    ],
  }),
  component: () => (
    <LegalShell title="Foydalanish shartlari" updated="15-iyul, 2026">
      <p>
        Ushbu shartlar Life Order xizmatidan foydalanish tartibini belgilaydi.
        Xizmatdan foydalanib, siz ushbu shartlarga rozilik bildirasiz.
      </p>
      <h2 className="mt-8 font-serif text-2xl">1. Xizmat haqida</h2>
      <p>
        Life Order — bu o'z-o'zini boshqarish uchun yordamchi platforma. U tibbiy
        maslahat yoki professional psixologik yordam o'rnini bosmaydi.
      </p>
      <h2 className="mt-8 font-serif text-2xl">2. Sizning majburiyatlaringiz</h2>
      <p>
        Haqiqiy ma'lumot berish, boshqa foydalanuvchilarga hurmat, qonuniy
        maqsadlarda foydalanish sizning javobgarligingiz.
      </p>
      <h2 className="mt-8 font-serif text-2xl">3. To'lovlar</h2>
      <p>
        Pro obuna oldindan to'lanadi. Bekor qilish istalgan vaqtda mumkin;
        joriy davr oxirigacha kirish saqlanadi.
      </p>
      <h2 className="mt-8 font-serif text-2xl">4. Javobgarlik chegarasi</h2>
      <p>
        Xizmat "borligicha" taqdim etiladi. Biz uzluksiz ishlashni kafolatlay
        olmaymiz va olingan qarorlaringiz uchun javobgar emasmiz.
      </p>
      <h2 className="mt-8 font-serif text-2xl">5. Aloqa</h2>
      <p>Savollar uchun: support@lifeorder.app</p>
    </LegalShell>
  ),
});
