# Auction Prototype

A React + Vite prototype of an airline upgrade auction experience.

It includes:
- Admin dashboard for auction operations
- Flight list and flight-level bid management
- Global auction rules configuration
- Email template previews (invite, reminder, confirmation)
- Passenger-side bidding flow mockup
- Auto-discovered Entities page (every seeded DB table is rendered)

The codebase is a pnpm monorepo split into three packages:
- **`@auction/core`** — shared types, color tokens, and pure domain helpers
- **`@auction/backend`** — in-memory mock backend (services, DB emulator, seed data)
- **`@auction/web`** — the Vite + React SPA (admin + passenger UI)
- **`@auction/server`** — NestJS HTTP server that exposes the mock backend under `/api/*`

The web app talks to the server over HTTP (via a Vite dev proxy in development).
Data storage is still fully mocked in-memory inside `@auction/backend`.

## Mock Backend Latency

The in-memory mock backend can simulate network latency to better exercise loading states.

Default behavior:
- Enabled in development
- Random delay between `120ms` and `800ms`
- Disabled in test mode (`vitest`)

Environment variables (read from both Vite and Node process env):
- `VITE_MOCK_LATENCY_ENABLED` (`true`/`false`)
- `VITE_MOCK_LATENCY_MIN_MS` (number)
- `VITE_MOCK_LATENCY_MAX_MS` (number)

## Mock Backend Failures

The mock backend can also emulate server errors to test error states and retries.

Default behavior:
- Enabled in development
- Global random failure rate is `0` (off unless configured)
- Disabled in test mode (`vitest`)

Environment variables (read from both Vite and Node process env):
- `VITE_MOCK_FAILURE_ENABLED` (`true`/`false`)
- `VITE_MOCK_FAILURE_RATE` (number between `0` and `1`)

## Tech Stack

