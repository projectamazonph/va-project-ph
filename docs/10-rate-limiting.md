---
title: PPC Coach - Rate Limiting & Abuse Control
file: 10-rate-limiting.md
version: 1.0
reviewed: 2026-08-17
owner: Backend Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Rate Limiting & Abuse Control

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Backend Lead
Engine: Redis token bucket, edge middleware + service-level enforcement

## Philosophy

Protect auth, money-adjacent writes, and LLM-backed coach (cost vector).
Legit students never feel limits; limits target automation and abuse.
Fail closed for writes if Redis unavailable (return 503, alert); reads may fail open.

## Tiers

| Scope | Limit | Burst | Window | Key |
|---|---:|---:|---|---|
| Login / register / reset | 5 | 5 | 60s | IP |
| Login failures | 5 | - | 10min lockout | IP + email |
| API reads (authed) | 300 | 60 | 60s | userId |
| API writes (authed) | 60 | 15 | 60s | userId |
| Server actions | 120 | 30 | 60s | userId |
| Coach /ask | 20 | 5 | 60s | userId |
| Coach (LLM tier) | 10 | 3 | 60s | userId |
| Report generation | 10 | 3 | 60s | userId |
| Webhooks (inbound) | 120 | 30 | 60s | source IP + signature |
| Public pages | 300 | 100 | 60s | IP |

Teacher/admin scopes x2 multiplier. Role boost never applies to auth endpoints.

## Headers (every limited response)

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1755446400
Retry-After: 12        // only on 429
```

## Response on limit

```json
HTTP 429
{ "ok": false, "error": { "code": "RATE_LIMITED",
  "message": "You are going a bit fast. Please wait a few seconds and try again." } }
```

Plain words per 02-design.md copy rules - never blame the user.

## Implementation Contract

```typescript
// lib/rate-limit.ts - single implementation
rateLimit(key: string, opts: { limit: number; window: "1m" | "10m"; burst?: number })
  => Promise<{ allowed: boolean; remaining: number; resetAt: number }>
```

Middleware applies coarse IP limits; services apply per-user limits (defense in depth).
Keys namespaced: rl:{scope}:{key}; TTL auto-expiry; atomic Lua script (no race).
Unit tests: exact-boundary behavior (limit, limit+1, window rollover, burst).

## Escalation Ladder

| Signal | Action |
|---|---|
| 429 x >50/min same key | Log warn |
| Auth failures pattern | Temporary block + alert |
| Sustained abuse 15min | Auto-ban IP 24h + audit entry |
| Credential stuffing suspected | Force MFA on targeted accounts + Security alert |

## Exemptions & Changes

Health checks and internal jobs exempt (never public).
Limit changes require ADR-lite (comment in this file + PR review) and load-test evidence.
Quarterly review of thresholds against real traffic percentiles (p99 usage must stay <70% of limit).

---
