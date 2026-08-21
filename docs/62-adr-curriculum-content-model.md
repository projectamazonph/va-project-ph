---
title: ADR - Curriculum Content Model
file: 62-adr-curriculum-content-model.md
version: 1.0
reviewed: 2026-08-21
owner: Tech Lead + Curriculum Lead
status: accepted
---

# ADR 62 - Curriculum Content Model

## Context

The M0 lesson page shipped in PR #10 (commit `3b01f94`) renders lesson bodies
on `app/(app)/learn/[moduleSlug]/[lessonSlug]/page.tsx`. The body is sourced
from `lessons.content` in Postgres (a JSONB value with shape `{ format: "mdx",
raw: <string> }`) and converted to HTML on the server.

The M0 corpus is 7 lessons in `content/curriculum/modules/module-0/*.mdx`.
They are **plain CommonMark**: headings, paragraphs, lists, tables, inline
emphasis, fenced code. A `grep '<[A-Z]'` over the corpus returns zero matches,
so no lesson today uses JSX, React components, or interactive widgets.

Three content-rendering choices are in front of us right now, with more to
come at M2 (interactive worksheets) and M3+ (per-lesson quizzes embedded
inline):

1. **Plain markdown** with a small zero-dep parser (e.g. `marked`).
2. **A real MDX runtime** like `@mdx-js/mdx` + a renderer, capable of embedding
   React components, but with a non-trivial bundle and build cost.
3. **A custom HTML-in-JSON shape** that the author writes by hand, with
   React components stitched in by the page.

This ADR records what we picked, why, the cost we are accepting, and the
trigger for revisiting.

## Decision

### M0 (now): plain markdown, `marked` parser, no JSX

- The author writes `.mdx` files in `content/curriculum/modules/<module>/...`
  with a YAML frontmatter block (`slug`, `title`, `summary`, `position`,
  `estimatedMinutes`) and a plain CommonMark body. The `.mdx` extension is
  retained so a future runtime upgrade is a renderer swap, not a file rename.
- `pnpm curriculum:compile` (script `scripts/curriculum/compile-mdx.ts`)
  parses frontmatter via `gray-matter`, validates against
  `LessonMetaSchema` (Zod), and UPSERTs into `modules` and `lessons`.
- At page render time, `lib/curriculum/render-markdown.ts` parses
  `lessons.content.raw` with `marked` and returns an HTML string. The page
  renders the string via `dangerouslySetInnerHTML` inside a single
  `<article>` styled by the `prose prose-ink` Tailwind plugin.

### M2: introduce a real MDX runtime (likely `next-mdx-remote`)

When worksheets need interactive React components (ACOS sliders, ROAS
scenarios, search-term input), promote MDX to a true runtime. The
frontmatter-and-file shape does not change; only the renderer does. The
compile script gains a step that pre-compiles MDX to a serialised AST (or
the runtime compiles on demand with `next-mdx-remote/rsc`).

### Forever out of scope: option 3 (hand-written HTML-in-JSON)

Authors do not write HTML. They write markdown. Editors (Design Lead, future
admin CMS) also emit markdown. Keeping one authoring format end-to-end
removes an entire class of "the JSON and the rendered output drift apart"
bugs.

## Why this split, not a single choice

- **Bundle.** `marked` is 30 KB minified, zero dependencies. `@mdx-js/mdx` +
  `next-mdx-remote` together ship ~250 KB and a webpack/turbopack
  transformation pipeline. M0 doesn't use any of that, so the cost is
  pure overhead today.
- **Author surface.** Plain markdown is the language every curriculum
  contributor already knows. MDX requires a small but real training
  ramp (component imports, prop syntax, `export const meta = ...`).
  We do not want a curriculum author blocked on a missing import.
- **Security.** `marked` is string-in, HTML-out with no JSX surface.
  M2's `next-mdx-remote/rsc` is a real React renderer and inherits the
  usual care around untrusted input. M0 content is internal-only, so
  the threat model is "the curriculum lead does not paste hostile
  markdown" rather than "an attacker controls the lesson body".
