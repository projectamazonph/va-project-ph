import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildUpsertPayload } from "@/scripts/curriculum/compile-mdx";

const validModule = {
  courseSlug: "amazon-ppc-foundations",
  title: "Amazon Basics Before PPC",
  position: 0,
};
const validLesson = {
  slug: "what-is-amazon",
  title: "What is Amazon Marketplace?",
  summary: "Amazon is the online store.",
  position: 1,
  estimatedMinutes: 3,
  content: { format: "mdx" as const, raw: "# Hello" },
};

describe("buildUpsertPayload", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("produces module + lesson upserts with the schema-correct keys", () => {
    const out = buildUpsertPayload({
      module: validModule,
      lessons: [validLesson],
      moduleId: "00000000-0000-0000-0000-000000000001",
      courseId: "00000000-0000-0000-0000-000000000002",
    });

    expect(out.modules).toEqual([
      expect.objectContaining({
        course_id: "00000000-0000-0000-0000-000000000002",
        title: "Amazon Basics Before PPC",
        position: 0,
      }),
    ]);

    expect(out.lessons).toHaveLength(1);
    expect(out.lessons[0]).toEqual(
      expect.objectContaining({
        module_id: "00000000-0000-0000-0000-000000000001",
        slug: "what-is-amazon",
        title: "What is Amazon Marketplace?",
        summary: "Amazon is the online store.",
        position: 1,
        estimated_minutes: 3,
        is_published: true,
        content: { format: "mdx", raw: "# Hello" },
      }),
    );
  });

  it("rejects an invalid module via Zod", () => {
    expect(() =>
      buildUpsertPayload({
        module: { ...validModule, position: -1 },
        lessons: [validLesson],
        moduleId: "x",
        courseId: "x",
      }),
    ).toThrow(/position/);
  });

  it("rejects an invalid lesson via Zod", () => {
    expect(() =>
      buildUpsertPayload({
        module: validModule,
        lessons: [{ ...validLesson, content: { format: "mdx", raw: "" } }],
        moduleId: "x",
        courseId: "x",
      }),
    ).toThrow(/raw/);
  });

  it("is idempotent on repeated calls with the same input", () => {
    const a = buildUpsertPayload({ module: validModule, lessons: [validLesson], moduleId: "m", courseId: "c" });
    const b = buildUpsertPayload({ module: validModule, lessons: [validLesson], moduleId: "m", courseId: "c" });
    expect(a).toEqual(b);
  });
});
