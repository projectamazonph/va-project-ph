import { z } from "zod";
import { CurriculumError } from "@/server/errors";
import {
  LessonProgressStatusSchema,
  ModuleRoutingSlugSchema,
  type LessonProgressStatus,
} from "@/lib/schemas/curriculum";

const ModuleRowSchema = z.object({
  id: z.string().uuid(),
  course_id: z.string().uuid(),
  title: z.string(),
  position: z.number().int().min(0).max(99),
});
export type Module = z.infer<typeof ModuleRowSchema>;

const LessonRowSchema = z.object({
  id: z.string().uuid(),
  module_id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  position: z.number().int().min(1).max(99),
  estimated_minutes: z.number().int().min(1).max(240),
  is_published: z.boolean(),
  content: z.object({ format: z.literal("mdx"), raw: z.string() }),
});
export type Lesson = z.infer<typeof LessonRowSchema>;

const ProgressRowSchema = z.object({
  lesson_id: z.string().uuid(),
  status: LessonProgressStatusSchema,
});

type SupabaseLike = { from: (table: string) => unknown };

export function createCurriculumRepository(supabase: SupabaseLike) {
  return {
    async getModuleBySlug(slug: string, courseId: string): Promise<Module> {
      const position = ModuleRoutingSlugSchema.parse(slug);
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (c: string, v: unknown) => {
              eq: (c: string, v: unknown) => { maybeSingle: () => Promise<{ data: unknown; error: unknown }> };
            };
          };
        };
      })
        .from("modules")
        .select("id, course_id, title, position")
        .eq("course_id", courseId)
        .eq("position", position)
        .maybeSingle();
      if (error) throw new Error(`Module lookup failed: ${(error as { message: string }).message}`);
      const parsed = ModuleRowSchema.safeParse(data);
      if (!parsed.success) throw new CurriculumError("MODULE_NOT_FOUND", "We couldn't find that module.");
      return parsed.data;
    },

    async listLessonsForModule(moduleId: string): Promise<Lesson[]> {
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (c: string, v: unknown) => {
              order: (c: string, opts: unknown) => Promise<{ data: unknown; error: unknown }>;
            };
          };
        };
      })
        .from("lessons")
        .select("id, module_id, slug, title, summary, position, estimated_minutes, is_published, content")
        .eq("module_id", moduleId)
        .order("position", { ascending: true });
      if (error) throw new Error(`Lessons lookup failed: ${(error as { message: string }).message}`);
      const rows = z.array(LessonRowSchema).parse((data as unknown[]) ?? []);
      return rows.sort((a, b) => a.position - b.position);
    },

    async getLessonBySlug(moduleId: string, lessonSlug: string): Promise<Lesson> {
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (c: string, v: unknown) => {
              eq: (c: string, v: unknown) => { maybeSingle: () => Promise<{ data: unknown; error: unknown }> };
            };
          };
        };
      })
        .from("lessons")
        .select("id, module_id, slug, title, summary, position, estimated_minutes, is_published, content")
        .eq("module_id", moduleId)
        .eq("slug", lessonSlug)
        .maybeSingle();
      if (error) throw new Error(`Lesson lookup failed: ${(error as { message: string }).message}`);
      const parsed = LessonRowSchema.safeParse(data);
      if (!parsed.success) throw new CurriculumError("LESSON_NOT_FOUND", "That lesson isn't here.");
      return parsed.data;
    },

    async getStudentProgress(studentId: string, moduleId: string): Promise<Map<string, LessonProgressStatus>> {
      const lessons = await this.listLessonsForModule(moduleId);
      const lessonIds = lessons.map((l) => l.id);
      if (lessonIds.length === 0) return new Map();
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (c: string, v: unknown) => {
              in: (c: string, v: unknown) => Promise<{ data: unknown; error: unknown }>;
            };
          };
        };
      })
        .from("lesson_progress")
        .select("lesson_id, status")
        .eq("student_id", studentId)
        .in("lesson_id", lessonIds);
      if (error) throw new Error(`Progress lookup failed: ${(error as { message: string }).message}`);
      const rows = z.array(ProgressRowSchema).parse((data as unknown[]) ?? []);
      const map = new Map<string, LessonProgressStatus>();
      for (const r of rows) map.set(r.lesson_id, r.status);
      return map;
    },
  };
}
