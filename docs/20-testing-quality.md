---
title: Testing and Quality Strategy
file: 20-testing-quality.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead
status: active
---

# 20 - Testing and Quality Strategy

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Tech Lead

Companion to 13-engineering-standards.md (TDD protocol). This doc answers: what data, what environments, what suites, and how we accept the product with real teachers.

## Test Environments and Data

| Env | Purpose | Data | Reset cadence |
|---|---|---|---|
| CI ephemeral | unit/integration | factory-built fixtures | per run |
| Preview | PR demos | seeded | per deploy |
| Staging | e2e, UAT | synthetic cohort (named fake students) | weekly |
| Prod smoke | post-deploy | service account only | never mutated by tests beyond own account |

### Rules

- Factories live in tests/factories/; no test hardcodes ids - use factory output.
- Seeded RNG (seedrandom) for simulator cases; seed printed in failure output.
- No PII in any non-prod environment. Synthetic names from approved list.
- Money fixtures cover the teaching table: 0 sales, ACOS below/at/above margin, huge CPC.

## Suites and Ownership

| Suite | Tool | Runs | Owner | Failure policy |
|---|---|---|---|---|
| Unit (incl. property tests for metrics) | Vitest | every PR | author | block merge |
| Integration (repos, actions, API) | Vitest + Docker PG | every PR | author | block merge |
| Contract (API envelope and schema drift) | Vitest | every PR | backend lead | block merge |
| E2E smoke | Playwright (chromium) | every PR | author | block merge |
| E2E full (all flows x roles) | Playwright (3 browsers) | nightly + pre-release | QA warden | block release |
| Accessibility | axe-core in Playwright | every PR | frontend lead | block merge |
| Load (k6: auth, coach, trainer) | k6 | pre-release + monthly | devops | block release if regression |
| Visual regression (design tokens page) | Playwright screenshots | weekly | design lead | triage, non-blocking |

## Mandatory Scenario Matrix (golden paths, always green)

| Flow | Asserts |
|---|---|
| Register -> complete lesson | XP +20 exactly once on double-submit |
| Trainer all-correct | score 100, XP first-attempt-only |
| Trainer incomplete | 400 with field-level plain messages |
| Quiz | answers never present in network payload |
| Builder 70+ | badge state persists after reload |
| Report generate | ACOS/ROAS match lib/metrics golden values |
| Teacher views student | only linked students visible; other cohorts 404 |
| Admin role change | audit row created |
| Rate limit | 6th login attempt -> lockout message |

## Bug Protocol

1. Reproduce with a failing test FIRST (ticket blocked until test exists).
2. Fix -> green -> regression test stays forever.
3. SEV-2+ bugs trigger a "why did the suite miss this?" note in the post-mortem.

## UAT / Beta Program

| Phase | Who | Duration | Exit criteria |
|---|---|---|---|
| Alpha | internal team + 2 friendly teachers | 2 weeks | all golden paths pass in real classrooms |
| Beta | 5 teachers, ~40 students, free | 4 weeks | >=80% students complete Module 0-2; teacher NPS >= 40; zero SEV-1 |
| GA | public | - | go/no-go checklist (30-open-questions.md) |

Beta feedback loop: in-app "flag a problem" -> linear ticket auto-created with session context (no PII beyond userId) -> weekly triage.

## Release Acceptance Checklist

- [ ] All suites green on staging
- [ ] Golden paths re-run on prod smoke account
- [ ] Load test within baseline +/-10%
- [ ] No open SEV-2
- [ ] Release notes written (plain words) and approved
