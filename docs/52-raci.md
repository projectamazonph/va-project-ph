---
title: Ownership and Decision Routing (RACI)
file: 52-raci.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Ownership and Decision Routing (RACI)

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Product Owner

Every recurring decision has one Accountable person. R = does the work, A = owns outcome (one per row), C = consulted, I = informed. Update in same PR as any role change.

## Roles at Table

PO = Product Owner; TL = Tech Lead; DL = Design Lead; BL = Backend Lead; FL = Frontend Lead; DO = DevOps Lead; SO = Security Lead; FO = Finance/Legal owner; DOC = Docs Owner; AI = AI Owner; GT = Growth lead.

## RACI Matrix

| Decision / Activity | PO | TL | DL | BL | FL | DO | SO | FO | DOC | AI | GT |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Roadmap and themes | A/R | C | C | I | I | I | - | C | I | - | C |
| PRD-lite approval | A | C | R | C | C | - | C | - | I | - | I |
| Curriculum content publish | C | C | A/R | - | - | - | - | - | C | - | I |
| Money formulas change | C | A | R | R | I | - | - | - | I | - | - |
| Schema/migrations | I | A | - | R | - | C | C | - | I | - | - |
| Security policy and incident SEV-1 | I | R | - | R | - | R | A | I | I | - | I |
| Pricing and refunds policy | R | - | C | - | - | - | - | A | I | - | C |
| Billing incidents/chargebacks | I | C | - | R | - | - | C | A | - | - | - |
| Production deploys and rollback | I | C | - | R | R | A/R | - | - | - | - | - |
| Feature flags lifecycle | R | C | C | C | C | C | - | - | A (registry) | C | - |
| Coach prompt/model changes | C | C | C | - | - | - | C | - | I | A/R | - |
| Teacher quality and calibration | C | - | A | - | - | - | - | C | I | - | - |
| Support escalations T3 | C | A | - | R | R | R | C | - | - | - | - |
| Marketing claims and testimonials | C | - | C | - | - | - | C | C | - | - | A/R |
| Legal filings (BIR/NPC/DTI) | I | - | - | - | - | - | C | A/R | - | - | - |
| Docs freshness enforcement | I | C | C | R | R | R | R | R | A | R | R |
| Vendor selection | C | C | - | R | - | R | C | A | I | C | - |
| Scholarships | A | - | - | - | - | - | - | R | - | - | I |

## Decision Routing Rules

If two owners disagree, escalate to PO for product, TL for technical, within 24h; dissent recorded in ADR/decision log (not erased).

Anything touching money, auth, PII, or published curriculum needs the named A explicitly approving the PR (CODEOWNERS enforces where possible).

Tie-breaker hierarchy: Safety/Legal > Student trust > Shipping speed.

Single-writer principle: only the A (or their delegate) edits their domain's docs; others PR suggestions.

Vacancy rule: TL is interim A for any vacant seat; vacancy >30 days becomes a board-level item.

## Standing Meetings (minimal, PHT-friendly)

| Meeting | Cadence | Attendees | Output |
|---|---|---|---|
| Standup | Mon/Wed/Fri 15m | builders | blockers only |
| Triage | weekly 30m | PO, TL, GT, DOC | inbox dispositioned |
| Metrics review | monthly | PO, GT, DL, FO | KPI actions (analytics gap file 23) |
| Doc day | monthly | all owners | freshness checked |
| Calibration | bi-weekly (50-teacher-quality.md) | teachers + DL | rubric patches |
| Ops review | monthly | TL, DO, SO | SLO/budget/security posture |