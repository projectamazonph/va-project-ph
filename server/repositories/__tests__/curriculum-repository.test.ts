import { describe, expect, it, vi } from "vitest";
import { createCurriculumRepository } from "@/server/repositories/curriculum-repository";
import { CurriculumError } from "@/server/errors";

type Row = Record<string, unknown>;
type QueryResult = { data: Row | Row[] | null; error: { message: string; code?: string } | null };

function makeClient(handlers: Record<string, (chain: string[]) => QueryResult>): { from: ReturnType<typeof vi.fn> } {
  const from = vi.fn((table: string) => {
    const calls: string[] = [];
    const terminal = () => Promise.resolve(handlers[table]?.(calls) ?? { data: null, error: null });
    const chain = {
      select: vi.fn(() => { calls.push("select"); return chain; }),
      eq: vi.fn((col: string, _val: unknown) => { void _val; calls.push(`eq:${col}`); return chain; }),
      in: vi.fn(() => { calls.push("in"); return terminal(); }),
      order: vi.fn(() => { calls.push("order"); return terminal(); }),
      maybeSingle: vi.fn(() => terminal()),
      single: vi.fn(() => terminal()),
    };
    return chain;
  });
  return { from };
}

const UUID1 = "11111111-1111-4111-8111-111111111111";
const UUID2 = "22222222-2222-4222-8222-222222222222";
const UUID3 = "33333333-3333-4333-8333-333333333333";

const MODULE_ROW = {
  id: UUID1,
  course_id: UUID2,
  title: "Amazon Basics",
  position: 0,
};

const LESSON_1 = {
  id: UUID1,
  module_id: UUID2,
  slug: "what-is-amazon",
  title: "What is Amazon?",
  summary: "Amazon is a store.",
  position: 2,
  estimated_minutes: 5,
  is_published: true,
  content: { format: "mdx", raw: "# Hello" },
};

const LESSON_2 = {
  ...LESSON_1,
  id: UUID3,
  slug: "what-is-a-seller",
  position: 1,
};

const PROGRESS_ROW = {
  lesson_id: UUID1,
  status: "complete" as const,
};

describe("curriculumRepository.getModuleBySlug", () => {
  it("returns the module when the position resolves", async () => {
    const client = makeClient({
      modules: () => ({ data: MODULE_ROW, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getModuleBySlug("module-0", UUID2);
    expect(out).toEqual(MODULE_ROW);
    expect(client.from).toHaveBeenCalledWith("modules");
  });

  it("throws MODULE_NOT_FOUND when no row", async () => {
    const client = makeClient({
      modules: () => ({ data: null, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    let err: unknown;
    try {
      await repo.getModuleBySlug("module-99", UUID2);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(CurriculumError);
    expect((err as CurriculumError).code).toBe("MODULE_NOT_FOUND");
    expect((err as CurriculumError).status).toBe(404);
  });

  it("throws plain Error when Supabase transport errors", async () => {
    const client = makeClient({
      modules: () => ({ data: null, error: { message: "connection failed" } }),
    });
    const repo = createCurriculumRepository(client as never);
    await expect(repo.getModuleBySlug("module-0", UUID2)).rejects.toThrow(/Module lookup failed/);
  });

  it("parses module-N to integer position via ModuleRoutingSlugSchema", async () => {
    const client = makeClient({
      modules: () => ({ data: { ...MODULE_ROW, position: 13 }, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getModuleBySlug("module-13", UUID2);
    expect(out.position).toBe(13);
  });
});

describe("curriculumRepository.listLessonsForModule", () => {
  it("returns lessons sorted by position", async () => {
    const client = makeClient({
      lessons: () => ({ data: [LESSON_1, LESSON_2], error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.listLessonsForModule(UUID2);
    expect(out.map((l) => l.position)).toEqual([1, 2]);
  });

  it("returns an empty array when no lessons exist", async () => {
    const client = makeClient({
      lessons: () => ({ data: [], error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.listLessonsForModule(UUID2);
    expect(out).toEqual([]);
  });

  it("throws plain Error when Supabase errors", async () => {
    const client = makeClient({
      lessons: () => ({ data: null, error: { message: "connection failed" } }),
    });
    const repo = createCurriculumRepository(client as never);
    await expect(repo.listLessonsForModule(UUID2)).rejects.toThrow(/Lessons lookup failed/);
  });

  it("validates lesson content envelope via Zod", async () => {
    const malformed = { ...LESSON_1, content: { format: "html", raw: "x" } };
    const client = makeClient({
      lessons: () => ({ data: [malformed], error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    await expect(repo.listLessonsForModule(UUID2)).rejects.toThrow();
  });
});

describe("curriculumRepository.getLessonBySlug", () => {
  it("returns the lesson when found", async () => {
    const client = makeClient({
      lessons: () => ({ data: LESSON_1, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getLessonBySlug(UUID2, "what-is-amazon");
    expect(out).toEqual(LESSON_1);
  });

  it("throws LESSON_NOT_FOUND when no row", async () => {
    const client = makeClient({
      lessons: () => ({ data: null, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    let err: unknown;
    try {
      await repo.getLessonBySlug(UUID2, "missing");
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(CurriculumError);
    expect((err as CurriculumError).code).toBe("LESSON_NOT_FOUND");
    expect((err as CurriculumError).status).toBe(404);
  });

  it("throws plain Error when Supabase transport errors", async () => {
    const client = makeClient({
      lessons: () => ({ data: null, error: { message: "connection failed" } }),
    });
    const repo = createCurriculumRepository(client as never);
    await expect(repo.getLessonBySlug(UUID2, "what-is-amazon")).rejects.toThrow(/Lesson lookup failed/);
  });
});

describe("curriculumRepository.getStudentProgress", () => {
  it("returns a Map keyed by lessonId with status values", async () => {
    const client = makeClient({
      lessons: () => ({ data: [LESSON_1, LESSON_2], error: null }),
      lesson_progress: () => ({ data: [PROGRESS_ROW], error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getStudentProgress("00000000-0000-0000-0000-000000000099", UUID2);
    expect(out.size).toBe(1);
    expect(out.get(UUID1)).toBe("complete");
    expect(out.has(UUID3)).toBe(false);
  });

  it("returns an empty Map when no lessons exist (early return)", async () => {
    const client = makeClient({
      lessons: () => ({ data: [], error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getStudentProgress("00000000-0000-0000-0000-000000000099", UUID2);
    expect(out.size).toBe(0);
  });

  it("returns an empty Map when lessons exist but no progress rows", async () => {
    const client = makeClient({
      lessons: () => ({ data: [LESSON_1, LESSON_2], error: null }),
      lesson_progress: () => ({ data: [], error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getStudentProgress("00000000-0000-0000-0000-000000000099", UUID2);
    expect(out.size).toBe(0);
  });

  it("throws plain Error when Supabase errors on progress lookup", async () => {
    const client = makeClient({
      lessons: () => ({ data: [LESSON_1], error: null }),
      lesson_progress: () => ({ data: null, error: { message: "connection failed" } }),
    });
    const repo = createCurriculumRepository(client as never);
    await expect(
      repo.getStudentProgress("00000000-0000-0000-0000-000000000099", UUID2),
    ).rejects.toThrow(/Progress lookup failed/);
  });
});
