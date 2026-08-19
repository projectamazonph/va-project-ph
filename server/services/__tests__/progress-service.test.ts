import { describe, expect, it, vi } from "vitest";
import { markLessonStatus } from "@/server/services/progress-service";
import { CurriculumError } from "@/server/errors";

function makeClient(upsertResult: { error: { code?: string; message: string } | null }) {
  const upsert = vi.fn().mockResolvedValue(upsertResult);
  return { from: vi.fn(() => ({ upsert })) };
}

const STUDENT_ID = "11111111-1111-4111-8111-111111111111";
const LESSON_ID = "22222222-2222-4222-8222-222222222222";

describe("markLessonStatus", () => {
  it("upserts with the (student_id, lesson_id) unique key", async () => {
    const sb = makeClient({ error: null });
    await markLessonStatus(sb as never, {
      studentId: STUDENT_ID,
      lessonId: LESSON_ID,
      status: "complete",
    });
    const upsert = (sb.from as ReturnType<typeof vi.fn>).mock.results[0]!.value.upsert as ReturnType<typeof vi.fn>;
    expect(upsert.mock.calls[0]![0]).toEqual(
      expect.objectContaining({
        student_id: STUDENT_ID,
        lesson_id: LESSON_ID,
        status: "complete",
        completed_at: expect.any(String),
      }),
    );
    expect(upsert.mock.calls[0]![0]).not.toHaveProperty("current_step");
    expect(upsert.mock.calls[0]![1]).toEqual({ onConflict: "student_id,lesson_id" });
  });

  it("maps Supabase RLS error 42501 to PROGRESS_FORBIDDEN", async () => {
    const sb = makeClient({ error: { code: "42501", message: "rls" } });
    await expect(
      markLessonStatus(sb as never, {
        studentId: STUDENT_ID,
        lessonId: LESSON_ID,
        status: "complete",
      }),
    ).rejects.toBeInstanceOf(CurriculumError);
  });

  it("rejects an invalid status via Zod", async () => {
    const sb = makeClient({ error: null });
    await expect(
      markLessonStatus(sb as never, {
        studentId: STUDENT_ID,
        lessonId: LESSON_ID,
        status: "done" as never,
      }),
    ).rejects.toBeInstanceOf(CurriculumError);
  });

  it("sets completed_at to null when status is not complete", async () => {
    const sb = makeClient({ error: null });
    await markLessonStatus(sb as never, {
      studentId: STUDENT_ID,
      lessonId: LESSON_ID,
      status: "in_progress",
    });
    const upsert = (sb.from as ReturnType<typeof vi.fn>).mock.results[0]!.value.upsert as ReturnType<typeof vi.fn>;
    expect(upsert.mock.calls[0]![0]).toMatchObject({ completed_at: null });
  });
});