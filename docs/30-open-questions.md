---
title: Open Questions and Parked Decisions Register
file: 30-open-questions.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: active
---

# 30 - Open Questions and Parked Decisions Register

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Product Owner

A parking lot with deadlines. Every item has a decide-by date and an owner; expired items auto-appear on the weekly agenda (checked by check-docs).

## Open Questions

| # | Question | Options | Owner | Decide by | Status |
|---|---|---|---|---|---|
| 1 | Pricing model for teacher seats | per-student vs per-teacher vs flat cohort pack | Product | before M8 | open |
| 2 | Leaderboards: names visible? | opt-in names vs anonymous vs off | Design Lead | beta feedback | open |
| 3 | Mobile PWA vs responsive-only | build later vs now | Tech Lead | post-GA data | parked |
| 4 | Second language priority | ES vs PT vs other | Product | demand signal | parked |
| 5 | Real-money phase 2 (write access to Amazon Ads)? | likely NO forever (teaching stance) | Tech Lead + counsel | 2026-Q4 | parked |
| 6 | Self-serve teacher signup vs invite-only GA | invite-only (quality) vs open (growth) | Product | GA gate | open |
| 7 | Certification artifact: PDF badge vs verifiable link | both? | Design Lead | M5 | open |
| 8 | Coach personality depth | strictly teacher vs light encouragement | Design Lead | beta feedback | open |

## GA Go/No-Go Checklist (lives here until passed)

- [ ] All P0 docs implemented and verified by doc-warden
- [ ] Beta exit criteria met (20-testing-quality.md §5)
- [ ] Legal docs published (26-compliance-legal.md §6)
- [ ] Pen test findings closed
- [ ] SLO dashboards live with 2 weeks of clean data
- [ ] Support canned library + escalation tested end-to-end
- [ ] DR tabletop completed (16-runbooks.md)
- [ ] Cost ceilings set: infra + LLM monthly budgets with 80% alerts

## Rules for This Register

1. No item without owner + date.
2. Decisions move to an ADR, then leave this file (link left behind).
3. Items expired >14 days fail the doc freshness check.
