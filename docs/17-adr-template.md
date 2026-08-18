---
title: Architecture Decision Records - Template and Decision Lifecycle
file: 17-adr-template.md
version: 1.0
reviewed: 2026-08-18
owner: Tech Lead
status: active
source: extracted from AGENTS.md, 30-open-questions.md, 44-architecture.md, and 58-templates.md
---

# 17 - Architecture Decision Records

An ADR records a decision that changes a boundary, creates a durable constraint, or resolves a meaningful trade-off. It is not required for routine implementation inside an accepted design.

## When an ADR is required

- changing the stack or a cross-cutting dependency;
- changing an API, data contract, authentication model, or tenant boundary;
- adding live Amazon Ads access or any write-capable external integration;
- changing money formulas, grading rules, or certification claims;
- choosing a migration, storage, queue, or deployment strategy with rollback consequences;
- accepting a security, privacy, accessibility, or reliability trade-off.

## Lifecycle

1. Open a short proposal with the context, constraints, and options.
2. Ask the owning leads named in [52-raci.md](./52-raci.md) for review.
3. Mark the decision `accepted`, `rejected`, or `superseded`.
4. Update affected code, tests, runbooks, and index links in the same delivery slice.
5. Never silently edit an accepted decision; append a superseding ADR.

## Template

Copy this structure into `docs/decisions/ADR-NNN-<short-name>.md`:

```markdown
---
title: ADR-NNN - <decision>
file: ADR-NNN-<short-name>.md
version: 1.0
reviewed: YYYY-MM-DD
owner: Named role
status: proposed | accepted | rejected | superseded
---

# ADR-NNN - <decision>

Date: YYYY-MM-DD
Decision owner: <role>
Reviewers: <roles>

## Context
What problem or constraint forced a decision?

## Decision
What will we do?

## Options considered
| Option | Benefits | Costs / risks | Why not chosen |

## Consequences
What becomes easier, harder, or permanently constrained?

## Verification and rollout
Tests, migration steps, feature flag, metrics, and rollback.

## Related documents
Links to product, architecture, security, runbook, and open-question records.
```

## Decision hygiene

Open questions belong in [30-open-questions.md](./30-open-questions.md) until a decision is made. Architecture context belongs in [44-architecture.md](./44-architecture.md); the ADR should link to it rather than duplicate the whole system description. Use [58-templates.md](./58-templates.md) for the decision-log entry format.
