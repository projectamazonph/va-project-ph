---
title: PPC Coach - CI/CD Pipeline
file: 09-ci-cd.md
version: 1.0
reviewed: 2026-08-17
owner: DevOps Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# CI/CD Pipeline

Version: 1.0 · Reviewed: 2026-08-17 · Owner: DevOps Lead
Tooling: GitHub Actions · Deploy: preview (per PR) -> staging -> production

## Pipeline Stages

```
PR opened/updated
 |- 1. Static gate        (parallel, fail-fast)
 |    |- typecheck        pnpm typecheck
 |    |- lint             pnpm lint (ESLint + Prettier check)
 |    |- secrets scan     gitleaks
 |    |- docs freshness   node scripts/check-docs.mjs   (15-living-documentation.md)
 |    |- a11y copy rules   custom: glossary-jargon checker
 |- 2. Test
 |    |- unit + property   vitest --coverage  (gate: >=80% changed lines)
 |    |- api contract      vitest (route handlers)
 |    |- e2e smoke         playwright (chromium)
 |- 3. Build
 |    |- next build + bundle size gate (07-frontend.md §6)
 |- 4. Preview deploy     comment on PR with URL

merge to main
 |- stages 1-3 again
 |- deploy staging (auto) + seeded DB
 |- e2e full suite on staging
 |- production: manual approval (environment protection rules)
      |- migrate (prisma migrate deploy)
      |- deploy
      |- smoke + rollback hook
```

## Branch & Environment Matrix

| Branch | Environment | Data | Promotion |
|---|---|---|---|
| feat/, fix/ | Preview | seeded | PR -> main |
| main | Staging | synthetic | merge (squash) |
| main + approval | Production | real | manual gate |
| hotfix/* | Prod fast-track | real | see §5 |

## Quality Gates (all must pass)

| Gate | Threshold |
|---|---|
| TypeScript | zero errors, zero any (lint rule) |
| Unit coverage (changed lines) | >= 80% |
| E2E smoke | 100% pass |
| Bundle | within budgets |
| pnpm audit | no high/critical |
| Docs | frontmatter fresh, links resolve |
| Migrations | applied cleanly on staging clone |

## Release Process

Releases from main only; tag vYYYY.MM.DD-n.
Changelog auto-generated from conventional commits (14-git-guardrails.md).
Production deploys Mon-Thu, 09:00-16:00 UTC only (no Friday deploys).
Post-deploy: smoke checklist (16-runbooks.md), watch dashboards 30 min.
Rollback = redeploy previous tag + migrate is additive-only by policy, so DB never blocks rollback.

## Hotfix Protocol

Branch hotfix/ from main.
Minimal diff + regression test reproducing the bug (TDD even under pressure).
Fast-track PR: 1 reviewer + green CI; deploy immediately after merge.
Post-incident review within 48h -> ADR or runbook update.

## Secrets & Config

CI secrets in GitHub Actions env; scoped per environment.
Preview envs get read-only seeded DB only.
Production secrets: deploy key holders = Tech Lead + DevOps Lead.

## Caching & Speed Targets

pnpm store + Next cache cached between runs. Target: full PR pipeline < 8 min.

---
