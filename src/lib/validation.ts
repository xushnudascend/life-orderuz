import { z } from "zod";

// Markazlashgan Zod sxemalar. Har joyda inline validation o'rniga shu yerdan import qiling.

export const uuid = z.string().uuid();
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD kutilgan");
export const nonEmpty = (max = 2000) => z.string().trim().min(1).max(max);

// Profil
export const profileUpdateSchema = z.object({
  display_name: z.string().trim().min(1).max(60).optional(),
  region: z.string().trim().max(80).optional(),
  archetype: z.enum(["explorer", "warrior", "sage", "guardian", "builder"]).optional(),
  timezone: z.string().trim().max(60).optional(),
  visibility: z.enum(["public", "friends", "private"]).optional(),
  language: z.enum(["uz", "ru", "en"]).optional(),
});

// Habits
export const habitCreateSchema = z.object({
  title: nonEmpty(120),
  category: z.enum(["body", "habits", "learn", "other"]).default("habits"),
  cadence: z.enum(["daily", "weekly"]).default("daily"),
  target_per_week: z.number().int().min(1).max(14).optional(),
});
export const habitLogSchema = z.object({
  habit_id: uuid,
  logged_date: isoDate,
  note: z.string().trim().max(500).optional(),
});

// Journal
export const journalEntrySchema = z.object({
  content: nonEmpty(5000),
  mood: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string().trim().max(24)).max(10).optional(),
});

// Meals / diet
export const mealSchema = z.object({
  name: nonEmpty(120),
  kcal: z.number().int().min(0).max(10000).optional(),
  protein_g: z.number().min(0).max(1000).optional(),
  carbs_g: z.number().min(0).max(1000).optional(),
  fat_g: z.number().min(0).max(1000).optional(),
  image_url: z.string().url().max(500).optional(),
  eaten_at: z.string().datetime().optional(),
});

// Community
export const communityPostSchema = z.object({
  channel: z.string().trim().min(1).max(40),
  content: nonEmpty(2000),
});

// Chat / Nadir
export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.union([z.string(), z.array(z.any())]),
  })).min(1).max(50),
  userStats: z.record(z.string(), z.any()).optional(),
});

// Auth
export const emailSchema = z.string().trim().email().max(255);
export const passwordSchema = z.string().min(8).max(128);

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type HabitCreate = z.infer<typeof habitCreateSchema>;
export type MealInput = z.infer<typeof mealSchema>;
