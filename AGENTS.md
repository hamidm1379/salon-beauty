<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Beauty Salon (Next.js 16 + Prisma 7)

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: SQLite via LibSQL + Prisma 7
- **Auth**: JWT (jose) with access/refresh tokens
- **UI**: Tailwind CSS 4, Framer Motion, Lucide icons
- **Language**: TypeScript 5, React 19

## Architecture
- `src/app/(public)/` — Public pages (no auth)
- `src/app/(dashboard)/admin/` — Admin dashboard (auth required)
- `src/app/api/` — API routes (auth via middleware)
- `src/services/` — Business logic (Service pattern)
- `src/repositories/` — Data access (Repository pattern)
- `src/lib/prisma.ts` — Prisma client singleton
- `src/middleware.ts` — Route protection

## Prisma Commands
```bash
npx prisma generate        # Regenerate client after schema changes
npx prisma migrate dev     # Create & apply migration
npx prisma migrate deploy  # Apply migrations in production
npx prisma db push         # Push schema without migration
npx prisma studio          # Open database GUI
```

## Code Conventions
- Use `"use client"` only when needed (Framer Motion, hooks)
- Services return `ApiResponse<T>` type
- Repository pattern for all DB queries
- Gold accent: `var(--color-gold-accent)` (#c9a227)
- Primary: `var(--color-primary)` (#7c3aed)
