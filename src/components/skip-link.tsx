/**
 * Klaviatura foydalanuvchilari uchun "asosiy mazmunga o'tish" havolasi.
 * Focus qilinganda ko'rinadi, aks holda vizual jihatdan yashirin.
 */
export function SkipLink({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:border focus:border-primary focus:bg-background focus:px-3 focus:py-2 focus:font-ui focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg"
    >
      Asosiy mazmunga o'tish
    </a>
  );
}
