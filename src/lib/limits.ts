// Free / Pro tier limits — centralized configuration
export const freeTierLimits = {
  habits: 3,
  journalEntriesPerDay: 1,
  mentorMessagesPerDay: 5,
  shieldPerWeek: 0,
  analytics: false,
  advancedInsights: false,
} as const;

export const proTierLimits = {
  habits: Infinity,
  journalEntriesPerDay: Infinity,
  mentorMessagesPerDay: Infinity,
  shieldPerWeek: 3,
  analytics: true,
  advancedInsights: true,
} as const;

export type PlanId = "monthly" | "yearly";

export const pricing = {
  monthly: {
    id: "monthly" as const,
    amount: 59000,
    originalAmount: 75000,
    currency: "UZS",
    label: "59 000 so'm / oy",
    short: "59 000",
    months: 1,
  },
  yearly: {
    id: "yearly" as const,
    amount: 490000,
    originalAmount: 708000, // 59000 * 12
    currency: "UZS",
    label: "490 000 so'm / yil",
    short: "490 000",
    discount: "Yillik obuna (30% tejamkorlik)",
    months: 12,
  },
} as const;
