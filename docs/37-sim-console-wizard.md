---
title: Simulator Console Wizard - Campaign Setup and Navigation
file: 37-sim-console-wizard.md
version: 1.0
reviewed: 2026-08-18
owner: Design Lead + Backend Lead
status: active
source: extracted from 33-wireframes-mobile-first.md, 34-interactions-and-events.md, 36-simulators-platform.md, and 60-ux-ui-copy-foundation.md
---

# 37 - Simulator Console Wizard

The Console Wizard gives beginners a safe, guided way to plan Sponsored Products, Sponsored Brands, and Sponsored Display work. It teaches the order of decisions without pretending to be a live Amazon Ads console.

## Wizard sequence

1. choose the practice goal and ad type;
2. review the product and audience context;
3. choose campaign and ad-group structure;
4. add targets, match types, negatives, budget, and bid approach;
5. review naming, launch checks, and monitoring plan;
6. submit for formative feedback or teacher review.

On mobile this is a three-step flow with visible progress. On larger screens, the form and a summary may sit side by side. The summary is never the only place validation appears.

## Shared rules

- Names reveal goal, product, targeting, and time period.
- Duplicate targets, empty ad groups, invalid budgets, and contradictory negatives receive plain field-level feedback.
- “Ready” means ready for practice review only; it never means approved for a live account.
- The learner's inputs persist when moving between steps and survive a safe refresh.
- Submission is idempotent and stores the scenario and rubric versions.

## Ad-type differences

| Practice mode | What changes | What stays shared |
|---|---|---|
| Sponsored Products | product target, keyword/match choices, placement context | goal, structure, budget, review |
| Sponsored Brands | brand context, headline or collection intent | relevance, audience, measurement |
| Sponsored Display | audience or product context, reach goal | safety, budget, monitoring |

Do not teach one ad type's targeting behavior as universal. The case explains the rule that is being practiced.

## Completion rubric

Score structure, relevance, control, naming, and launch readiness separately. Feedback calls out the strongest decision, one missed risk, and the next practice step. See [50-teacher-quality.md](./50-teacher-quality.md) for human review and [36-simulators-platform.md](./36-simulators-platform.md) for the shared attempt contract.
