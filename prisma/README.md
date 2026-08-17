# Prisma boundary

The Prisma schema and migrations will be added with the first persistence slice.
All database access must stay behind `server/repositories/` and services must not
expose Prisma types, following `docs/08-backend.md`.
