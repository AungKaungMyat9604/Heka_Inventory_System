# Heka

Hospital **inventory and pharmacy masters** app built with **SvelteKit 5**, **Svelte 5**, **Drizzle ORM**, **PostgreSQL** (Neon), **Better Auth**, **Paraglide** (i18n), **Tailwind CSS 4**, and **DaisyUI 5**. The UI is trimmed to **Administration** (staff, user groups, branches, financial year, prefix configuration, departments), **Inventory Setup**, and **Inventory** operations (PR → PO → GRN, department flows, stock). Clinical EMR, registration, billing, CPOE, and medication-order screens were removed from this branch.

### Inventory-only fork and database

Navigation uses `module` / `page` rows from [`src/lib/server/db/seed/information-table-seed.ts`](src/lib/server/db/seed/information-table-seed.ts). Master lookup data is trimmed for inventory in [`master-table-seed.ts`](src/lib/server/db/seed/master-table-seed.ts).

**Schema-breaking migration:** [`drizzle/0067_inventory_only_drop_legacy.sql`](drizzle/0067_inventory_only_drop_legacy.sql) removes legacy clinical/billing/medication tables and trims `notification`, `prefix_format`, and `prefix_counter` columns. **Existing databases must run `pnpm run db:migrate`** (see [`docs/drizzle-migrations.md`](docs/drizzle-migrations.md)); do not mix old schema with new code. After migrating, run **`pnpm run db:seed`** so navigation and masters match the trimmed app (or reset to an empty branch and migrate + seed).

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** — lockfile is [`pnpm-lock.yaml`](pnpm-lock.yaml); prefer `pnpm` for installs and scripts
- **PostgreSQL** connection string compatible with Neon serverless (`DATABASE_URL`)

## Quick start

```sh
pnpm install
cp .env.example .env
# Edit .env — at minimum DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_BASE_URL

pnpm run paraglide
pnpm run db:push
pnpm run db:seed
pnpm run dev
```

Dev server listens on **http://localhost:5173** by default (`vite dev --host 0.0.0.0 --port 5173`).

The root path `/` redirects to `/auth/login`. Use seeded credentials from your environment or create accounts via signup where enabled.

## Environment variables

Authoritative template: [`.env.example`](.env.example). Highlights:

| Variable                      | Purpose                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                | PostgreSQL (Neon pooler URL recommended for serverless driver + transactions)                                |
| `BETTER_AUTH_SECRET`          | Session/crypto secret (min 32 chars; e.g. `openssl rand -base64 32`)                                         |
| `BETTER_AUTH_BASE_URL`        | App origin as Better Auth sees it (dev: `http://localhost:5173`)                                             |
| `BETTER_AUTH_URL`             | Optional; alias/origin wiring for Better Auth                                                                |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated extra origins (LAN IP, preview port, etc.)                                                   |
| `SMTP_*`                      | Outbound email (password reset, etc.)                                                                        |
| `PUBLIC_TINYMCE_API_KEY`      | Optional TinyMCE cloud                                                                                       |
| `TIGRIS_*`                    | Object storage for uploads                                                                                   |
| `PUBLIC_APP_NAME`             | Optional display name (defaults to `heka` in [`src/lib/config/app.config.ts`](src/lib/config/app.config.ts)) |

Optional **Playwright** credentials (local or CI when running full E2E):

| Variable             | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `E2E_LOGIN_EMAIL`    | User email for signed-in tests                        |
| `E2E_LOGIN_PASSWORD` | Password for that user                                |
| `E2E_BASE_URL`       | Override base URL (default in config: preview origin) |

## Scripts

| Script               | Description                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm run dev`       | Paraglide compile + Vite dev server                                                                          |
| `pnpm run build`     | Production build                                                                                             |
| `pnpm run preview`   | Preview production build                                                                                     |
| `pnpm run check`     | `svelte-check` + UI/server boundary guard ([`scripts/check-ui-boundary.mjs`](scripts/check-ui-boundary.mjs)) |
| `pnpm run lint`      | Prettier + ESLint                                                                                            |
| `pnpm run test:unit` | Vitest                                                                                                       |
| `pnpm run test:e2e`  | Playwright (starts preview; needs `.env` / DB for real auth)                                                 |
| `pnpm run test`      | Unit (run mode) + E2E                                                                                        |
| `pnpm run db:*`      | Drizzle push / generate / migrate / studio / seeds — see [`package.json`](package.json)                      |

Releases use **Changesets** (`pnpm run changeset`, `pnpm run version`, `pnpm run release`).

## Architecture (contributors)

- **UI → API → server-only**: Pages and components call `fetch()` to mirrored routes under [`src/routes/api/`](src/routes/api); DB and auth-heavy logic live in [`src/lib/server/`](src/lib/server). Do not import `$lib/server/**` from `.svelte` or `$lib/tool/**` — enforced by `pnpm run check`.
- **Types**: HTTP/JSON shapes for the UI belong in [`src/lib/model/type/`](src/lib/model/type); Drizzle schema types stay under [`src/lib/server/db/`](src/lib/server/db).
- **i18n**: User-visible strings use Paraglide `m.*()`; messages live in [`messages/`](messages/), compiled to [`src/lib/paraglide/`](src/lib/paraglide).
- **Docs**: [`docs/db-schema.md`](docs/db-schema.md), [`docs/drizzle-migrations.md`](docs/drizzle-migrations.md), [inventory skill](.cursor/skills/inventory-transactions-and-batch-flow/SKILL.md).

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes and pull requests: `paraglide`, `check`, `lint`, and unit tests.

Optional **Playwright** job: run [`.github/workflows/ci.yml`](.github/workflows/ci.yml) manually via **Actions → CI → Run workflow** and enable **Run Playwright E2E**. Configure repository **Secrets** (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `E2E_LOGIN_EMAIL`, `E2E_LOGIN_PASSWORD`, etc.) so the preview server and login tests can succeed.

## License / security

See [`SECURITY.md`](SECURITY.md) for supported versions and how to report vulnerabilities.
