---
title: Project Plan - Milestones, Gates and Delivery Sequence
file: 18-project-plan.md
version: 1.0
reviewed: 2026-08-18
owner: Product Owner
status: active
source: extracted from 19-gap-analysis.md, 20-testing-quality.md, 30-open-questions.md, 43-production-gap-audit.md, and 47-product-process.md
---

# 18 - Project Plan

The project plan keeps delivery dependency-ordered. A milestone is complete only when the product behavior, tests, documentation, and operational evidence are all present.

## Milestones

| Milestone | Outcome | Exit evidence |
|---|---|---|
| M0 Foundation | repo, auth boundary, design tokens, schemas, CI, docs checker | first vertical slice and green static gates |
| M1 Learning core | lessons, quizzes, progress, glossary, student shell | student can complete a lesson and resume it |
| M2 Practice tools | safe trainer, builder, report, and simulator foundations | golden paths pass with synthetic cases |
| M3 Teacher loop | cohorts, submissions, rubric grading, calibration | teacher can grade and student can act on feedback |
| M4 Content operations | versioned curriculum, review, publish, rollback | content release gate and correction drill pass |
| M5 Beta | closed teacher/student cohort with support and analytics | beta exit criteria in [20-testing-quality.md](./20-testing-quality.md) |
| M6 Production readiness | SLOs, backups, security review, legal baseline, payments | gates in [43-production-gap-audit.md](./43-production-gap-audit.md) pass |
| M7 Growth | partner/community distribution and reliable support | approved experiment evidence and capacity review |
| M8 Future integrations | only approved read-only or other explicitly accepted integrations | ADR, threat model, consent, rollback, and operational owner |

Milestones may overlap when dependencies are explicit, but a later milestone cannot be used to excuse a missing safety or quality gate from an earlier one.

## Planning rules

- Product requirements use the PRD-lite and prioritization process in [47-product-process.md](./47-product-process.md).
- A feature has one owner, one acceptance contract, and one rollback or kill condition.
- Work that changes learner outcomes, formulas, or grading needs curriculum and teacher-quality review.
- Work that changes authentication, payment, PII, or external integrations needs security review and, where required, an ADR.
- Planned work is not represented as shipped in copy, analytics, or public claims.

## Weekly review

Review milestone status, blocked dependencies, open decisions, incident follow-ups, and documentation freshness. Move unresolved decisions to [30-open-questions.md](./30-open-questions.md) with an owner and decide-by date. Use [52-raci.md](./52-raci.md) for routing.

## Release gate

Before beta or GA promotion, verify:

- golden paths and accessibility checks are green;
- curriculum, trainer cases, and formulas were reviewed;
- teacher calibration and support coverage are ready;
- SLO dashboards and alert routes are live;
- backups were restored successfully in a rehearsal;
- legal, payment, and privacy gates are signed off;
- the release, rollback, and incident runbooks were exercised.

This plan is directional. The current decision register and production audit are authoritative for go/no-go decisions.
