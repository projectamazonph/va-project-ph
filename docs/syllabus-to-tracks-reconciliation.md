---
title: Syllabus to Implementation Tracks Reconciliation
file: syllabus-to-tracks-reconciliation.md
version: 1.0
reviewed: 2026-08-18
owner: Tech Lead + Curriculum Lead
status: active
supersedes: null
superseded-by: null
document-type: curriculum-to-product traceability register
audience: curriculum, product, engineering, and delivery teams
source-of-truth: curriculum-syllabus.md
---

# Syllabus to Implementation Tracks Reconciliation

## Document Control

| Field | Value |
|---|---|
| Document type | Curriculum-to-product traceability register |
| Product | VA Project Philippines |
| Owner | Tech Lead + Curriculum Lead |
| Status | Active |
| Version | 1.0 |
| Review cadence | At least every 30 days and whenever curriculum or implementation scope changes |
| Authoritative curriculum | [`curriculum-syllabus.md`](./curriculum-syllabus.md) |

## Purpose and Authority

This register maps the authoritative syllabus in [`curriculum-syllabus.md`](./curriculum-syllabus.md) to the engineering implementation tracks in this standalone VA Project Philippines codebase.

This is a greenfield project. It is not related to, dependent on, or migrated
from `amph-v2-greenfield` or any other external implementation repository.

The syllabus remains authoritative for learning outcomes and curriculum scope. This register is authoritative only for traceability between those outcomes and product implementation work.

## Scope and Traceability Requirements

Every lesson, quiz, simulator case, and other curriculum content must trace back to a syllabus module. Every engineering track that supports curriculum delivery must identify the module or modules it serves in this register.

When adding new curriculum content:

1. Find the syllabus module the content serves.
2. Check the implementation track row below.
3. Use the existing track if it ships. Add a row here if it does not.

When adding new engineering tracks:

1. Add a row here that names the syllabus module or modules the track supports.
2. Identify the implementation status using the legend below.
3. Update the documentation index when the document set changes.

## Status legend

- **Shipped** - the capability is available in the current greenfield implementation.
- **In progress** - implementation is actively underway.
- **Planned** - scope is defined but implementation has not started.
- **Not started** - the gap is known but no implementation commitment has been made.

## Module mapping

| Module | Topic | Goal (short) | Implementation track | Status |
|---|---|---|---|---|
| Module 0 | Amazon Basics | Where PPC fits on Amazon | `app/(app)/learn/[moduleSlug]/[lessonSlug]/` + `content/curriculum/modules/module-0/` lesson corpus + `lib/curriculum/render-markdown.ts` | Shipped (UI, schema, content corpus) |
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

Part Two of the syllabus, "Turning This Syllabus Into a Full-Featured Web App Coaching Aid," describes 10 web app modules (A-J). These map to engineering tracks in this repository.

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
- `AGENTS.md` voice and design guardrails apply verbatim.

## Update rule

Changes to curriculum scope and implementation mapping are reviewed by both the Curriculum Lead and Tech Lead. Update this register in the same PR when a syllabus module changes, an engineering track ships, or an implementation status changes.

When a new syllabus module is added, append a row in both tables in the same PR.
