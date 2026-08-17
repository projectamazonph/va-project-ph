---
title: Content and Curriculum Operations
file: 22-content-curriculum-ops.md
version: 1.0
reviewed: 2026-08-17
owner: Design Lead (curriculum) + Docs Owner (process)
status: active
---

# 22 - Content and Curriculum Operations

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Design Lead (curriculum) + Docs Owner (process)

The lessons, glossary, quiz bank, trainer cases, and coach answers ARE the product. They are managed like code: versioned, reviewed, tested.

## Content Inventory and Ownership

| Asset | Location | Author | Approver | Test coverage |
|---|---|---|---|---|
| Modules/lessons | DB (modules, lessons) via admin editor | Curriculum author | Design Lead + Tech Lead | snapshot tests + reading-level check |
| Glossary | lib/copy/en.ts + DB mirror | Design Lead | Tech Lead (formula accuracy) | jargon-link integrity test |
| Quiz bank | DB quiz_questions | Curriculum author | Design Lead | answer-correctness unit tests |
| Trainer cases | DB + server/rules.ts expectations | Curriculum author | Tech Lead | golden grading tests |
| Coach rule answers | server/coach/rules.ts | Design Lead + AI owner | Tech Lead | eval harness (24-ai-governance.md) |
| Money formulas | lib/metrics.ts | Tech Lead ONLY | Tech Lead + Design Lead | 100% branch coverage |

## Authoring Guidelines

- Plain words; 6th-grade reading level (automated check, gate at score <= 8 on readability scale).
- One idea per lesson block; lessons <= 10 min.
- Every jargon term links to glossary on first use (CI checks).
- Examples use the canonical product family (bamboo cutting board etc.) for continuity.
- No absolute promises ("this will lower ACOS") - teach tendencies + judgment.
- Currency-neutral examples where possible; show $ signs consistently.

## Change Pipeline

```
Draft (admin editor) -> Preview (renders with student skin) -> Automated checks
  -> Curriculum review (Design Lead) -> Technical review (if logic/scoring touched)
  -> Publish (versioned; previous version retained) -> Changelog entry
```

Published content is immutable per version; edits create a new version.
Rollback = republish previous version (one click, audit-logged).
Breaking pedagogy changes (e.g., reordering modules) require ADR.

## Quality Gates for Content PRs

- [ ] Readability score within threshold
- [ ] Glossary links resolve; no undefined jargon
- [ ] Quiz answers verified by reviewer against metrics formulas
- [ ] Trainer case math re-computed by reviewer (ACOS column must match formulas)
- [ ] Student-facing copy diff reviewed word-by-word (small diffs only)

## Localization Readiness (i18n plan)

- All strings already live in lib/copy/.ts; components never inline text.
- Units and currency formatted via Intl with locale; examples may need cultural adaptation - flag with `// i18n-note:`.
- New locale process: translate copy file -> curriculum review by native-speaking teacher -> readability check in target language -> gated rollout to one cohort.
- Coach answers: rule engine translated; LLM answers constrained to enabled locales only.

## Curriculum Effectiveness Loop

- Monthly item analysis: quiz question pass rates; 30% drop-off triggers content investigation.
- Teacher feedback channel tagged curriculum; triaged in weekly content standup.

## Content Incidents

Wrong formula published = SEV-2 (teaches incorrect habits): unpublish version, notify affected cohort in-app, post correction note, post-mortem within 48h.
