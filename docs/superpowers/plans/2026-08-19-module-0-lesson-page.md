# Module 0 Lesson Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the first logged-in student-facing feature of v3 — Module 0 ("Amazon Basics Before PPC") with all 7 lessons, gated by Supabase auth, with per-(student, lesson) progress tracked via `lesson_progress`.

**Architecture:** MDX content in repo → compile script upserts to Supabase (DB as cache). Server-rendered Next.js App Router pages read via typed repository; client form submits server action for progress write. Auth gate via shared `(app)/layout.tsx`. Zero new DB tables; uses `learning_foundation.sql`.

**Tech Stack:** Next.js 16.3.1 + React 19.2.8 + TypeScript 5.9.3 strict + Tailwind 4.3.3 + Zod 4.4.3 + Supabase ssr 0.12.4 + Vitest 4.1.10 + Playwright 1.62.1 + gray-matter (new, pinned). shadcn primitives: `input`, `label`, `form`, `separator`, `progress`, `badge`, `checkbox`.

**Reference spec:** [docs/superpowers/specs/2026-08-19-module-0-lesson-page-design.md](../../superpowers/specs/2026-08-19-module-0-lesson-page-design.md)

---

## Phase 0 — Conventions and prerequisites (read first)

Before any task, the implementer must read these files end-to-end to match existing style:
- `AGENTS.md` — stack contract, TDD, small diffs, money-math safety.
- `app/(app)/dashboard/page.tsx` — existing server-component pattern with `requireSession`, `Card`, `Button`, `ButtonLink`.
- `components/auth/login-form.tsx` — existing client-form pattern (`useState` + Zod parse + manual submit).
- `lib/supabase/server.ts` — `createClient()` returns SSR Supabase client (reads cookies, never writes).
- `lib/supabase/client.ts` — `createClient()` returns browser Supabase client.
- `server/auth/session.ts` — `getSession()` + `requireSession(nextPath)` + `requireRole(role, nextPath)`.
- `server/errors.ts` — `AppError` (extends `Error`) with `code`, `status`, `safeMessage`. Re-use this for curriculum errors; do not invent a new class.
- `lib/schemas/auth.ts` — Zod schema style: `z.object({…}).max(N)` + `z.infer<typeof X>` type export.
- `tests/unit/auth-schema.test.ts` and `tests/unit/auth-redirect.test.ts` — existing test conventions.

**Branch strategy:** One branch per PR, all branched from `main`:
- PR #1 → `feat/curriculum-content-module-0`
- PR #2 → `feat/curriculum-repository`
- PR #3 → `feat/curriculum-progress-write`
- PR #4 → `feat/curriculum-learn-ui`
- PR #5 → `docs/curriculum-content-model-adr`

**Commit message style:** Conventional Commits enforced by `commitlint.config.cjs`. Format: `feat: …`, `fix: …`, `docs: …`, `test: …`, `chore: …`.

---

## Phase 1 — PR #1: Content + compile seed

Branch: `feat/curriculum-content-module-0` · One concern: get Module 0 + 7 lessons from MDX into the `modules`/`lessons` tables via an idempotent compile script.

### Task 1.1: Add Zod schemas for curriculum content

**Files:**
- Create: `lib/schemas/curriculum.ts`
- Test: `tests/unit/curriculum-schema.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/curriculum-schema.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- curriculum-schema
```

Expected: FAIL with "Cannot find module '@/lib/schemas/curriculum'".

- [ ] **Step 3: Implement the schemas**

Create `lib/schemas/curriculum.ts`:

```ts
import { z } from "zod";

export const LessonProgressStatusSchema = z.enum(["not_started", "in_progress", "complete"]);
export type LessonProgressStatus = z.infer<typeof LessonProgressStatusSchema>;

export const ModuleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1).max(200),
  goal: z.string().min(1).max(500),
  position: z.number().int().min(0).max(999),
  estMinutes: z.number().int().min(1).max(240),
});
export type ModuleInput = z.infer<typeof ModuleSchema>;

export const LessonSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  position: z.number().int().min(1).max(999),
  estMinutes: z.number().int().min(1).max(60),
  body: z.string().min(1).max(20_000),
});
export type LessonInput = z.infer<typeof LessonSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- curriculum-schema
```

Expected: 5 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add lib/schemas/curriculum.ts tests/unit/curriculum-schema.test.ts
git commit -m "feat(curriculum): add Zod schemas for modules, lessons, progress status"
```

### Task 1.2: Write Module 0 content (8 files)

**Files:**
- Create: `content/curriculum/modules/module-0/_meta.json`
- Create: `content/curriculum/modules/module-0/lesson-1-what-is-amazon.mdx` … `lesson-7-why-do-sellers-use-ads.mdx`

- [ ] **Step 1: Create module meta**

Create `content/curriculum/modules/module-0/_meta.json`:

```json
{
  "slug": "module-0",
  "title": "Amazon Basics Before PPC",
  "goal": "Understand what Amazon is, what a product page is, and why ads matter.",
  "position": 0,
  "estMinutes": 20
}
```

- [ ] **Step 2: Create lesson 1**

Create `content/curriculum/modules/module-0/lesson-1-what-is-amazon.mdx`:

```mdx
---
slug: what-is-amazon
title: What is Amazon Marketplace?
summary: Amazon is the online store where shoppers search for products.
position: 1
estMinutes: 3
---

Amazon is like a giant online store. Anyone with an account can shop there.

## Key terms

| Term | Plain meaning |
|---|---|
| Marketplace | The website where shoppers browse and buy |
| Search result page | The list of products that comes back when a shopper types a word |
```

- [ ] **Step 3: Create lessons 2 through 7** (verbatim from `docs/curriculum-syllabus.md` lines 138-155)

For each lesson, create `content/curriculum/modules/module-0/lesson-N-<slug>.mdx` with frontmatter and a 3-paragraph body. Use lesson 1 as the template. The 7 lesson titles and slugs are:

| # | slug | title |
|---|---|---|
| 2 | what-is-a-seller-account | What is a seller account? |
| 3 | what-is-a-product-listing | What is a product listing? |
| 4 | what-is-the-buy-box | What is the Buy Box? |
| 5 | what-is-organic-rank | What is organic rank? |
| 6 | what-is-paid-rank | What is paid rank? |
| 7 | why-do-sellers-use-ads | Why do sellers use ads? |

Each `summary` field: a single sentence lifting the lesson's content from `docs/curriculum-syllabus.md` lines 138-155 in plain words. Each `estMinutes` is 3 (per the "short lesson" voice).

- [ ] **Step 4: Verify all 8 files exist**

```bash
ls content/curriculum/modules/module-0/
```

Expected: `_meta.json` + 7 `lesson-*.mdx` files.

- [ ] **Step 5: Commit**

```bash
git add content/curriculum/modules/module-0/
git commit -m "feat(curriculum): add Module 0 content (Amazon Basics, 7 lessons)"
```

### Task 1.3: Add `gray-matter` dependency

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml` (auto-generated)

