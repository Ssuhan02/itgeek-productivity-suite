# ITGeek Productivity Suite — Development Roadmap

_Prioritized list for the next session(s). Renamed from `TODO_NEXT.md` on 2026-08-07 (content unchanged by the rename itself). This replaces the previous frontend-focused roadmap as of 2026-08-06, following the strategic decision to build ITGeek ToDo as the first module of the ITGeek Productivity Suite — see `docs/SYSTEM_DESIGN_DOCUMENT.md` and `PROJECT_STATUS.md`'s Project Vision section. Nothing here has been started unless explicitly marked done — this is a plan, not a changelog (see `CHANGELOG.md` for that)._

_Updated 2026-08-08 — a full frontend session landed (Home Dashboard, config-driven modules, ToDo pagination, the Task Details dialog and the Suite's first reusable UI primitive). See the new **Version 1.0 Frontend Progress** section below and the refreshed **Next Session Plan**. The backend/platform priorities (1–9) are unchanged and still unstarted — this was a frontend-only session._

## Version 1.0 Frontend Progress

_The SDD scopes Version 1.0 as "ITGeek Platform + ToDo" — the whole platform, not just the ToDo app. This section tracks the frontend half of that; Priorities 1–9 below track the backend/platform half, which is the actual bottleneck for calling V1.0 complete. There is no separate "Version 1.1" in the SDD's plan — the next numbered version is 2.0 (Personal Finance)._

| Piece | Status |
|---|---|
| Home Dashboard (platform landing page) | ✅ Done (2026-08-08) |
| Config-driven module/routing system | ✅ Done (2026-08-08) |
| Global Navigation Bar | ✅ Done (2026-08-08) |
| ToDo module — core (CRUD, scheduling, calendar, priority, projects, search, Safe Delete & Recovery) | ✅ Done (2026-08-04/05) |
| ToDo module — pagination | ✅ Done (2026-08-08) |
| ToDo module — Task Details (rich per-task view/edit) | ✅ Done (2026-08-08) |
| Reusable Dialog UI primitive (`components/ui/Dialog`) | ✅ Done (2026-08-08) — first component built explicitly for reuse across future modules |
| Personal Finance module | 🔲 Placeholder only (dashboard card + route, no functionality) — real build is Version 2.0 scope per the SDD table, though the placeholder exists now |
| Settings module | 🔲 Placeholder only |
| Profile module | 🔲 Placeholder only |
| Backend, database, authentication, API | 🔲 Not started — Priorities 3–7 below |
| Production custom domains | 🔲 Not started — see Next Session Plan |

**Bottom line:** the frontend shell is now considerably more "platform-shaped" than it was yesterday, but Version 1.0 per the SDD still requires the backend/platform work in Priorities 1–9 — none of which this session touched.

## Next Session Plan

_Updated 2026-08-08 — items 7–8 from the previous version of this list ("Continue Home Dashboard improvements" / "Continue ToDo module development") are substantially addressed as of today (see Version 1.0 Frontend Progress above) and have been replaced with more specific next steps below. Domain configuration (items 1–6) is still untouched and still first in line if picked up._

1. Connect GoDaddy custom domain.
2. Configure Cloudflare custom domain.
3. Configure `productivity.itgeek.xyz`.
4. Configure `todo.itgeek.xyz`.
5. Configure `finance.itgeek.xyz`.
6. Verify automatic deployments (confirm a push to `main` still deploys correctly once custom domains are attached).
7. **Choose a direction:** continue the frontend track (build a real Personal Finance/Settings/Profile module, deepen Task Details with one of its named future sections, or migrate the remaining dialogs to the new `Dialog` primitive — see Deferred below) **or** switch to the backend/platform track (Priority 1, below, unstarted since 2026-08-06). See `PROJECT_STATUS.md`'s Recommended Next Milestone for the tradeoffs.
8. If continuing ToDo specifically: `TodoInput`'s schedule-reset bug (Deferred list) is still the oldest open item and still small/high-value.

Full deployment context and step-by-step notes: `DEPLOYMENT.md`.

## Milestones completed

- ✅ **Git + GitHub source control** (2026-08-07) — repository initialized, committed, and pushed to [`Ssuhan02/itgeek-productivity-suite`](https://github.com/Ssuhan02/itgeek-productivity-suite).
- ✅ **Frontend deployed and live** (2026-08-07) — hosted on Cloudflare Pages at https://itgeek-productivity-suite.pages.dev, with automatic deployment from GitHub on every push to `main`. This is ahead of Priority 9 below in sequence (infrastructure groundwork), not a completion of Priority 9 itself — Priority 9 additionally requires the custom domains (see Next Session Plan) and the backend/platform work in Priorities 1–8. Full detail: `DEPLOYMENT.md`.
- ✅ **Home Dashboard, module system, and Global Nav** (2026-08-08) — the platform landing page named in the Project Vision now exists, config-driven end to end. Full detail: `PROJECT_STATUS.md`, `ARCHITECTURE.md`.
- ✅ **ToDo pagination and Task Details** (2026-08-08) — plus the Suite's first reusable UI component (`Dialog`), which future modules (starting with a real Personal Finance build) are expected to use. Full detail: `CHANGELOG.md`'s 2026-08-08 entry.

## Priority 1 — Complete the System Design Document
- **Description:** `docs/SYSTEM_DESIGN_DOCUMENT.md` currently covers Project Vision, Core Principle, Design Philosophy, Project Goals, Future Vision (version roadmap), Success Criteria, and Product Scope. Review it for completeness against what the following priorities will need — in particular, confirm it says enough (or add a section) about the intended technology direction, environments, and non-functional requirements (security, performance, availability) before architecture design begins in earnest.
- **Why it matters:** Every later priority explicitly says it should "reference this document before implementation" (the SDD's own closing line). Starting architecture work against an incomplete SDD risks decisions that have to be revisited.
- **Estimated complexity:** Easy — mostly review and gap-filling, not new invention.
- **Status:** Not started. Untouched by the 2026-08-08 frontend session.

## Priority 2 — Design the overall project architecture
- **Description:** Define how the frontend, backend, database, and shared platform services fit together at a system level — the modular structure the SDD's Core Principle calls for, made concrete (module boundaries, how modules share auth/backend/database without becoming tightly coupled, where the existing frontend fits).
- **Why it matters:** This is the bridge between the SDD's vision-level statements and the more concrete designs (backend, database, auth, API) that follow — those can't be designed correctly in isolation from this.
- **Estimated complexity:** Medium.
- **Note (2026-08-08):** the *frontend's own* module boundary pattern (config-driven `MODULES`, one route/page/dashboard-card per module, `Dialog` as a shared primitive) is now a real, working example of "modular, low-coupling" architecture that this priority's backend-facing design should stay consistent with, not necessarily mirror exactly — see `ARCHITECTURE.md`.

## Priority 3 — Design the backend architecture
- **Description:** Choose and document the backend's structure — language/framework, service boundaries, how it serves both the ToDo module today and additional modules later without rework, per the "shared platform first" decision.
- **Why it matters:** No backend exists yet; this is the first concrete technical decision of the platform build.
- **Estimated complexity:** Medium–Large.

## Priority 4 — Design the database schema
- **Description:** Model users, authentication data, and the ToDo domain (tasks, projects, priority, scheduling, description/notes/status/due-date, Safe Delete & Recovery's 24h retention) for persistent, multi-user, multi-device storage — replacing/superseding the current client-only `localStorage` model described in `PROJECT_STATUS.md`'s Data Model section, which is a useful reference for the fields that need to survive the move (now six fields larger than when this priority was first written).
- **Why it matters:** Directly required by the SDD's Success Criteria ("User data is securely stored in a database... Users can access their tasks from multiple devices").
- **Estimated complexity:** Medium.

## Priority 5 — Design the authentication system
- **Description:** Registration, login/logout, and per-user data isolation, per the SDD's Success Criteria and Core Principle ("a common authentication system" shared across all future modules).
- **Why it matters:** Every other module in the Suite depends on this being right and shared, not rebuilt per module.
- **Estimated complexity:** Medium–Large.

## Priority 6 — Design the REST API
- **Description:** Define the endpoints connecting the frontend to the new backend — covering the ToDo module's existing feature surface (tasks, projects, priorities, scheduling, search, Safe Delete & Recovery, and now Task Details' fields) plus auth.
- **Why it matters:** This is the contract the frontend integration (Priority 8) will be built against.
- **Estimated complexity:** Medium.

## Priority 7 — Implement the backend
- **Description:** Build the backend per Priorities 3–6's designs.
- **Why it matters:** The first real backend code for the project.
- **Estimated complexity:** Large.

## Priority 8 — Connect the frontend to the backend
- **Description:** Replace the current `useLocalStorage`-based persistence (now living in `TodoPage.tsx`, not `App.tsx`) with real API calls against the new backend, add the login/registration UI, and handle multi-device/session concerns the client-only version never had to.
- **Why it matters:** This is where the existing frontend (all of it — see `PROJECT_STATUS.md`'s Completed Features) actually becomes part of the platform rather than a standalone prototype.
- **Estimated complexity:** Large.

## Priority 9 — Deploy the platform
- **Description:** Ship Version 1.0 (ITGeek Platform + ToDo) to production, accessible at `productivity.itgeek.xyz` / `todo.itgeek.xyz` (and eventually `finance.itgeek.xyz` for Version 2.0) per the SDD's Success Criteria.
- **Status: partially in progress.** Hosting infrastructure is live (Cloudflare Pages, auto-deploy from GitHub), and the frontend now includes the platform-shell pieces (Dashboard, nav, routing) the SDD calls for — but the production custom domains are not yet configured (see Next Session Plan), and the backend/platform work in Priorities 1–8 hasn't started, so this priority isn't complete.
- **Why it matters:** Completion criterion for Version 1.0 per the SDD.
- **Estimated complexity:** Medium.

---

## Deferred (frontend technical debt)

Not abandoned — still real, accurate technical debt in the current frontend, just deprioritized behind the platform build above (or, for the newer items, simply not yet picked up). Full detail in `PROJECT_STATUS.md`'s Known Bugs / Limitations:

- `TodoInput`'s schedule toggle/date/time not resetting after submit (oldest open item, still small/high-value)
- No checked-in automated test suite
- Calendar day cells not keyboard-accessible
- Duplicated `getSchedulableDateBounds()` / similar date-time picker rows
- Stale `today` / date-bounds across a day boundary
- No confirmation before deleting a project
- TypeScript `strict` mode not enabled
- No general localStorage schema validation (likely superseded by server-side validation once Priority 8 lands)
- `TodoPage.tsx` callbacks not memoized
- Unoptimized background image (~2.9 MB combined)
- **New (2026-08-08):** `ConfirmDialog`/`ManageProjectsDialog`/`RecentlyDeletedDialog` still use the older `ModalOverlay` primitive, not the new `Dialog` — a small, well-scoped migration now that `Dialog` has proven itself on Task Details
- **New (2026-08-08):** existing `Todo` mutators (toggle, drag-schedule, badge changes, inline rename) don't update `updatedAt` — only Task Details' Save does. Worth a pass if `updatedAt` needs to be reliable for anything beyond its current display-only use
- **New (2026-08-08):** `App.css` has grown to ~2,560 lines — still fine architecturally (no framework/CSS-modules decision has changed), but worth considering a per-feature file split before it grows much further

## Future Enhancements

_(Unprioritized, product-level ideas — separate from the architecture/platform priorities above.)_

**Task Details** (2026-08-08's dialog was explicitly built to allow these without a redesign — see `TaskDetails.tsx`'s layout and `ARCHITECTURE.md`):
- Subtasks
- Attachments
- Recurring Tasks
- Reminders
- Activity History

**Everything else, unchanged:**
- Calendar project-color-coding, Project Dashboard/Statistics, AI project summary — all previously deferred frontend ideas the current data model already supports without rework.
- Week/day calendar views, export/import (JSON/ICS), drag-to-reorder within the backlog, dark mode.
- Everything named in the SDD's Future Vision (Personal Finance in v2.0, AI Productivity Assistant in v3.0, Team Collaboration in v4.0) — out of scope until the platform (Priorities 1–9 above) exists.
