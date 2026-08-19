"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { markLessonStatus, type SupabaseLike } from "@/server/services/progress-service";
import { CurriculumError } from "@/server/errors";
import { LessonProgressStatusSchema } from "@/lib/schemas/curriculum";

export type MarkLessonFormState =
  | { ok: true; lessonId: string; status: "not_started" | "in_progress" | "complete" }
  | { ok: false; error: { code: "AUTH_REQUIRED" | "INVALID_INPUT" | "PROGRESS_FORBIDDEN" | "UNKNOWN"; message: string } };

const FormSchema = z.object({
  lessonId: z.string().uuid("Lesson id is invalid."),
  status: LessonProgressStatusSchema,
});

export async function markLessonStatusAction(
  _prev: MarkLessonFormState | null,
  formData: FormData,
): Promise<MarkLessonFormState> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: { code: "AUTH_REQUIRED", message: "Please sign in to save your progress." } };
  }
  const parsed = FormSchema.safeParse({
    lessonId: formData.get("lessonId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { ok: false, error: { code: "INVALID_INPUT", message: parsed.error.issues[0]?.message ?? "Invalid input." } };
  }
  const supabase = (await createClient()) as unknown as SupabaseLike;
  try {
    const result = await markLessonStatus(supabase, {
      studentId: session.sub,
      lessonId: parsed.data.lessonId,
      status: parsed.data.status,
    });
    revalidateTag(`progress:student:${session.sub}`, "max");
    return { ok: true, lessonId: result.lessonId, status: result.status };
  } catch (err) {
    if (err instanceof CurriculumError && err.code === "PROGRESS_FORBIDDEN") {
      return { ok: false, error: { code: err.code, message: err.safeMessage } };
    }
    return { ok: false, error: { code: "UNKNOWN", message: "Something went wrong. Try again." } };
  }
}