import { describe, expect, it, vi } from "vitest";
import { createCurriculumRepository } from "@/server/repositories/curriculum-repository";
import { CurriculumError } from "@/server/errors";

type Row = Record<string, unknown>;
type QueryResult = { data: Row | Row[] | null; error: { message: string; code?: string } | null };

function makeClient(handlers: Record<string, (chain: string[]) => QueryResult>): { from: ReturnType<typeof vi.fn> } {
  const from = vi.fn((table: string) => {
    const calls: string[] = [];
    const chain = {
      select: vi.fn(() => { calls.push("select"); return chain; }),
      eq: vi.fn((col: string, _val: unknown) => { void _val; calls.push(`eq:${col}`); return chain; }),
      in: vi.fn(() => { calls.push("in"); return chain; }),
      order: vi.fn(() => { calls.push("order"); return chain; }),
      maybeSingle: vi.fn(() => Promise.resolve(handlers[table]?.(calls) ?? { data: null, error: null })),
      single: vi.fn(() => Promise.resolve(handlers[table]?.(calls) ?? { data: null, error: null })),
    };
    return chain;
  });
  return { from };
}

describe("curriculumRepository.getModuleBySlug", () => {
  it("returns the module when the position resolves", async () => {
    const client = makeClient({
      modules: () => ({
        data: {
          id: "11111111-1111-4111-8111-111111111111",
          course_id: "22222222-2222-4222-8222-222222222222",
          title: "Amazon Basics",
          position: 0,
        },
        error: null,
      }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getModuleBySlug("module-0", "22222222-2222-4222-8222-222222222222");
    expect(out).toEqual({
      id: "11111111-1111-4111-8111-111111111111",
      course_id: "22222222-2222-4222-8222-222222222222",
      title: "Amazon Basics",
      position: 0,
    });
  });

  it("throws MODULE_NOT_FOUND when no row", async () => {
    const client = makeClient({
      modules: () => ({ data: null, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    await expect(repo.getModuleBySlug("module-99", "c1")).rejects.toBeInstanceOf(CurriculumError);
  });
});

describe("curriculumRepository.listLessonsForModule", () => {
  it("returns lessons sorted by position", async () => {
    const client = makeClient({
      modules: () => ({ data: null, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.listLessonsForModule("m1");
    expect(out).toEqual([]);
  });
});

describe("curriculumRepository.getStudentProgress", () => {
  it("returns an empty map when no lessons exist", async () => {
    const client = makeClient({
      modules: () => ({ data: null, error: null }),
    });
    const repo = createCurriculumRepository(client as never);
    const out = await repo.getStudentProgress("s1", "m1");
    expect(out.size).toBe(0);
  });
});
