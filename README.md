# Auction Prototype

A React + Vite prototype of an airline upgrade auction experience.

It includes:
- Admin dashboard for auction operations
- Flight list and flight-level bid management
- Global auction rules configuration
- Email template previews (invite, reminder, confirmation)
- Passenger-side bidding flow mockup
- Auto-discovered Entities page (every seeded DB table is rendered)

This is a front-end prototype with an in-memory mock backend service layer.
There is no real network/API integration yet.

## Mock Backend Latency

The in-memory mock backend can simulate network latency to better exercise loading states.

Default behavior:
- Enabled in development
- Random delay between `120ms` and `800ms`
- Disabled in test mode (`vitest`)

Environment variables:
- `VITE_MOCK_LATENCY_ENABLED` (`true`/`false`)
- `VITE_MOCK_LATENCY_MIN_MS` (number)
- `VITE_MOCK_LATENCY_MAX_MS` (number)

## Mock Backend Failures

The mock backend can also emulate server errors to test error states and retries.

Default behavior:
- Enabled in development
- Global random failure rate is `0` (off unless configured)
- Disabled in test mode (`vitest`)

Environment variables:
- `VITE_MOCK_FAILURE_ENABLED` (`true`/`false`)
- `VITE_MOCK_FAILURE_RATE` (number between `0` and `1`)

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS 4 + shadcn/ui
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

### 2. Run development server

```bash
pnpm dev
```

Default local URL:

```text
http://localhost:5173/
```

## Available Scripts

```bash
pnpm dev      # start local dev server
pnpm build    # production build
pnpm preview  # preview production build locally
pnpm format   # format code with Biome
pnpm lint     # lint with warnings treated as errors
pnpm typecheck
pnpm typecheck:tests
pnpm test
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
├── src/
│   ├── App.tsx                        # main app orchestration
│   ├── main.tsx                       # React entry point
│   ├── index.css                      # global styles
│   ├── theme.ts                       # palette + semantic design tokens
│   ├── types.ts                       # type definitions
│   ├── i18n.ts                        # locale dictionaries (ru/en/uz) and Locale type
│   ├── locale.tsx                     # locale context provider + useLocale hook
│   ├── pages/                         # top-level page components
│   │   ├── AdminShell.tsx             # shell header + tab layout
│   │   ├── FlightList.tsx             # flight table view
│   │   ├── FlightDetail.tsx           # flight detail panel
│   │   ├── GlobalRules.tsx            # rules configuration
│   │   ├── EmailPreview.tsx           # email template previews
│   │   ├── PassengerBidUI.tsx         # passenger bid mockup
│   │   └── EntitiesPage.tsx           # auto-discovered DB tables view
│   ├── primitives/                    # reusable UI primitives (Pill, MetricCard, ...)
│   ├── components/ui/                 # shadcn/ui component layer
│   ├── domain/                        # pure helpers shared across UI and backend
│   │   ├── channel.ts                 # channel-to-icon mapping
│   │   ├── color.ts                   # color token resolver
│   │   └── weighted.ts                # bid weighted-score formula
│   ├── data/<entity>.ts               # per-entity seed data (one file per table)
│   ├── format/                        # display formatters (flight time, bid distribution)
│   ├── lib/                           # small framework-agnostic utilities
│   ├── queries/                       # TanStack Query hooks and keys
│   └── backend/                       # in-memory backend service + db emulator
│       ├── contracts.ts               # aggregate BackendClient contract
│       ├── serviceClient.ts           # builds db, services, latency wrapper
│       ├── latency.ts                 # latency + failure injection
│       ├── db/                        # generic DB emulator + contracts
│       └── services/<entity>/         # per-entity contracts.ts, service.ts, seed.ts
│           ├── airports/
│           ├── bids/
│           ├── bidStates/
│           ├── cities/
│           ├── countries/
│           ├── flightHauls/
│           ├── flightStatuses/
│           ├── flights/
│           ├── passengers/
│           ├── passengerConfig/
│           ├── rules/
│           ├── seatMap/
│           └── tiers/
├── tests/                             # vitest suites (db emulator + per-service)
├── index.html                         # app shell
├── vite.config.ts                     # Vite config
├── tsconfig.json                      # strict TS config
├── tsconfig.check.json                # typecheck config including tests
├── biome.json                         # Biome config (format + lint)
├── check.sh                           # quality checks
├── health.sh                          # security/dependency checks
└── package.json                       # scripts and dependencies
```

## Architecture Notes

