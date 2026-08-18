---
title: PPC Coach - Security Policy
file: 03-security.md
version: 1.0
reviewed: 2026-08-17
owner: Security Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Security Policy

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Security Lead
Model: defense in depth. Assume every input is hostile until validated.

## Threat Model Summary

| Asset | Threat | Primary Controls |
|---|---|---|
| Student accounts | Credential theft, session hijack | Strong password policy / OAuth, httpOnly cookies, rotation |
| Teacher data (cohorts, grades) | Unauthorized read | RBAC, row-level checks in every service |
| Amazon Ads tokens (future integration) | Exfiltration | Encrypted at rest (KMS), least-privilege scopes, no logging |
| Payments/billing (future) | Fraud | PCI via Stripe only; no card data touches our servers |
| Content (lessons) | XSS via rich text | Server-rendered, sanitized markdown; CSP |
| API | Brute force, scraping, abuse | Rate limiting (10-rate-limiting.md), validation |
| Simulator scoring | Tampered XP/leaderboards | All scoring computed server-side; client is display-only |

## Authentication & Sessions

Provider: Supabase Auth (email magic links initially; password and MFA can be
added when the product requires them).
Sessions: Supabase SSR cookies, httpOnly and Secure in production, with claim
refresh handled by the Next.js proxy.
Password reset and account lockout remain Supabase Auth configuration concerns.

Scaffold enforcement: protected routes use `requireSession()` and validate
Supabase Auth claims before rendering. `PREVIEW_MODE=true` is allowed only for
non-production local/E2E previews and must never be enabled in production.

## Authorization (RBAC)

| Role | Can |
|---|---|
| student | own progress, simulators, coach |
| teacher | assigned students' progress, grading, assignments |
| admin | everything + user management + audit |

Rules:
- Every route/action asserts role server-side - never trust client.
- Ownership check for all object access (resource.ownerId === session.userId or teacher<->student link).
- Deny by default. New endpoints start locked; permissions added explicitly.
- Permission checks live in one service (authz.ts) - never inline ad-hoc checks.

## Input & Output Safety

Zod validation on ALL inputs (client hint + server enforcement - server is authoritative).
SQL: Supabase migrations and repository queries only. Raw SQL requires Security review.
XSS: React escaping by default; dangerouslySetInnerHTML banned by lint rule.
Markdown content: sanitized (allowlist: p, ul, ol, li, table, b, i, code, no links to javascript:).
File uploads: type allowlist, max size, stored outside webroot, served signed.

## Headers & Transport

```
Content-Security-Policy: default-src 'self'; img-src 'self' data: cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; script-src 'self'; connect-src 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

TLS 1.2+ only. HSTS enforced at edge.

## Secrets Management

Secrets live ONLY in environment variables / secret manager. Never in code, docs, tests, fixtures, or git history.
.env* is gitignored + a pre-commit hook (gitleaks) blocks patterns.
Rotation schedule: DB creds 90d, API keys on demand, session signing key 180d.
If a secret leaks: revoke within 1 hour, rotate, file incident (16-runbooks.md).

## Data Protection & Privacy

Collect minimum: email, name, progress. No PII in simulator data.
Right to export & delete (GDPR-style): self-serve in Settings; hard delete within 30 days.
Backups encrypted at rest; restore tested quarterly.
Logs: never log passwords, tokens, full emails. Mask PII fields.
Amazon Ads data (future): read-only scopes, per-user encrypted tokens, purge on disconnect.

## Dependency & Supply Chain

Lockfile committed; pnpm install --frozen-lockfile in CI.
Dependabot/Renovate weekly; security patches merged.
