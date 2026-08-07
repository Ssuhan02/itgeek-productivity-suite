# Project Status

_Last updated: 2026-08-08 (end of session)_

## Project Overview

**Purpose:** A single-user, browser-local to-do application with an integrated calendar, task prioritization, and project organization. Tasks live in a backlog or are scheduled to a date (and optionally a time). Every task carries a **Priority** (High/Medium/Low) and belongs to a **Project** (a user-managed, colored category — Work, Personal, etc.). The app currently has no backend — everything is stored in the browser's `localStorage`. **This is the Version 1.0 client-side foundation of a larger planned platform** — see Project Vision below and `docs/SYSTEM_DESIGN_DOCUMENT.md` for the full System Design Document (SDD).

**Current development stage:** As of 2026-08-08, the app is no longer just the ToDo prototype — it's a **multi-module shell**: a Home Dashboard (`/`) links to modules defined in a single config array, ToDo (`/todo`) is fully built and now includes pagination and a rich Task Details dialog, and Personal Finance/Settings/Profile exist as real, routed placeholders (plus six more placeholder modules defined but not yet surfaced on the dashboard). The ToDo module itself remains feature-complete: task management, scheduling, priority, project organization, search, Safe Delete & Recovery, pagination, and Task Details are all implemented and verified. The app still has **no persisted automated test suite** (see Known Gaps) and **no backend** — `localStorage` only, no multi-device/multi-user support. Runs locally via `npm run dev` (Vite dev server) or `npm run build` + `npm run preview`, and is live and publicly deployed at **https://itgeek-productivity-suite.pages.dev** (Cloudflare Pages, auto-deploying from GitHub on every push to `main` — see `DEPLOYMENT.md`). Production custom domains (`productivity.itgeek.xyz`, `todo.itgeek.xyz`, `finance.itgeek.xyz`) are planned but not yet configured.

## Project Vision

_Full detail: `docs/SYSTEM_DESIGN_DOCUMENT.md`. This section summarizes it — treat the SDD as the source of truth if the two ever disagree._

ITGeek ToDo is the first module of the planned **ITGeek Productivity Suite** — a multi-module, cloud-based SaaS productivity platform where independent modules (ToDo, Notes, Calendar, Expense Tracker, Habit Tracker, and future applications) share one authentication system, one backend, and one database.

- **Core principle:** a modular, scalable, user-centric architecture with a clear frontend/backend/database separation, so new modules can be added later with minimal impact on existing ones.
- **Design philosophy:** simplicity over complexity, user experience before unnecessary features, modular development, secure-by-design, a consistent UI, clean code, future scalability, and reusable components/services.
- **Build order:** the shared platform (authentication, user management, settings, common backend infrastructure) is built first; individual modules are then developed and released incrementally on top of it. ToDo is the first module; each module is completed and stabilized before the next one begins.
- **Platform landing page:** a Home Dashboard, serving as the shared entry point across all modules once the platform exists. **Built this session** — see below.

**Version roadmap** (from the SDD):

| Version | Objective |
|---|---|
| **1.0** | ITGeek Platform + ToDo |
| **2.0** | Personal Finance Module |
| **3.0** | AI Productivity Assistant |
| **4.0** | Team Collaboration & Shared Workspaces |
| **5.0** | Complete ITGeek Productivity Suite |

## Recent Development Session

_2026-08-08 — full-day Claude Code frontend session. Full narrative: `CHANGELOG.md`'s 2026-08-08 entry. Full architectural reasoning: `ARCHITECTURE.md` (new this session). Working conventions for future sessions: `CLAUDE.md` (new this session)._

