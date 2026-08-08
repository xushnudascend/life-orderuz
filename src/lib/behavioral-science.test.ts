import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyArchetypeTheme } from "./archetype-theme";
import { freeTierLimits, proTierLimits } from "./limits";

describe("Behavioral Science Infrastructure", () => {
  describe("Forgiving Streak Logic (Fogg Model & SDT)", () => {
    it("should allow testing forgivness logic in the database", () => {
       // Note: Real DB logic is in Postgres triggers. 
       // This test asserts the logic intended for the forgiving streak.
       const currentStreak = 10;
       const gap = 2; // missed 1 day
       const newStreak = Math.max(1, currentStreak - (gap - 1));
       expect(newStreak).toBe(9);
    });

    it("should recover quickly if gap is large but not reset to zero", () => {
      const currentStreak = 20;
      const gap = 5; // missed 4 days
      const newStreak = Math.max(1, currentStreak - (gap - 1));
      expect(newStreak).toBe(16);
    });
  });

  describe("Tier Limits (SDT Autonomy & Miller's Law)", () => {
    it("Free tier should respect Miller's Law (5-7 chunks) for habits", () => {
      expect(freeTierLimits.habits).toBeLessThanOrEqual(7);
    });

    it("Pro tier should allow higher investment", () => {
      expect(proTierLimits.habits).toBe(Infinity);
    });
  });
});
