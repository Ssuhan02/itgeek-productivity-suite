# ITGeek Productivity Suite

A multi-module, cloud-based productivity platform, currently in its **Version 1.0** stage: a polished, single-user, browser-local **ToDo** module (task management, scheduling, calendar, priorities, projects, search, and Safe Delete & Recovery) that serves as the client-side foundation for the wider planned suite — see `docs/SYSTEM_DESIGN_DOCUMENT.md` for the full vision (a shared platform, Home Dashboard, and future modules including Personal Finance, an AI Productivity Assistant, and Team Collaboration).

**Live:** https://itgeek-productivity-suite.pages.dev _(Cloudflare Pages; custom domains — `productivity.itgeek.xyz`, `todo.itgeek.xyz`, `finance.itgeek.xyz` — are planned but not yet configured. See `DEPLOYMENT.md`.)_

## Tech stack

- **Frontend:** React 19 + TypeScript, built with Vite
- **Styling:** plain CSS (no framework)
- **State/persistence:** React state + a `localStorage`-backed hook — no backend yet (see Roadmap)
- **Linting:** oxlint

Full detail: `PROJECT_STATUS.md`'s Tech Stack section.

## Getting started

```bash
npm install
npm run dev       # start the Vite dev server
npm run build      # type-check (tsc -b) and produce a production build in dist/
npm run preview    # preview the production build locally
npm run lint        # run oxlint
```

## Project documentation

This project keeps its working state in a small set of living documents rather than solely in code comments — read these before making changes, and keep them updated as you go:

| Document | Purpose |
|---|---|
| [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | The current, authoritative snapshot of the project: what's built, tech stack, data model, known bugs/limitations, and where to pick up next. Start here. |
| [`ROADMAP.md`](./ROADMAP.md) | Prioritized plan for upcoming work, including the immediate Next Session Plan. |
| [`DEVELOPMENT_LOG.md`](./DEVELOPMENT_LOG.md) | Chronological log of each development session — objectives, decisions, problems and solutions, open questions. |
| [`CHANGELOG.md`](./CHANGELOG.md) | Feature-level changelog of what shipped, session by session. |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | How and where the app is hosted, the deployment pipeline, and the production domain plan. |
| [`docs/SYSTEM_DESIGN_DOCUMENT.md`](./docs/SYSTEM_DESIGN_DOCUMENT.md) | The project's architecture and vision reference — the source of truth for direction and scope. |

## Deployment

Hosted on **Cloudflare Pages**, connected directly to this GitHub repository — every push to `main` triggers an automatic build and deploy. Source control is Git + GitHub; DNS for the planned custom domains stays on GoDaddy. Full details, history, and the domain plan: [`DEPLOYMENT.md`](./DEPLOYMENT.md).
