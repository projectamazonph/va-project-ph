---
title: Module 0 Lesson Page — Vertical Slice Design
file: 2026-08-19-module-0-lesson-page-design.md
version: 1.0
reviewed: 2026-08-19
owner: Tech Lead + Curriculum Lead
status: active
supersedes: null
project: VA Project Philippines (v3, "The VA Project")
slice: first shippable student-facing feature
---

# Module 0 Lesson Page — Vertical Slice Design

## 1. Summary

Ship a logged-in student view of Module 0 ("Amazon Basics Before PPC") with all 7 lessons, gated by Supabase auth, with per-(student, lesson) progress tracked via the existing `lesson_progress` table. This is the first shippable user-facing feature of v3 and the template for Modules 1-14.

Out of scope for this slice: Modules 1-14, simulators, quizzes, worksheets, billing, admin, AI features.

## 2. Goals and non-goals

**Goals**
- A logged-in student can navigate to `/learn/module-0`, see all 7 lessons with their status, and mark each complete via an "I read this lesson" checkbox.
- Module 0 content lives as MDX in the repo (authoring surface), compiled into `modules` + `lessons` DB rows at build time.
- The full vertical slice — auth, DB read, DB write, UI, MDX rendering, tests — is exercised end-to-end.
- Quality gates from `AGENTS.md` and `docs/13-engineering-standards.md` all stay green.
- This slice establishes the template (MDX shape, repository/service/action pattern, error contracts, test fixtures) that Modules 1-14 will follow.

**Non-goals**
- Any content from Modules 1-14.
- Simulators, quizzes, worksheets, certificates.
- Billing, teacher dashboard, admin.
- Public (unauthenticated) preview of Module 0.
- AI features (out of scope per ADR-003 "Zero AI features").
- Analytics events on lesson complete (tracked separately in `docs/23-analytics-metrics.md`).

## 3. User-facing behavior

A logged-in student navigates to `/learn/module-0`:
1. Sees the module title "Amazon Basics Before PPC" and its one-sentence goal.
2. Sees a progress bar: "0 of 7 lessons complete".
3. Sees a list of 7 lessons, each with a status badge (`not_started` / `in_progress` / `complete`).
4. Clicks a lesson → lands on `/learn/module-0/<lesson-slug>` → sees the lesson body in plain Filipino-VA-friendly English (no jargon, per `AGENTS.md`).
5. Reads the lesson. At the bottom: a checkbox "I read this lesson" + a "Save" button.
6. Ticks the checkbox, clicks Save. The status badge flips to `complete`. The progress bar increments. Reloading the page persists the status.

A logged-out visitor navigating to `/learn/module-0` is redirected to `/login?next=/learn/module-0`. After signing in, they land back on the module page.

## 4. Architecture

### 4.1 Layered structure

