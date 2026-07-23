import { Sprout } from "lucide-react";

/**
 * Fogg BMAP — birinchi 5 kun: pastroq kutish, kichikroq odat.
 * Yangi foydalanuvchini keskin bosim ostiga qo'ymaslik uchun aniq signal.
 * Streak >= 5 bo'lganda avtomatik yashiriladi.
 */
export function EasyModeRibbon({ streakDays }: { streakDays: number }) {
  if (streakDays >= 5) return null;
  const remaining = Math.max(1, 5 - streakDays);
  return (
    <div
      role="note"
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.2em] text-primary"
    >
      <Sprout className="h-3.5 w-3.5" aria-hidden />
      Yengil rejim · yana {remaining} kun · 2 daqiqalik 1 odat kifoya
    </div>
  );
}
