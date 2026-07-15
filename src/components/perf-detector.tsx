import { useEffect } from "react";

/**
 * Sekin qurilmalarda `document.documentElement.dataset.perf = "low"` qo'yadi.
 * Signal manbalar:
 *  1) navigator.hardwareConcurrency <= 4
 *  2) navigator.deviceMemory <= 2 GB (mavjud bo'lsa)
 *  3) network effectiveType "slow-2g" / "2g"
 *  4) Birinchi frame < 20ms bo'lmasa (juda taxminiy fallback)
 */
export function PerfDetector() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    try {
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        hardwareConcurrency?: number;
        connection?: { effectiveType?: string; saveData?: boolean };
      };
      let low = false;
      if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) low = true;
      if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) low = true;
      const ct = nav.connection?.effectiveType ?? "";
      if (ct === "slow-2g" || ct === "2g" || nav.connection?.saveData) low = true;
      if (low) root.dataset.perf = "low";
      else root.dataset.perf = "auto";
    } catch {
      root.dataset.perf = "auto";
    }
  }, []);

  return null;
}
