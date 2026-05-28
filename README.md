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

- React 18
- Vite 5

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173/
```

## Available Scripts

```bash
npm run dev      # start local dev server
npm run build    # production build
npm run preview  # preview production build locally
```

## Project Structure

```text
.
├── UpgradeAuctionAdmin.jsx   # main prototype UI
├── src/main.jsx              # React entry point
├── index.html                # app shell
├── vite.config.js            # Vite config
└── package.json              # scripts and dependencies
```

## Notes

- Theme is currently light corporate and tokenized for easy color management.
- Styling is inline and concentrated in `UpgradeAuctionAdmin.jsx` for rapid prototyping.

## AI-Assisted shadcn Workflow

This repository includes project-level shadcn skills for agent-driven development.

Installed artifacts:
- `.agents/skills/shadcn`
- `skills-lock.json`

Install command used:

```bash
npm exec skills add shadcn/ui
```

Recommended next steps:
1. Initialize shadcn for this app (`npx shadcn@latest init`) so `components.json` is created.
2. Add required components with `npx shadcn@latest add <component>`.
3. Keep generated UI primitives in `src/components/ui` and compose app-specific components separately.