| Layer | New files | Responsibility |
|---|---|---|
| Content (repo) | `content/curriculum/modules/module-0/_meta.json` + `lesson-1…7-*.mdx` | Authoring surface for Module 0 prose. |
| Compile seed | `scripts/curriculum/compile-mdx.ts` + `package.json` scripts `curriculum:compile` (apply) and `curriculum:check` (dry-run) | Reads MDX, validates frontmatter via Zod, upserts into `modules` + `lessons` via Supabase service-role client. Idempotent. |
| Zod schemas | `lib/schemas/curriculum.ts` | `ModuleSchema`, `LessonSchema`, `LessonProgressStatusSchema`. Re-used by compile, repository, service, action, client form. |
| Repository | `server/repositories/curriculum-repository.ts` | Typed read APIs wrapping Supabase. Maps `PostgrestError` codes to `CurriculumError` codes. |
| Service | `server/services/progress-service.ts` | Write logic for `lesson_progress`. Zod-validates. Maps errors. |
| Server action | `server/actions/lesson-progress.ts` | Thin Zod-validated wrapper over service for `useFormState`. Re-checks auth on every call. |
| UI | `app/(app)/layout.tsx` + `app/(app)/learn/[moduleSlug]/page.tsx` + `app/(app)/learn/[moduleSlug]/[lessonSlug]/page.tsx` + `app/(app)/learn/[moduleSlug]/[lessonSlug]/mark-read-form.tsx` | Auth gate, server-rendered pages, client form. |
| shadcn primitives (PR #4) | `input`, `label`, `form`, `separator`, `progress`, `badge`, `checkbox` | Installed via `pnpm dlx shadcn@latest add <id>`. No hand-rolled variants. Tokens only from `docs/02-design.md` per AGENTS.md. |
| Presentational | `components/learn/lesson-status-badge.tsx` + `components/learn/module-progress-bar.tsx` + `components/learn/lesson-nav.tsx` | Pure server-rendered components. |
| ADR + status updates | `docs/61-adr-curriculum-content-model.md` + edit `docs/syllabus-to-tracks-reconciliation.md` | Decision record + traceability register update. |

### 4.2 Auth gate

`app/(app)/layout.tsx` is the single auth chokepoint for every route under `(app)`. It calls `getSession()` from `server/auth/session.ts`. If no session, it calls `redirect('/login?next=<current-path>')`. Every page under `(app)` inherits this.

### 4.3 Money-math safety

Module 0 contains zero formulas (verified against `docs/curriculum-syllabus.md` lines 130-155). No code in this slice imports `lib/metrics.ts`. PR #4 adds an ESLint `no-restricted-imports` rule forbidding `lib/metrics` from `app/(app)/learn/**`.

### 4.4 Stack contract adherence

This slice touches only technologies listed in `AGENTS.md` Section "Stack Contract":
- Next.js 16.3.1 App Router + TypeScript strict.
- Tailwind 4.3.3 (tokens only from `docs/02-design.md`).
- Zod 4.4.3 at every boundary (compile, repo, service, action, client form).
- Supabase PostgreSQL + Supabase Auth.
- Vitest 4.1.10 + Testing Library (unit), Playwright 1.62.1 (e2e).
- No new dependencies are added beyond `gray-matter` for MDX frontmatter parsing (pinned version, justification in PR #1 description).

## 5. PR decomposition (one concern per PR, per AGENTS.md "small diffs")

| PR | Title | Files added | Tests added |
|---|---|---|---|
| #1 | Curriculum content + compile seed | `content/curriculum/modules/module-0/**` (8 files), `scripts/curriculum/compile-mdx.ts`, `lib/schemas/curriculum.ts`, `package.json` script entries, `lefthook.yml` hook, `.github/workflows/ci.yml` step | `scripts/curriculum/__tests__/compile-mdx.test.ts` |
| #2 | Curriculum repository (read path) | `server/repositories/curriculum-repository.ts`, edit `server/errors.ts` to add `CurriculumError` class | `server/repositories/__tests__/curriculum-repository.test.ts` |
| #3 | Progress service + server action (write path) | `server/services/progress-service.ts`, `server/actions/lesson-progress.ts` | `server/services/__tests__/progress-service.test.ts`, `server/actions/__tests__/lesson-progress.test.ts` |
| #4 | Auth-gated UI pages | `app/(app)/layout.tsx`, both `page.tsx` files, `mark-read-form.tsx`, 3 presentational components, 7 shadcn primitives via `pnpm dlx shadcn@latest add` (input, label, form, separator, progress, badge, checkbox), ESLint rule edit | `app/(app)/learn/__tests__/[moduleSlug]-page.test.tsx`, `tests/e2e/learn-module-0.spec.ts` |
| #5 | ADR + reconciliation update | `docs/61-adr-curriculum-content-model.md`, edit `docs/syllabus-to-tracks-reconciliation.md` Module 0 row | None (docs-only PR) |

Each PR is independently mergeable. Each PR must keep all six quality gates green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm docs:check`, `pnpm curriculum:check`.

## 6. Data flow

### 6.1 Compile flow (PR #1)
```
Author edits content/curriculum/modules/module-0/lesson-N-*.mdx
  → git commit
    → lefthook pre-commit runs pnpm curriculum:check (--dry-run)
      → PR opened → CI runs pnpm curriculum:check + other gates
        → PR merged → CI post-merge runs pnpm curriculum:compile (writes to staging Supabase)
          → scripts/curriculum/compile-mdx.ts
            → glob _meta.json + lesson-*.mdx
            → gray-matter parse → Zod validate (lib/schemas/curriculum.ts)
            → on schema failure → exit non-zero with file:line:error
            → upsert module row by slug; upsert lesson rows by (module_id, slug)
            → log [compiled] module=module-0 lesson=lesson-N status=upserted
              → Supabase tables (modules, lessons) now hold Module 0 + 7 lessons
```

### 6.2 View flow (PR #4)
```
GET /learn/module-0
  → app/(app)/layout.tsx (Server Component)
    → getSession() → if absent: redirect('/login?next=/learn/module-0')
  → app/(app)/learn/[moduleSlug]/page.tsx (Server Component)
    → getSession() (cached)
    → curriculumRepository.getModuleBySlug('module-0')
      → on not-found: notFound()
    → curriculumRepository.listLessonsForModule(module.id)
    → curriculumRepository.getStudentProgress(session.userId, module.id)
    → progressMap = Map<lessonId, status>
    → render <h1>, <ModuleProgressBar>, list of <LessonRow>
```

### 6.3 Mark-complete flow (PR #3 + #4)
```
Tick checkbox on /learn/module-0/<lesson-slug>
  → <MarkReadForm> useFormState action
    → markLessonStatusAction(prevState, formData)
      → getSession() → if absent: throw 'AUTH_REQUIRED'
      → Zod parse formData → { lessonId, status }
      → progressService.markLessonStatus({ studentId, lessonId, status })
        → Zod parse again (boundary #2)
        → supabase.from('lesson_progress').upsert({ student_id, lesson_id, status, updated_at: now() }, { onConflict: 'student_id,lesson_id' })
        → on RLS violation: throw 'PROGRESS_FORBIDDEN'
        → return updated row (Zod-parsed)
      → return { ok: true, lessonId, status }
    → form re-renders with badge flipped → router.refresh()
```

### 6.4 Caching strategy

- `getSession()` uses React `cache()` so multiple server components in one request share one Supabase round-trip.
- Repository module/lesson reads use Next.js 16 cache directives (the exact API — `cacheLife('minutes')` + `cacheTag('curriculum')` vs. older `fetch` options — is confirmed in PR #2 against the Next.js 16 version in `package.json`).
- Repository progress reads: `cache: 'no-store'` (must be live).
- Server actions bypass cache.

## 7. Error handling

### 7.1 Error class hierarchy

`server/errors.ts` gains a new typed error:

```ts
export class CurriculumError extends Error {
  constructor(
    public readonly code:
      | 'MODULE_NOT_FOUND'
      | 'LESSON_NOT_FOUND'
      | 'PROGRESS_FORBIDDEN'
      | 'INVALID_STATUS'
      | 'AUTH_REQUIRED',
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'CurriculumError';
  }
}
```

### 7.2 Mapping table

| Source | Trigger | Resulting code |
|---|---|---|
| `curriculum-repository.getModuleBySlug` returns null | Module slug doesn't exist | `MODULE_NOT_FOUND` |
| `curriculum-repository.listLessonsForModule` returns empty | Module has no lessons | `LESSON_NOT_FOUND` |
| `curriculum-repository.getLessonBySlug` returns null | Lesson slug doesn't exist | `LESSON_NOT_FOUND` |
| Supabase `lesson_progress` upsert returns `42501` | RLS denied (student tried to write another student's row) | `PROGRESS_FORBIDDEN` |
| Zod rejects status enum value | Form tampering or compile input bug | `INVALID_STATUS` |
| `getSession()` returns null in `app/(app)/layout.tsx` | Unauthenticated | redirect (not thrown) |
| `getSession()` returns null in `markLessonStatusAction` | Session expired mid-request | throw `AUTH_REQUIRED` |
| Anything else (network, PG 5xx) | Unknown | thrown as `Error` → `app/error.tsx` |

### 7.3 User-facing copy (plain words, per AGENTS.md)

- `AUTH_REQUIRED` → toast: *"Please sign in to save your progress."* + login button.
- `MODULE_NOT_FOUND` → `app/not-found.tsx`: *"We couldn't find that module. Head back to your dashboard."*
- `LESSON_NOT_FOUND` → `app/not-found.tsx`: *"That lesson isn't here. Try the module overview."*
- `PROGRESS_FORBIDDEN` → toast: *"You can only update your own progress. Reload the page."*
- `INVALID_STATUS` → field error on checkbox: *"Pick a valid status."*
- Generic → `app/error.tsx`: *"Something went wrong on our side. Try again in a moment."*

### 7.4 Logging

- Repository: logs Supabase request id + operation + duration at `info`.
- Service: logs `lesson_progress` writes at `info` with `{ studentIdHash, lessonId, status }`.
- All `CurriculumError` codes logged at `warn` with stack.
- No `console.log` in production code (lint rule in PR #4).

## 8. Testing

### 8.1 Coverage targets (enforced via `vitest.config.ts` thresholds)

| Component | Target |
|---|---|
| Repository | 100% line |
| Service | 100% line |
| Server action | 100% line |
| Server components | 80% line |
| Client form | 80% line |
| Compile script | 90% line |

### 8.2 Tests per PR

| PR | Test file | What it covers |
|---|---|---|
| #1 | `scripts/curriculum/__tests__/compile-mdx.test.ts` | Valid MDX → correct upsert payload; invalid frontmatter → non-zero exit; idempotent re-run |
| #2 | `server/repositories/__tests__/curriculum-repository.test.ts` | Happy paths + error code mapping (`MODULE_NOT_FOUND`, `LESSON_NOT_FOUND`, `PROGRESS_FORBIDDEN`) |
| #3 | `server/services/__tests__/progress-service.test.ts` + `server/actions/__tests__/lesson-progress.test.ts` | Auth re-check, Zod re-parse, RLS scenarios, idempotent upsert |
| #4 | `app/(app)/learn/__tests__/[moduleSlug]-page.test.tsx` + `tests/e2e/learn-module-0.spec.ts` | Server-rendered module overview + full Playwright journey (login → view → tick → save → badge flip → reload → persisted) |

### 8.3 Fixtures (in `tests/fixtures/curriculum/`)

- `module-0/_meta.json` — minimal valid module.
- `module-0/lesson-1-…mdx` — minimal valid lesson.
- `module-0/lesson-bad-frontmatter.mdx` — invalid (missing slug) for Zod-rejection test.

### 8.4 Manual UAT checklist (per `docs/20-testing-quality.md`, before merge to `main`)

- [ ] Login as a test student → land on `/learn/module-0` → see 7 lessons all `not_started`.
- [ ] Open lesson 1 → tick checkbox → Save → see status badge flip to `complete`.
- [ ] Reload page → badge persists.
- [ ] Try to manually craft a POST to `/learn/module-0/<other-lesson>` to mark someone else's progress → 403 / `PROGRESS_FORBIDDEN`.
- [ ] Logout → try `/learn/module-0` → redirects to `/login?next=/learn/module-0`.
- [ ] Open in mobile viewport (375px) → all lessons readable, no horizontal scroll.

## 9. Quality gates (must all be green at every PR merge)

- `pnpm lint` — ESLint clean.
- `pnpm typecheck` — `tsc --noEmit` clean.
- `pnpm test` — Vitest unit + integration all pass.
- `pnpm test:e2e` — Playwright all pass.
- `pnpm docs:check` — frontmatter + owner + status check (existing).
- `pnpm curriculum:check` — new gate; fails PR if any MDX frontmatter is invalid.
- No `any` types, no `eslint-disable` without reviewer-approved comment, no `console.log` in production code.

## 10. Dependencies

This slice adds at most one new runtime dependency: a tiny frontmatter parser. PR #1 must pin a specific version and add it to `package.json` with a comment in the PR description justifying the choice. Approved candidates (per the existing PR review policy):

- `gray-matter` (most common, ~100kb, no native deps).

If a different parser is preferred, the PR description must note why `gray-matter` was rejected.

No other dependencies are added in this slice. All other code uses already-installed packages from `package.json`.

## 11. Rollout and observability

- The five PRs land in sequence (no batching). Each PR is small enough to revert cleanly.
- After PR #4 merges to `main`, smoke-check staging Supabase has Module 0 + 7 lessons + at least one test student's `complete` row.
- Add the dashboards defined in `docs/21-observability-slo.md` for `lesson_progress` write rate and `CurriculumError` rate. Implementation is tracked in `docs/21`; this slice does not add dashboard code.
- No feature flag needed — Module 0 ships to all logged-in students immediately on merge.

## 12. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MDX body contains a syntax error that breaks compile | Low | High (PR blocks) | PR #1 includes the `compile-mdx.test.ts` that catches bad frontmatter; lint step includes `pnpm curriculum:check` in pre-commit + CI |
| RLS policy on `lesson_progress` doesn't exist or is misconfigured | Medium | Critical (any student could write any row) | Verify policy in PR #3 by attempting cross-student write in test; manual UAT checklist item |
| Session check in layout is bypassed | Low | High | PR #4 includes e2e test that visits `/learn/module-0` while logged out and asserts redirect |
| Module 0 copy in `docs/curriculum-syllabus.md` is incomplete or inaccurate | Medium | Medium | PR #1 lifts verbatim from `docs/curriculum-syllabus.md` lines 130-155; Curriculum Lead reviews PR #1 before merge |
| shadcn primitives pulled in conflict with `docs/02-design.md` tokens | Low | Low | shadcn primitives use Tailwind classes that resolve through `app/globals.css` which already references design tokens |
| New `gray-matter` dependency adds attack surface | Low | Low | Pinned version, no transitive runtime code used beyond frontmatter parsing |

## 13. Out of scope (deferred)

- Modules 1-14 (each follows this template; tracked in `docs/syllabus-to-tracks-reconciliation.md`).
- Simulators (S1-S14) — per `docs/42-simulator-roadmap.md`.
- Quizzes, worksheets, certificates — per `docs/syllabus-to-tracks-reconciliation.md`.
- Billing, teacher dashboard, admin, AI features.
- Public (unauthenticated) preview of Module 0.
- Analytics events on lesson complete — tracked in `docs/23-analytics-metrics.md`.

## 14. References

- `AGENTS.md` — stack contract and TDD rules.
- `docs/02-design.md` — design tokens.
- `docs/13-engineering-standards.md` — engineering standards.
- `docs/14-git-guardrails.md` — branch + PR rules.
- `docs/15-living-documentation.md` — anti-stale documentation system.
- `docs/17-adr-template.md` — ADR template (used for `docs/61-adr-curriculum-content-model.md` in PR #5).
- `docs/18-project-plan.md` — build milestones.
- `docs/20-testing-quality.md` — test strategy, UAT.
- `docs/22-content-curriculum-ops.md` — curriculum pipeline.
- `docs/35-copy-bible.md` — voice rules.
- `docs/60-ux-ui-copy-foundation.md` — UX/UI copy foundation.
- `docs/61-adr-supabase-foundation.md` — Supabase foundation ADR (precedent for PR #5).
- `docs/curriculum-syllabus.md` lines 130-155 — Module 0 source content.
- `docs/syllabus-to-tracks-reconciliation.md` — Module 0 traceability row.
- `supabase/migrations/202608180001_learning_foundation.sql` — `modules`, `lessons`, `lesson_progress` tables.
