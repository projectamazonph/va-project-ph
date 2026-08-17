---
title: Repo Artifacts - Files That Must Actually Exist
file: 29-repo-artifacts.md
version: 1.0
reviewed: 2026-08-17
owner: DevOps Lead
status: active
---

# 29 - Repo Artifacts: Files That Must Actually Exist

Version: 1.0 · Reviewed: 2026-08-17 · Owner: DevOps Lead

These are referenced across docs 00-28. This file specifies them so M0 can commit them in one PR.

## CODEOWNERS

```
.github/CODEOWNERS
@org/core
/server/                   @org/backend-leads
/lib/metrics.ts            @org/tech-lead
/lib/schemas/              @org/backend-leads
/app/api/                  @org/backend-leads
/components/ui/            @org/design-lead
/docs/                     @org/docs-owner
/.github/                  @org/devops-leads
/prisma/migrations/        @org/backend-leads @org/tech-lead
```

## PR Template (.github/pull_request_template.md)

```markdown
## What / Why

Ticket:
Refs: #

## Module ownership touched

## TDD evidence
- [ ] Failing test commit precedes implementation (or tests-only PR linked): _

## Self-review checklist (01-agent.md §4.5)
- [ ] strict types, zero any
- [ ] Zod at every new boundary
- [ ] Unit tests: happy + failure paths
- [ ] A11y: keyboard + focus + aria
- [ ] Plain-words copy checked

## UI evidence

## Docs
- [ ] Affected docs updated + frontmatter reviewed bumped, or proof none affected

## Risk & rollback
```

## Issue Templates

- **bug.yml**: repro, expected/actual, role, severity guess, session id (optional).
- **feature.yml**: user story, acceptance test names (Given/When/Then), doc impact.
- **docs.yml**: stale doc path, what changed in reality, evidence link.
- **03-security.md**: directs to disclosure policy (26-compliance-legal.md §4) - not public issues.

## Commit and Lint Configs (committed, pinned)

| File | Purpose |
|---|---|
| `commitlint.config.js` | conventional commits; scope allow-list matches folder map |
| `.eslintrc` extras | no any, no console.log in server, no-restricted-imports (metrics single source), no dangerouslySetInnerHTML |
| `.prettierrc` | single formatter; CI checks |
| `lefthook.yml` | pre-commit: typecheck-staged, gitleaks, commitlint |
| `.gitleaks.toml` | patterns + allowlist for fixtures |
| `scripts/check-docs.mjs` | frontmatter freshness, linked_code drift, broken links, index completeness (see 15-living-documentation.md §2) |
| `madge` config | circular dependency gate |

## Environment Variable Registry (single source; CI fails on undocumented vars)

| Variable | Env | Purpose | Rotation |
|---|---|---|---|
| `DATABASE_URL` | all | Postgres | 90d |
| `DIRECT_URL` | dev/CI | migrations | 90d |
| `REDIS_URL` | all | limits/jobs/cache | 90d |
| `AUTH_SECRET` | all | session signing | 180d |
| `NEXT_PUBLIC_APP_URL` | all | canonical URL | n/a |
| `EMAIL_API_KEY`, `EMAIL_FROM` | stg/prod | transactional mail | 90d |
| `SENTRY_DSN` | stg/prod | errors | on demand |
| `COACH_LLM_API_KEY` | stg/prod | coach fallback | 90d |
| `COACH_LLM_ENABLED` | stg/prod | kill switch flag mirror | n/a |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | prod (M8) | billing | 90d |
| `AMAZON_ADS_CLIENT_ID/SECRET` | prod (future) | integration §27 | on approval |
| `RATE_LIMIT_*` | all | override defaults (see 10-rate-limiting.md) | n/a |

**Rules:** `.env.example` mirrors this table (values blank); any new var requires a table row in the same PR; check-docs cross-verifies.

## Approved Dependency Register (additions need Tech Lead approval + row here)

| Dependency | Role | License | Status |
|---|---|---|---|
| next, react | framework | MIT | approved |
| prisma | ORM | Apache-2.0 | approved |
| zod | validation | MIT | approved |
| tailwindcss, cva | styling | MIT | approved |
| chart.js | dashboard chart | MIT | approved |
| auth.js, argon2 | auth | ISC/Apache | approved |
| vitest, @testing-library/*, playwright | testing | MIT/Apache | approved |
| bullmq, ioredis | jobs/limits | MIT | approved |
| react-hook-form, @hookform/resolvers | forms | MIT | approved |
| pino | logging | MIT | approved |

## Feature Flag Registry

| Flag | Default | Owner | Lifecycle |
|---|---|---|---|
| `coach.llmEnabled` | false -> true post-eval | AI Owner | kill switch, permanent |
| `registration.open` | true | Tech Lead | operational |
| `amazonAds.syncEnabled` | false | Backend Lead | kill switch, permanent |
| `beta.analyticsV2` | false | Product | remove at GA |

**Flag hygiene:** every flag has an owner + removal date or "permanent"; stale non-permanent flags fail monthly audit.

## Miscellaneous Required Files

- `CONTRIBUTING.md` -> points to 00-INDEX.md + TDD protocol summary.
- `CODE_OF_CONDUCT.md` -> Contributor Covenant v2.1, enforcement = Tech Lead + Product Owner.
- `SECURITY.md` -> disclosure policy summary + contact.
- `public/security.txt` -> contact, policy link, expiry.
- `public/brand/PROVENANCE.md` -> generated asset prompts/sources.
