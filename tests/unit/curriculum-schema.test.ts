import { describe, expect, it } from "vitest";
import {
  LessonContentSchema,
  LessonMetaSchema,
  LessonProgressStatusSchema,
  ModuleMetaSchema,
  ModuleRoutingSlugSchema,
} from "@/lib/schemas/curriculum";

describe("ModuleMetaSchema", () => {
  it("accepts a valid module", () => {
    const r = ModuleMetaSchema.safeParse({
      courseSlug: "amazon-ppc-foundations",
      title: "Amazon Basics Before PPC",
      position: 0,
    });
    expect(r.success).toBe(true);
  });

  it("rejects a missing courseSlug", () => {
    const r = ModuleMetaSchema.safeParse({ title: "x", position: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects negative position", () => {
    const r = ModuleMetaSchema.safeParse({
      courseSlug: "amazon-ppc-foundations",
      title: "x",
      position: -1,
    });
    expect(r.success).toBe(false);
  });
});

describe("LessonMetaSchema", () => {
  it("accepts a valid lesson", () => {
    const r = LessonMetaSchema.safeParse({
      slug: "what-is-amazon",
      title: "What is Amazon Marketplace?",
      summary: "Amazon is the online store.",
      position: 1,
      estimatedMinutes: 3,
      content: { format: "mdx", raw: "# Hello" },
    });
    expect(r.success).toBe(true);
  });

  it("rejects an empty content.raw", () => {
    const r = LessonMetaSchema.safeParse({
      slug: "x",
      title: "x",
      summary: "x",
      position: 1,
      estimatedMinutes: 1,
      content: { raw: "" },
    });
    expect(r.success).toBe(false);
  });

  it("rejects estimatedMinutes above 60", () => {
    const r = LessonMetaSchema.safeParse({
      slug: "x",
      title: "x",
      summary: "x",
      position: 1,
      estimatedMinutes: 240,
      content: { raw: "x" },
    });
    expect(r.success).toBe(false);
  });
});

describe("ModuleRoutingSlugSchema", () => {
  it("parses module-N to integer N", () => {
    expect(ModuleRoutingSlugSchema.parse("module-0")).toBe(0);
    expect(ModuleRoutingSlugSchema.parse("module-13")).toBe(13);
  });
  it("rejects non-conforming slugs", () => {
    expect(() => ModuleRoutingSlugSchema.parse("MODULE-0")).toThrow();
    expect(() => ModuleRoutingSlugSchema.parse("module-x")).toThrow();
    expect(() => ModuleRoutingSlugSchema.parse("")).toThrow();
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

describe("LessonContentSchema", () => {
  it("accepts a valid content envelope", () => {
    const r = LessonContentSchema.safeParse({ format: "mdx", raw: "# Hello" });
    expect(r.success).toBe(true);
  });
  it("rejects an empty raw", () => {
    const r = LessonContentSchema.safeParse({ format: "mdx", raw: "" });
    expect(r.success).toBe(false);
  });
  it("rejects an unknown format", () => {
    const r = LessonContentSchema.safeParse({ format: "html", raw: "x" });
    expect(r.success).toBe(false);
  });
});
