# ITGeek Productivity Suite — Development Roadmap

_Prioritized list for the next session(s). Renamed from `TODO_NEXT.md` on 2026-08-07 (content unchanged by the rename itself). This replaces the previous frontend-focused roadmap as of 2026-08-06, following the strategic decision to build ITGeek ToDo as the first module of the ITGeek Productivity Suite — see `docs/SYSTEM_DESIGN_DOCUMENT.md` and `PROJECT_STATUS.md`'s Project Vision section. Nothing here has been started unless explicitly marked done — this is a plan, not a changelog (see `DEVELOPMENT_LOG.md` for that)._

## Next Session Plan

_Added 2026-08-07 — this is the immediate to-do list for the next session, ahead of (and partly overlapping with) the numbered platform priorities below, which remain the longer-range plan._

1. Connect GoDaddy custom domain.
2. Configure Cloudflare custom domain.
3. Configure `productivity.itgeek.xyz`.
4. Configure `todo.itgeek.xyz`.
5. Configure `finance.itgeek.xyz`.
6. Verify automatic deployments (confirm a push to `main` still deploys correctly once custom domains are attached).
7. Continue Home Dashboard improvements.
8. Continue ToDo module development.

Full deployment context and step-by-step notes: `DEPLOYMENT.md`.

## Milestones completed

- ✅ **Git + GitHub source control** (2026-08-07) — repository initialized, committed, and pushed to [`Ssuhan02/itgeek-productivity-suite`](https://github.com/Ssuhan02/itgeek-productivity-suite).
- ✅ **Frontend deployed and live** (2026-08-07) — hosted on Cloudflare Pages at https://itgeek-productivity-suite.pages.dev, with automatic deployment from GitHub on every push to `main`. This is ahead of Priority 9 below in sequence (infrastructure groundwork), not a completion of Priority 9 itself — Priority 9 additionally requires the custom domains (see Next Session Plan) and the backend/platform work in Priorities 1–8. Full detail: `DEPLOYMENT.md`.

## Priority 1 — Complete the System Design Document
- **Description:** `docs/SYSTEM_DESIGN_DOCUMENT.md` currently covers Project Vision, Core Principle, Design Philosophy, Project Goals, Future Vision (version roadmap), Success Criteria, and Product Scope. Review it for completeness against what the following priorities will need — in particular, confirm it says enough (or add a section) about the intended technology direction, environments, and non-functional requirements (security, performance, availability) before architecture design begins in earnest.
- **Why it matters:** Every later priority explicitly says it should "reference this document before implementation" (the SDD's own closing line). Starting architecture work against an incomplete SDD risks decisions that have to be revisited.
- **Estimated complexity:** Easy — mostly review and gap-filling, not new invention.

## Priority 2 — Design the overall project architecture
- **Description:** Define how the frontend, backend, database, and shared platform services fit together at a system level — the modular structure the SDD's Core Principle calls for, made concrete (module boundaries, how modules share auth/backend/database without becoming tightly coupled, where the existing frontend fits).
- **Why it matters:** This is the bridge between the SDD's vision-level statements and the more concrete designs (backend, database, auth, API) that follow — those can't be designed correctly in isolation from this.
- **Estimated complexity:** Medium.

## Priority 3 — Design the backend architecture
- **Description:** Choose and document the backend's structure — language/framework, service boundaries, how it serves both the ToDo module today and additional modules later without rework, per the "shared platform first" decision.
- **Why it matters:** No backend exists yet; this is the first concrete technical decision of the platform build.
- **Estimated complexity:** Medium–Large.

## Priority 4 — Design the database schema
- **Description:** Model users, authentication data, and the ToDo domain (tasks, projects, priority, scheduling, Safe Delete & Recovery's 24h retention) for persistent, multi-user, multi-device storage — replacing/superseding the current client-only `localStorage` model described in `PROJECT_STATUS.md`'s Data Model section, which is a useful reference for the fields that need to survive the move.
- **Why it matters:** Directly required by the SDD's Success Criteria ("User data is securely stored in a database... Users can access their tasks from multiple devices").
- **Estimated complexity:** Medium.

## Priority 5 — Design the authentication system
- **Description:** Registration, login/logout, and per-user data isolation, per the SDD's Success Criteria ("Users can register with a username and password... securely log in and log out") and Core Principle ("a common authentication system" shared across all future modules).
- **Why it matters:** Every other module in the Suite depends on this being right and shared, not rebuilt per module.
- **Estimated complexity:** Medium–Large.

## Priority 6 — Design the REST API
- **Description:** Define the endpoints connecting the frontend to the new backend — covering the ToDo module's existing feature surface (tasks, projects, priorities, scheduling, search, Safe Delete & Recovery) plus auth.
- **Why it matters:** This is the contract the frontend integration (Priority 8) will be built against.
- **Estimated complexity:** Medium.

## Priority 7 — Implement the backend
- **Description:** Build the backend per Priorities 3–6's designs.
- **Why it matters:** The first real backend code for the project.
- **Estimated complexity:** Large.

## Priority 8 — Connect the frontend to the backend
- **Description:** Replace the current `useLocalStorage`-based persistence in `App.tsx` with real API calls against the new backend, add the login/registration UI, and handle multi-device/session concerns the client-only version never had to.
- **Why it matters:** This is where the existing frontend (all of it — see `PROJECT_STATUS.md`'s Completed Features) actually becomes part of the platform rather than a standalone prototype.
- **Estimated complexity:** Large.

## Priority 9 — Deploy the platform
- **Description:** Ship Version 1.0 (ITGeek Platform + ToDo) to production, accessible at `productivity.itgeek.xyz` / `todo.itgeek.xyz` (and eventually `finance.itgeek.xyz` for Version 2.0) per the SDD's Success Criteria.
- **Status: partially in progress.** Hosting infrastructure is live (Cloudflare Pages, auto-deploy from GitHub — see "Milestones completed" above and `DEPLOYMENT.md`), but the production custom domains are not yet configured (see Next Session Plan), and the backend/platform work in Priorities 1–8 hasn't started, so this priority isn't complete — only its hosting foundation is.
- **Why it matters:** Completion criterion for Version 1.0 per the SDD.
- **Estimated complexity:** Medium.

---

## Deferred (from the previous, frontend-only roadmap)

Not abandoned — still real, accurate technical debt in the current frontend, just deprioritized behind the platform build above. Full detail in `PROJECT_STATUS.md`'s Known Bugs / Limitations and Recommended Next Milestone sections:

- `TodoInput`'s schedule toggle/date/time not resetting after submit
- No checked-in automated test suite
- Calendar day cells not keyboard-accessible
- Duplicated `getSchedulableDateBounds()` / similar date-time picker rows
- Stale `today` / date-bounds across a day boundary
- No confirmation before deleting a project
- TypeScript `strict` mode not enabled
- No general localStorage schema validation (likely superseded by server-side validation once Priority 8 lands, rather than worth fixing client-side first)
- `App.tsx` callbacks not memoized
- Unoptimized background image (~2.9 MB combined)

## Future Enhancements

_(Unprioritized, product-level ideas — separate from the architecture/platform priorities above.)_

- Calendar project-color-coding, Project Dashboard/Statistics, AI project summary — all previously deferred frontend ideas the current data model already supports without rework.
- Recurring tasks, week/day calendar views, reminders/notifications, export/import (JSON/ICS), drag-to-reorder within the backlog, dark mode.
- Everything named in the SDD's Future Vision (Personal Finance in v2.0, AI Productivity Assistant in v3.0, Team Collaboration in v4.0) — out of scope until the platform (Priorities 1–9 above) exists.
