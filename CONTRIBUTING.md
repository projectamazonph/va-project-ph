# Contributing

The VA Project Philippines is a greenfield project. Start with the relevant
architecture document in `docs/`, then follow the TDD and plain-words rules in
`AGENTS.md` and `docs/20-testing-quality.md`.

## Local checks

```bash
pnpm install
pnpm docs:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Use a feature or fix branch. Keep changes small, update affected documentation,
and open a pull request for review. Never commit `.env` files, credentials, or
real student data.
