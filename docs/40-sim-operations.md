---
title: Simulator Operations - Bids, Budget Pacing and Bulk Work
file: 40-sim-operations.md
version: 1.0
reviewed: 2026-08-18
owner: Backend Lead + Curriculum Lead
status: active
source: extracted from AGENTS.md, 20-testing-quality.md, 22-content-curriculum-ops.md, 36-simulators-platform.md, and 60-ux-ui-copy-foundation.md
---

# 40 - Simulator Operations

This document groups three operational practice areas: S2 Bid decisions, S3 Budget and Pacing, and S7 Bulk Operations. They share a bias toward measured changes, clear evidence, and safe recovery.

## S2 - Bid decisions

Give the learner current bid, spend, clicks, orders, sales, CPC, ACOS or ROAS, goal, and data-confidence context. The learner chooses raise, hold, lower, pause for investigation, or ask for review. Full credit requires correct metric reading, a proportionate change, and a monitoring plan.

Never teach a universal bid percentage or an auction mechanic as a guaranteed rule. Use the canonical functions in `lib/metrics.ts`.

## S3 - Budget and pacing

Give the learner a daily budget, elapsed period, spend, sales or order context, expected activity, and constraints. The learner identifies under-pacing, over-pacing, or insufficient evidence and proposes a controlled adjustment or observation plan.

Feedback must distinguish budget pacing from profitability. A campaign can spend its budget and still need a different decision; a campaign can underspend and still be healthy.

## S7 - Bulk Operations

The learner reviews a proposed batch of changes and chooses approve, edit, reject, or stage for review. The simulator validates duplicate rows, missing identifiers, conflicting changes, out-of-range bids, and accidental broad scope.

Bulk practice must include a preview, count of affected objects, rollback or undo guidance, and an explicit confirmation. It never generates a file or request that can be sent to a live account.

## Shared operations rubric

| Dimension | Full-credit behavior |
|---|---|
| Evidence | Uses the right metric and time window |
| Control | Chooses a measured, reversible action |
| Scope | Understands which objects and rows are affected |
| Safety | Stops when data is weak or the change is risky |
| Follow-up | Names the next check and success signal |

See [16-runbooks.md](./16-runbooks.md) for incident and rollback thinking and [36-simulators-platform.md](./36-simulators-platform.md) for versioned attempt storage.
