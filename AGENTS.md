---
title: PPC Coach - Agent Instructions & Guardrails
file: AGENTS.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Agent Instructions & Guardrails

Scope: ALL AI agents (coding assistants, review bots, doc generators) working in this repo.
Version: 1.0 · Reviewed: 2026-08-17 · Owner: Tech Lead

## Mission Context

You are building PPC Coach: a coaching web app teaching absolute-beginner virtual assistants Amazon PPC. Users are non-technical. Every surface must use plain words. Money math (CPC, ACOS, ROAS, break-even) must always be correct - a wrong formula teaches wrong habits.

## Stack Contract (do not change without ADR)

| Concern | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript strict: true |
| Styling | Tailwind CSS; tokens only from docs/02-design.md |
| Validation | Zod at every boundary (client, server action, API, DB input) |
| DB / Auth | Supabase PostgreSQL + Supabase Auth |
| Cache / limits | Redis (rate limits, sessions, queues) |
| Testing | Vitest + Testing Library (unit), Playwright (e2e) |
| Fonts | fontsource CDN only. Never Google Fonts. |
| Images | Generated assets or /public only. Never hotlink external images in production code. |

## Allowed / Forbidden

Allowed:
- Edit files within your assigned module (see ownership map in PR template).
- Add tests, types, schemas, docs for your change.
- Propose refactors via a separate PR.

Forbidden:
- Committing secrets, API keys, tokens, or real Amazon Advertising credentials.
- Touching main directly; all changes go through PR.
- Disabling lint rules, any types, or eslint-disable without a written reason + reviewer approval.
- Deleting or renaming DB columns/migrations (only additive migrations; removals via ADR).
- Changing money formulas (ACOS = spend/sales*100, ROAS = sales/spend, break-even = margin %) without explicit sign-off.
- Silently changing public API contracts - version them.
- Installing dependencies not on the approved list in package.json review.
- Writing user-facing copy with jargon - plain words only, per glossary in docs/02-design.md.

## Working Protocol for Agents

Read first: [docs/index.md](./docs/index.md), the module doc for the file you touch, and [docs/17-adr-template.md](./docs/17-adr-template.md) history for that area.
Plan: Output a numbered plan (files touched, tests added, risks) before editing.
TDD: Write failing test -> minimal implementation -> refactor. Never submit green-by-accident code.
Small diffs: One concern per PR.
