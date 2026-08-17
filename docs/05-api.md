---
title: PPC Coach - API Specification
file: 05-api.md
version: 1.0
reviewed: 2026-08-17
owner: Backend Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# API Specification

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Backend Lead
Style: REST over HTTPS, JSON. Base path: /api/v1. Next.js Route Handlers.
Primary UI mutations use Server Actions (12-server-actions.md); API exists for integrations, webhooks, and non-browser clients.

## Conventions

| Concern | Rule |
|---|---|
| Versioning | Path version /api/v1. Breaking changes -> /api/v2, v1 lives 2 releases. |
| Auth | Session cookie for browser; Authorization: Bearer for integrations. |
| Format | Request/response JSON, camelCase. Dates ISO-8601 UTC. |
| Idempotency | PUT/DELETE idempotent; mutating POSTs accept Idempotency-Key header. |
| Pagination | ?page=1&pageSize=20&q=; response includes meta:{page,pageSize,total}. |
| Errors | Envelope below; HTTP status + machine code + plain-words message. Never stack traces. |
| Ids | UUID v4, never sequential (no enumeration). |

## Error envelope

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Check the highlighted fields and try again.",
    "details": { "dailyBudget": "Must be between 1 and 1000." }
  }
}
```

## HTTP status map

| Status | When |
|---|---|
| 200 / 201 / 204 | success / created / deleted |
| 400 | validation failed |
| 401 | not authenticated |
| 403 | authenticated but not allowed |
| 404 | not found (also used instead of 403 to hide existence) |
| 409 | conflict (duplicate, stale version) |
| 422 | semantically invalid (valid shape, bad business rule) |
| 429 | rate limited (see 10-rate-limiting.md) |
| 500 | unexpected; alert fires |

## Endpoints

### Auth

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | /auth/register | public | Create student (invite-gated) |
| POST | /auth/login | public | Session cookie |
| POST | /auth/logout | any | Destroy session |
| POST | /auth/reset-request | public | Email reset token |
| POST | /auth/reset-confirm | public | Set new password |

### Progress & Learning

| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | /me/progress | student | Lessons done, XP, level |
| POST | /lessons/:id/complete | student | Mark complete (server re-checks prerequisites, awards XP) |
| GET | /quiz/:id | student | Fetch questions (answers never included) |
| POST | /quiz/:id/submit | student | Grade server-side, returns result |

### Practice (simulators)

| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | /trainer/:caseId | student | Case data |
| POST | /trainer/:caseId/submit | student | Grade decisions server-side |
| POST | /builder/submit | student | Score campaign build server-side |
| POST | /report/generate | student | Compute metrics + draft |

### Coach

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | /coach/ask | student | Question -> plain-words answer (rule engine / LLM w/ guard) |

### Teacher

| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | /teacher/cohort | teacher | List students + status flags |
| GET | /teacher/students/:id | teacher | Detail: progress, weak areas, attempts |
| POST | /teacher/assignments | teacher | Assign lesson/remediation |
| POST | /teacher/grades | teacher | Save grade + comments |

### Admin (see 11-admin.md)

| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | /admin/users | admin | Paginated user management |
| PATCH | /admin/users/:id | admin | Role/status changes (audit logged) |
| GET | /admin/audit | admin | Immutable audit trail |
| GET | /admin/health | admin/ops | Build/env/dependency report |

### Webhooks

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /webhooks/stripe | signature | Billing events (future) |
| POST | /webhooks/amazon-ads | signature + token | Sync events (future) |

## Example

```http
POST /api/v1/trainer/case-weekly-1/submit
Content-Type: application/json

{ "caseId": "case-weekly-1",
  "decisions": [ { "rowId": "r1", "action": "exact" }, { "rowId": "r2", "action": "negative" } ] }

200 OK
{ "ok": true, "data": { "score": 80, "correct": 8,
  "rows": [ { "rowId": "r1", "correct": true, "expected": "exact",
              "rationale": "Strong sales, ACOS below break-even." } ] } }
```

## Rate Limits (summary - full policy in 10-rate-limiting.md)

| Route group | Limit |
|---|---|
| Auth | 5 req/min/IP |
| Coach | 20 req/min/user |
| Writes | 60 req/min/user |
| Reads | 300 req/min/user |

## Change Management

Any endpoint addition -> update this doc + OpenAPI snapshot in same PR (CI fails if missing).
Deprecation: Deprecation + Sunset headers for >=1 release before removal.
Contract tests: Playwright suite hits every endpoint; CI blocks merges on contract drift.

---
