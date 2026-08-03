import { describe, it, expect } from "vitest";
import { freeTierLimits, proTierLimits, pricing } from "./limits";

describe("tarif limitlari", () => {
  it("Pro har doim Free'dan kam emas", () => {
    expect(proTierLimits.habits).toBeGreaterThanOrEqual(freeTierLimits.habits);
    expect(proTierLimits.journalEntriesPerDay).toBeGreaterThanOrEqual(
      freeTierLimits.journalEntriesPerDay,
    );
    expect(proTierLimits.mentorMessagesPerDay).toBeGreaterThanOrEqual(
      freeTierLimits.mentorMessagesPerDay,
    );
    expect(proTierLimits.shieldPerWeek).toBeGreaterThanOrEqual(freeTierLimits.shieldPerWeek);
  });

  it("analitika faqat Pro'da", () => {
    expect(freeTierLimits.analytics).toBe(false);
    expect(proTierLimits.analytics).toBe(true);
  });
});

describe("narxlar", () => {
  it("summalar musbat butun son (tiyinsiz UZS)", () => {
    for (const plan of Object.values(pricing)) {
      expect(Number.isInteger(plan.amount)).toBe(true);
      expect(plan.amount).toBeGreaterThan(0);
      expect(plan.currency).toBe("UZS");
      expect(plan.months).toBeGreaterThan(0);
    }
  });

  it("yillik tarif oylikdan arzonroq (oyiga hisoblaganda)", () => {
    const monthly = pricing.monthly.amount / pricing.monthly.months;
    const yearly = pricing.yearly.amount / pricing.yearly.months;
    expect(yearly).toBeLessThan(monthly);
  });

  it("id maydoni kalit bilan mos", () => {
    for (const [key, plan] of Object.entries(pricing)) {
      expect(plan.id).toBe(key);
    }
  });
});