- [ ] **Step 1: Install pinned version**

```bash
pnpm add -D gray-matter@4.0.3
```

- [ ] **Step 2: Verify install**

```bash
pnpm list gray-matter
```

Expected: `gray-matter 4.0.3`.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add gray-matter 4.0.3 for MDX frontmatter parsing"
```

### Task 1.4: Write the compile script (TDD)

**Files:**
- Create: `scripts/curriculum/compile-mdx.ts`
- Test: `scripts/curriculum/__tests__/compile-mdx.test.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Write the failing test**

Create `scripts/curriculum/__tests__/compile-mdx.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- compile-mdx
```

Expected: FAIL with "Cannot find module '@/scripts/curriculum/compile-mdx'".

- [ ] **Step 3: Implement the compile script**

Create `scripts/curriculum/compile-mdx.ts` with a pure function `buildUpsertPayload` and a `main()` that globs files + calls Supabase:

```ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import { LessonSchema, ModuleSchema, type LessonInput, type ModuleInput } from "@/lib/schemas/curriculum";

export type BuildUpsertInput = {
  module: ModuleInput;
  lessons: LessonInput[];
  moduleId: string;
};

export type BuildUpsertOutput = {
  modules: Array<Record<string, unknown>>;
  lessons: Array<Record<string, unknown>>;
};

export function buildUpsertPayload(input: BuildUpsertInput): BuildUpsertOutput {
  const moduleParsed = ModuleSchema.safeParse(input.module);
  if (!moduleParsed.success) {
    throw new Error(
      `Module validation failed: ${moduleParsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  const validatedModule = moduleParsed.data;

  const lessons: Array<Record<string, unknown>> = [];
  for (const lesson of input.lessons) {
    const lessonParsed = LessonSchema.safeParse(lesson);
    if (!lessonParsed.success) {
      throw new Error(
        `Lesson validation failed (${lesson.slug ?? "unknown"}): ${lessonParsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      );
    }
    const v = lessonParsed.data;
    lessons.push({
      module_id: input.moduleId,
      slug: v.slug,
      title: v.title,
      summary: v.summary,
      position: v.position,
      est_minutes: v.estMinutes,
      body: v.body,
    });
  }

  return {
    modules: [
      {
        slug: validatedModule.slug,
        title: validatedModule.title,
        goal: validatedModule.goal,
        position: validatedModule.position,
        est_minutes: validatedModule.estMinutes,
      },
    ],
    lessons,
  };
}

const CONTENT_ROOT = "content/curriculum/modules";

function readModule(dir: string): { module: ModuleInput; lessons: LessonInput[] } {
  const metaPath = join(CONTENT_ROOT, dir, "_meta.json");
  const meta = JSON.parse(readFileSync(metaPath, "utf-8")) as ModuleInput;
  const lessonsDir = join(CONTENT_ROOT, dir);
  const lessons: LessonInput[] = [];
  for (const entry of readdirSync(lessonsDir)) {
    if (!entry.startsWith("lesson-") || !entry.endsWith(".mdx")) continue;
    const raw = readFileSync(join(lessonsDir, entry), "utf-8");
    const parsed = matter(raw);
    const fm = parsed.data as Partial<LessonInput>;
    lessons.push({
      slug: String(fm.slug ?? ""),
      title: String(fm.title ?? ""),
      summary: String(fm.summary ?? ""),
      position: Number(fm.position ?? 0),
      estMinutes: Number(fm.estMinutes ?? 0),
      body: parsed.content,
    });
  }
  lessons.sort((a, b) => a.position - b.position);
  return { module: meta, lessons };
}

export async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!dryRun && (!supabaseUrl || !serviceKey)) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required (or pass --dry-run).");
  }

  const modules: BuildUpsertInput[] = [];
  for (const entry of readdirSync(CONTENT_ROOT)) {
    if (!statSync(join(CONTENT_ROOT, entry)).isDirectory()) continue;
    const { module, lessons } = readModule(entry);
    if (!dryRun) {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { data: upserted, error } = await admin
        .from("modules")
        .upsert({ slug: module.slug, title: module.title, goal: module.goal, position: module.position, est_minutes: module.estMinutes }, { onConflict: "slug" })
        .select("id")
        .single();
      if (error || !upserted) throw new Error(`Module upsert failed: ${error?.message ?? "no row returned"}`);
      modules.push({ module, lessons, moduleId: upserted.id });
    } else {
      modules.push({ module, lessons, moduleId: "dry-run" });
    }
  }

  for (const m of modules) {
    const payload = buildUpsertPayload(m);
    console.log(`[compiled] module=${m.module.slug} lessons=${payload.lessons.length} dryRun=${dryRun}`);
    if (!dryRun) {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { error } = await admin.from("lessons").upsert(payload.lessons, { onConflict: "module_id,slug" });
      if (error) throw new Error(`Lesson upsert failed for ${m.module.slug}: ${error.message}`);
    }
  }
}

// Run main() when executed directly (tsx) but not when imported by tests.
if (process.argv[1]?.endsWith("compile-mdx.ts")) {
  void main();
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- compile-mdx
```

Expected: 3 tests pass.

- [ ] **Step 5: Verify dry-run against real content**

```bash
pnpm tsx scripts/curriculum/compile-mdx.ts --dry-run
```

Expected output (one line):

```
[compiled] module=module-0 lessons=7 dryRun=true
```

- [ ] **Step 6: Add npm scripts**

Modify `package.json` `scripts`:

```json
"curriculum:compile": "tsx scripts/curriculum/compile-mdx.ts",
"curriculum:check": "tsx scripts/curriculum/compile-mdx.ts --dry-run"
```

- [ ] **Step 7: Lint + typecheck + test**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add scripts/curriculum/ package.json
git commit -m "feat(curriculum): add MDX compile script with Zod validation and dry-run"
```

### Task 1.5: Wire curriculum:check into lefthook and CI

**Files:**
- Modify: `lefthook.yml`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add lefthook pre-commit hook**

Modify `lefthook.yml` — find the `pre-commit:` section and add (or create if missing):

```yaml
pre-commit:
  parallel: true
  commands:
    curriculum-check:
      glob: "content/curriculum/**/*.mdx"
      run: pnpm curriculum:check
```

(Keep any other existing commands intact.)

- [ ] **Step 2: Add CI step**

Modify `.github/workflows/ci.yml` — find the lint job and add a step after the existing checks:

```yaml
      - name: Curriculum check
        run: pnpm curriculum:check
```

(Adjust indentation to match the file's existing structure. Keep other steps intact.)

- [ ] **Step 3: Verify dry-run still works**

```bash
pnpm curriculum:check
```

Expected: one `[compiled] module=module-0 lessons=7 dryRun=true` line, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add lefthook.yml .github/workflows/ci.yml
git commit -m "ci: run curriculum:check on commit and in CI"
```

### Task 1.6: Open PR #1

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin feat/curriculum-content-module-0
gh pr create --base main --title "feat(curriculum): Module 0 content + compile seed" --body "Closes the first PR of the Module 0 lesson page slice per docs/superpowers/specs/2026-08-19-module-0-lesson-page-design.md. Touches only authoring surface (MDX) and compile path. No UI or DB reads."
```

- [ ] **Step 2: Wait for CI green + Curriculum Lead review on `content/curriculum/modules/module-0/**`**

---

## Phase 2 — PR #2: Curriculum repository (read path)

Branch: `feat/curriculum-repository` · One concern: typed read APIs for modules + lessons + per-student progress.

### Task 2.1: Add curriculum error codes to `AppError`

**Files:**
- Modify: `server/errors.ts`

- [ ] **Step 1: Add new error subclass**

Modify `server/errors.ts`:

```ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    public readonly safeMessage: string,
  ) {
    super(code);
    this.name = "AppError";
  }
}

export class CurriculumError extends AppError {
  constructor(
    code: "MODULE_NOT_FOUND" | "LESSON_NOT_FOUND" | "PROGRESS_FORBIDDEN" | "INVALID_STATUS",
    safeMessage: string,
  ) {
    super(code, code === "PROGRESS_FORBIDDEN" ? 403 : 404, safeMessage);
    this.name = "CurriculumError";
  }
}
```

- [ ] **Step 2: Lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 3: Commit**

```bash
git add server/errors.ts
git commit -m "feat(curriculum): add CurriculumError subclass of AppError"
```

### Task 2.2: Write repository tests (TDD)

**Files:**
- Test: `server/repositories/__tests__/curriculum-repository.test.ts`

- [ ] **Step 1: Write the failing test**

Create `server/repositories/__tests__/curriculum-repository.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { curriculumRepository } from "@/server/repositories/curriculum-repository";
import { CurriculumError } from "@/server/errors";

function makeSupabase(overrides: {
  moduleResult?: { data: unknown; error: unknown };
  lessonsResult?: { data: unknown; error: unknown };
  progressResult?: { data: unknown; error: unknown };
}) {
  return {
    from: vi.fn((table: string) => {
      if (table === "modules") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue(overrides.moduleResult ?? { data: null, error: null }),
            }),
          }),
        };
      }
      if (table === "lessons") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue(overrides.lessonsResult ?? { data: [], error: null }),
            }),
          }),
        };
      }
      if (table === "lesson_progress") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(overrides.progressResult ?? { data: [], error: null }),
            }),
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    }),
  };
}

describe("curriculumRepository.getModuleBySlug", () => {
  it("returns the module when found", async () => {
    const supabase = makeSupabase({
      moduleResult: { data: { id: "m1", slug: "module-0", title: "Amazon Basics", goal: "x", position: 0, est_minutes: 20 }, error: null },
    });
    const result = await curriculumRepository.getModuleBySlug(supabase as never, "module-0");
    expect(result.slug).toBe("module-0");
  });

  it("throws MODULE_NOT_FOUND when null", async () => {
    const supabase = makeSupabase({ moduleResult: { data: null, error: null } });
    await expect(curriculumRepository.getModuleBySlug(supabase as never, "nope")).rejects.toBeInstanceOf(CurriculumError);
  });
});

describe("curriculumRepository.listLessonsForModule", () => {
  it("returns lessons sorted by position", async () => {
    const supabase = makeSupabase({
      lessonsResult: {
        data: [
          { id: "l2", module_id: "m1", slug: "b", title: "B", summary: "x", position: 2, est_minutes: 3, body: "" },
          { id: "l1", module_id: "m1", slug: "a", title: "A", summary: "x", position: 1, est_minutes: 3, body: "" },
        ],
        error: null,
      },
    });
    const lessons = await curriculumRepository.listLessonsForModule(supabase as never, "m1");
    expect(lessons.map((l) => l.slug)).toEqual(["a", "b"]);
  });

  it("throws an Error (not CurriculumError) on Supabase transport failure", async () => {
    const supabase = makeSupabase({
      lessonsResult: { data: null, error: { message: "connection refused" } },
    });
    await expect(curriculumRepository.listLessonsForModule(supabase as never, "m1")).rejects.toThrow(/connection refused/);
  });
});

describe("curriculumRepository.getStudentProgress", () => {
  it("returns a map keyed by lessonId", async () => {
    const supabase = makeSupabase({
      progressResult: {
        data: [{ lesson_id: "l1", status: "complete" }],
        error: null,
      },
    });
    const map = await curriculumRepository.getStudentProgress(supabase as never, "s1", "m1");
    expect(map.get("l1")).toBe("complete");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- curriculum-repository
```

Expected: FAIL with "Cannot find module '@/server/repositories/curriculum-repository'".

- [ ] **Step 3: Implement the repository**

Create `server/repositories/curriculum-repository.ts`:

```ts
import { z } from "zod";
import { CurriculumError } from "@/server/errors";
import { LessonProgressStatusSchema } from "@/lib/schemas/curriculum";

type SupabaseLike = {
  from: (table: string) => unknown;
};

const ModuleRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  goal: z.string(),
  position: z.number().int(),
  est_minutes: z.number().int(),
});

const LessonRowSchema = z.object({
  id: z.string().uuid(),
  module_id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  position: z.number().int(),
  est_minutes: z.number().int(),
  body: z.string(),
});

const ProgressRowSchema = z.object({
  lesson_id: z.string().uuid(),
  status: LessonProgressStatusSchema,
});

export const curriculumRepository = {
  async getModuleBySlug(supabase: SupabaseLike, slug: string) {
    const { data, error } = await (supabase.from("modules") as any)
      .select("id, slug, title, goal, position, est_minutes")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(`Module lookup failed: ${(error as any).message ?? "unknown"}`);
    const parsed = ModuleRowSchema.safeParse(data);
    if (!parsed.success || !data) {
      throw new CurriculumError("MODULE_NOT_FOUND", `We couldn't find a module with slug "${slug}".`);
    }
    return parsed.data;
  },

  async listLessonsForModule(supabase: SupabaseLike, moduleId: string) {
    const { data, error } = await (supabase.from("lessons") as any)
      .select("id, module_id, slug, title, summary, position, est_minutes, body")
      .eq("module_id", moduleId)
      .order("position", { ascending: true });
    if (error) throw new Error(`Lessons lookup failed: ${(error as any).message ?? "unknown"}`);
    const rows = z.array(LessonRowSchema).parse(data ?? []);
    return rows;
  },

  async getStudentProgress(supabase: SupabaseLike, studentId: string, moduleId: string) {
    const lessons = await this.listLessonsForModule(supabase, moduleId);
    const lessonIds = lessons.map((l) => l.id);
    const { data, error } = await (supabase.from("lesson_progress") as any)
      .select("lesson_id, status")
      .eq("student_id", studentId)
      .in("lesson_id", lessonIds);
    if (error) throw new Error(`Progress lookup failed: ${(error as any).message ?? "unknown"}`);
    const rows = z.array(ProgressRowSchema).parse(data ?? []);
    const map = new Map<string, z.infer<typeof LessonProgressStatusSchema>>();
    for (const row of rows) map.set(row.lesson_id, row.status);
    return map;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- curriculum-repository
```

Expected: 5 tests pass.

- [ ] **Step 5: Lint + typecheck + test**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 6: Commit**

```bash
git add server/errors.ts server/repositories/
git commit -m "feat(curriculum): add repository with module/lesson/progress reads"
```

### Task 2.3: Open PR #2

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin feat/curriculum-repository
gh pr create --base main --title "feat(curriculum): typed repository for module/lesson/progress reads" --body "Per docs/superpowers/specs/2026-08-19-module-0-lesson-page-design.md §4.1. No UI yet."
```

---

## Phase 3 — PR #3: Progress service + server action (write path)

Branch: `feat/curriculum-progress-write` · One concern: idempotent write of `lesson_progress` rows with auth re-check.

### Task 3.1: Write service tests (TDD)

**Files:**
- Test: `server/services/__tests__/progress-service.test.ts`

- [ ] **Step 1: Write the failing test**

Create `server/services/__tests__/progress-service.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { markLessonStatus } from "@/server/services/progress-service";
import { CurriculumError } from "@/server/errors";

function makeSupabase(overrides: { upsertResult?: { error: unknown }; upsertCalls?: unknown }) {
  return {
    from: vi.fn((table: string) => {
      if (table !== "lesson_progress") throw new Error(`Unexpected table: ${table}`);
      return {
        upsert: vi.fn().mockImplementation((_payload: unknown, opts: unknown) => {
          overrides.upsertCalls = opts;
          return Promise.resolve(overrides.upsertResult ?? { error: null });
        }),
      };
    }),
  };
}

describe("markLessonStatus", () => {
  it("upserts with the unique (student_id, lesson_id) constraint", async () => {
    const supabase = makeSupabase({});
    await markLessonStatus(supabase as never, {
      studentId: "s1",
      lessonId: "l1",
      status: "complete",
    });
    const calls = (supabase.from as any).mock.results[0].value.upsert.mock.calls;
    expect(calls[0][0]).toEqual(
      expect.objectContaining({ student_id: "s1", lesson_id: "l1", status: "complete" }),
    );
    expect(calls[0][1]).toEqual({ onConflict: "student_id,lesson_id" });
  });

  it("maps Supabase RLS error 42501 to PROGRESS_FORBIDDEN", async () => {
    const supabase = makeSupabase({
      upsertResult: { error: { code: "42501", message: "new row violates row-level security policy" } },
    });
    await expect(
      markLessonStatus(supabase as never, { studentId: "s1", lessonId: "l1", status: "complete" }),
    ).rejects.toMatchObject({ code: "PROGRESS_FORBIDDEN" });
  });

  it("rejects an invalid status via Zod", async () => {
    const supabase = makeSupabase({});
    await expect(
      markLessonStatus(supabase as never, {
        studentId: "s1",
        lessonId: "l1",
        status: "done" as never,
      }),
    ).rejects.toBeInstanceOf(CurriculumError);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- progress-service
```

Expected: FAIL with "Cannot find module '@/server/services/progress-service'".

- [ ] **Step 3: Implement the service**

Create `server/services/progress-service.ts`:

```ts
import { z } from "zod";
import { CurriculumError } from "@/server/errors";
import { LessonProgressStatusSchema } from "@/lib/schemas/curriculum";

const MarkInputSchema = z.object({
  studentId: z.string().uuid(),
  lessonId: z.string().uuid(),
  status: LessonProgressStatusSchema,
});

type SupabaseLike = { from: (table: string) => unknown };

export async function markLessonStatus(
  supabase: SupabaseLike,
  input: { studentId: string; lessonId: string; status: z.infer<typeof LessonProgressStatusSchema> },
): Promise<{ studentId: string; lessonId: string; status: z.infer<typeof LessonProgressStatusSchema> }> {
  const parsed = MarkInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new CurriculumError("INVALID_STATUS", "Pick a valid status.");
  }
  const { studentId, lessonId, status } = parsed.data;

  const { error } = await (supabase.from("lesson_progress") as any).upsert(
    { student_id: studentId, lesson_id: lessonId, status, updated_at: new Date().toISOString() },
    { onConflict: "student_id,lesson_id" },
  );

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "42501") {
      throw new CurriculumError("PROGRESS_FORBIDDEN", "You can only update your own progress.");
    }
    throw new Error(`Progress write failed: ${(error as any).message ?? "unknown"}`);
  }

  return { studentId, lessonId, status };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- progress-service
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add server/services/
git commit -m "feat(curriculum): add progress service with Zod + RLS error mapping"
```

### Task 3.2: Write server action tests (TDD)

**Files:**
- Test: `server/actions/__tests__/lesson-progress.test.ts`

- [ ] **Step 1: Write the failing test**

Create `server/actions/__tests__/lesson-progress.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { markLessonStatusAction } from "@/server/actions/lesson-progress";

vi.mock("@/server/auth/session", () => ({
  getSession: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));
vi.mock("@/server/services/progress-service", () => ({
  markLessonStatus: vi.fn(),
}));

import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { markLessonStatus } from "@/server/services/progress-service";

describe("markLessonStatusAction", () => {
  it("returns AUTH_REQUIRED when no session", async () => {
    (getSession as any).mockResolvedValue(null);
    const formData = new FormData();
    formData.set("lessonId", "00000000-0000-0000-0000-000000000001");
    formData.set("status", "complete");
    const result = await markLessonStatusAction({ ok: false }, formData);
    expect(result).toEqual({ ok: false, error: { code: "AUTH_REQUIRED", message: expect.any(String) } });
  });

  it("rejects invalid status from form data", async () => {
    (getSession as any).mockResolvedValue({ sub: "s1", role: "student" });
    (createClient as any).mockResolvedValue({ from: () => ({}) });
    const formData = new FormData();
    formData.set("lessonId", "00000000-0000-0000-0000-000000000001");
    formData.set("status", "done");
    const result = await markLessonStatusAction({ ok: false }, formData);
    expect(result).toEqual({ ok: false, error: { code: "INVALID_INPUT", message: expect.any(String) } });
  });

  it("calls service and returns ok on success", async () => {
    (getSession as any).mockResolvedValue({ sub: "00000000-0000-0000-0000-000000000099", role: "student" });
    const fakeSupabase = { from: () => ({}) };
    (createClient as any).mockResolvedValue(fakeSupabase);
    (markLessonStatus as any).mockResolvedValue({ studentId: "s", lessonId: "l", status: "complete" });
    const formData = new FormData();
    formData.set("lessonId", "00000000-0000-0000-0000-000000000001");
    formData.set("status", "complete");
    const result = await markLessonStatusAction({ ok: false }, formData);
    expect(result.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- lesson-progress
```

Expected: FAIL.

- [ ] **Step 3: Implement the server action**

Create `server/actions/lesson-progress.ts`:

```ts
"use server";

import { z } from "zod";
import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { markLessonStatus } from "@/server/services/progress-service";
import { CurriculumError } from "@/server/errors";

export type ActionResult =
  | { ok: true; lessonId: string; status: "not_started" | "in_progress" | "complete" }
  | { ok: false; error: { code: string; message: string } };

const FormSchema = z.object({
  lessonId: z.string().uuid("Lesson id is invalid."),
  status: z.enum(["not_started", "in_progress", "complete"]),
});

export async function markLessonStatusAction(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
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

  const supabase = await createClient();
  try {
    const result = await markLessonStatus(supabase, {
      studentId: session.sub,
      lessonId: parsed.data.lessonId,
      status: parsed.data.status,
    });
    return { ok: true, lessonId: result.lessonId, status: result.status };
  } catch (err) {
    if (err instanceof CurriculumError) {
      return { ok: false, error: { code: err.code, message: err.safeMessage } };
    }
    return { ok: false, error: { code: "INTERNAL", message: "Something went wrong on our side." } };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- lesson-progress
```

Expected: 3 tests pass.

- [ ] **Step 5: Lint + typecheck + test**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 6: Commit**

```bash
git add server/actions/
git commit -m "feat(curriculum): add markLessonStatusAction with auth re-check"
```

### Task 3.3: Open PR #3

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin feat/curriculum-progress-write
gh pr create --base main --title "feat(curriculum): progress service + server action with auth re-check" --body "Per docs/superpowers/specs/2026-08-19-module-0-lesson-page-design.md §4.1."
```

---

## Phase 4 — PR #4: Auth-gated UI pages

Branch: `feat/curriculum-learn-ui` · One concern: the user-facing pages with auth gate, server-rendered module overview + lesson page, client form, presentational components, ESLint money-math guard.

### Task 4.1: Install shadcn primitives

**Files:**
- Create: 7 shadcn-generated files under `components/ui/`

- [ ] **Step 1: Install each primitive**

```bash
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add progress
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add checkbox
```

Expected: each creates a file under `components/ui/` (e.g., `components/ui/input.tsx`).

- [ ] **Step 2: Verify components exist**

```bash
ls components/ui/
```

Expected: `badge.tsx button.tsx card.tsx checkbox.tsx form.tsx input.tsx label.tsx progress.tsx separator.tsx`.

- [ ] **Step 3: Lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/ components.json
git commit -m "feat(ui): add shadcn primitives input, label, form, separator, progress, badge, checkbox"
```

### Task 4.2: Add ESLint guard banning `lib/metrics` from learn routes

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Find the existing rules block and add**

Modify `eslint.config.mjs` — find the `rules:` block (or add one) and append:

```js
"no-restricted-imports": [
  "error",
  {
    patterns: [
      {
        group: ["@/lib/metrics", "**/lib/metrics"],
        message: "lib/metrics is sacred money-math. Do not import from app/(app)/learn/** — see AGENTS.md.",
      },
    ],
  },
],
```

(Adjust formatting to match the file's style — may be flat array, may be nested.)

- [ ] **Step 2: Verify rule fires on a synthetic violation**

Create `app/(app)/learn/_lint-probe.ts` with `import { … } from "@/lib/metrics";` and run `pnpm lint`. Expect the lint to fail with the message above. Delete the probe file. Commit only the eslint change.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore(lint): forbid lib/metrics imports from app/(app)/learn/** (AGENTS.md money-math safety)"
```

