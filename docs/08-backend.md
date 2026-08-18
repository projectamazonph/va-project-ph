---
title: PPC Coach - Backend Architecture
file: 08-backend.md
version: 1.0
reviewed: 2026-08-17
owner: Backend Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Backend Architecture

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Backend Lead
Runtime: Node 22 · Next.js route handlers + server actions · Postgres + Redis

## Layer Model (strict, no skipping)

```
UI / Route Handler / Server Action        <- transport only
        |
Service layer  (business rules)           <- pure-ish, testable, no Supabase types in signatures
        |
Repository layer (data access)            <- only place Supabase clients are imported
        |
Postgres / Redis / external adapters      <- behind interfaces for testability
```

Rules:
- Components never import repositories. Services never import next/headers (session passed in).
- External systems (email, AI coach, Stripe, Amazon Ads) behind adapter interfaces; fake implementations in tests.

## Core Services

| Service | Responsibility | Key invariant |
|---|---|---|
| authService | session, login, reset, MFA | never logs credentials |
| progressService | lesson completion, prerequisites | idempotent XP awards (unique refId) |
| xpService | award, level computation | single level table; capped events |
| trainerService | grading search-term decisions | scoring server-side, deterministic |
| builderService | campaign scoring | rules engine table-driven, unit-tested |
| quizService | question delivery (no answers), grading | answers never leave server |
| reportService | metrics computation via lib/metrics | formulas from 04-schema.md §3 only |
| coachService | rule engine -> optional LLM fallback | guardrails: no financial advice, plain words |
| cohortService | teacher views, assignments, grades | teacher<->student link enforced |
| auditService | append-only event log | write-only API; no update/delete |
| rateLimit | Redis token bucket (see 10-rate-limiting.md) | fails open? NO - fail closed on Redis outage for writes |

## Business Rules Registry (single source)

All scoring/thresholds in server/rules.ts:

```typescript
export const RULES = {
  lessonXp: 20, quizXpPerCorrect: 3, trainerXpPerCorrect: 5,
  builderXp: 40, builderPassScore: 70, reportXp: 15, coachFirstAskXp: 5,
  bidSafeRange: [0.5, 1.5], starterBudgetRange: [10, 50],
  badKeywordWords: ["plastic","glass","free","wholesale","cheap","knife","bulk","used"],
} as const;
```

Any change = ADR + docs update (curriculum depends on these numbers).

## Error Handling

```typescript
class AppError extends Error {
  constructor(public code: string, public status: number, public safeMessage: string) { super(code); }
}
// e.g. throw new AppError("LESSON_LOCKED", 409, "Finish the previous lesson first.");
```

Services throw AppError; route handlers/actions map to envelopes.
Unknown errors: log full detail + correlation id; return generic message.
Error boundary per route group; 500 page with retry.

## Caching Strategy

| Data | Strategy |
|---|---|
| Lesson/module content | revalidateTag("content") on admin edit; stale-while-revalidate |
| Dashboard progress | Per-user tag `progress:`; revalidate on XP events |
| Glossary | Static import (content files) |
| Rate limits | Redis, TTL keys |

No cache for: auth decisions, quiz answers, live grades.

## Background Jobs (BullMQ on Redis)

| Job | Trigger | SLA |
|---|---|---|
| digest-email | weekly cron (teacher summary) | best-effort |
| stale-student-flag | daily cron | marks at-risk in cohort |
| audit-export | admin request | 1h |

Queue health alerts: error rate >1%, p95 >800ms, queue depth >100, Redis down.

---
