---
title: Template Library - Every Referenced Template, In One Place
file: 58-templates.md
version: 1.0
reviewed: 2026-08-17
owner: Docs Owner
status: active
supersedes: null
superseded-by: null
source: closure of dangling template references across docs 16/47/50/52/56/57
---

# Template Library - Every Referenced Template, In One Place

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Docs Owner
Dangling template references across docs 16/47/50/52/56/57 are closed here. Copy -> fill -> file in the listed location. Living-docs rules apply to the templates themselves.

## Experiment Log - docs/experiments/EX-NNN-<title>.md (doc 47 section 4)

```
EX-NNN: <title>
status: proposed | running | decided | abandoned
owner: <name>   dates: <start> -> <end>
hypothesis: If we <change>, <primary metric> will move by <X%> because <reasoning>.
persona link: doc 32 section <N>
primary metric: <name + guardrails>
audience/split: <allocation>   min sample/power: <calc>
variant description: A: ... B: ...
risks/ethics check: dark-pattern scan yes / copy review yes
--- RESULT (filled at decision) ---
outcome: <numbers + chart link>
decision: ship | revert | iterate   decided-by: <name + date>
learning: <one paragraph, written for the next experiment>
```

## Decision Log Entry - appended to docs/decisions/decisions.md (doc 52 section 3)

```
YYYY-MM-DD - <decision title>
context: <why now>   options considered: <A, B, C>   decided: <choice>
accountable: <name>   dissent: <names if any>
review trigger: <metric or date when this decision gets revisited>
```

(Use full ADRs, doc 17, for architecture; decision log is for operational/product calls.)

## Pen Test - scope doc + report (docs 26 section 7, 43 gate)

```
Pen Test - <vendor> - <window>
scope: app.thevaproject.ph, api routes, auth flows, payment webhooks, admin portal
out of scope: DoS, social engineering, third-party hosted checkouts
rules of engagement: window <dates>, test accounts provided, no real student data
contacts: SO (primary), DO (infra)
--- REPORT (vendor output, sanitized) ---
findings table: id - severity - description - evidence ref - status
remediation log: finding -> ticket -> fix commit -> verification -> closed-by
sign-off: Security Lead + Tech Lead      next test due: <date>
```

## Incident Post-Mortem (doc 16 section 2.5)

```
Incident <id> - <date> - SEV <N>
duration: <start - end>   users affected: <count + segment>
timeline: (declare / mitigate / resolve, UTC+8 timestamps)
impact: SLO burn, support tickets, revenue effect (if any)
root cause: plain words; contributing factors listed separately
what went well / what didn't:
action items: [owner - due - ticket] - at least one preventive, one detective
comms review: were doc 54 updates timely and clear?
status: draft -> reviewed by <names> -> published summary (SEV-1/2)
Blameless rule: name systems and processes, not people.
```

## On-Call Handoff (doc 16 section 6)

```
Handoff - <date> - <outgoing> -> <incoming>
current SEVs/open incidents: <list>
watch items: <list>
pending vendor maintenance: <list with dates>
escalation state: who's paged whom for what
handover call done: yes   shadow confirmed: yes (first rotation requirement)
```

## Calibration Session Log - docs/calibration/YYYY-MM-DD.md (doc 50 section 3)

```
Calibration - <date> - facilitator: <name>
items graded: <count>   participants: <names>
score table: item x teacher x variance
variance result: <avg> vs target at most 10   gold-item deltas: <list>
rubric patches proposed: [patch id - wording change - curriculum PR link]
decisions: <list>
next session: <date>
```

## Vendor Onboarding Checklist (doc 56 section 4 - printable form)

```
Vendor: <name>   requested-by: <name>   date: <YYYY-MM-DD>
[ ] ADR-lite: why existing stack can't cover
[ ] Data flows diagrammed; categories classified (PII/payment/none)
[ ] DPA/zero-retention executed          [ ] Security questionnaire returned
[ ] Cost in FinOps budget                 [ ] Exit plan written
[ ] Secrets scoped (env list)             [ ] Register row added (doc 56 section 3)
approvals: Security <sign> Finance <sign> Tech Lead <sign>
```

## Partnership One-Pager (doc 57 section 6)

```
The VA Project Philippines x <Partner Name>
tech: Partner Cohort | Campus | Livelihood | Creator | Hiring | Scholar Fund
their goal: <one line>   our promise: <one line>
structure: seats/cohort - duration - pricing/scholarship terms - data scope
success metrics: from doc 57 section 5 (subset, agreed)
next step: pilot cohort of <size> on <date>   owners: GT + partner coordinator
```

## Maintenance Rules for This File

New template requests go through a docs PR; templates never live scattered in chat.
Each template lists its citing doc; when the citing doc changes, this file updates in the same PR (doc 15 linked_code rule).