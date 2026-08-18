---
title: Simulator Platform - Common Contract and Safety Model
file: 36-simulators-platform.md
version: 1.0
reviewed: 2026-08-18
owner: Backend Lead + Curriculum Lead
status: active
source: extracted from 20-testing-quality.md, 22-content-curriculum-ops.md, 34-interactions-and-events.md, 44-architecture.md, 50-teacher-quality.md, and 60-ux-ui-copy-foundation.md
---

# 36 - Simulator Platform

Simulators are safe practice environments for PPC judgment. They must teach a decision, explain the consequence, and make it impossible for a student to believe a practice action changed a live Amazon account.

## Non-negotiable safety rules

- Use synthetic or explicitly approved training data only.
- Never accept or store live Amazon credentials in the student simulator.
- Never send a simulator decision to Amazon Ads or change a real budget, bid, listing, or campaign.
- Label every result as practice or formative; a score is not certification or hiring evidence.
- Preserve the scenario version and rubric version used for every attempt.
- Give feedback on the work, not the learner's character. See [50-teacher-quality.md](./50-teacher-quality.md).

## Common scenario contract

Every simulator scenario has:

| Field | Purpose |
|---|---|
| `id`, `slug`, `version` | stable identity and immutable revision |
| `status` | `draft`, `published`, or `archived` |
| `title`, `brief`, `learningObjective` | beginner-readable framing |
| `dataset` | synthetic tables, metrics, and context shown to the learner |
| `tasks` | ordered decisions and allowed inputs |
| `rubric` | dimensions, acceptable ranges, and rationale rules |
| `feedback` | safe, risky, and incomplete explanation paths |
| `module`, `difficulty`, `estimatedMinutes` | curriculum and progression mapping |

Published scenarios are immutable. An edit creates a new version; archiving removes it from new attempts but does not remove old evidence.

## Attempt lifecycle

```text
available -> started -> submitted -> scored -> reviewed (optional) -> reflected
```

Submission is idempotent. A retry must not create a second completion reward or overwrite the original answers. The attempt stores scenario version, answers, score dimensions, feedback, timestamps, and actor IDs required for audit.

## Grading contract

Automated grading may score deterministic rules and provide immediate feedback. Teacher review is required when an answer is ambiguous, a rationale is open-ended, or a score is used in a learning intervention. Acceptable ranges and calibration cases are versioned with the rubric.

The platform reports dimensions and next steps, not a false precision ranking. All metric calculations use the canonical functions in `lib/metrics.ts`.

## Shared UI states and events

Every simulator supports loading, empty, error, in-progress, submitted, scored, and retry states. Buttons show a clear busy state and prevent duplicate submission. Keyboard and screen-reader behavior follows [34-interactions-and-events.md](./34-interactions-and-events.md).

Recommended event names are `simulator_viewed`, `simulator_started`, `simulator_task_completed`, `simulator_submitted`, `simulator_feedback_viewed`, and `simulator_review_requested`. Store pseudonymous IDs only; event definitions follow [23-analytics-metrics.md](./23-analytics-metrics.md).

## Release gates

- scenario math independently recomputed;
- rubric and feedback reviewed by Curriculum Lead and Teacher Quality owner;
- all golden paths and failure paths covered by tests;
- accessibility and mobile layout checked;
- version, publish, archive, and retry behavior verified;
- copy clearly says practice data and no live-account action.

See [20-testing-quality.md](./20-testing-quality.md) for the scenario matrix and [18-project-plan.md](./18-project-plan.md) for sequencing.
