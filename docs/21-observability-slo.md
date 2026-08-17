---
title: Observability, SLOs and Error Budget
file: 21-observability-slo.md
version: 1.0
reviewed: 2026-08-17
owner: DevOps Lead
status: active
---

# 21 - Observability, SLOs and Error Budget

Version: 1.0 · Reviewed: 2026-08-17 · Owner: DevOps Lead

## Signals

| Signal | Tool | Standard |
|---|---|---|
| Logs | Structured JSON -> log platform | level, ts, correlationId, userIdHash, route, durationMs |
| Metrics | Prometheus-compatible | RED method per route + business counters |
| Tracing | OpenTelemetry | action -> service -> repo spans |
| Errors | Sentry (or equivalent) | grouped, with release tag; no PII in payloads |
| Uptime | External synthetic checks | login + trainer submit every 5 min from 2 regions |

## SLIs and SLOs

| User journey | SLI | SLO | Measurement |
|---|---|---|---|
| Auth | successful logins / attempts (excl. bad creds) | 99.9% / 30d | 5xx rate on auth routes |
| Learning | lesson page loads OK | 99.9% / 30d | synthetic + status codes |
| Practice | trainer/builder submits succeed | 99.5% / 30d | action success rate |
| Coach | answer returned 1% for 5m | SEV-2 | on-call page |
| SLO burn fast | 2% budget in 1h | SEV-2 | on-call page |
| SLO burn slow | 5% budget in 6h | SEV-3 | Slack next business day |
| p95 > 800ms | 10m | SEV-3 | Slack |
| Redis/DB down | health fail x2 | SEV-1 | page all hands |
| Job queue > 100 | 15m | SEV-3 | Slack |
| LLM spend > 80% daily budget | - | SEV-3 | Slack (auto-kill-switch at 100%) |
| Admin login | any | INFO | audit digest |

## Alert Quality Rules

- Every alert has a runbook link; alerts without runbooks fail the monthly audit.
- Noise budget: any alert paged twice and dismissed gets retuned within 1 week.

## Retention

| Data | Retention |
|---|---|
| Logs | 30 days hot, 1 year cold |
| Metrics | 15 months |
| Traces | 14 days |
| Errors | 90 days |
| Audit events | 2 years (see 03-security.md) |

## Review Cadence

- Weekly: error budget check in team standup (1 slide).
- Monthly: alert quality review (noise, misses).
- Quarterly: SLO renegotiation with product.
