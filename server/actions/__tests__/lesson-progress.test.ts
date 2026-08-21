import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/server/auth/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("@/server/services/progress-service", () => ({ markLessonStatus: vi.fn(), progressTag: (id: string) => `progress:student:${id}` }));

import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";
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
    expect(updateTag).toHaveBeenCalledWith(`progress:student:${STUDENT_ID}`);
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

  it("ignores a malicious studentId in form data and uses session.sub", async () => {
    const sessionSub = "11111111-1111-4111-8111-111111111111";
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      sub: sessionSub,
      role: "student",
    });
    (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ from: () => ({}) });
    (markLessonStatus as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      lessonId: "22222222-2222-4222-8222-222222222222",
      status: "complete",
    });
    const fd = new FormData();
    fd.set("studentId", "99999999-9999-4999-8999-999999999999"); // attacker trying to spoof
    fd.set("lessonId", "22222222-2222-4222-8222-222222222222");
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(true);
    expect(markLessonStatus).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ studentId: sessionSub }),
    );
    // Also: the spoofed studentId must NOT be passed through
    const callArgs = (markLessonStatus as unknown as ReturnType<typeof vi.fn>).mock.calls[0]![1] as { studentId: string };
    expect(callArgs.studentId).not.toBe("99999999-9999-4999-8999-999999999999");
  });

  it("surfaces a service-thrown INVALID_INPUT (not a form-input rejection)", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      sub: "11111111-1111-4111-8111-111111111111",
      role: "student",
    });
    (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ from: () => ({}) });
    (markLessonStatus as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new CurriculumError("INVALID_INPUT", "Invalid progress input."),
    );
    const fd = new FormData();
    fd.set("lessonId", "22222222-2222-4222-8222-222222222222");
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("INVALID_INPUT");
      expect(r.error.message).toBe("Invalid progress input.");
    }
  });

  it("returns UNKNOWN when the service throws a generic Error", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      sub: "11111111-1111-4111-8111-111111111111",
      role: "student",
    });
    (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ from: () => ({}) });
    (markLessonStatus as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("network blip"));
    const fd = new FormData();
    fd.set("lessonId", "22222222-2222-4222-8222-222222222222");
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("UNKNOWN");
      expect(r.error.message).toBe("Something went wrong. Try again.");
    }
  });

  it("returns UNKNOWN when createClient rejects", async () => {
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      sub: "11111111-1111-4111-8111-111111111111",
      role: "student",
    });
    (createClient as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("boot failure"));
    const fd = new FormData();
    fd.set("lessonId", "22222222-2222-4222-8222-222222222222");
    fd.set("status", "complete");
    const r = await markLessonStatusAction(null, fd);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("UNKNOWN");
      expect(r.error.message).toBe("Something went wrong. Try again.");
    }
  });
});