**Work completed:**
- **Home Dashboard & Suite shell** — new `DashboardPage` (`/`), config-driven module system (`src/config/modules.ts`'s `MODULES` array drives the dashboard grid, `GlobalNav`, and `App.tsx`'s route generation), reusable `ComingSoonPage`, `AppLayout` shared shell, `usePageTitle` hook. Proved the config-driven architecture by adding six placeholder modules (Calendar, Notes, Habits, Inventory, PMP Study, Japanese Learning) fully routed, then removing them from the dashboard again — zero component changes either direction.
- **ToDo module: pagination** — `usePagination` hook + `Pagination` component, 5 tasks/page, applied after the existing filter/sort pipeline. New dev-only sample data (`src/dev/sampleTodos.ts`, 20 tasks) gated behind `import.meta.env.DEV`, verified absent from production builds.
- **ToDo module: Task Details** — the Suite's **first reusable UI component**, `Dialog` (`src/components/ui/Dialog/`): backdrop blur, fade+scale entrance, focus trap, ESC/backdrop-click closing, scroll lock, focus restoration. Built on it: `TaskDetails`, a full per-task editing dialog (Title, Description, Project, Priority, Status, Scheduled/Due Date, Notes). `Todo` extended with `taskId`, `description`, `notes`, `status`, `dueDate`, `updatedAt` — all migrated for existing data. Human-readable Task IDs (`TSK-000001`). Single click opens the dialog; double-click still does the existing inline rename (debounced to avoid conflict). Unsaved-changes confirmation reuses the existing `useConfirm`.
- **ToDo layout architecture** — several iterative passes converged on: `.layout` as CSS Grid (content-driven equal-height columns, no viewport-binding needed), a "single-stretch-responsibility" principle applied throughout (only one element per chain claims `flex-grow`), and the calendar grid now genuinely stretching to fill its card (`grid-template-rows: repeat(6, 1fr)`, cells grow taller instead of leaving dead space).
- **Shared design system** — new `.app-input` base class (the standard input styling + clean focus state for the whole Suite), applied to both the task input and Search input, removing duplicated CSS and a stray focus-glow inconsistency between them.
- **Two real bugs found and fixed via verification** (not just inspection): a Task Details focus-restore race (fixed by seeding draft state synchronously via `useState`'s lazy initializer instead of `useEffect`, remounting per task via `key={todo.id}`), and a Status dropdown rendering multiple/mispositioned arrows (root cause: a `background` shorthand silently resetting a `background-image` set elsewhere in the cascade — fixed at the shared `.app-input` level, benefiting every consumer).
- **Process:** `file_listing.txt` established and maintained (regenerated/diffed) after every task, not just at session end; `ARCHITECTURE.md` and `CLAUDE.md` created today.

**Architecture / design decisions made:**
- Modules are config-only (`MODULES` array) — adding or hiding a module (even fully placeholder ones) never touches component code, only `src/config/modules.ts`.
- New app-wide reusable primitives get their own `components/ui/<Name>/` folder with a dedicated CSS file, distinct from the single global `App.css` — `Dialog` is the first, and is the standard going forward for Personal Finance/Settings/Profile/future confirmation dialogs. The three existing dialogs (`ConfirmDialog`, `ManageProjectsDialog`, `RecentlyDeletedDialog`) were deliberately left on their original `ModalOverlay`-based implementation this session — not migrated, to avoid regressing proven flows while building the new primitive. Migrating them is flagged as future cleanup, not done.
- CSS Grid, not Flexbox, is now the house style for "two panels must match height, driven by content" layouts — see `ARCHITECTURE.md`.
- Task IDs are derived (scanned from existing data), not separately persisted, so there's nothing to desync.

**Effect on this repository:** substantial. Two new dependencies-worth of surface area (routing + the module/dashboard system) sit in front of the previously-standalone ToDo app; the ToDo module itself gained pagination and a new dialog-based detail view on top of everything from prior sessions, which remains intact and unchanged in behavior. See Tech Stack, Current Folder Structure, Data Model, State Management, and Completed Features below — all updated to reflect the current codebase, not just this session's diff.

_2026-08-07 — source control, deployment, and infrastructure session (done manually outside Claude Code; documented here after the fact). Full narrative: `DEVELOPMENT_LOG.md`'s 2026-08-07 entry. Full deployment reference: `DEPLOYMENT.md`._

**Work completed:**
- Initialized git, configured it with a GitHub account, and committed the project.
- Created the GitHub repository (https://github.com/Ssuhan02/itgeek-productivity-suite) and pushed the project to it.
- Configured a GitHub Actions workflow to deploy to GitHub Pages; deployment could not complete due to a global GitHub Actions hosted-runner outage.
- Switched hosting to Cloudflare Pages: created a Cloudflare account, connected the GitHub repo, and completed the first successful deployment. Automatic deployment from GitHub on every push to `main` is now configured.
- Removed the GitHub Pages–specific `base: '/itgeek-productivity-suite/'` from `vite.config.ts` (unnecessary, and would break asset paths, on Cloudflare Pages).
- Reorganized documentation for consistency: `TODO_NEXT.md` → `ROADMAP.md`, `docs/SESSION_NOTES.md` → `DEVELOPMENT_LOG.md` (moved to project root), added `DEPLOYMENT.md`, updated this file, `CHANGELOG.md`, and `README.md`.

**Decisions made:**
- Abandon GitHub Pages in favor of Cloudflare Pages for hosting, going forward (not just as a one-time workaround for the outage).
- DNS stays on GoDaddy; Cloudflare is scoped to hosting/CDN/SSL/auto-deploy only, not DNS.
- Production architecture will use three subdomains: `productivity.itgeek.xyz` (platform landing), `todo.itgeek.xyz` (ToDo module), `finance.itgeek.xyz` (Personal Finance module, Version 2.0).

**Effect on this repository:** one functional code change (`vite.config.ts`'s `base` option removed — required for the new host, not a feature change) plus the documentation reorganization described above. The application itself is otherwise unchanged from 2026-08-05/06. The project now has real source control and a live, auto-deploying hosting pipeline for the first time — see "Project Overview" above and the updated Tech Stack table below.

_2026-08-06 — planning/architecture session. No application code was changed; this was a documentation- and vision-setting session, distinct from the feature-building session on 2026-08-05 described throughout the rest of this document._

**Work completed:**
- Created the initial System Design Document (`docs/SYSTEM_DESIGN_DOCUMENT.md`) — the project's authoritative architecture/vision reference going forward.
- Defined the Project Vision, Core Principle, Design Philosophy, Project Goals, and Future Vision (summarized in Project Vision above; full text in the SDD).
- Updated `PROJECT_STATUS.md` (this file) and replaced `TODO_NEXT.md` with a new priority order reflecting the platform-first direction.
- Created `docs/SESSION_NOTES.md` as a chronological session log, starting with today's entry.

**Architecture / strategic decisions made:**
- ITGeek ToDo is the first module of the ITGeek Productivity Suite, not a standalone app.
- The shared platform (auth, user management, backend infrastructure) will be built before any additional modules.
- Version 2.0 will introduce a Personal Finance module.
- A Home Dashboard will serve as the platform's landing page.

**Effect on this repository:** none, functionally. Everything described elsewhere in this document (the existing frontend implementation) is unaffected and now serves as the Version 1.0 client-side foundation under this plan. Today's work sets the direction for backend/platform work starting next session — see the rewritten `ROADMAP.md`.

## Tech Stack

| Category | Choice |
|---|---|
| Language | TypeScript (~6.0.2, module target `esnext`, target `es2023`) |
| UI framework | React 19.2.8 (function components + hooks only) |
| Routing | React Router 7.18.2 (`react-router-dom`) — added this session; `BrowserRouter` in `main.tsx`, route table in `App.tsx` generated from `src/config/modules.ts` |
| Build tool | Vite 8.2.0 with `@vitejs/plugin-react` |
| Linting | oxlint 1.75.0 (`.oxlintrc.json`) |
| Styling | Plain CSS with native CSS nesting, single global `App.css` (~2,560 lines) + `index.css` (no Sass/Tailwind/CSS-in-JS) |
| State management | React local state only (`useState`) + `useLocalStorage` hook, plus `ConfirmContext`/`ToastContext` for cross-cutting imperative UI — no Redux/Zustand |
| Persistence | Browser `localStorage`, two keys: `todos`, `projects` |
| Browser automation (dev-only) | Playwright 1.62.1 (`devDependency`), Chromium binary installed locally — used to manually drive/screenshot/verify the app during development; **no checked-in test files use it yet** |
| Package manager | npm (`package-lock.json` present) |
| Source control | Git + GitHub — [`Ssuhan02/itgeek-productivity-suite`](https://github.com/Ssuhan02/itgeek-productivity-suite) (since 2026-08-07) |
| Hosting / deployment | Cloudflare Pages, auto-deploying from GitHub on push to `main` — https://itgeek-productivity-suite.pages.dev (since 2026-08-07). See `DEPLOYMENT.md`. |

**Notable absence:** still no test runner wired to `npm test`, no CI config beyond the now-inactive GitHub Pages workflow (see `DEPLOYMENT.md`), no `strict: true` in `tsconfig.app.json`.

## Current Folder Structure

```
ToDo App/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / .app.json / .node.json
├── .oxlintrc.json
├── file_listing.txt                   # Maintained file map — regenerated/diffed after every task (see CLAUDE.md)
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                       # Entry point: BrowserRouter + ConfirmProvider + ToastProvider, sets the background CSS var before render
│   ├── App.tsx                        # Route table only — generated from MODULES; no application logic lives here anymore
│   ├── App.css                        # All feature/component styling (single global stylesheet, ~2,560 lines)
│   ├── index.css                      # Global resets, CSS variables (theme), page background (reads var(--app-bg-image))
│   ├── types.ts                       # Todo, Project, Priority, TaskStatus, Filter, SortOption types
│   ├── pages/                         # NEW this session — one component per route, owns its own state
│   │   ├── DashboardPage.tsx          # "/" — Home Dashboard, renders a ModuleCard per visibleOnDashboard module (stateless)
│   │   ├── TodoPage.tsx               # "/todo" — everything the old App.tsx used to own (state, mutators, filter pipeline)
│   │   └── ComingSoonPage.tsx         # Generic placeholder page for any coming-soon module; takes just `moduleName`
│   ├── layouts/                       # NEW this session
│   │   └── AppLayout.tsx              # Shared page shell: optional GlobalNav, title header, content, footer, dev signature
│   ├── config/                        # NEW this session — data, not components
│   │   ├── modules.ts                 # MODULES: ModuleInfo[] — drives routing, dashboard, and nav. See ARCHITECTURE.md
│   │   ├── branding.ts                # APP_NAME, APP_TAGLINE
│   │   └── dashboardTheme.ts          # Typed mirror of dashboard-related CSS custom properties
│   ├── contexts/                      # NEW this session (folder) — cross-cutting imperative UI
│   │   ├── ConfirmContext.tsx         # useConfirm().requestConfirm(options) -> Promise<boolean>
│   │   └── ToastContext.tsx           # useToast().showToast(options)
│   ├── dev/                           # NEW this session — dev-only code, excluded from production builds
│   │   └── sampleTodos.ts             # 20 fixture tasks, gated behind import.meta.env.DEV + /* @__PURE__ */
│   ├── assets/
│   │   ├── index.ts                   # Top-level asset barrel (re-exports images/backgrounds; reserved slots for icons/logos/illustrations)
│   │   ├── images/
│   │   │   ├── backgrounds/
│   │   │   │   ├── mount-fuji-bg.png      # active background (project's own copy, independent of source file)
│   │   │   │   ├── background.jpeg        # previous background, kept as a catalogued (unused) alternative
│   │   │   │   └── index.ts               # exports mountFujiBg, mountFujiClassicBg
│   │   │   ├── icons/                 # empty, scaffolded for future use
│   │   │   ├── logos/                 # empty, scaffolded for future use
│   │   │   └── illustrations/         # empty, scaffolded for future use
│   │   └── fonts/                     # empty, scaffolded for future use
│   ├── themes/
│   │   ├── backgrounds.ts             # `backgrounds` catalog (BackgroundKey union); main.tsx picks the active one
│   │   ├── colors.ts                  # ThemeColors type scaffold (actual tokens still live as CSS vars in index.css)
│   │   ├── typography.ts              # ThemeTypography type scaffold (same idea, for font stacks)
│   │   └── index.ts                   # barrel
│   ├── hooks/
│   │   ├── useLocalStorage.ts         # Generic localStorage hook, with an optional migrate() param
│   │   ├── usePageTitle.ts            # NEW this session — sets document.title to the bare page name, no app-name prefix
│   │   ├── usePagination.ts           # NEW this session — generic pagination (pageItems/currentPage/totalPages/goToPage/...)
│   │   ├── useBodyScrollLock.ts       # NEW this session — reference-counted body-scroll lock, used by Dialog
│   │   ├── useConfirm.ts              # Reads ConfirmContext
│   │   ├── useToast.ts                # Reads ToastContext
│   │   ├── useDeleteWithUndo.ts       # Confirm -> exit animation -> undo-window toast -> commit, for the Safe Delete flow
│   │   ├── useUndoableDelete.ts       # Lower-level undo-window primitive used by useDeleteWithUndo
│   │   ├── useRecentlyDeleted.ts      # 24h Recently Deleted archive (separate localStorage key)
│   │   └── useExitAnimation.ts        # Generic "animate out, then remove" helper
│   ├── utils/
│   │   ├── date.ts                    # Date/time formatting + calendar-grid math
│   │   ├── priority.ts                # Priority constants: labels, icons, sort order, default
│   │   ├── projects.ts                # Project constants: defaults, color palette, icon options, color helpers
│   │   ├── sortTodos.ts               # Pure sort function for all 5 sort modes
│   │   ├── search.ts                  # Quick Search: field-extractor registry, matchesSearch, searchTodos
│   │   ├── highlight.ts               # getHighlightSegments — splits text around a search match for <mark> rendering
│   │   └── taskId.ts                  # NEW this session — formatTaskId/nextTaskNumber (derived, not persisted, "TSK-000001")
│   └── components/
│       ├── ui/                        # NEW this session — app-wide, domain-agnostic primitives (see ARCHITECTURE.md)
│       │   └── Dialog/
│       │       ├── Dialog.tsx         # The Suite's standard modal primitive
│       │       ├── Dialog.css         # Its own stylesheet — deliberately not merged into App.css
│       │       └── index.ts
│       ├── dashboard/                 # NEW this session
│       │   └── ModuleCard.tsx         # One dashboard card, entirely config-driven (no per-module logic)
│       ├── GlobalNav.tsx              # NEW this session — compact fixed top nav bar, driven by MODULES
│       ├── Header.tsx                 # NEW this session — the app title, used inside AppLayout
│       ├── TaskDetails.tsx            # NEW this session — Task Details dialog, built on ui/Dialog
│       ├── Pagination.tsx             # NEW this session — generic page-number control, pairs with usePagination
│       ├── TodoInput.tsx              # Add-task form: text, priority, project, optional schedule
│       ├── SearchBar.tsx              # Quick Search input: left icon, live filtering, clear button
│       ├── TodoList.tsx               # Pure list renderer; search-aware empty state
│       ├── TodoItem.tsx               # Single task row (checkbox, text w/ search highlighting + click-to-open-details, badges, buttons)
│       ├── TodoFilters.tsx            # Footer: item count, All/Active/Completed, Clear completed, Recently Deleted trigger
│       ├── TodoToolbar.tsx            # Project filter, Priority filter, Sort, Manage Projects trigger
│       ├── Calendar.tsx               # Month grid, navigation, high-priority day indicator; grid stretches to fill its card
│       ├── PrioritySelect.tsx         # Native select styled as a colored priority pill/control
│       ├── PriorityBadge.tsx          # Click-to-edit compact priority badge (wraps PrioritySelect)
│       ├── ProjectSelect.tsx          # Native select styled as a colored project pill/control (dynamic colors via CSS vars)
│       ├── ProjectBadge.tsx           # Click-to-edit compact project badge (wraps ProjectSelect)
│       ├── ManageProjectsDialog.tsx   # Modal: create/rename/recolor/re-icon/delete projects (still on ModalOverlay, not migrated to ui/Dialog)
│       ├── ConfirmDialog.tsx          # Generic confirm/cancel modal, invoked via useConfirm() (still on ModalOverlay)
│       ├── ModalOverlay.tsx           # Older modal primitive — still powers the three dialogs above; superseded by ui/Dialog for new work
│       ├── RecentlyDeletedDialog.tsx / RecentlyDeletedItem.tsx / RecentlyDeletedEmptyState.tsx / RestoreButton.tsx / DeleteForeverButton.tsx
│       ├── Toast.tsx / ToastContainer.tsx / TimerBadge.tsx
│       ├── EmptyState.tsx             # Shared "nothing here" block (used by TodoList and Recently Deleted)
│       ├── Tagline.tsx                # AppLayout's footer tagline
│       ├── DeveloperSignature.tsx     # Fixed bottom-right, non-interactive attribution
│       └── icons/
│           ├── CalendarIcon.tsx
│           ├── TrashIcon.tsx
│           ├── SettingsIcon.tsx
│           └── SearchIcon.tsx
└── PROJECT_STATUS.md / ROADMAP.md / CHANGELOG.md / ARCHITECTURE.md / CLAUDE.md / DEVELOPMENT_LOG.md / DEPLOYMENT.md
```

No `dist/` committed, no test directory.

## Data Model

```ts
// src/types.ts
export type Priority = 'high' | 'medium' | 'low'
export type TaskStatus = 'active' | 'completed'   // NEW — mirrors `completed`, doesn't replace it (see State Management)

export interface Project {
  id: string       // 'work' | 'personal' | ... for defaults, crypto.randomUUID() for user-created
  name: string
  icon: string      // emoji
  color: string     // hex, e.g. '#4f6bed' — arbitrary, user-editable
}

export interface Todo {
  id: string
  taskId: string          // NEW — human-readable "TSK-000001", display only; `id` is still the real key everywhere
  text: string
  completed: boolean
  createdAt: number
  updatedAt: number        // NEW — set on migration (defaults to createdAt) and by Task Details' Save; existing
                            //       mutators (toggle, drag-schedule, badge changes) don't bump it yet
  scheduledDate?: string   // 'YYYY-MM-DD'
  scheduledTime?: string   // 'HH:MM' 24-hour
  priority: Priority       // required; defaults to 'medium'
  projectId: string        // required; references a Project.id
  description?: string     // NEW — Task Details' "Description" field
  notes?: string            // NEW — Task Details' "Notes" field, distinct from description
  status: TaskStatus        // NEW — required; kept in sync with `completed`, not an independent source of truth
  dueDate?: string          // NEW — 'YYYY-MM-DD', distinct from scheduledDate (no calendar-placement behavior)
}

export type Filter = 'all' | 'active' | 'completed'
export type SortOption = 'priority' | 'dueDate' | 'newest' | 'oldest' | 'alphabetical'
```

**Default projects** (`src/utils/projects.ts`), seeded on first load and used as the migration fallback:

| id | name | icon | color |
|---|---|---|---|
| `work` | Work | 💼 | `#4f6bed` |
| `personal` | Personal | 🏠 | `#d6548a` |
| `learning` | Learning | 📚 | `#d98c2b` |
| `shopping` | Shopping | 🛒 | `#0f9488` |
| `travel` | Travel | ✈️ | `#06b6d4` |
| `health` | Health | 💪 | `#e2583f` |

A curated `PROJECT_COLOR_PALETTE` (~10 swatches) and `PROJECT_ICON_OPTIONS` (~18 emoji) back the "change color"/"change icon" pickers in the Manage Projects dialog and are also offered when creating a new project — colors aren't restricted to the palette at the data level (any hex works), the palette is just the curated UI picker.

**Invariants not enforced by the type system:**
- `projectId` should always reference an existing `Project.id`. `deleteProject` reassigns affected tasks before removing the project, so this holds in practice, but nothing prevents a future code path from violating it.
- `scheduledTime` should only be set when `scheduledDate` is set (same as before; still true).
- `status` should always agree with `completed` (`'completed'` iff `completed === true`) — enforced by convention (every write site sets both together), not by the type system. If a future code path ever sets one without the other, filtering/sorting (which still reads `completed`) and the Task Details Status field (which reads `status`) would silently disagree.

## State Management

State is now split by route instead of all living in one component:

- **`TodoPage.tsx`** owns everything ToDo-related — this is what used to be `App.tsx`'s state, moved as-is:
  ```ts
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', DEFAULT_PROJECTS)
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', applyDevSeed([]), (stored) => applyDevSeed(migrateTodos(stored, projects)))
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('oldest')
  const [isManagingProjects, setIsManagingProjects] = useState(false)
  const [isRecentlyDeletedOpen, setIsRecentlyDeletedOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [detailsTaskId, setDetailsTaskId] = useState<string | null>(null)   // NEW — which task's dialog is open
  ```
- **`DashboardPage.tsx`** has no state at all — purely `MODULES.filter(m => m.visibleOnDashboard).map(...)`.
- **`ConfirmContext`/`ToastContext`** (unchanged, cross-cutting) provide imperative, awaitable UI from anywhere — `TaskDetails`' unsaved-changes prompt uses `useConfirm()` rather than owning its own confirmation state.

**Filter pipeline** (each stage feeds the next, unchanged from before this session, now inside `TodoPage`): `todos` → `visibleTodos` (backlog vs. selected calendar date) → `projectFilteredTodos` → `priorityFilteredTodos` → `searchFilteredTodos` (via `searchTodos`) → `statusFilteredTodos` (All/Active/Completed) → `filteredTodos` (sorted, via `sortTodos`) → **`pagedTodos`** (NEW — via `usePagination`, the last step, 5/page; never affects which todos match or their order).

**Mutation functions in `TodoPage.tsx`:** `addTodo`, `toggleTodo`, `deleteTodo`, `editTodo`, `updateTodo` (NEW — Task Details' Save, applies a partial `Todo` patch), `clearCompleted`, `scheduleTodo`, `unscheduleTodo`, `changePriority`, `changeProject`, `handleBacklogDrop`, `handleSelectDate`, plus project CRUD: `addProject`, `renameProject`, `updateProject`, `deleteProject`. None are memoized (`useCallback`) — unchanged known gap, now with one more function.

**Local (component-owned) state**, for completeness: `TodoItem` (text-edit draft, inline scheduler date/time, plus a `clickTimer` ref this session for the single-click-vs-double-click debounce), `TodoInput` (text, schedule toggle/date/time, priority, projectId), `Calendar` (viewed month, drag-hover date), `PriorityBadge`/`ProjectBadge` (isEditing), `ManageProjectsDialog` (which row's icon/color picker is open, new-project draft fields), `TaskDetails` (NEW — its own `draft` object mirroring the open `Todo`, seeded synchronously per task via `key={todo.id}` — see `ARCHITECTURE.md`).

## LocalStorage

- **`'todos'`** — same mechanism as before (whole-array rewrite on every mutation), now also carrying `taskId`, `description`, `notes`, `status`, `dueDate`, `updatedAt` on every entry.
- **`'projects'`** — unchanged this session.
- **Migration:** `migrateTodos(todos, projects)` (in `TodoPage.tsx`) now also backfills the six new fields on any todo missing them: `taskId` (assigned in `createdAt` order via `nextTaskNumber`), `description`/`notes` (`''`), `status` (derived from `completed`), `dueDate` (left `undefined`), `updatedAt` (`createdAt`). Verified this session against hand-crafted old-shape todo objects (missing all six new fields) — migrates correctly, no crash, Task Details opens and displays them correctly afterward.
- **Dev-only seeding:** `applyDevSeed()` wraps the `useLocalStorage` default/migrate calls — if `import.meta.env.DEV` and the (parsed) todo list is empty, seeds `DEV_SAMPLE_TODOS` (20 fixture tasks). Checks the *parsed array's length*, not raw key presence, specifically because `useLocalStorage` always writes back `"[]"` for an empty list, which is a truthy stored string (a real bug this session, since fixed — see `CHANGELOG.md`). No-op in production (`import.meta.env.DEV` is statically `false`), and the fixture data itself is stripped from the production bundle (verified via `npm run build`).
- Still no general schema validation beyond the targeted migration functions — unchanged caveat.

## Components Added or Modified This Session

**New:** `DashboardPage`, `TodoPage`, `ComingSoonPage` (`pages/`); `AppLayout` (`layouts/`); `GlobalNav`, `Header`, `ModuleCard` (`components/dashboard/`), `TaskDetails`, `Pagination`; `Dialog` (`components/ui/Dialog/`); `ConfirmContext`, `ToastContext` promoted to their own `contexts/` folder; `usePageTitle`, `usePagination`, `useBodyScrollLock`; `utils/taskId.ts`; `config/modules.ts`, `config/branding.ts`, `config/dashboardTheme.ts`; `dev/sampleTodos.ts`.

**Modified:** `App.tsx` (rewritten — now just a `MODULES`-driven route table, no application logic), `main.tsx` (`BrowserRouter` wrapper), `types.ts` (six new `Todo` fields + `TaskStatus`), `TodoPage.tsx` (formerly `App.tsx`'s content — migration, `addTodo`, `updateTodo`, `detailsTaskId` state, pagination wiring), `TodoList.tsx`/`TodoItem.tsx` (pagination-aware, `onOpenDetails` threading, debounced click handler, focus/keyboard handling for the title), `SearchBar.tsx`/`TodoInput.tsx` (`.app-input` adoption), `App.css` (extensive — see `CHANGELOG.md`).

## Completed Features (cumulative, including prior sessions)

### Home Dashboard & Suite shell (2026-08-08)
Config-driven module system (`MODULES` array) drives dashboard cards, Global Nav, and routing simultaneously. Every module card is equally clickable (active modules open their real page; coming-soon modules open a shared placeholder) — no per-module logic anywhere in the dashboard or nav components. Adding a module (even placeholder) is a one-entry config change, proven by adding and then hiding six modules without touching any component.

### ToDo: Pagination (2026-08-08)
5 tasks per page, applied as the final step of the existing filter/sort pipeline (never affects matching or ordering). Generic `usePagination` hook + `Pagination` component, reusable by any future list, not ToDo-specific.

### ToDo: Task Details (2026-08-08)
Click a task's title (or Enter/Space when it has keyboard focus) to open a full editing dialog: Title, Description, Project, Priority, Status, Scheduled Date, Due Date, Notes. Built on the new `Dialog` primitive — dark blurred backdrop, fade+scale entrance, focus trap, ESC/backdrop-click to close, background scroll lock, focus restored to the exact task afterward. Editing then closing without saving prompts a confirmation (reusing the existing Safe-Delete confirm dialog pattern) before discarding. Double-click still starts the pre-existing inline rename, coexisting via a debounced click handler. Human-readable Task IDs (`TSK-000001`) shown read-only in the dialog header.

### ToDo: Layout & visual polish (2026-08-08)
Task list and Calendar cards match height via CSS Grid (content-driven, not viewport-bound); the calendar's month grid now genuinely fills its card (rows/cells grow taller) instead of leaving blank space; task rows and header controls made more compact (title font 15px→12px, controls ~20% shorter); pointer cursor across the entire clickable task row; a shared `.app-input` style unifies every text input's appearance and focus behavior across the app.

### Task list & scheduling (prior sessions — unchanged this session)
Add/edit/toggle/delete, All/Active/Completed filter, drag-and-drop scheduling, click-to-pick date/time, month calendar with navigation bounded to today ±10 years, context-aware remove (delete vs. unschedule), Safe Delete & Recovery (confirm → 5s undo → 24h Recently Deleted).

### Priority System (2026-08-05)
- Every task has a Priority (High 🔴, Medium 🟡, Low 🟢), defaulting to Medium.
- Selectable at creation (toolbar-styled `PrioritySelect`) and changeable any time directly on the task row via `PriorityBadge` — click the compact colored badge, pick a new value, it reverts to a badge automatically (no separate "edit mode" needed, avoids a focus/blur race that would exist if nested inside the text-edit flow).
- Priority filter in the list toolbar; 5 sort modes (Priority, Due Date, Newest, Oldest, Alphabetical) via `sortTodos`.
- Calendar days containing a scheduled High-priority task get a small red corner dot (`.has-high-priority`), independent of the existing "has tasks" fill.

### Project System (2026-08-05)
- Every task belongs to a Project (not "Category" — this was an explicit naming requirement). Default projects: Work, Personal, Learning, Shopping, Travel, Health, each with a name/icon/hex color.
- Same click-to-edit compact-badge pattern as Priority (`ProjectBadge` → `ProjectSelect`), but colors are **data-driven** (arbitrary hex per project, not a fixed 3-value enum) via CSS custom properties (`--proj-color`/`--proj-bg`/`--proj-border`) computed by `projectColorStyle()` — this is what lets user-created projects render correctly with zero new CSS.
- Project filter in the toolbar (composes with Priority filter, Status filter, and the calendar date selection — all four narrow the same underlying list independently).
- **Manage Projects dialog** (`ManageProjectsDialog`): create, inline-rename, change icon (click swatch → inline emoji grid), change color (click swatch → inline color grid), delete. Deleting is blocked when only one project remains (a task always needs somewhere to belong); otherwise affected tasks are reassigned to the first remaining project, never deleted.
- Migration backfills `projectId` on pre-existing tasks to the default Work project.

### Layout / Visual polish (2026-08-05, several iterative passes)
- Add-task toolbar restructured to a two-row layout (full-width input, then Priority/Project/Calendar/Add below) — fixes an overflow bug where the Add button was pushed outside the panel after Priority was added.
- Task-row action buttons (Calendar, Delete) are always visible at reduced opacity (not hover-only) — improves discoverability, especially on touch. Delete's "×" replaced with a proper Trash icon; both buttons share consistent 24×24 sizing, tooltips, and hover/focus treatment.
- Task-row title given a `flex: 1 1 auto` + small `min-width` floor instead of a large fixed floor — lets short titles stay on one line while long titles wrap across multiple balanced-width lines, pushing the badge/button cluster to its own line below via `flex-wrap`.
- Dropdown arrows: replaced the unstylable native browser arrow with a custom SVG chevron (`appearance: none` + `background-image`), consistently sized/positioned across every `<select>` in the app.
- New shared `.badge-pill` / `.badge-pill--control` CSS base, extracted so Priority and Project badges/selects don't duplicate the same geometry rules.

### Developer Signature (2026-08-05)
Fixed bottom-right, non-interactive (`pointer-events: none`, `user-select: none`), translucent glass-style badge reading "Developed by ITGeek © 2026."

### Responsive polish (2026-08-05)
Reused the existing `≤480px` breakpoint tier to tune `.card` padding, the calendar header/grid, `.todo-actions` wrapping, and the Manage Projects dialog for small phones; fixed `.badge-pill` text overflow, unified dialog `max-height`, added a defensive `overflow-x: hidden` on `body`.

### Quick Search (2026-08-05)
Full-width search bar (`SearchBar` + `SearchIcon`) between the add-task form and the filter toolbar. Live, case-insensitive, partial-match search across task title / project name / priority name via a field-extractor registry (`utils/search.ts`'s `SEARCH_FIELDS`) — adding a future searchable field is a one-line addition there. Composes with (never replaces) the Project/Priority/Status filters and the Calendar date selection. Matching text highlighted via `<mark>`; a dedicated "No matching tasks found" empty state. Search query is ephemeral UI state, not persisted.

### Background & Theme Architecture (2026-08-05)
Scalable asset/theme structure (`src/assets/`, `src/themes/`) replacing an old hardcoded background path — see the dedicated Asset & Theme Architecture section below.

## Asset & Theme Architecture

_Unchanged this session — introduced 2026-08-05._

- **`src/assets/`** — all static, non-code files. `images/backgrounds/` holds the actual image files plus an `index.ts` that centralizes their exports. `images/icons/`, `images/logos/`, `images/illustrations/`, and `fonts/` exist as empty, scaffolded folders for future asset types.
- **`src/themes/`** — `backgrounds.ts` exposes a `backgrounds` catalog object that a future theme-switcher would read from; `colors.ts`/`typography.ts` currently only export **type** scaffolds — the app's actual color/font tokens still live as CSS custom properties in `index.css`'s `:root` block.
- **JS → CSS bridge:** `main.tsx` sets `document.documentElement.style.setProperty('--app-bg-image', ...)` synchronously before render; `index.css`'s `#root` rule consumes it as `var(--app-bg-image)`. Same pattern `utils/projects.ts`'s `projectColorStyle()` uses for per-project colors.
- Switching themes today means changing one line in `main.tsx`.

## Known Bugs / Limitations

1. **`TodoInput`'s schedule toggle/date/time don't reset after a successful submit.** `handleSubmit` resets `text` and `priority` but not `showSchedule`/`date`/`time`. Reproduced 2026-08-05 via automated test; **still not fixed** — out of scope for every session since (none touched `TodoInput`'s submit handler). Still flagged as a good, small, high-value next fix.
2. **Calendar day cells still not keyboard-accessible** — unchanged, still the most significant accessibility gap. (Note: the Task Details title *is* now keyboard-accessible, added this session — the calendar grid itself is the remaining gap.)
3. **No persisted automated test suite.** Every feature added/changed across every session, including this one, was verified with one-off Playwright scripts written directly into the project root/scratch directory and deleted immediately after use. Playwright itself is a real `devDependency`, confirmed working end-to-end repeatedly, but there are zero checked-in spec files and no `npm test` script.
4. **Stale `today` / date-bounds across a day boundary** — unchanged from before.
5. **Duplicated `getSchedulableDateBounds()` computation** and **structurally similar date/time picker rows** — both still unresolved.
6. **Drag-and-drop remains desktop/mouse-only** — unchanged.
7. **No confirmation before deleting a project** — unchanged.
8. **`crypto.randomUUID()` has no fallback**, **no general localStorage schema validation** beyond the targeted `migrateTodos` backfills, **`background-attachment: fixed`**, **unoptimized background image (~2.9 MB combined)** — unchanged.
9. **`TodoPage.tsx`'s mutation functions are not memoized** (`React.memo`/`useCallback`) — unchanged, one more function this session (`updateTodo`).
10. **`App.css` is now ~2,560 lines** (up from ~1,000+ noted previously) — still consistent with the project's deliberate "no CSS framework, no CSS modules" architecture, but the case for splitting it (e.g. per-feature files, still no build-time CSS-in-JS) grows stronger as it keeps growing. Not done this session — flagged for consideration.
11. **NEW: existing `Todo` mutators don't bump `updatedAt`.** Only Task Details' Save does. `toggleTodo`, `changePriority`, `changeProject`, drag-scheduling, and inline rename all leave `updatedAt` stale — a deliberate scope decision this session (touching every existing mutator was out of scope for an "add a dialog" task), but worth fixing in a future pass if `updatedAt` needs to be reliable for anything beyond Task Details' own display.
12. **NEW: `ConfirmDialog`/`ManageProjectsDialog`/`RecentlyDeletedDialog` still use the older `ModalOverlay` primitive**, not the new `Dialog`. Not a bug — both work correctly — but it's architectural inconsistency (two modal systems in one app) worth resolving via a future migration pass now that `Dialog` has proven itself on `TaskDetails`.

## Recommended Next Milestone

**Still superseded by the 2026-08-06 strategic pivot** for the *platform/backend* track — `ROADMAP.md`'s Priority 1 (complete the SDD) through Priority 9 (deploy the platform) remain untouched and unstarted; nothing this session changed that. What **did** change is the frontend track: the Home Dashboard (previously just a planned concept) is now real, and the ToDo module gained a meaningful new capability (Task Details) beyond what `ROADMAP.md` had explicitly planned for it.

Two reasonable next directions, in order of how directly they continue this session's momentum:

1. **Continue the frontend track** — either build out Personal Finance/Settings/Profile for real (currently placeholders), or keep deepening ToDo (Subtasks/Attachments/Recurring/Reminders/Activity History were explicitly named as *future* Task Details sections, not built this session — see `ROADMAP.md`), or do the `Dialog` migration cleanup (Known Bug #12).
2. **Switch to the backend/platform track** — `ROADMAP.md`'s Priority 1–9, unstarted since 2026-08-06. The frontend now has considerably more surface area (routing, multiple pages, a richer data model) that a future backend integration (Priority 8) will need to account for — worth keeping in mind whether that argues for starting backend design sooner rather than continuing frontend breadth first.

See `ROADMAP.md` for the full, currently-prioritized breakdown of both tracks.

## Git & Deployment History

_Supersedes the previous "Git Commit Suggestion" section — the project stopped being suggestion-only on 2026-08-07. Full narrative: `DEVELOPMENT_LOG.md`'s 2026-08-07 entry (infrastructure) and `CHANGELOG.md`'s 2026-08-08 entry (today's frontend work); full deployment detail: `DEPLOYMENT.md`._

| Commit | Date | Summary |
|---|---|---|
| `c1659b2` | 2026-08-07 | Initial commit (full working tree as of end of 2026-08-06 session) |
| `2e074c9` | 2026-08-07 | Add GitHub Actions deployment (GitHub Pages workflow) |
| `229454a`, `72106f0`, `a6108c1` | 2026-08-07 | Trigger GitHub Actions (retries during the GitHub Actions runner outage) |
| `8ce0203` | 2026-08-07 | Enable manual workflow |
| `4ef2131` | 2026-08-07 | Remove GitHub Pages base path (the `vite.config.ts` fix for Cloudflare Pages) |
| `57b457d` | 2026-08-07 | Update project documentation and Cloudflare deployment |
| `95b1fb0` | 2026-08-08 | Improve ToDo dashboard layout, responsive calendar, reusable input styles, and UI polish |
| `c9aaf0c` | 2026-08-08 | Refine Task Details dialog layout and fix status dropdown styling |

Repository: https://github.com/Ssuhan02/itgeek-productivity-suite. Current deployment: Cloudflare Pages at https://itgeek-productivity-suite.pages.dev, auto-deploying on every push to `main` — see `DEPLOYMENT.md` for the full setup and the domain plan.

## Code Review Findings

_Carried over from the original review; items resolved in a given session are marked accordingly._

### Bugs / correctness risks
- `TodoInput` schedule state doesn't reset after submit — still open (Known Bugs #1).
- Stale "today" and date bounds — still open.
- `crypto.randomUUID()` no fallback — still open.
- No general localStorage schema validation — still open (targeted migration for priority/projectId/the six new Task Details fields is a form of validation for those specific fields, not general validation).
- **New, resolved this session:** the Task Details focus-restore race and the Status dropdown's `background` shorthand bug — see `CHANGELOG.md`'s 2026-08-08 entry for both.

### Code smells / duplication
- Duplicated `getSchedulableDateBounds()` computation — still open.
- Structurally similar date/time picker rows — still open.
- `TodoPage.tsx`'s mutation functions still not memoized, one more of them now.
- **New, resolved this session:** Search and task-title input styling (border/radius/padding/font/focus) was duplicated before being extracted into the shared `.app-input` base class.
- **New, open:** two parallel modal-dialog systems now exist (`ModalOverlay`-based and `Dialog`-based) — see Known Bugs #12.

### Accessibility
- Calendar day cells still not keyboard-operable — still the most significant gap.
- **New, resolved this session:** the task title (which opens Task Details) is a real, labeled, keyboard-operable control (`tabIndex`, `role="button"`, Enter/Space) — it wasn't focusable at all before this session.

### TypeScript
- `strict` mode still not explicitly enabled — still open, still low-risk given the codebase's existing null-safety style.
- New code this session (module config, Dialog primitive, extended Todo fields) follows the same clean, no-`any` conventions.

### Performance
- Unoptimized background image — still open, still the single biggest performance item.
- No virtualization on `.todo-list` — still irrelevant at expected scale (still capped at 5 visible rows via pagination now, if anything less of a concern than before).

### React best practices
- Hooks usage remains correct throughout new code (no conditional hooks, accurate dependency arrays) — including a case this session where the *wrong* pattern (`useEffect`-based state seeding) was tried first, caught by verification, and replaced with the correct one (`useState`'s lazy initializer + `key`-based remount). See `ARCHITECTURE.md`.
- `key`s used correctly everywhere new lists were added (module routes, pagination pages).
- Still no `React.memo`/`useCallback` — consistent with "not needed yet," flagged again given the growing prop surface.

## Starting Point for Tomorrow

_Updated 2026-08-08._

1. Read this session's summary above and `CHANGELOG.md`'s 2026-08-08 entry for exactly what changed and why.
2. Decide between the two next-direction options in **Recommended Next Milestone** above (continue frontend breadth/depth, or switch to backend/platform per `ROADMAP.md`'s Priority 1–9) — this is a real decision point, not an obvious default either way.
3. If continuing frontend work: Personal Finance/Settings/Profile are still placeholder-only; the `Dialog`-migration cleanup (Known Bug #12) is small and well-scoped; `TodoInput`'s schedule-reset bug (Known Bug #1) is still the oldest open item and still easy to fix.
4. If switching to backend/platform: start at `ROADMAP.md`'s Priority 1 (SDD completeness review) — nothing in that track has been started since 2026-08-06.
5. The existing frontend still runs via `npm run dev`, is live at https://itgeek-productivity-suite.pages.dev, and `npm run build && npm run lint` both currently pass clean — that's the baseline to keep green regardless of which direction is chosen next.
6. `file_listing.txt` is current as of the end of this session (verified via diff, no changes pending). Keep it updated per-task going forward, per `CLAUDE.md`.