### Modular Features
The codebase is organized under `src/` with thin layered folders:
- Each major UI panel lives in `src/pages/` as a self-contained module
- Reusable atoms live in `src/primitives/` (`Pill`, `MetricCard`, `BarChart`, ...)
- UI components follow the shadcn/ui pattern — installed under `src/components/ui/`
  and styled via Tailwind CSS 4 utility classes with semantic CSS custom property tokens
- `src/domain/` contains only pure cross-layer helpers: `color.ts` (token resolver),
  `channel.ts` (icon map), and `weighted.ts` (bid score formula)
- Color tokens live in `src/domain/color.ts`; enum dictionaries (tiers, bid states,
  flight statuses, flight hauls) are full entities — seed rows in `src/data/<entity>.ts`
  carry `name` (LocalizedString) and `colorId`/`bgId` token references
- Per-entity seed data is split into `src/data/<entity>.ts`
- Type definitions are centralized in `src/types.ts`

### Design Tokens
The color palette is owned by CSS custom properties on `:root` in `src/index.css`
(single source of truth, shadcn-compatible). The design tokens are exposed to
Tailwind 4 via `@theme inline` so components can use utility classes like
`bg-surface-card`, `text-text-muted`, and `border-border-default` directly.
`src/theme.ts` is a thin TypeScript bridge that maps semantic names to
`var(--token)` strings, retained for dynamic inline styles that still require
runtime color values (e.g. conditional Pill colors from entity data).

### Data & Mappings
- Seed data lives in `src/data/<entity>.ts` — one file per table (countries, cities, airports, passengers, flights, bids)
- Domain dictionary entries (e.g. country/city/airport `name`, tier/state/status `name`)
  carry `LocalizedString` shapes resolved with active `locale` from `useLocale()`
- Enum dictionaries (tiers, bid states, flight statuses, flight hauls) are served
  through their own backend services and consumed in pages via TanStack Query hooks
  (`useTiersById`, `useBidStatesById`, `useFlightStatusesById`, `useFlightHaulsById`)
  with `staleTime: Infinity`
- `src/i18n.ts` only contains pure UI text (labels, headings); no per-entity data

### Backend Layering
- The aggregate `BackendClient` contract lives in `src/backend/contracts.ts`
- Each entity is a folder under `src/backend/services/<entity>/` containing:
  - `contracts.ts` — service interface and entity-specific query/filter types
  - `service.ts` — exports `<entity>Seed` and `create<Entity>Service(db)`
  - `utils.ts` — pure helpers (filter mapping, joins) shared with tests/other services
- `src/backend/serviceClient.ts` merges all `*Seed` objects into a single DB and
  composes services + the generic `entities` service, then wraps everything with
  latency/failure injection
- Generic DB emulator is in `src/backend/db/emulator.ts`; metadata access
  (`tableNames`) is split into the `DbSchema` facet
- DB operations are declarative (`filters` + `patch`, no function arguments)
- Services own cross-entity joins so callers issue one request: e.g.
  `bids.list` joins `passengers`, and `flights.findDetailById` joins route
  airports + cities + countries via `airports/utils.ts`

### Adding a New Entity (DB-backed)
1. Add the type to `src/types.ts` and seed data to `src/data/<name>.ts`.
2. Create `src/backend/services/<name>/{contracts,service}.ts` (and `utils.ts` if needed),
   exporting `<name>Seed` and a `create<Name>Service(db)` factory.
3. Merge `<name>Seed` into the `createDbEmulator` call in `src/backend/serviceClient.ts`.
4. Add the service to the `BackendClient` type in `src/backend/contracts.ts`.
5. Add a query key in `src/queries/keys.ts` and a `use<Name>` hook under `src/queries/`.

### Adding a Config/State-only Service (no DB table)
For services that hold mutable config or non-relational state (like `rules`, `passengerConfig`,
`seatMap`), skip steps 1 and 3 above — create a `seed.ts` (or inline defaults in `service.ts`)
instead of `src/data/<name>.ts`, and pass no `db` argument to the factory.
4. Spread the seed and register the service in `src/backend/serviceClient.ts`.
5. Add a localized title under `entities.tableTitles` in `src/i18n.ts`.
6. The new table appears automatically on the `/entities` page.

### Text & Localization
- User-facing shared labels are centralized in `src/i18n.ts` under locale
  dictionaries (`ru`, `en`, `uz`)
- Runtime locale state is managed by `src/locale.tsx` (`LocaleProvider`, `useLocale`)
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
3. Keep generated UI primitives in `src/components/ui` and compose app-specific components separately.