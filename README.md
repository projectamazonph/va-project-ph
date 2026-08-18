# VA Project Philippines

Documentation suite for the VA Project Philippines platform - an Amazon PPC training system for Filipino virtual assistants.

## Documentation

The full numbered documentation catalog lives in `docs/index.md`. It is organized into eight sections (A through H):

- **A. Agent & Process** - agent identity, security, schema, API, db, frontend, backend, CI/CD, rate limiting, admin, server actions
- **B. Design & Brand** - personas, wireframes, interactions, copy bible
- **C. Engineering Standards** - gap analysis, testing, observability, content ops, analytics, AI governance, notifications, compliance, Amazon Ads integration, support
- **D. Security, Legal & Compliance** - vendor risk register, PH compliance, security
- **E. Quality & Operations** - RACI, help center, status page, changelog policy, templates
- **F. Product & Growth** - production gap audit, architecture, infrastructure, billing, product process, growth, teacher quality, offline performance, partnerships
- **G. Simulators** - shared platform plus six simulator specification and roadmap docs
- **H. Audits** - production gap audit, open questions

Working files (not in the numbered scheme) live alongside `docs/`: `curriculum-syllabus.md` and `syllabus-to-tracks-reconciliation.md`.

## Status

This repository is the **standalone greenfield home** for the VA Project Philippines platform. It has no external implementation dependency or companion repository.

The documentation in this repository is the source of truth for the product, architecture, curriculum, operations, and engineering conventions. The application implementation will be scaffolded and developed here as the project progresses.

## Development

The application uses Next.js App Router, TypeScript strict mode, Tailwind CSS,
Zod, and Vitest. Start locally with:

```bash
pnpm install
pnpm dev
```

Run the full local quality gate with `pnpm docs:check`, `pnpm format:check`,
`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.

The initial implementation lives in `app/`, shared UI primitives in
`components/ui/`, business foundations in `lib/` and `server/`, and tests in
`tests/`. Product and architecture decisions remain documented under `docs/`.

The `/dashboard` route is protected by default. `PREVIEW_MODE=true` is reserved
for local and E2E scaffold previews; it must not be enabled in production.

### Supabase setup

Copy `.env.example` to `.env.local` and set the `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` values from the Supabase `Academy`
project. Configure the Auth confirmation and magic-link email templates to send
`token_hash` to `/auth/confirm` before testing sign-in.

The initial database contract is committed under `supabase/migrations/`. Do not
apply it to a shared environment until the migration has been reviewed and
tested against a development database.
