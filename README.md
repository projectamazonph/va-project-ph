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
- **G. Simulators** - slot reserved for the seven simulator specs
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

Run the full local quality gate with `pnpm format:check`, `pnpm lint`,
`pnpm typecheck`, `pnpm test`, and `pnpm build`.

The initial implementation lives in `app/`, shared UI primitives in
`components/ui/`, business foundations in `lib/` and `server/`, and tests in
`tests/`. Product and architecture decisions remain documented under `docs/`.
