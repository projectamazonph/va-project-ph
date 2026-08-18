import { describe, expect, it } from "vitest";
import {
  LessonProgressStatusSchema,
  LessonSchema,
  ModuleSchema,
} from "@/lib/schemas/curriculum";

describe("ModuleSchema", () => {
  it("accepts a valid module", () => {
    const result = ModuleSchema.safeParse({
      slug: "module-0",
      title: "Amazon Basics Before PPC",
      goal: "Understand what Amazon is, what a product page is, and why ads matter.",
      position: 0,
      estMinutes: 20,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative position", () => {
    const result = ModuleSchema.safeParse({
      slug: "module-0",
      title: "x",
      goal: "x",
      position: -1,
      estMinutes: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe("LessonSchema", () => {
  it("accepts a valid lesson", () => {
    const result = LessonSchema.safeParse({
      slug: "what-is-amazon",
      title: "What is Amazon Marketplace?",
      summary: "Amazon is a giant online store.",
      position: 1,
      estMinutes: 3,
      body: "# Hello",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body", () => {
    const result = LessonSchema.safeParse({
      slug: "x",
      title: "x",
      summary: "x",
      position: 1,
      estMinutes: 1,
      body: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("LessonProgressStatusSchema", () => {
  it("accepts the three valid statuses", () => {
    expect(LessonProgressStatusSchema.parse("not_started")).toBe("not_started");
    expect(LessonProgressStatusSchema.parse("in_progress")).toBe("in_progress");
    expect(LessonProgressStatusSchema.parse("complete")).toBe("complete");
  });
  it("rejects unknown statuses", () => {
    expect(() => LessonProgressStatusSchema.parse("done")).toThrow();
  });
});