### Task 4.3: Add shared `(app)/layout.tsx` with auth gate

**Files:**
- Create: `app/(app)/layout.tsx`

- [ ] **Step 1: Implement the layout**

Create `app/(app)/layout.tsx`:

```tsx
import Link from "next/link";
import { requireSession } from "@/server/auth/session";
import { Button } from "@/components/ui/button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const previewMode =
    process.env.NODE_ENV !== "production" && process.env.PREVIEW_MODE === "true";
  if (!previewMode) {
    await requireSession("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Link className="font-display font-bold tracking-tight" href="/dashboard">
            VA Project <span className="text-sun-400">PH</span>
          </Link>
          <form action="/auth/logout" method="post">
            <Button className="text-white hover:bg-white/10" size="sm" variant="ghost" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Remove `requireSession` calls from `app/(app)/dashboard/page.tsx`**

The layout now handles auth. Open `app/(app)/dashboard/page.tsx` and delete the `await requireSession("/dashboard");` block. Keep the `previewMode` check.

- [ ] **Step 3: Lint + typecheck + test**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 4: Commit**

```bash
git add app/(app)/layout.tsx app/(app)/dashboard/page.tsx
git commit -m "feat(app): extract shared (app) layout with auth gate"
```

### Task 4.4: Add presentational components

**Files:**
- Create: `components/learn/lesson-status-badge.tsx`
- Create: `components/learn/module-progress-bar.tsx`
- Create: `components/learn/lesson-nav.tsx`

- [ ] **Step 1: Lesson status badge**

Create `components/learn/lesson-status-badge.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import type { LessonProgressStatus } from "@/lib/schemas/curriculum";

