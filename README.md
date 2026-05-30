# Auction Prototype

A React + Vite prototype of an airline upgrade auction experience.

It includes:
- Admin dashboard for auction operations
- Flight list and flight-level bid management
- Global auction rules configuration
- Email template previews (invite, reminder, confirmation)
- Passenger-side bidding flow mockup

This is a front-end prototype with mock data (no backend/API integration yet).

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
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
│   ├── UpgradeAuctionAdmin.tsx        # main app orchestration
│   ├── AdminShell.tsx                 # shell header + tab layout
│   ├── FlightList.tsx                 # flight table view
│   ├── FlightDetail.tsx               # flight detail panel
│   ├── GlobalRules.tsx                # rules configuration
│   ├── EmailPreview.tsx               # email template previews
│   ├── PassengerBidUI.tsx             # passenger bid mockup
│   ├── theme.ts                       # palette + semantic design tokens
│   ├── data.ts                        # domain data + UI mappings
│   ├── types.ts                       # type definitions
│   ├── primitives.tsx                 # reusable UI primitives
│   ├── main.tsx                       # React entry point
│   └── index.css                      # global styles
├── index.html                         # app shell
├── vite.config.ts                     # Vite config
├── tsconfig.json                      # strict TS config
├── biome.json                         # Biome config (format + lint)
├── check.sh                           # quality checks
├── health.sh                          # security/dependency checks
└── package.json                       # scripts and dependencies
```

## Architecture Notes

### Modular Features
The codebase is flattened under `src/` for prototype speed, while keeping modular files:  
- Each major UI panel is a self-contained module (FlightList, FlightDetail, GlobalRules, etc.)
- Shared UI primitives are isolated in `primitives.tsx`
- Type definitions are centralized in `types.ts`

### Design Tokens
Theme uses a palette + semantic token architecture:
- `PALETTE` in `theme.ts` defines the concrete color values
- `SEMANTIC` tokens layer on top for role-based naming (e.g., `bgWarning`, `textPrimary`)
- `data.ts` uses semantic token IDs for maintainable UI-to-color mappings

### Data & Mappings
`data.ts` contains:
- Domain data (flight statuses, tiers, distributions)
- UI mapping records (state metadata, color IDs, icons)
- `colorToken()` resolver for semantic token lookup

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