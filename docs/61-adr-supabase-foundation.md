---
title: ADR - Supabase Foundation
file: 61-adr-supabase-foundation.md
version: 1.0
reviewed: 2026-08-18
owner: Tech Lead
status: accepted
---

# ADR 61 - Supabase Foundation

## Decision

Use Supabase as the first-party persistence and authentication platform for the
VA Project Philippines application.

- Supabase Auth owns email-based authentication and browser sessions.
- Supabase Postgres owns profiles, course content, enrollments, progress, and
  worksheet submissions.
- Row Level Security is the primary database authorization boundary.
- Next.js server and browser clients use `@supabase/ssr`.
- Application services keep Supabase calls behind repository/service seams so a
  future provider change does not leak into UI components.

The initial target is the existing `Academy` Supabase project in the project
organization, region `ap-southeast-1`. The first migration is committed to the
repository before it is applied to any shared environment.

## Why

Supabase gives this project the smallest credible path to a working student
workflow: managed Auth, Postgres migrations, generated types, and database-level
authorization in one platform. It also fits the documented Postgres and RLS
requirements without adding an application-owned session system.

## Security constraints

- Only the publishable key may be exposed to browser code.
- A secret/service-role key must never be placed in `NEXT_PUBLIC_*` variables or
  committed to the repository.
- Server-side protected pages validate claims through Supabase Auth and read
  role data from `public.profiles`.
- Student, teacher, and admin access is enforced by RLS policies, not only by
  UI visibility.
- Auth email templates must use the token-hash confirmation flow before shared
  testing begins.

## Consequences

The existing custom HMAC session helper remains as a compatibility test seam
until the Supabase flow is verified in CI and a real preview environment. It is
not the production authentication path once Supabase configuration is present.

The database model and migration workflow now follow Supabase SQL migrations;
the older Prisma placeholder documentation must be updated before the first
production schema change.

## Verification before applying the migration

1. Run the local type, lint, unit, build, and E2E checks with Supabase packages
   installed.
2. Apply the migration only to a development branch or approved non-production
   project.
3. Inspect Supabase security and performance advisors.
4. Verify login, logout, RLS isolation, and the student-to-teacher review path.
