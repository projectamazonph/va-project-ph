---
title: Compliance, Privacy and Legal Baseline
file: 26-compliance-legal.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead + external counsel review cadence
status: draft - source truncated mid-Privacy table ("Target:" cut); remainder pending
---

# 26 - Compliance, Privacy and Legal Baseline

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Tech Lead + external counsel review cadence

This is an operational baseline, not legal advice. Counsel reviews before GA and annually.

## Privacy

| Item | Policy |
|---|---|
| Legal bases | Contract (service delivery) + consent (nudges/analytics opt-ins) |
| Data collected | Email, name, progress, attempts - nothing more without ADR |
| Minors | Service is 16+. Age attestation at signup; no knowingly collected minor data; deletion on discovery. (COPPA posture: exclude, don''t accommodate) |
| DSAR handling | Export: self-serve JSON. Delete: self-serve -> 30-day grace -> hard delete job -> audit entry. Target: _(truncated)_ |

_(Sections beyond the Privacy table (Accessibility, Security disclosure, Content licensing, Legal docs) are pending source content.)_
