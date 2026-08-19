import { z } from "zod";
import { CurriculumError } from "@/server/errors";
import { LessonProgressStatusSchema, type LessonProgressStatus } from "@/lib/schemas/curriculum";

const InputSchema = z.object({
  studentId: z.string().uuid(),
  lessonId: z.string().uuid(),
  status: LessonProgressStatusSchema,
});
export type MarkLessonStatusInput = z.infer<typeof InputSchema>;

export type SupabaseLike = {
  from: (table: string) => {
    upsert: (rows: unknown, opts: unknown) => Promise<{ error: { code?: string; message: string } | null }>;
  };
};

export async function markLessonStatus(
  supabase: SupabaseLike,
  input: MarkLessonStatusInput,
): Promise<{ lessonId: string; status: LessonProgressStatus }> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    throw new CurriculumError("PROGRESS_FORBIDDEN", "Invalid progress input.");
  }
  const { studentId, lessonId, status } = parsed.data;
  const completedAt = status === "complete" ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      { student_id: studentId, lesson_id: lessonId, status, current_step: 0, completed_at: completedAt },
      { onConflict: "student_id,lesson_id" },
    );
  if (error) {
    if (error.code === "42501") {
      throw new CurriculumError("PROGRESS_FORBIDDEN", "You can only update your own progress.");
    }
    throw new Error(`Progress write failed: ${error.message}`);
  }
  return { lessonId, status };
}