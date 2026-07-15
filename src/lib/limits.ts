// Free tier limits — centralized configuration
export const freeTierLimits = {
  habits: 3,
  journalEntriesPerDay: 1,
  mentorMessagesPerDay: 10,
  shieldPerWeek: 1,
} as const;

export const proTierLimits = {
  habits: Infinity,
  journalEntriesPerDay: Infinity,
  mentorMessagesPerDay: Infinity,
  shieldPerWeek: 3,
} as const;

export const pricing = {
  monthly: { amount: 29000, currency: "UZS", label: "29 000 so'm / oy" },
  yearly: { amount: 249000, currency: "UZS", label: "249 000 so'm / yil" },
} as const;
