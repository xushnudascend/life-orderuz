import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

/**
 * Tepada to'liq kenglikdagi banner:
 * - Internet uzilganda to'q sariq (destructive) rangda "Internet aloqasi yo'q..."
 * - Qayta ulanganda 2 soniyaga yashil "tiklandi" tasdig'i, so'ng yopiladi
 */
export function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setOnline(navigator.onLine);
    const on = () => {
      setOnline(true);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 2200);
    };
    const off = () => {
      setOnline(false);
      setShowRestored(false);
    };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online && !showRestored) return null;

  const isRestored = online && showRestored;
  return (
    <div
      role="status"
      className={
        "fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-2 px-4 py-2 font-ui text-xs uppercase tracking-[0.18em] " +
        (isRestored
          ? "bg-success text-success-foreground"
          : "bg-destructive text-destructive-foreground")
      }
    >
      {isRestored ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          Aloqa tiklandi
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          Internet aloqasi yo'q — aloqani tekshir
        </>
      )}
    </div>
  );
}
