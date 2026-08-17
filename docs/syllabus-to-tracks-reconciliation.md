---
title: Syllabus to Implementation Tracks Reconciliation
file: syllabus-to-tracks-reconciliation.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead + Curriculum Lead
status: active
supersedes: null
superseded-by: null
source-of-truth: docs/curriculum-syllabus.md
---

# Syllabus to Implementation Tracks Reconciliation

Bridges the authoritative syllabus in [`curriculum-syllabus.md`](./curriculum-syllabus.md) (a verbatim copy of the original beginner-first syllabus) to the engineering implementation tracks in this standalone VA Project Philippines codebase.

This is a greenfield project. It is not related to, dependent on, or migrated
from `amph-v2-greenfield` or any other external implementation repository.

## Purpose

`curriculum-syllabus.md` is the curriculum source-of-truth. Every lesson, quiz, simulator case, and content item must trace back to a syllabus module. This file is the map.

When adding new curriculum content:

1. Find the syllabus module the content serves.
2. Check the implementation track row below.
3. Use the existing track if it ships. Add a row here if it does not.

When adding new engineering tracks:

1. Add a row here that names the syllabus module or modules the track supports.
2. Update the index.

## Status legend

- **Shipped** - feature is live in this project's production / greenfield implementation.
- **In progress** - actively being built.
- **Planned** - scoped, story written, not yet started.
- **Not started** - known gap, no commitment yet.

## Module mapping

| Module | Topic | Goal (short) | Implementation track | Status |
|---|---|---|---|---|
| Module 0 | Amazon Basics | Where PPC fits on Amazon | `content/curriculum/modules/` lesson corpus + landing-page copy | Planned |
| Module 1 | What is PPC? | How paid ads work | `content/curriculum/modules/` lesson corpus + landing-page `what-is-ppc` block | Planned |
| Module 2 | Money Math | CPC, ACOS, ROAS, profit | Domain `Money` value object + quiz fixtures in `content/curriculum/quiz-questions.json` | Shipped (domain) + Planned (lesson content) |
| Module 3 | Campaign Structure | Campaigns, ad groups, targeting | Campaign builder sandbox (simulator Module D) + admin campaign builder | Shipped (admin) + Planned (sandbox) |
| Module 4 | Keyword Research | Find words customers type | Glossary tool + search term practice (Module E) | Planned |
| Module 5 | Listing Readiness | Product page can convert | Listing-readiness scorecard in content + simulator case | Planned |
| Module 6 | Campaign Setup | Build first campaigns | Campaign builder sandbox (Module D) | Planned |
| Module 7 | Bids and Budgets | How much to pay | Simulator bid controls + Money math | Planned |
| Module 8 | Search Terms and Negatives | Stop wasted spend | Search term practice tool (Module E in web app plan) | Planned |
| Module 9 | Weekly Optimization | Manager routine | VA task board (Module G) | Planned |
| Module 10 | Reporting | Read data and explain it | Report builder (Module F) + admin audit/analytics | Shipped (admin analytics) + Planned (student report builder) |
| Module 11 | Troubleshooting | Fix common problems | Troubleshooting simulator cases | Planned |
| Module 12 | VA Workflow | Daily, weekly, monthly tasks | VA task board (Module G) + admin task assignment | Planned |
| Module 13 | Client Communication | Report and ask good questions | Communication templates in `copy-bible.md` + student messages | Planned |
| Module 14 | Capstone Project | Manage a practice account | Capstone grading rubric + simulator aggregate case | Planned |

## Web app coaching aid modules (Part 2 of syllabus)

The web app plan in the syllabus (lines 2,203-3,005) describes 10 web app modules (A-J). These map to engineering tracks in this repository.

| Web app module | Topic | Implementation track | Status |
|---|---|---|---|
| Module A | Learning Management System | `content/curriculum/modules/` (MDX) + lesson renderer | Planned |
| Module B | PPC Glossary Tool | Glossary domain + glossary UI | Planned |
| Module C | Practice Simulator | Simulator registry (`buildSimulatorRegistry.ts`) | Shipped (5 simulators) + Planned (PPC simulator) |
| Module D | Campaign Builder Sandbox | Campaign sandbox table per syllabus data model | Planned |
| Module E | Optimization Coach | Optimization case library + grading | Planned |
| Module F | Report Builder | Report builder UI + AI Conversations table | Planned |
| Module G | VA Task Board | Admin task assignment + student dashboard | Shipped (admin) + Planned (student) |
| Module H | Teacher Dashboard | Admin teacher view + student progress | Shipped (admin) |
| Module I | AI Coach | **Skipped** per ADR-003 "Zero AI features" | Not started (out of scope) |
| Module J | Certification System | Level-gating use cases + certificate PDF | Planned |

## Cross-references

- Authoritative syllabus: [`curriculum-syllabus.md`](./curriculum-syllabus.md)
- Voice rules: see `copy-bible.md` (PH blue/sun palette + Filipino VA voice)
- `docs/01-agent.md` voice and design guardrails apply verbatim.

## Update rule

When a syllabus module changes, update this file in the same PR. When an engineering track ships, update the status column in the same PR.

When a new syllabus module is added, append a row in both tables in the same PR.
