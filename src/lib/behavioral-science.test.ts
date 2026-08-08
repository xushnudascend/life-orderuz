import { describe, it, expect } from 'vitest';

// Simulating the Forgiving Streak logic from the SQL function
function calculateForgivingStreak(current: number, lastCheckInDaysAgo: number, hasShield: boolean): number {
  if (lastCheckInDaysAgo <= 1) return current + 1;
  if (hasShield) return current + 1; // Shield bridges gap
  
  // FORGIVING RULE: Miss reduces rather than resets
  // new_current := GREATEST(1, s.current_days - (gap - 1));
  return Math.max(1, current - (lastCheckInDaysAgo - 1));
}

describe('Behavioral Science: Forgiving Streaks', () => {
  it('increments streak on consecutive days', () => {
    expect(calculateForgivingStreak(5, 1, false)).toBe(6);
  });

  it('reduces rather than resets streak on single miss (Forgiving Rule)', () => {
    // 2 days ago means 1 day missed
    expect(calculateForgivingStreak(10, 2, false)).toBe(9);
  });

  it('reduces heavily but stays positive on multi-day miss', () => {
    expect(calculateForgivingStreak(10, 5, false)).toBe(6);
    expect(calculateForgivingStreak(3, 10, false)).toBe(1);
  });

  it('bridges the gap if shield is available', () => {
    expect(calculateForgivingStreak(10, 3, true)).toBe(11);
  });
});