- pnpm workspaces monorepo (`packages/*`)
- React 19 + Vite 8 (web)
- NestJS 11 + Express (HTTP server)
- TypeScript 6 (strict, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`)
- Tailwind CSS 4 + shadcn/ui
- TanStack Query 5
- Biome 2
- Vitest 4
- simple-git-hooks + gitleaks checks

## Getting Started

### 0. Ensure pnpm version (recommended in Codespaces)

This project is pinned to `pnpm@11.4.0` via `packageManager` in `package.json`.

```bash
corepack enable
corepack prepare pnpm@11.4.0 --activate
pnpm -v
```

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the API server and web app

In one terminal:

```bash
pnpm dev:server   # NestJS on http://localhost:3000, routes under /api/*
```

In another terminal:

```bash
pnpm dev          # Vite on http://localhost:5173 (proxies /api -> :3000)
```

Open `http://localhost:5173/`.

## Available Scripts

Root scripts orchestrate the whole workspace:

```bash
pnpm dev              # start web dev server (Vite)
pnpm dev:server       # start API dev server (NestJS, tsx watch)
pnpm build            # production build of the web app
pnpm preview          # preview production web build locally
pnpm format           # format code with Biome
pnpm lint             # lint with warnings treated as errors
pnpm typecheck        # tsc -b (composite project references, all packages)
pnpm typecheck:tests  # flat tsc --noEmit including test files
pnpm test             # vitest run
```

Project check scripts in repo root:

```bash
bash check.sh      # format + lint + typecheck + tests
bash health.sh     # gitleaks + outdated deps + security audit
bash all-checks.sh # runs both scripts
```

## Project Structure

```text
.
├── packages/
│   ├── core/                          # @auction/core — shared types + pure domain helpers
│   │   └── src/
│   │       ├── types.ts               # cross-package type definitions
│   │       ├── colorTokens.ts         # ColorTokenId union
│   │       ├── domain/weighted.ts     # bid weighted-score formula
│   │       └── index.ts               # public surface
│   │
│   ├── backend/                       # @auction/backend — in-memory mock backend
│   │   ├── src/
│   │   │   ├── index.ts               # exports adminBackend, passengerBackend,
│   │   │   │                          #   createBackend, createServiceClient, contracts
│   │   │   ├── data/<entity>.ts       # per-entity seed data (one file per table)
│   │   │   └── backend/
│   │   │       ├── contracts.ts       # combined BackendClient contract (tests)
│   │   │       ├── client.ts          # composition root: adminBackend + passengerBackend
│   │   │       ├── serviceClient.ts   # builds db, both clients, latency wrapper
│   │   │       ├── latency.ts         # latency + failure injection (Vite + Node)
│   │   │       ├── admin/             # admin client contract + composition
│   │   │       ├── passenger/         # passenger client contract + composition
│   │   │       ├── db/                # generic DB emulator + contracts
│   │   │       └── services/<entity>/ # per-entity contracts.ts, service.ts, utils.ts
│   │   └── tests/                     # backend service + DB emulator suites
│   │
│   ├── server/                        # @auction/server — NestJS HTTP server
│   │   ├── src/
│   │   │   ├── main.ts                # bootstrap, listens on :3000
│   │   │   ├── app.module.ts          # root Nest module
│   │   │   ├── backend/instance.ts    # singleton createBackend() instance
│   │   │   ├── admin/                 # AdminController — /api/admin/*
│   │   │   └── passenger/             # PassengerController — /api/passenger/*
│   │   └── tsconfig.json              # decorator-enabled TS config
│   │
│   └── web/                           # @auction/web — Vite + React SPA
│       ├── index.html
│       ├── vite.config.ts             # Vite config (proxies /api -> :3000)
│       ├── components.json            # shadcn config
│       ├── public/
│       ├── src/
│       │   ├── App.tsx                # main app orchestration
│       │   ├── main.tsx               # React entry point
│       │   ├── index.css              # global styles
│       │   ├── theme.ts               # semantic design tokens
│       │   ├── i18n.ts                # locale dictionaries (ru/en/uz)
│       │   ├── locale.tsx             # LocaleProvider + useLocale hook
│       │   ├── api/httpBackend.ts     # fetch client matching backend surface
│       │   ├── pages/                 # AdminShell, FlightList, FlightDetail, ...
│       │   ├── primitives/            # reusable UI atoms (Pill, MetricCard, ...)
│       │   ├── components/ui/         # shadcn/ui components
│       │   ├── domain/                # UI-side helpers (color.ts, channel.ts)
│       │   ├── format/                # display formatters
│       │   ├── lib/                   # framework-agnostic utilities
│       │   └── queries/               # TanStack Query hooks + keys
│       └── tests/                     # smoke tests
│
├── package.json                       # root — shared devDeps + orchestrating scripts
├── pnpm-workspace.yaml                # packages, allowBuilds, overrides
├── tsconfig.base.json                 # shared strict TS options
├── tsconfig.json                      # root project references (composite build)
├── tsconfig.check.json                # flat typecheck including tests
├── vitest.config.ts                   # runs packages/*/tests + packages/*/src
├── biome.json                         # Biome config (format + lint)
├── check.sh                           # quality checks
├── health.sh                          # security/dependency checks
└── all-checks.sh                      # runs both
```

## Architecture Notes

### Package Boundaries
- `@auction/core` is the shared vocabulary (types, color token union, pure helpers)
  and depends on no other workspace package
- `@auction/backend` owns all data and business logic — services, DB emulator,
  seed data, admin/passenger clients, latency/failure injection — and depends
  only on `@auction/core`
- `@auction/server` is a thin NestJS transport that wraps a singleton
  `createBackend()` from `@auction/backend` behind REST controllers
- `@auction/web` never imports `@auction/backend` at runtime; it talks to the
  server over HTTP through `src/api/httpBackend.ts`, which mirrors the backend
  contract exactly. This keeps a real network boundary between UI and data.
- Cross-package imports resolve source-first via pnpm workspace symlinks and
  each package's `main`/`types` field pointing at `./src/index.ts`. TypeScript
  is configured with composite project references (`tsc -b`) so cross-package
  types are checked in dependency order; build artifacts emit to gitignored
  `packages/*/dist/`.

### HTTP Layer
- `@auction/server` mounts `AdminController` under `/api/admin` and
  `PassengerController` under `/api/passenger`, delegating each route to the
  matching method on the shared `createBackend()` instance
- Vite's dev server proxies `/api` to `http://localhost:3000`, so the web app
  uses relative URLs in both dev and production
- `httpBackend.ts` exports objects with the same shape as `adminBackend` /
  `passengerBackend`, so query hooks are agnostic to the transport

### Modular Features (web)
- Each major UI panel lives in `packages/web/src/pages/` as a self-contained module
- Reusable atoms live in `packages/web/src/primitives/` (`Pill`, `MetricCard`, `BarChart`, ...)
- UI components follow the shadcn/ui pattern — installed under `packages/web/src/components/ui/`
  and styled via Tailwind CSS 4 utility classes with semantic CSS custom property tokens
- `packages/web/src/domain/` contains UI-side helpers: `color.ts` (token resolver)
  and `channel.ts` (icon map). The `weighted.ts` bid-score formula lives in
  `@auction/core` since it is shared with the backend.
- Color tokens are declared as a union in `@auction/core/src/colorTokens.ts`
  and satisfied by the web `theme.ts` object at compile time

### Design Tokens
The color palette is owned by CSS custom properties on `:root` in
`packages/web/src/index.css` (single source of truth, shadcn-compatible).
The design tokens are exposed to Tailwind 4 via `@theme inline` so components
can use utility classes like `bg-surface-card`, `text-text-muted`, and
`border-border-default` directly.
`packages/web/src/theme.ts` is a thin TypeScript bridge that maps semantic
names to `var(--token)` strings, retained for dynamic inline styles that
still require runtime color values (e.g. conditional Pill colors from entity
data). It uses `satisfies Record<ColorTokenId, string>` to stay in sync with
the `ColorTokenId` union in `@auction/core`.

### Data & Mappings
- Seed data lives in `packages/backend/src/data/<entity>.ts` — one file per table
  (countries, cities, airports, passengers, flights, bids)
- Domain dictionary entries (e.g. country/city/airport `name`, tier/state/status `name`)
  carry `LocalizedString` shapes resolved with active `locale` from `useLocale()`
- Enum dictionaries (tiers, bid states, flight statuses, flight hauls) are served
  through their own backend services and consumed in pages via TanStack Query hooks
  (`useTiersById`, `useBidStatesById`, `useFlightStatusesById`, `useFlightHaulsById`)
  with `staleTime: Infinity`
- `packages/web/src/i18n.ts` only contains pure UI text (labels, headings);
  no per-entity data

### Backend Layering
- The backend is split into two client surfaces, composed in
  `packages/backend/src/backend/client.ts`:
  - `adminBackend` (`packages/backend/src/backend/admin/`) — full authority:
    flight operations, bid moderation (`approve`/`reject`/`autoSelect`),
    `rules.update`, raw entity tables, and ownership of all reference data
  - `passengerBackend` (`packages/backend/src/backend/passenger/`) — a
    read-mostly facade for the passenger app. It owns passenger-specific
    services (`passengerConfig`, `seatMap`) and, like a BFF in a real system,
    **delegates shared reads to the admin client**. It exposes only a
    narrowed, safe subset: `flights.findDetailById` (no listing/query),
    `rules.get` (no update), `passengers.getCurrent`, and re-exported
    context-free lookups (`tiers`, `flightHauls`, `airports`, `cities`,
    `countries`)
- The combined `BackendClient` contract in
  `packages/backend/src/backend/contracts.ts` (admin ∪ passenger) is used by
  `createServiceClient()` so backend tests can exercise every capability
  through a single entry point
- Each entity is a folder under
  `packages/backend/src/backend/services/<entity>/` containing:
  - `contracts.ts` — service interface and entity-specific query/filter types
  - `service.ts` — exports `<entity>Seed` and `create<Entity>Service(db)`
  - `utils.ts` — pure helpers (filter mapping, joins) shared with tests/other services
- `packages/backend/src/backend/serviceClient.ts` merges all `*Seed` objects
  into a single DB, builds the admin client, builds the passenger client on
  top of it, then wraps each with latency/failure injection (`createBackend()`)
- Generic DB emulator is in `packages/backend/src/backend/db/emulator.ts`;
  metadata access (`tableNames`) is split into the `DbSchema` facet
- DB operations are declarative (`filters` + `patch`, no function arguments)
- Services own cross-entity joins so callers issue one request: e.g.
  `bids.list` joins `passengers`, and `flights.findDetailById` joins route
  airports + cities + countries via `airports/utils.ts`

### Adding a New Entity (DB-backed)
1. Add the type to `packages/core/src/types.ts` and seed data to
   `packages/backend/src/data/<name>.ts`.
2. Create `packages/backend/src/backend/services/<name>/{contracts,service}.ts`
   (and `utils.ts` if needed), exporting `<name>Seed` and a
   `create<Name>Service(db)` factory.
3. Merge `<name>Seed` into the `createDbEmulator` call in
   `packages/backend/src/backend/serviceClient.ts`.
4. Register the service on the relevant client:
   `packages/backend/src/backend/admin/{contracts,client}.ts` (and, if the
   passenger app needs it, expose/delegate it in
   `packages/backend/src/backend/passenger/{contracts,client}.ts`). Keep
   `BackendClient` in `packages/backend/src/backend/contracts.ts` in sync
   for tests.
5. Expose the endpoints in `packages/server/src/admin/admin.controller.ts`
   (and `passenger/passenger.controller.ts` if applicable) and mirror the
   shape in `packages/web/src/api/httpBackend.ts` so the web transport stays
   aligned with the backend contract.
6. Add a query key in `packages/web/src/queries/keys.ts` and a `use<Name>`
   hook under `packages/web/src/queries/` importing `adminBackend` or
   `passengerBackend` from `../api/httpBackend`.

### Adding a Config/State-only Service (no DB table)
For services that hold mutable config or non-relational state (like `rules`,
`passengerConfig`, `seatMap`), skip steps 1 and 3 above — create a `seed.ts`
(or inline defaults in `service.ts`) instead of a file under
`packages/backend/src/data/`, and pass no `db` argument to the factory.
4. Spread the seed and register the service in
   `packages/backend/src/backend/serviceClient.ts`.
5. Add a localized title under `entities.tableTitles` in
   `packages/web/src/i18n.ts`.
6. The new table appears automatically on the `/entities` page.

### Text & Localization
- User-facing shared labels are centralized in `packages/web/src/i18n.ts`
  under locale dictionaries (`ru`, `en`, `uz`)
- Runtime locale state is managed by `packages/web/src/locale.tsx`
  (`LocaleProvider`, `useLocale`)
- Components consume `txt` from `useLocale()` instead of global translation constants
- Domain dictionary entries (e.g. airport `name`/`city`/`country`) carry
  `LocalizedString` and are rendered via `value[locale]`
- Adding a new locale can be done by extending `I18N`; switchers in admin/passenger UI
  update text reactively

## AI-Assisted shadcn Workflow

This repository includes project-level shadcn skills for agent-driven development.

Installed artifacts:
- `.agents/skills/shadcn`
- `skills-lock.json`

Install command used:

```bash
pnpm dlx skills add shadcn/ui
```

Recommended next steps:
1. Initialize shadcn for this app (`pnpm dlx shadcn@latest init`) so `components.json` is created.
2. Add required components with `pnpm dlx shadcn@latest add <component>`.
3. Keep generated UI primitives in `packages/web/src/components/ui` and compose
   app-specific components separately.