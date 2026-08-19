import { z } from "zod";

// Status enum matches the `lesson_progress.status` CHECK constraint.
export const LessonProgressStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "complete",
]);
export type LessonProgressStatus = z.infer<typeof LessonProgressStatusSchema>;

// URL slug convention → integer position. The DB has no `modules.slug`;
// module is located by `(course_id, position)`. The URL keeps the
// syllabus convention `module-N` for readability.
export const ModuleRoutingSlugSchema = z
  .string()
  .regex(/^module-(\d+)$/, "Use module-{int} convention.")
  .transform((v) => Number(v.slice(7)));
export type ModulePosition = number;

const SlugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only.");

// Authoring-side shape for the module row. `_meta.json` provides this.
// DB columns written: `course_id`, `title`, `position` (UNIQUE key).
export const ModuleMetaSchema = z.object({
  courseSlug: SlugSchema,
  title: z.string().min(1).max(200),
  position: z.number().int().min(0).max(99),
});
export type ModuleMeta = z.infer<typeof ModuleMetaSchema>;

// Authoring-side shape for a lesson. Bodies parsed by gray-matter.
export const LessonMetaSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  position: z.number().int().min(1).max(99),
  estimatedMinutes: z.number().int().min(1).max(60),
  content: z.object({
    format: z.literal("mdx"),
    raw: z.string().min(1).max(20_000),
  }),
});
export type LessonMeta = z.infer<typeof LessonMetaSchema>;

// Shape stored in `lessons.content` JSONB column.
export const LessonContentSchema = LessonMetaSchema.shape.content;
export type LessonContent = z.infer<typeof LessonContentSchema>;
