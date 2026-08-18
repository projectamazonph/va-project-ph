# Persistence boundary

Supabase Postgres migrations live in `supabase/migrations/`. All database access
must stay behind `server/repositories/` and services must not expose Supabase
client types, following `docs/08-backend.md`.

This directory is retained temporarily as a migration marker for tooling that
expects a persistence directory. It is not an active Prisma integration.
