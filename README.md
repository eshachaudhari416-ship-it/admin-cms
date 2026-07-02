# Admin CMS — Module 12

Next.js + TypeScript + Tailwind admin panel for The AI Signal, covering all
10 content types: Tools, Companies, Models, Categories, Collections, News,
Videos, Repositories, Users, Reports — plus a Dashboard and Analytics view.

## Setup

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL
npx prisma migrate dev --name init
npx prisma db seed            # optional demo data
npm run dev
```

Visit `/admin`. Since Module 11 (Auth) isn't merged yet, `middleware.ts`
looks for a `stub_role` cookie (`ADMIN` or `EDITOR`) to let you in during
development — set one manually in your browser devtools, or temporarily
comment out `middleware.ts` while working locally.

**No Postgres server handy?** Swap `provider = "postgresql"` to `"sqlite"`
in `prisma/schema.prisma` and set `DATABASE_URL="file:./dev.db"`.

## Why it's structured this way

The brief's coding guidelines say "don't duplicate code" across a 10-entity
CMS — so instead of 10 sets of pages/routes/forms, there's **one of each**,
driven by a config file:

- **`src/lib/entities.ts`** — the entity registry. One entry per module with
  its Prisma model name, table columns, form fields, and zod validation
  schema. This is the single source of truth; adding an 11th module later
  means adding one object here, not new files.
- **`src/app/api/admin/[entity]/route.ts`** + **`[id]/route.ts`** — one
  dynamic API route serves list/create/read/update/delete for all 10
  entities, looking up the right Prisma model and schema from the registry.
- **`src/components/admin/DataTable.tsx`** + **`EntityForm.tsx`** — one
  table and one form component, rendered differently per module based on
  its config (column types, field types, status enum).
- **`src/app/admin/[entity]/page.tsx`** — one page renders `/admin/tools`,
  `/admin/companies`, etc.

## Folder structure

```
prisma/
  schema.prisma        # all 10 models + enums
  seed.ts              # demo data
src/
  app/
    admin/
      layout.tsx        # sidebar shell
      page.tsx           # dashboard
      analytics/page.tsx
      [entity]/page.tsx  # generic module page (tools, companies, ...)
    api/admin/
      [entity]/route.ts       # GET (list) / POST (create)
      [entity]/[id]/route.ts  # GET / PUT / DELETE one record
      analytics/route.ts      # counts for dashboard + analytics
    login/page.tsx       # placeholder until Module 11 ships
    globals.css
    layout.tsx
  components/
    admin/               # DataTable, EntityForm, Sidebar, Topbar, StatCard,
                          # StatusBadge, Empty/Error/Loading states
    ui/                  # generic Button, Input/Textarea/Select, Checkbox, Modal
  hooks/
    useEntityData.ts      # fetch + loading/empty/error state per module
  lib/
    entities.ts           # entity registry (see above)
    prisma.ts             # Prisma client singleton
    auth.ts                # requireAdmin() guard for API routes
  middleware.ts            # gates /admin/* pages
```

## Auth (temporary stub)

Real login belongs to Module 11. Until it's merged, `src/lib/auth.ts` reads
a role from a header/cookie so every API route can be built, tested, and
reviewed against a real contract:

```ts
// src/lib/auth.ts
export async function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role") ?? req.cookies.get("stub_role")?.value;
  // ...
}
```

Swap-in once Module 11 ships (NextAuth shown as an example in the file's
comments) — nothing else in the codebase needs to change, since every route
already calls `requireAdmin()` the same way.

## Status against the Definition of Done

- ✅ UI matches the design direction reviewed earlier (dark console aesthetic,
  unified status system across modules)
- ✅ API integrated — every table reads/writes through real `/api/admin/*`
  routes, not mock state
- ✅ Database integration — Prisma schema for all 10 entities
- ✅ No hardcoded data — `prisma/seed.ts` is the only seed data, everything
  else flows through the DB
- ✅ Loading, empty, error states — driven by real fetch results in
  `useEntityData`
- ✅ Proper validation — zod schemas per entity, enforced server-side in the
  API route (client-side check in the form is just for instant feedback)
- ✅ `npx tsc --noEmit` passes with zero errors
- ⚠️ **Not yet run in this sandbox**: `npx prisma generate` and `next build`
  need to download Prisma's query-engine binary from `binaries.prisma.sh`,
  which isn't reachable from here. Run `npm install && npx prisma generate
  && npm run build` on your machine or CI to do the final build check before
  opening your PR.
- ⚠️ Mobile responsive — the shell uses Tailwind responsive classes
  (`max-lg:hidden` on the sidebar, etc.) but hasn't been checked on a real
  device; worth a pass before marking this fully done.

## Git workflow reminder (from the brief)

```bash
git checkout -b feature/admin-cms
git add .
git commit -m "feat(admin): scaffold CMS with generic entity CRUD"
git push origin feature/admin-cms
# open a PR — don't push to main directly
```
