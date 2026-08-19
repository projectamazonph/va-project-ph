import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/server/auth/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));
vi.mock("@/server/services/progress-service", () => ({ markLessonStatus: vi.fn() }));

import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { markLessonStatus } from "@/server/services/progress-service";
import { markLessonStatusAction } from "@/server/actions/lesson-progress";
import { CurriculumError } from "@/server/errors";

const STUDENT_ID = "33333333-3333-4333-8333-333333333333";
const LESSON_ID = "44444444-4444-4444-8444-444444444444";

describe("markLessonStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns AUTH_REQUIRED when no session", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const fd = new FormData();
    fd.set("lessonId", LESSON_ID);
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("AUTH_REQUIRED");
  });

  it("rejects an invalid status from form data", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ sub: STUDENT_ID, role: "student" });
    const fd = new FormData();
    fd.set("lessonId", LESSON_ID);
    fd.set("status", "done");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("INVALID_INPUT");
  });

  it("calls the service, revalidates the tag, and returns ok on success", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      sub: STUDENT_ID,
      role: "student",
    });
    (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ from: () => ({}) });
    (markLessonStatus as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      lessonId: LESSON_ID,
      status: "complete",
    });
    const fd = new FormData();
    fd.set("lessonId", LESSON_ID);
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith(`progress:student:${STUDENT_ID}`, "max");
  });

  it("maps service PROGRESS_FORBIDDEN to the action error code", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      sub: STUDENT_ID,
      role: "student",
    });
    (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ from: () => ({}) });
    (markLessonStatus as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new CurriculumError("PROGRESS_FORBIDDEN", "You can only update your own progress."),
    );
    const fd = new FormData();
    fd.set("lessonId", LESSON_ID);
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("PROGRESS_FORBIDDEN");
  });
});