---
title: Teacher Quality System - Calibration, Grading Standards and Teacher Ops
file: 50-teacher-quality.md
version: 1.0
reviewed: 2026-08-17
owner: Design Lead (curriculum) and Product Owner
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Teacher Quality System - Calibration, Grading Standards and Teacher Ops

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Design Lead (curriculum) + Product Owner

Human grading IS the product's quality layer. If teachers grade inconsistently, certificates mean nothing and students churn. This doc makes grading a system, not a vibe.

## Teacher Ladder

| Level | Requirements | Privileges |
|---|---|---|
| T1 Teacher-in-training | Sandbox scores per onboarding gate (see gap file 19b) | Grade Tier-1 items, supervised |
| T2 Teacher | 20 graded items with variance within section 3; calibration attended | Grade all sims; assign lessons |
| T3 Senior Teacher | 3 months T2 + audit pass | Cohort lead; rubric change proposals; calibrate others |

Promotion/demotion decided by quality metrics (Quality Metrics section), never tenure.

## Grading Standards

Grade against the rubric, not gut feel; every partial score gets a one-line plain-words reason (feeds the debrief).

Comment formula: What was good - what was missed - exact next step. Max 3 sentences.

Never grade the person ("you"), always the work ("this decision").

Edge-of-rubric items - mark needs-second-opinion instead of guessing (queue to T3).

Time budget guideline: at most 5 min per Tier-1/2 item, at most 10 min Tier-3; over-budget items signal rubric problems, not teacher slowness.

## Calibration Program

| Activity | Cadence | Target |
|---|---|---|
| Calibration session | Bi-weekly, 45 min: all teachers grade same 3 submissions independently then compare | Inter-rater spread at most 10 points (of 100) |
| Gold items | 10 submissions with fixed expert grades injected monthly into queues (blind) | Teacher within +/-8 of gold |
| Drift alert | Rolling 30-day variance vs gold | Auto-flag for re-calibration |

Session outputs logged in docs/calibration/ with rubric patches (curriculum pipeline - see content-curriculum-ops gap file 22 when rubrics change).

## QA Sampling and Appeals

QA: T3 samples 10% of each teacher's graded items monthly; findings to private feedback + retraining if repeat.

Student appeal: in-app "Ask for re-review" to different teacher grades blind; if delta at least 15 points, both grades go to calibration review; student gets the higher + apology template.

AI pre-scores (testing-quality gap file 36 section 4) are decision support only; visible to teacher with confidence; overruling requires no justification, but overrides are tracked for prompt/rubric improvement.

## Teacher Performance Metrics

| Metric | Target |
|---|---|
| Grading SLA (submission to graded) | within 48h (support-experience gap file 28) |
| Gold-item accuracy | at least 90% within +/-8 |
| Student "feedback helped" rating | at least 4.2/5 |
| Queue zero-days per week | at least 3 |
| Appeal overturn rate | at most 5% |

## Compensation Model (outline)

Per-item rates by tier + cohort facilitation fee; published rate card to teachers (transparency).

Quality bonus: quarterly, tied to Quality Metrics - rewards consistency, not volume.

Paid calibration time. Never pay per "favorable" outcome - conflict guardrail.

## Continuity and Contingency

Every cohort has at least 2 linked teachers (no single point of failure).

Teacher departure: handoff checklist (open queue reassigned, notes exported, students notified with warm copy).

Platform outage: offline grading sheets (rubric PDF + submission export) so cohorts don't stall (45-infrastructure.md Business Continuity line).

Teacher community channel: rubric questions, tough cases, wins - moderated by T3.

## Artifacts

Rubric registry: versioned with cases (testing-quality gap file 36 case JSON) - teachers see current version in grading UI with diff notes.

Grading templates and comment bank: 35-copy-bible.md voice; plain words always.

Quarterly teacher report: quality metrics + student outcome correlations (completion to certification) - proves their impact back to them.