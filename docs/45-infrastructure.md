---
title: Infrastructure, Environments and FinOps
file: 45-infrastructure.md
version: 1.0
reviewed: 2026-08-17
owner: DevOps Lead
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Infrastructure, Environments and FinOps

Version: 1.0 - Reviewed: 2026-08-17 - Owner: DevOps Lead

Goal: reproducible environments, boring deploys, predictable cost. Everything provisioned as code; no console-click infrastructure.

## Reference Topology (recommended)

| Layer | Primary | Approved alternative |
|---|---|---|
| App hosting | Vercel (Next.js native) | Fly.io/Render with Docker |
| Postgres | Neon or Supabase (branchable) | RDS + pgBackRest |
| Redis | Upstash (serverless) | ElastiCache |
| Object storage | Cloudflare R2 / S3 | Supabase storage |
| CDN/WAF | Cloudflare | Vercel edge |
| Secrets | Doppler or 1Password Connect | GitHub env secrets (last resort) |
| Monitoring | observability-slo gap file 21 stack (OTel + Sentry + uptime) | - |
| IaC | Terraform (infra) + repo config files (app) | Pulumi |

Selections become ADR 0007 at M0 sign-off.

## Domains and Zones

| Hostname | Purpose |
|---|---|
| www.thevaproject.ph (or .com.ph) | Landing/marketing |
| app.thevaproject.ph | Product |
| api.thevaproject.ph | Reserved (webhooks/integrations) |
| status.thevaproject.ph | Status page (future 54-status-page.md) |
| learn.thevaproject.ph | Help center (future 53-help-center.md) |

Rules: TLS everywhere (auto-renew), HSTS per 03-security.md, apex-to-www redirect, preview domains `*.preview.`.

## Environment Matrix

| Env | Branch/trigger | DB | Redis | Payments | LLM |
|---|---|---|---|---|---|
| local | dev machine | docker compose | docker | sandbox mock | mock adapter |
| preview | PR | branch DB (seeded) | ephemeral | sandbox | capped key |
| staging | main | persistent seeded | persistent | sandbox + webhook tester | real, budget-capped |
| prod | manual approval | real + replica | real + DR | live | live, budgeted |

Promotion rule: nothing reaches prod without staging e2e green + migration rehearsal (see 09-ci-cd.md).

## Secrets and Config

All runtime config via env (registry: repo-artifacts gap file 29 section 5); app fails fast on missing required vars with named error.

Secrets manager to deploy pipeline injection; zero secrets in images/repos.

Per-env isolation keys (a staging webhook can never touch prod tables).

## Backups, DR and Continuity

| Item | Value |
|---|---|
| Backups | nightly full + PITR WAL; encrypted; 30d |
| RPO / RTO | 5 min / 15 min (exec sign-off required at GA gate) |
| Failover | promote replica runbook (see 09-ci-cd.md); DNS TTL at most 300s for app+db |
| DR drill | quarterly tabletop + annual real restore into staging |
| Business continuity | If app unhostable: static maintenance page + email channel; teachers get offline grading sheets (see 50-teacher-quality.md section 7) |

## IaC Layout

```
infra/
  terraform/
    global/        # DNS, CDN, storage buckets
    prod/ staging/ preview-template/
  runbooks-link.md
```

Rules: state in remote backend + locking; terraform plan posted to PRs by CI; apply only from pipeline; drift check weekly.

## Scaling Policy and Capacity Plan

| Signal | Action |
|---|---|
| Sustained CPU/replicas > 70% (15m) | autoscale app tier |
| DB connections > 70% pool | enable pgbouncer / raise pool + investigate |
| Read-heavy dashboards slow | route cohort/analytics reads to replica |
| Queue depth trending | add worker concurrency before depth alert |

Forecast inputs (review quarterly with analytics): enrolled students x weekly active rate x actions/session. Current design headroom: 10x MVP traffic before structural change (partition xp_events/attempts when rows > 20M).

## FinOps (cost control)

| Line | Budget/mo (launch) | Alert at |
|---|---:|---:|
| Hosting/CDN | $80 | 80% |
| Database | $60 | 80% |
| Redis | $20 | 80% |
| Email | $15 | 80% |
| LLM coach | $50 (ai-governance gap file 24 section 6 kill-switch at 100%) | 80% |
| Error/observability | $30 | 80% |

Unit economics target: infra + LLM cost per monthly active student at most PHP 15 (pricing floor guard, see 46-billing-payments.md). Monthly FinOps line in ops review; anomalies become a ticket.