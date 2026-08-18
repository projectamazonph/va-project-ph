import { z } from "zod";

export const LessonProgressStatusSchema = z.enum(["not_started", "in_progress", "complete"]);
export type LessonProgressStatus = z.infer<typeof LessonProgressStatusSchema>;

export const ModuleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1).max(200),
  goal: z.string().min(1).max(500),
  position: z.number().int().min(0).max(999),
  estMinutes: z.number().int().min(1).max(240),
});
export type ModuleInput = z.infer<typeof ModuleSchema>;

export const LessonSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  position: z.number().int().min(1).max(999),
  estMinutes: z.number().int().min(1).max(60),
  body: z.string().min(1).max(20_000),
});
export type LessonInput = z.infer<typeof LessonSchema>;
