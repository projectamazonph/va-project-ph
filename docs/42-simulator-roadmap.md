---
title: Simulator Roadmap - Sequencing, Dependencies and Exit Gates
file: 42-simulator-roadmap.md
version: 1.0
reviewed: 2026-08-18
owner: Product Owner + Curriculum Lead
status: active
source: extracted from 18-project-plan.md, 20-testing-quality.md, 22-content-curriculum-ops.md, 27-amazon-ads-integration.md, and 36-simulators-platform.md
---

# 42 - Simulator Roadmap

The roadmap grows learner judgment in small, safe steps. A new simulator is not approved merely because it can render a form; it needs curriculum mapping, a rubric, evidence storage, teacher review rules, and a safe release gate.

## Sequence

| Phase | Scope | Exit gate |
|---|---|---|
| S1 Foundation | common scenario, attempt, version, publish, archive, and feedback contracts | retry is idempotent and old attempts remain readable |
| S2 Core judgment | Search Term Trainer and Bid Elevator | golden cases cover harvest, waste, hold, and insufficient evidence |
| S3 Planning | Campaign Builder and Listing Audit | learners can connect structure, relevance, and measurement |
| S4 Communication | Report Builder | metric accuracy and client-safe language pass review |
| S5 Teacher loop | review queue, calibration cases, appeals, and intervention links | inter-rater target and grading SLA are measurable |
| S6 Capstone | cross-tool practice account and portfolio evidence | teacher-approved capstone rubric and correction drill pass |
| S7 Future integrations | read-only approved data import, if ever needed | ADR, threat model, consent, rate limits, and rollback are accepted |

## Dependencies

- S1 depends on authentication, authorization, schemas, persistence, and audit events.
- S2-S4 depend on the shared platform and the canonical metrics library.
- S5 depends on teacher roles, cohort links, review storage, and [50-teacher-quality.md](./50-teacher-quality.md).
- S6 depends on curriculum mapping and a stable evidence export.
- S7 is independent of the MVP and must not be used to justify live write access. See [27-amazon-ads-integration.md](./27-amazon-ads-integration.md).

## Release checklist

- [ ] Learning objective is tied to a lesson and a real VA task.
- [ ] Synthetic data, formulas, expected answers, and acceptable ranges have an independent review.
- [ ] Safe-practice copy is visible at start, decision, and result.
- [ ] Mobile keyboard, focus, loading, error, retry, and no-horizontal-scroll behavior pass.
- [ ] Attempts are versioned, auditable, exportable, and never deleted as a shortcut.
- [ ] Teacher review and appeal behavior is defined before publishing the case.
- [ ] Analytics events measure completion and confusion without storing unnecessary PII.

The active product sequence and go/no-go decisions remain governed by [18-project-plan.md](./18-project-plan.md), [30-open-questions.md](./30-open-questions.md), and [43-production-gap-audit.md](./43-production-gap-audit.md).
