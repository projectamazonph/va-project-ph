import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildUpsertPayload } from "@/scripts/curriculum/compile-mdx";

const validModule = {
  slug: "module-0",
  title: "Amazon Basics Before PPC",
  goal: "Understand Amazon basics.",
  position: 0,
  estMinutes: 20,
};

const validLesson = {
  slug: "what-is-amazon",
  title: "What is Amazon Marketplace?",
  summary: "Amazon is the online store.",
  position: 1,
  estMinutes: 3,
  body: "# Hello",
};

describe("buildUpsertPayload", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("produces a module upsert keyed by slug and a lesson upsert keyed by (module_id, slug)", () => {
    const result = buildUpsertPayload({
      module: validModule,
      lessons: [validLesson],
      moduleId: "00000000-0000-0000-0000-000000000001",
    });

    expect(result.modules).toEqual([
      expect.objectContaining({
        slug: "module-0",
        title: "Amazon Basics Before PPC",
        goal: "Understand Amazon basics.",
        position: 0,
        est_minutes: 20,
      }),
    ]);
    expect(result.lessons).toHaveLength(1);
    expect(result.lessons[0]).toEqual(
      expect.objectContaining({
        module_id: "00000000-0000-0000-0000-000000000001",
        slug: "what-is-amazon",
        title: "What is Amazon Marketplace?",
        position: 1,
      }),
    );
    expect(result.lessons[0]?.body).toContain("# Hello");
  });

  it("rejects an invalid module via Zod and throws a structured error", () => {
    expect(() =>
      buildUpsertPayload({
        module: { ...validModule, position: -1 },
        lessons: [validLesson],
        moduleId: "x",
      }),
    ).toThrow(/position/);
  });

  it("rejects an invalid lesson via Zod and throws a structured error", () => {
    expect(() =>
      buildUpsertPayload({
        module: validModule,
        lessons: [{ ...validLesson, body: "" }],
        moduleId: "x",
      }),
    ).toThrow(/body/);
  });
});