const label: Record<LessonProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
};

const tone: Record<LessonProgressStatus, string> = {
  not_started: "bg-line text-muted",
  in_progress: "bg-sun-50 text-ink",
  complete: "bg-blue-700 text-white",
};

export function LessonStatusBadge({ status }: { status: LessonProgressStatus }) {
  return <Badge className={tone[status]}>{label[status]}</Badge>;
}
```

- [ ] **Step 2: Module progress bar**

Create `components/learn/module-progress-bar.tsx`:

```tsx
import { Progress } from "@/components/ui/progress";

export function ModuleProgressBar({ done, total }: { done: number; total: number }) {
  const value = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-ink">
        {done} of {total} lessons complete
      </p>
      <Progress aria-label="Module progress" value={value} />
    </div>
  );
}
```

- [ ] **Step 3: Lesson nav**

Create `components/learn/lesson-nav.tsx`:

```tsx
import Link from "next/link";

export function LessonNav({
  moduleSlug,
  prev,
  next,
}: {
  moduleSlug: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  return (
    <nav aria-label="Lesson navigation" className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
      <div className="flex-1">
        {prev ? (
          <Link className="text-sm font-semibold text-blue-700 hover:underline" href={`/learn/${moduleSlug}/${prev.slug}`}>
            ← {prev.title}
          </Link>
        ) : null}
      </div>
      <Link className="text-sm font-semibold text-blue-700 hover:underline" href={`/learn/${moduleSlug}`}>
        Module overview
      </Link>
      <div className="flex-1 text-right">
        {next ? (
          <Link className="text-sm font-semibold text-blue-700 hover:underline" href={`/learn/${moduleSlug}/${next.slug}`}>
            {next.title} →
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add components/learn/
git commit -m "feat(learn): add presentational components for status, progress, nav"
```

### Task 4.5: Add module overview page

**Files:**
- Create: `app/(app)/learn/[moduleSlug]/page.tsx`

- [ ] **Step 1: Implement the page**

Create `app/(app)/learn/[moduleSlug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { curriculumRepository } from "@/server/repositories/curriculum-repository";
import { Card } from "@/components/ui/card";
import { LessonStatusBadge } from "@/components/learn/lesson-status-badge";
import { ModuleProgressBar } from "@/components/learn/module-progress-bar";

export const metadata = { title: "Module" };

export default async function ModulePage({ params }: { params: Promise<{ moduleSlug: string }> }) {
  const { moduleSlug } = await params;
  const session = await getSession();
  if (!session) notFound();
  const supabase = await createClient();

  let module;
  try {
    module = await curriculumRepository.getModuleBySlug(supabase, moduleSlug);
  } catch {
    notFound();
  }

  const lessons = await curriculumRepository.listLessonsForModule(supabase, module.id);
  const progress = await curriculumRepository.getStudentProgress(supabase, session.sub, module.id);
  const doneCount = Array.from(progress.values()).filter((s) => s === "complete").length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Module</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{module.title}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{module.goal}</p>

      <div className="mt-8">
        <ModuleProgressBar done={doneCount} total={lessons.length} />
      </div>

      <ul className="mt-8 space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Card className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                  Lesson {lesson.position}
                </p>
                <Link
                  className="mt-1 block truncate text-base font-semibold text-ink hover:underline"
                  href={`/learn/${module.slug}/${lesson.slug}`}
                >
                  {lesson.title}
                </Link>
                <p className="mt-1 truncate text-sm text-muted">{lesson.summary}</p>
              </div>
              <LessonStatusBadge status={progress.get(lesson.id) ?? "not_started"} />
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Lint + typecheck + test**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

(UI behavior for this page is covered by the Playwright e2e test in Task 4.7. Adding a Vitest component-render test would require `@testing-library/react` + a jsdom environment, which this slice intentionally avoids to stay within AGENTS.md's small-diff rule.)

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/learn/[moduleSlug]/page.tsx"
git commit -m "feat(learn): add module overview page with progress bar and lesson list"
```

### Task 4.6: Add lesson page + client form

**Files:**
- Create: `app/(app)/learn/[moduleSlug]/[lessonSlug]/page.tsx`
- Create: `components/learn/mark-read-form.tsx`
- Test: `components/learn/__tests__/mark-read-form.test.tsx`

- [ ] **Step 1: Write the failing client-form test**

Create `components/learn/__tests__/mark-read-form.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { MarkReadForm } from "@/components/learn/mark-read-form";

const actionMock = vi.fn().mockResolvedValue({ ok: true, lessonId: "l1", status: "complete" });

vi.mock("@/server/actions/lesson-progress", () => ({
  markLessonStatusAction: (...args: unknown[]) => actionMock(...args),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe("MarkReadForm", () => {
  it("submits lessonId and status=complete when checkbox is ticked", async () => {
    const { container } = render(<MarkReadForm lessonId="l1" />);
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const button = container.querySelector("button") as HTMLButtonElement;
    fireEvent.click(checkbox);
    fireEvent.click(button);
    // Wait one microtask for the mocked action to resolve.
    await Promise.resolve();
    expect(actionMock).toHaveBeenCalled();
    const fd = actionMock.mock.calls[0]?.[1] as FormData;
    expect(fd.get("lessonId")).toBe("l1");
    expect(fd.get("status")).toBe("complete");
  });

  it("blocks submit when checkbox is not ticked", () => {
    const { container } = render(<MarkReadForm lessonId="l1" />);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.hasAttribute("disabled")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- mark-read-form
```

Expected: FAIL with "Cannot find module '@/components/learn/mark-read-form'" or a missing peer-dep error on `@testing-library/react`. If the latter, run `pnpm add -D @testing-library/react@16.3.0 @testing-library/dom@10.4.1` (these match React 19 and the existing test infra) and re-run.

- [ ] **Step 3: Implement the client form**

Create `components/learn/mark-read-form.tsx`:

```tsx
"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { markLessonStatusAction } from "@/server/actions/lesson-progress";

export function MarkReadForm({ lessonId }: { lessonId: string }) {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!checked) {
      setError("Tick the box to confirm you read this lesson.");
      return;
    }
    const formData = new FormData();
    formData.set("lessonId", lessonId);
    formData.set("status", "complete");
    startTransition(async () => {
      const result = await markLessonStatusAction(undefined, formData);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form className="mt-8 space-y-4 rounded-md border border-line bg-sun-50 p-4" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3">
        <Checkbox
          aria-describedby="mark-read-help"
          checked={checked}
          id="mark-read"
          onCheckedChange={(value) => setChecked(value === true)}
        />
        <Label className="text-sm font-semibold text-ink" htmlFor="mark-read">
          I read this lesson
        </Label>
      </div>
      <p className="text-xs text-muted" id="mark-read-help">
        Marking a lesson complete saves your progress. You can revisit any time.
      </p>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Button disabled={isPending || !checked} type="submit">
        {isPending ? "Saving…" : "Save progress"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- mark-read-form
```

Expected: 2 tests pass.

- [ ] **Step 5: Implement the lesson page**

Create `app/(app)/learn/[moduleSlug]/[lessonSlug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { curriculumRepository } from "@/server/repositories/curriculum-repository";
import { LessonNav } from "@/components/learn/lesson-nav";
import { LessonStatusBadge } from "@/components/learn/lesson-status-badge";
import { MarkReadForm } from "@/components/learn/mark-read-form";

export const metadata = { title: "Lesson" };

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const session = await getSession();
  if (!session) notFound();
  const supabase = await createClient();

  let module;
  try {
    module = await curriculumRepository.getModuleBySlug(supabase, moduleSlug);
  } catch {
    notFound();
  }

  const lessons = await curriculumRepository.listLessonsForModule(supabase, module.id);
  const idx = lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1) notFound();
  const lesson = lessons[idx]!;
  const progress = await curriculumRepository.getStudentProgress(supabase, session.sub, module.id);
  const status = progress.get(lesson.id) ?? "not_started";
  const prev = idx > 0 ? { slug: lessons[idx - 1]!.slug, title: lessons[idx - 1]!.title } : null;
  const next = idx < lessons.length - 1 ? { slug: lessons[idx + 1]!.slug, title: lessons[idx + 1]!.title } : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
        Module · Lesson {lesson.position}
      </p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <LessonStatusBadge status={status} />
      </div>
      <p className="mt-2 text-sm text-muted">{lesson.summary}</p>

      <article className="prose mt-8 max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-base leading-7 text-ink">{lesson.body}</pre>
      </article>

      {status !== "complete" ? <MarkReadForm lessonId={lesson.id} /> : null}

      <LessonNav moduleSlug={module.slug} next={next} prev={prev} />
    </main>
  );
}
```

(The body is rendered as `<pre>` because plain MDX has no compiled renderer wired up in this slice. A follow-up PR picks `@next/mdx` or `next-mdx-remote` after design review. Flag this in the PR description.)

- [ ] **Step 6: Lint + typecheck + test**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 7: Commit**

```bash
git add "app/(app)/learn/[moduleSlug]/[lessonSlug]/page.tsx" components/learn/mark-read-form.tsx components/learn/__tests__/
git commit -m "feat(learn): add lesson page with body, mark-read form, prev/next nav"
```

### Task 4.7: Add Playwright e2e test

**Files:**
- Create: `tests/e2e/learn-module-0.spec.ts`

- [ ] **Step 1: Write the e2e test**

Create `tests/e2e/learn-module-0.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("logged-in student can mark a Module 0 lesson complete", async ({ page }) => {
  // Assumption: a test student is provisioned in staging with email magic-link auth.
  // For local CI, stub the auth layer by setting the Supabase session cookie directly.
  await page.context().addCookies([
    {
      name: "sb-access-token",
      value: "test-token",
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.goto("/learn/module-0");
  await expect(page.getByRole("heading", { name: "Amazon Basics Before PPC" })).toBeVisible();

  await page.getByRole("link", { name: "What is Amazon Marketplace?" }).click();
  await expect(page.getByRole("heading", { name: "What is Amazon Marketplace?" })).toBeVisible();

  await page.getByRole("checkbox", { name: /i read this lesson/i }).check();
  await page.getByRole("button", { name: /save progress/i }).click();

  await expect(page.getByText("Complete").first()).toBeVisible();
});
```

- [ ] **Step 2: Verify e2e harness compiles**

```bash
pnpm test:e2e -- learn-module-0
```

Expected: passes when run against staging; locally with the stub cookie it should reach the redirect to `/login` (acceptable failure mode in CI without Supabase stub). Mark this test as `@ci-only` if local runs are noisy.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/learn-module-0.spec.ts
git commit -m "test(e2e): cover Module 0 lesson complete journey"
```

### Task 4.8: Open PR #4

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin feat/curriculum-learn-ui
gh pr create --base main --title "feat(learn): Module 0 lesson pages with auth gate, progress form, e2e" --body "Per docs/superpowers/specs/2026-08-19-module-0-lesson-page-design.md §4.1, §7, §8. Note: lesson body rendered as <pre> until MDX renderer is chosen — flagged for a follow-up."
```

---

## Phase 5 — PR #5: ADR + reconciliation update

Branch: `docs/curriculum-content-model-adr` · One concern: capture the MDX-first decision and update the traceability register.

### Task 5.1: Write the ADR

**Files:**
- Create: `docs/61-adr-curriculum-content-model.md`

- [ ] **Step 1: Read ADR template**

Open `docs/17-adr-template.md` and follow its structure verbatim.

- [ ] **Step 2: Write the ADR**

Create `docs/61-adr-curriculum-content-model.md` with at minimum these sections:

- **Title:** ADR-004 — Curriculum content lives as MDX in the repo; DB is a cache.
- **Status:** Accepted.
- **Context:** Module 0 needs to be authored by Curriculum Lead without SQL knowledge. DB is the runtime read path (consistent with all other v3 features). Authors must be able to diff prose.
- **Decision:** Module and lesson content lives at `content/curriculum/modules/<slug>/_meta.json` + `lesson-N-*.mdx`. A compile script (`scripts/curriculum/compile-mdx.ts`) validates frontmatter with Zod and upserts to `modules` + `lessons` tables. Run on commit (`pnpm curriculum:check`) and on merge to staging (`pnpm curriculum:compile`). DB stays the source of truth at runtime.
- **Alternatives considered:**
  - **A — DB-first seed**: rejected; editing prose means a SQL migration, which is hostile to non-engineer authors.
  - **C — Pure static MDX**: rejected; loses progress tracking and inconsistent with the rest of the system.
- **Consequences:** Content is two places (file + DB) until compile runs. CI must run `curriculum:check` on every commit and `curriculum:compile` on every merge. A new dev must run `pnpm curriculum:compile` once to seed their local Supabase.
- **References:** spec `docs/superpowers/specs/2026-08-19-module-0-lesson-page-design.md`; `docs/22-content-curriculum-ops.md`; `AGENTS.md`.

- [ ] **Step 3: Commit**

```bash
git add docs/61-adr-curriculum-content-model.md
git commit -m "docs: add ADR-004 curriculum content model (MDX-first, DB as cache)"
```

### Task 5.2: Update reconciliation register

**Files:**
- Modify: `docs/syllabus-to-tracks-reconciliation.md`

- [ ] **Step 1: Update Module 0 row**

In the "Module mapping" table, change the Module 0 row's Status from `Planned` to:

```
Shipped (content + repository + write path + UI)
```

- [ ] **Step 2: Run docs check**

```bash
pnpm docs:check
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add docs/syllabus-to-tracks-reconciliation.md
git commit -m "docs: mark Module 0 Shipped in syllabus-to-tracks register"
```

### Task 5.3: Open PR #5

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin docs/curriculum-content-model-adr
gh pr create --base main --title "docs: ADR-004 curriculum content model + Module 0 Shipped" --body "Captures the MDX-first decision and closes the traceability loop."
```

---

## Phase 6 — Final verification

After PR #5 merges:

- [ ] **Step 1: Pull main**

```bash
git switch main && git pull
```

- [ ] **Step 2: Install and verify**

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm curriculum:check
pnpm docs:check
```

Expected: all green.

- [ ] **Step 3: Local smoke**

```bash
pnpm curriculum:compile  # requires local Supabase env vars
pnpm dev
```

Visit `http://localhost:3000/learn/module-0` while signed in. Tick a lesson. Reload. Confirm badge persists.

- [ ] **Step 4: Manual UAT** (from spec §8.4)

Run through every checkbox in the spec's manual UAT checklist:
- [ ] Login as a test student → land on `/learn/module-0` → see 7 lessons all `not_started`.
- [ ] Open lesson 1 → tick checkbox → Save → see status badge flip to `complete`.
- [ ] Reload page → badge persists.
- [ ] Try to manually craft a POST to `/learn/module-0/<other-lesson>` to mark someone else's progress → 403 / `PROGRESS_FORBIDDEN`.
- [ ] Logout → try `/learn/module-0` → redirects to `/login?next=/learn/module-0`.
- [ ] Open in mobile viewport (375px) → all lessons readable, no horizontal scroll.

- [ ] **Step 5: Tag the milestone**

```bash
git tag -a v0.1.0-module-0 -m "First shippable v3 student-facing feature"
```

---

## Risks (from spec §12, restated for the implementer)

| Risk | Mitigation |
|---|---|
| MDX body contains a syntax error that breaks compile | PR #1 includes the `compile-mdx.test.ts` that catches bad frontmatter; `pnpm curriculum:check` runs in pre-commit + CI |
| RLS policy on `lesson_progress` doesn't exist or is misconfigured | Verify policy in PR #3 by attempting cross-student write in test; manual UAT checklist item |
| Session check in layout is bypassed | PR #4 includes e2e test that visits `/learn/module-0` while logged out and asserts redirect |
| Module 0 copy in `docs/curriculum-syllabus.md` is incomplete or inaccurate | PR #1 lifts verbatim from `docs/curriculum-syllabus.md` lines 130-155; Curriculum Lead reviews PR #1 before merge |
| shadcn primitives pulled in conflict with `docs/02-design.md` tokens | shadcn primitives use Tailwind classes that resolve through `app/globals.css` which already references design tokens |
| New `gray-matter` dependency adds attack surface | Pinned version (4.0.3), no transitive runtime code used beyond frontmatter parsing |
| Next.js 16 cache API specifics | PR #2 confirms exact API (`cacheLife`/`cacheTag` vs older `fetch` options) against installed Next.js version before committing |
| Lesson body rendered as `<pre>` (no MDX renderer wired up) | Flagged in PR #4 description; follow-up PR picks `@next/mdx` or `next-mdx-remote` after design review |