- **Reversibility.** Swapping `marked` for `next-mdx-remote` in M2 is a
  one-file change in `lib/curriculum/`. The compile script does not
  need to change shape, and the DB schema (`lessons.content` JSONB) is
  forward-compatible. This is why we kept the `.mdx` extension even
  though M0 content is plain CommonMark.

## What this means for the codebase

- **Forbidden in lesson pages.** `app/(app)/learn/**` cannot import
  `@/lib/metrics` (money math belongs in worksheets, M2+). The
  ESLint rule `no-restricted-imports` enforces this at compile time
  (added in PR #10).
- **Trust boundary.** `lessons.content.raw` is treated as trusted
  internal content. We do not run a sanitizer. If we ever ingest
  content from outside (user-generated, partner-supplied), we must
  revisit this decision and add DOMPurify or equivalent.
- **Rendering is server-only.** `lib/curriculum/render-markdown.ts` is
  imported by server components only. We do not ship `marked` to the
  client bundle.
- **Caching.** The compiled HTML is wrapped in `unstable_cache` for
  10 minutes per `(moduleId, lessonSlug)`. The cache tag is
  `curriculum:lesson:<moduleId>:<lessonSlug>`. The compile step's
  writer invalidates content tags; the progress action invalidates
  `progress:<studentId>` only, so a write of "Mark as read" never
  busts a lesson body.

## Consequences

Positive
  - M0 ships today with a 30 KB dep, no build-pipeline changes, and a
    clear upgrade path to a real MDX runtime.
  - Curriculum authors do not need to learn a new format for the M0
    work; the same CommonMark they use in a GitHub README works here.
  - The lesson pages stay fast: SSR HTML, no client-side JS for the
    body, and a stable cache layer.
  - Money math stays out of the read-and-tick slice by compile-time
    enforcement.

Negative
  - When M2 lands, the M0 lessons will render through a new runtime
    and need a visual smoke test. The plan is to keep M0's plain
    CommonMark shape so they continue to work without edits, but
    the rendering pipeline changes.
  - `marked` does not sanitise HTML. If an internal author pastes
    raw HTML, it will render. We accept this because the content
    store is internal, and we will add a `pnpm curriculum:check`
    lint that warns on raw `<script>` / `<iframe>` / `javascript:`
    in lesson bodies before M2.

Neutral
  - The `.mdx` extension is a forward-compatibility bet. If we ever
    decide MDX-the-runtime is the wrong answer, the rename to `.md`
    is a one-script migration.

## Trigger to revisit

Any one of the following moves this ADR to "superseded":

- A worksheet requires an interactive React component (ACOS slider,
  ROAS scenario, search-term input).
- A glossary term, quiz, or callout needs to be inlined into lesson
  copy by reference (e.g. `{{glossary:ACOS}}`).
- An author uses JSX in a lesson body and the compile step silently
  drops it (which is what `marked` will do today — worth catching
  early in `pnpm curriculum:check`).

## Rollback plan

If the M0 decision proves wrong, the page at
`app/(app)/learn/[moduleSlug]/[lessonSlug]/page.tsx` is the only
file that calls `renderLessonBody`. Swapping the implementation is
local. The DB column, the compile script, and the frontmatter shape
all stay the same.

## Cross-references

- M0 lesson page slice: PR #10 (commit `3b01f94`).
- M0 lesson corpus: `content/curriculum/modules/module-0/` (7 lessons).
- Compile script: `scripts/curriculum/compile-mdx.ts`.
- Renderer: `lib/curriculum/render-markdown.ts`.
- Architectural rule: `eslint.config.mjs` →
  `no-restricted-imports @/lib/metrics` under `app/(app)/learn/**`.
- Syllabus traceability: `docs/syllabus-to-tracks-reconciliation.md`
  (Module 0 row updated to "Shipped" in this PR).
- Project plan: `docs/18-project-plan.md` (M0 milestone).
