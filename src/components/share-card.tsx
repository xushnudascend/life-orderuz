import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { tierFromScore } from "@/lib/nervous";

/**
 * "Mening Life Order natijalarim" — ijtimoiy ulashish uchun karta.
 * PNG'ga eksport qiladi va Web Share API bo'lsa ulashadi.
 */
export function ShareCard({
  displayName,
  level,
  totalXp,
  currentStreak,
  disciplineScore,
}: {
  displayName: string;
  level: number;
  totalXp: number;
  currentStreak: number;
  disciplineScore: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = tierFromScore(disciplineScore);

  async function toPng(): Promise<Blob | null> {
    const node = ref.current;
    if (!node) return null;
    // SVG foreignObject orqali serverless PNG generatsiyasi
    const rect = node.getBoundingClientRect();
    const w = Math.max(600, rect.width);
    const h = Math.max(315, rect.height);
    const clone = node.cloneNode(true) as HTMLElement;
    clone.style.width = `${w}px`;
    clone.style.background = "#0a0a0a";
    const xml = new XMLSerializer().serializeToString(clone);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${xml}</div></foreignObject></svg>`;
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("image load failed"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.scale(2, 2);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
  }

  async function share() {
    try {
      const blob = await toPng();
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "life-order-natija.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: "Mening Life Order natijalarim",
          text: `Daraja ${level} · ${currentStreak} kunlik streak · ${tier.uz}`,
        });
        toast.success("Natija Davraga joylandi.");
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "life-order-natija.png";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Natija yuklab olindi.");
      }
    } catch {
      toast.error("Ulashib bo'lmadi. Qayta urinib ko'ring.");
    }
  }

  return (
    <div className="space-y-3">
      <div
        ref={ref}
        className="rounded-[var(--radius)] border border-primary/40 bg-gradient-to-br from-background via-background to-primary/10 p-8"
      >
        <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-primary">
          Mening Life Order natijalarim
        </p>
        <h3 className="mt-2 font-serif text-3xl leading-tight">{displayName}</h3>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Daraja</p>
            <p className="mt-1 font-serif text-3xl">{level}</p>
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">XP</p>
            <p className="mt-1 font-serif text-3xl">{totalXp}</p>
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Streak</p>
            <p className="mt-1 font-serif text-3xl">{currentStreak}</p>
          </div>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {tier.uz} · {disciplineScore}/100
        </p>
        <p className="mt-6 font-ui text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Life Order — Self-Control OS
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={share} size="sm">
          <Share2 className="mr-1 h-4 w-4" /> Ulashish
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const blob = await toPng();
            if (!blob) return toast.error("Yuklab bo'lmadi");
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "life-order-natija.png";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="mr-1 h-4 w-4" /> Yuklab olish
        </Button>
      </div>
    </div>
  );
}
