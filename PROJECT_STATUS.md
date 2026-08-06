# Project Status

_Last updated: 2026-08-07 (end of session)_

## Project Overview

**Purpose:** A single-user, browser-local to-do application with an integrated calendar, task prioritization, and project organization. Tasks live in a backlog or are scheduled to a date (and optionally a time). Every task carries a **Priority** (High/Medium/Low) and belongs to a **Project** (a user-managed, colored category — Work, Personal, etc.). The app currently has no backend — everything is stored in the browser's `localStorage`. **This is now understood to be the Version 1.0 client-side foundation of a larger planned platform** — see Project Vision below and `docs/SYSTEM_DESIGN_DOCUMENT.md` for the full System Design Document (SDD).

**Current development stage:** Feature-complete, polished prototype, functionally unchanged since 2026-08-05. Core task management, scheduling, priority, project organization, search, and a full Safe Delete & Recovery system (confirm → 5s undo → 24h Recently Deleted) are all implemented and manually/automatically verified. The app has **no persisted automated test suite** (see Known Gaps). Runs locally via `npm run dev` (Vite dev server) or `npm run build` + `npm run preview`, and as of 2026-08-07 is also **live and publicly deployed** at **https://itgeek-productivity-suite.pages.dev** (Cloudflare Pages, auto-deploying from GitHub on every push to `main` — see `DEPLOYMENT.md`). Production custom domains (`productivity.itgeek.xyz`, `todo.itgeek.xyz`, `finance.itgeek.xyz`) are planned but not yet configured.

## Project Vision

_Full detail: `docs/SYSTEM_DESIGN_DOCUMENT.md`. This section summarizes it — treat the SDD as the source of truth if the two ever disagree._

ITGeek ToDo is the first module of the planned **ITGeek Productivity Suite** — a multi-module, cloud-based SaaS productivity platform where independent modules (ToDo, Notes, Calendar, Expense Tracker, Habit Tracker, and future applications) share one authentication system, one backend, and one database.

- **Core principle:** a modular, scalable, user-centric architecture with a clear frontend/backend/database separation, so new modules can be added later with minimal impact on existing ones.
- **Design philosophy:** simplicity over complexity, user experience before unnecessary features, modular development, secure-by-design, a consistent UI, clean code, future scalability, and reusable components/services.
- **Build order:** the shared platform (authentication, user management, settings, common backend infrastructure) is built first; individual modules are then developed and released incrementally on top of it. ToDo is the first module; each module is completed and stabilized before the next one begins.
- **Platform landing page:** a Home Dashboard, serving as the shared entry point across all modules once the platform exists.

**Version roadmap** (from the SDD):

| Version | Objective |
|---|---|
| **1.0** | ITGeek Platform + ToDo |
| **2.0** | Personal Finance Module |
| **3.0** | AI Productivity Assistant |
| **4.0** | Team Collaboration & Shared Workspaces |
| **5.0** | Complete ITGeek Productivity Suite |

## Recent Development Session

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
| Build tool | Vite 8.2.0 with `@vitejs/plugin-react` |
| Linting | oxlint 1.75.0 (`.oxlintrc.json`) |
| Styling | Plain CSS with native CSS nesting, single global `App.css` + `index.css` (no Sass/Tailwind/CSS-in-JS) |
| State management | React local state only (`useState`) + `useLocalStorage` hook — no Redux/Zustand/Context |
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
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                       # Entry point; also sets the active background as a CSS custom property before render
│   ├── App.tsx                        # Top-level state owner + layout composition
│   ├── App.css                        # All feature/component styling (single global stylesheet, ~1000+ lines)
│   ├── index.css                      # Global resets, CSS variables (theme), page background (reads var(--app-bg-image))
│   ├── types.ts                       # Todo, Project, Priority, Filter, SortOption types
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
│   │   └── useLocalStorage.ts         # Generic localStorage hook, with an optional migrate() param
│   ├── utils/
│   │   ├── date.ts                    # Date/time formatting + calendar-grid math
│   │   ├── priority.ts                # Priority constants: labels, icons, sort order, default
│   │   ├── projects.ts                # Project constants: defaults, color palette, icon options, color helpers
│   │   ├── sortTodos.ts               # Pure sort function for all 5 sort modes
│   │   ├── search.ts                  # Quick Search: field-extractor registry, matchesSearch, searchTodos
│   │   └── highlight.ts               # getHighlightSegments — splits text around a search match for <mark> rendering
│   └── components/
│       ├── TodoInput.tsx              # Add-task form: text, priority, project, optional schedule
│       ├── SearchBar.tsx              # Quick Search input: left icon, live filtering, clear button
│       ├── TodoList.tsx               # Pure list renderer; search-aware empty state
│       ├── TodoItem.tsx               # Single task row (checkbox, text w/ search highlighting, project/priority/time badges, calendar/delete buttons)
│       ├── TodoFilters.tsx            # Footer: item count, All/Active/Completed, Clear completed
│       ├── TodoToolbar.tsx            # Project filter, Priority filter, Sort, Manage Projects trigger
│       ├── Calendar.tsx               # Month grid, navigation, high-priority day indicator
│       ├── PrioritySelect.tsx         # Native select styled as a colored priority pill/control
│       ├── PriorityBadge.tsx          # Click-to-edit compact priority badge (wraps PrioritySelect)
│       ├── ProjectSelect.tsx          # Native select styled as a colored project pill/control (dynamic colors via CSS vars)
│       ├── ProjectBadge.tsx           # Click-to-edit compact project badge (wraps ProjectSelect)
│       ├── ManageProjectsDialog.tsx   # Modal: create/rename/recolor/re-icon/delete projects
│       ├── DeveloperSignature.tsx     # Fixed bottom-right, non-interactive attribution
│       └── icons/
│           ├── CalendarIcon.tsx
│           ├── TrashIcon.tsx
│           ├── SettingsIcon.tsx
│           └── SearchIcon.tsx
└── PROJECT_STATUS.md / ROADMAP.md / CHANGELOG.md / DEVELOPMENT_LOG.md / DEPLOYMENT.md
```

No `dist/` committed, no test directory.

## Data Model

```ts
// src/types.ts
export type Priority = 'high' | 'medium' | 'low'

export interface Project {
  id: string       // 'work' | 'personal' | ... for defaults, crypto.randomUUID() for user-created
  name: string
  icon: string      // emoji
  color: string     // hex, e.g. '#4f6bed' — arbitrary, user-editable
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  scheduledDate?: string   // 'YYYY-MM-DD'
  scheduledTime?: string   // 'HH:MM' 24-hour
  priority: Priority       // required; defaults to 'medium'
  projectId: string        // required; references a Project.id
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

## State Management

All state lives in **`App.tsx`**:

```ts
const [projects, setProjects] = useLocalStorage<Project[]>('projects', DEFAULT_PROJECTS)
const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [], (stored) => migrateTodos(stored, projects))
const [filter, setFilter] = useState<Filter>('all')
const [selectedDate, setSelectedDate] = useState<string | null>(null)
const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
const [projectFilter, setProjectFilter] = useState<string | 'all'>('all')
const [sort, setSort] = useState<SortOption>('oldest')
const [isManagingProjects, setIsManagingProjects] = useState(false)
```

**Filter pipeline** (each stage feeds the next): `todos` → `visibleTodos` (backlog vs. selected calendar date) → `projectFilteredTodos` → `priorityFilteredTodos` → `searchFilteredTodos` (via `searchTodos`, matching task title / project name / priority name) → `statusFilteredTodos` (All/Active/Completed) → `filteredTodos` (sorted, via `sortTodos`). The footer's "N items left" / Clear-completed counts are derived from `searchFilteredTodos` (i.e., after project + priority + search, before status filter), so they always match what the status buttons are toggling between.

**Mutation functions in `App.tsx`:** `addTodo`, `toggleTodo`, `deleteTodo`, `editTodo`, `clearCompleted`, `scheduleTodo`, `unscheduleTodo`, `changePriority`, `changeProject`, `handleBacklogDrop`, `handleSelectDate`, plus project CRUD: `addProject`, `renameProject`, `updateProject` (icon/color), `deleteProject`. None are memoized (`useCallback`) — noted in Known Gaps, same as before, now with more functions passed down.

**Local (component-owned) state**, for completeness: `TodoItem` (text-edit draft, inline scheduler date/time), `TodoInput` (text, schedule toggle/date/time, priority, projectId), `Calendar` (viewed month, drag-hover date), `PriorityBadge`/`ProjectBadge` (isEditing), `ManageProjectsDialog` (which row's icon/color picker is open, new-project draft fields).

## LocalStorage

- **`'todos'`** — same mechanism as before (whole-array rewrite on every mutation), now also carrying `priority` and `projectId` on every entry.
- **`'projects'`** — new key this session. `Project[]`, seeded with the 6 defaults on first load, rewritten on every project CRUD operation.
- **Migration:** `useLocalStorage`'s hook signature grew an optional third parameter, `migrate?: (value: T) => T`, applied once in the lazy `useState` initializer when existing stored data is found. `App.tsx`'s `migrateTodos(todos, projects)` uses this to backfill `priority` (→ `'medium'`) and `projectId` (→ the first project in the current/default project list, `'work'` normally) on any todo missing them — covers both the original pre-Priority data shape and the pre-Projects shape in one pass. Verified this session against a todo object with **neither** field present (simulating a user who never had Priority or Projects) — both fields backfill correctly and the app doesn't crash.
- Still no general schema validation (`Array.isArray` / shape checks) beyond this specific, targeted migration — a malformed/hand-edited `localStorage` value could still crash the app on `JSON.parse` failure paths outside the try/catch, same caveat as before.

## Components Added or Modified This Session

**New:** `PrioritySelect`, `PriorityBadge`, `ProjectSelect`, `ProjectBadge`, `ManageProjectsDialog`, `TodoToolbar`, `DeveloperSignature`, `icons/CalendarIcon`, `icons/TrashIcon`, `icons/SettingsIcon`, `utils/priority.ts`, `utils/projects.ts`, `utils/sortTodos.ts`.

**Modified:** `App.tsx` (priority/project state, filters, CRUD, migration), `TodoInput.tsx` (priority + project selectors, two-row toolbar layout), `TodoItem.tsx` (project/priority badges, always-visible compact action buttons, flex-wrap row layout), `TodoList.tsx` (prop threading), `Calendar.tsx` (high-priority day indicator), `useLocalStorage.ts` (migrate param), `types.ts` (Priority, Project, projectId), `App.css` (extensive — see Changelog).

## Completed Features (cumulative, including prior sessions)

### Task list & scheduling (prior sessions — unchanged this session)
Add/edit/toggle/delete, All/Active/Completed filter, drag-and-drop scheduling, click-to-pick date/time, month calendar with navigation bounded to today ±10 years, context-aware remove (delete vs. unschedule).

### Priority System (this session)
- Every task has a Priority (High/Medium/Red 🔴, Medium 🟡, Low 🟢), defaulting to Medium.
- Selectable at creation (toolbar-styled `PrioritySelect`) and changeable any time directly on the task row via `PriorityBadge` — click the compact colored badge, pick a new value, it reverts to a badge automatically (no separate "edit mode" needed, avoids a focus/blur race that would exist if nested inside the text-edit flow).
- Priority filter in the list toolbar; 5 sort modes (Priority, Due Date, Newest, Oldest, Alphabetical) via `sortTodos`.
- Calendar days containing a scheduled High-priority task get a small red corner dot (`.has-high-priority`), independent of the existing "has tasks" fill.

### Project System (this session)
- Every task belongs to a Project (not "Category" — this was an explicit naming requirement). Default projects: Work, Personal, Learning, Shopping, Travel, Health, each with a name/icon/hex color.
- Same click-to-edit compact-badge pattern as Priority (`ProjectBadge` → `ProjectSelect`), but colors are **data-driven** (arbitrary hex per project, not a fixed 3-value enum) via CSS custom properties (`--proj-color`/`--proj-bg`/`--proj-border`) computed by `projectColorStyle()` — this is what lets user-created projects render correctly with zero new CSS.
- Project filter in the toolbar (composes with Priority filter, Status filter, and the calendar date selection — all four narrow the same underlying list independently).
- **Manage Projects dialog** (`ManageProjectsDialog`): create, inline-rename, change icon (click swatch → inline emoji grid), change color (click swatch → inline color grid), delete. Deleting is blocked when only one project remains (a task always needs somewhere to belong); otherwise affected tasks are reassigned to the first remaining project, never deleted.
- Migration backfills `projectId` on pre-existing tasks to the default Work project.

### Layout / Visual polish (this session, several iterative passes)
- Add-task toolbar restructured to a two-row layout (full-width input, then Priority/Project/Calendar/Add below) — fixes an overflow bug where the Add button was pushed outside the panel after Priority was added.
- Task-row action buttons (Calendar, Delete) are now always visible at reduced opacity (not hover-only) — improves discoverability, especially on touch. Delete's "×" replaced with a proper Trash icon; both buttons share consistent 24×24 sizing, tooltips ("Schedule Task" / "Delete Task", or "Move to main list" in the date-filtered context), and hover/focus treatment.
- Task-row title given a `flex: 1 1 auto` + small `min-width` floor instead of a large fixed floor — lets short titles ("Meeting with X") stay on one line while long titles wrap the *title* across multiple balanced-width lines (not one word per line) and push the badge/button cluster to its own line below, right-aligned, via `flex-wrap` on the row.
- Task-list panel widened from ~50/50 to ~55/45 against the calendar panel (`.tasks-card` flex-basis 540px / `.calendar-card` 436px, matching at the layout's max width).
- Dropdown arrows: replaced the unstylable native browser arrow with a custom SVG chevron (`appearance: none` + `background-image`), consistently sized/positioned across every `<select>` in the app (compact badge selects, toolbar-sized controls, filter toolbar, calendar month/year), then enlarged ~25% with a thicker stroke and an accent-purple hover tint after a follow-up pass. One shared base rule covers "any future dropdown" automatically.
- New shared `.badge-pill` / `.badge-pill--control` CSS base, extracted so Priority and Project badges/selects don't duplicate the same geometry rules.

### Developer Signature (this session)
Fixed bottom-right, non-interactive (`pointer-events: none`, `user-select: none`), translucent glass-style badge reading "Developed by ITGeek © 2026."

### Responsive polish (this session)
Reused the existing `≤480px` breakpoint tier (previously only used by the dev signature) to tune `.card` padding, the calendar header/grid, `.todo-actions` wrapping, and the Manage Projects dialog for small phones; fixed `.badge-pill` text overflow (added `text-overflow: ellipsis`), unified `.dialog-panel`'s `max-height` to `80svh` (matching `#root`'s existing `100svh`), and added a defensive `overflow-x: hidden` on `body`. Pure CSS, no component changes — see `App.css`/`index.css`.

### Quick Search (this session)
Full-width search bar (`SearchBar` + `SearchIcon`) between the add-task form and the filter toolbar. Live, case-insensitive, partial-match search across task title / project name / priority name via a field-extractor registry (`utils/search.ts`'s `SEARCH_FIELDS`) — adding a future searchable field (notes, tags, ...) is a one-line addition there, not a rewrite. Composes with (never replaces) the Project/Priority/Status filters and the Calendar date selection via a new `searchFilteredTodos` pipeline stage. Matching text in the task title is highlighted via `<mark>` (`utils/highlight.ts`); a dedicated "No matching tasks found" empty state replaces the generic one when a search yields nothing. Search query is ephemeral UI state, not persisted to `localStorage`.

### Background & Theme Architecture (this session)
Replaced the old hardcoded `url('./assets/background.jpeg')` in `index.css` with a scalable asset/theme structure — see the dedicated **Asset & Theme Architecture** section below.

## Asset & Theme Architecture

Introduced this session to replace the old single hardcoded `url('./assets/background.jpeg')` reference in `index.css` with a real, scalable structure — not just a one-off image swap.

- **`src/assets/`** — all static, non-code files. `images/backgrounds/` holds the actual image files plus an `index.ts` that centralizes their exports (`export { default as mountFujiBg } from './mount-fuji-bg.png'`, etc.) — nothing outside that folder imports an image path directly. `images/icons/`, `images/logos/`, `images/illustrations/`, and `fonts/` exist as empty, scaffolded folders for future asset types. `src/assets/index.ts` is a top-level barrel re-exporting the backgrounds (with commented placeholders for the other folders once they have real content).
- **`src/themes/`** — `backgrounds.ts` exposes a `backgrounds` catalog object (`{ mountFuji, mountFujiClassic }`, typed via `BackgroundKey = keyof typeof backgrounds`) that a future theme-switcher would read from; `colors.ts`/`typography.ts` currently only export `ThemeColors`/`ThemeTypography` **type** scaffolds (no values) — the app's actual color/font tokens still live as CSS custom properties in `index.css`'s `:root` block, which stays the single source of truth for now. `themes/index.ts` barrels all three.
- **JS → CSS bridge:** CSS can't `import` a TS value, and the project deliberately has no CSS-in-JS. `main.tsx` sets `document.documentElement.style.setProperty('--app-bg-image', \`url(${backgrounds.mountFuji})\`)` synchronously, before `createRoot(...).render(...)` (no flash of a missing background on load); `index.css`'s `#root` rule consumes it as `var(--app-bg-image)` inside the existing `background: linear-gradient(...), var(--app-bg-image) center / cover no-repeat fixed;` shorthand — same rendering properties as before (cover/center/no-repeat/fixed), only the source changed. This mirrors an existing pattern in the codebase (`utils/projects.ts`'s `projectColorStyle()` already bridges JS-computed colors into CSS the same way, via `--proj-color`/`--proj-bg`/`--proj-border`).
- **Switching themes today** means changing one line in `main.tsx` (which key of `backgrounds` gets read). A real switcher later — user-selectable, seasonal, dark-mode-driven — would replace that constant lookup with state (following the existing `useLocalStorage` pattern for persistence, same as `todos`/`projects`), without needing to change the catalog or the CSS bridge.
- The background image is the project's own copy (`src/assets/images/backgrounds/mount-fuji-bg.png`) — verified this session by temporarily renaming the Desktop source file and rebuilding; the build was unaffected.

## Known Bugs / Limitations

1. **New: `TodoInput`'s schedule toggle/date/time don't reset after a successful submit.** `handleSubmit` resets `text` and `priority` but not `showSchedule`/`date`/`time`. Reproduced this session via automated test: add a task with scheduling on, then add a second task without touching the schedule fields — the second task silently inherits the first task's date/time. Real, easily-hit correctness bug; not fixed this session (out of scope for a docs/verification pass) — **flagged as top priority for next session**, see `ROADMAP.md`.
2. **Calendar day cells still not keyboard-accessible** (carried over from the original session, unaddressed across all of this session's work — see `ROADMAP.md`).
3. **No persisted automated test suite.** Every feature added/changed this session (Priority, Projects, all layout passes) was verified with one-off Playwright scripts written directly into the project root and deleted immediately after use. Playwright itself is a real `devDependency` now and confirmed working end-to-end, but there are zero checked-in spec files and no `npm test` script — the next session starts from the same "no regression safety net" position as before, just with better tooling available to build one.
4. **Stale `today` / date-bounds across a day boundary** — unchanged from before; `Calendar.tsx`'s `today` and the module-level `dateBounds` in `TodoInput.tsx`/`TodoItem.tsx` are still computed once and never refreshed.
5. **Duplicated `getSchedulableDateBounds()` computation** and **structurally similar date/time picker rows** (`.schedule-row` vs. `.inline-schedule-row`) — both still unresolved from the original code-review findings.
6. **Drag-and-drop remains desktop/mouse-only** — unchanged.
7. **No confirmation before deleting a project.** Deleting a project only requires one click (blocked only when it's the last remaining project); tasks are reassigned rather than deleted, which limits the blast radius, but there's still no "are you sure" step and no undo.
8. **`crypto.randomUUID()` has no fallback**, **no general localStorage schema validation**, **`background-attachment: fixed`** — unchanged from the original session's findings. **Background image payload grew this session**: the active background is now an unoptimized 1.98 MB PNG (`mount-fuji-bg.png`, up from the previous 813 KB JPEG), and the old JPEG is *also* still bundled — kept as a catalogued-but-unused entry in the new `backgrounds` theme object (bundlers don't tree-shake unused object properties) — so total background payload is now ~2.9 MB versus ~813 KB before. Worth a compression/format pass (e.g. re-encoding as WebP) in a future session.
9. **`App.tsx`'s mutation functions are not memoized**, and the list of them has grown substantially this session (now ~13 functions passed to children, up from ~9) — still not a real performance problem at this data scale, but the case for addressing it together with `React.memo` grows slightly stronger as the prop surface grows.
10. **`App.css` is now a single ~1000+ line file.** Still consistent with the project's deliberate "no CSS framework, no CSS modules" architecture (preserved throughout this session per explicit instruction on every UI-focused turn), but worth keeping an eye on for navigability as it continues to grow.

## Recommended Next Milestone

**Superseded by the 2026-08-06 strategic pivot** — the frontend-hardening recommendation below was written before the project's scope expanded into the ITGeek Productivity Suite (see Project Vision above). The actual next steps now follow `ROADMAP.md`'s new priority order: complete the SDD, then design the overall architecture, backend architecture, database schema, authentication system, and REST API, before implementing the backend and connecting it to this frontend. `ROADMAP.md` also carries the immediate 2026-08-07 **Next Session Plan** (custom domain configuration) ahead of that longer-range order.

The frontend-hardening items below are **not abandoned** — they're still real, accurate technical debt in the current codebase (nothing about them changed on 2026-08-06) — just deprioritized behind the platform/backend design work for now. Several are worth revisiting specifically once backend integration begins rather than before, since they'll need rethinking anyway once data moves server-side (e.g. localStorage schema validation becomes a server-side validation concern instead).

_Original frontend-focused recommendation, kept for reference:_

1. **Fix the `TodoInput` schedule-reset bug** (Known Bug #1) — small, high-value, easy to regress-test once fixed.
2. **Stand up a real, checked-in automated test suite.** Either adopt Vitest + React Testing Library, or formalize the Playwright workflow already proven in past sessions into actual spec files under a `tests/` (or `e2e/`) directory with an `npm test` script. Cover at minimum: the migration path (old-shape data → new shape), add/edit/toggle/delete, priority and project badge edit-and-revert, filter composition (project + priority + status + calendar date together), and the Manage Projects delete-with-reassignment flow.
3. **Calendar keyboard accessibility** (Known Bug #2) — still the most significant accessibility gap, and the calendar now surfaces more information (high-priority dot) that keyboard users can't reach at all.

See `ROADMAP.md` for the current, active prioritized breakdown (platform/backend-focused as of 2026-08-06, with an immediate custom-domain task list added 2026-08-07).

## Git & Deployment History

_Supersedes the previous "Git Commit Suggestion" section — the project stopped being suggestion-only on 2026-08-07, when it actually became a git repository. Full narrative: `DEVELOPMENT_LOG.md`'s 2026-08-07 entry; full deployment detail: `DEPLOYMENT.md`._

The project is now a real git repository, hosted on GitHub, with commit history dated 2026-08-07 (git was initialized and the working tree from all prior sessions was committed in one pass, rather than split into the per-session commits speculatively suggested in earlier drafts of this document):

| Commit | Date | Summary |
|---|---|---|
| `c1659b2` | 2026-08-07 | Initial commit (full working tree as of end of 2026-08-06 session) |
| `2e074c9` | 2026-08-07 | Add GitHub Actions deployment (GitHub Pages workflow) |
| `229454a`, `72106f0`, `a6108c1` | 2026-08-07 | Trigger GitHub Actions (retries during the GitHub Actions runner outage) |
| `8ce0203` | 2026-08-07 | Enable manual workflow |
| `4ef2131` | 2026-08-07 | Remove GitHub Pages base path (the `vite.config.ts` fix for Cloudflare Pages) |

Repository: https://github.com/Ssuhan02/itgeek-productivity-suite. Current deployment: Cloudflare Pages at https://itgeek-productivity-suite.pages.dev, auto-deploying on every push to `main` — see `DEPLOYMENT.md` for the full setup and the domain plan.

## Code Review Findings

_Carried over from the original review; items resolved this session are marked. Nothing below has been changed as part of writing this document._

### Bugs / correctness risks
- **New: `TodoInput` schedule state doesn't reset after submit** (see Known Bugs #1) — the most important new finding this session.
- Stale "today" and date bounds — still open.
- `crypto.randomUUID()` no fallback — still open.
- No general localStorage schema validation — still open (though the migration mechanism for priority/projectId specifically is now in place, which is a form of targeted validation for those two fields).

### Code smells / duplication
- ~~Duplicated calendar-icon SVG markup~~ — **resolved this session** (`icons/CalendarIcon.tsx`, shared by `TodoInput` and `TodoItem`).
- Duplicated `getSchedulableDateBounds()` computation — still open.
- Structurally similar date/time picker rows — still open.
- **New, resolved within this session:** Priority and Project badge/select CSS was extracted into a shared `.badge-pill`/`.badge-pill--control` base rather than duplicated per feature.
- `App.tsx` mutation functions still not memoized, and there are more of them now.

### Accessibility
- Calendar day cells still not keyboard-operable — still the most significant gap.
- **Improved this session (as a side effect, not a dedicated pass):** task-row action buttons are no longer hover-only; they're always visible at reduced opacity, which meaningfully helps touch/keyboard discoverability even though it wasn't the primary goal of that change.

### TypeScript
- `strict` mode still not explicitly enabled — still open, still low-risk to turn on given the codebase's existing null-safety style.
- New code this session (Priority/Project types, CSS-variable style helpers) follows the same clean, no-`any` conventions as before.

### Performance
- Unoptimized background image — still open, still the single biggest performance item.
- No virtualization on `.todo-list` — still irrelevant at expected scale.

### React best practices
- Hooks usage remains correct throughout new code (no conditional hooks, accurate dependency arrays, including the new `useEffect` in `TodoInput` that guards against a deleted project leaving a stale selection).
- `key`s used correctly everywhere new lists were added (`ManageProjectsDialog`'s project rows, icon/color picker grids).
- Still no `React.memo`/`useCallback` — consistent with "not needed yet," flagged again given the growing prop surface.

## Starting Point for Tomorrow

_Updated 2026-08-07 — the immediate priority is now the domain/deployment work below, ahead of the SDD/architecture work in points 3–4 (both still valid, just next in line after domains are live)._

1. Read `ROADMAP.md`'s **Next Session Plan** first — connect the GoDaddy custom domains (`productivity.itgeek.xyz`, `todo.itgeek.xyz`, `finance.itgeek.xyz`) to the Cloudflare Pages deployment and verify automatic deployments still work. Full context: `DEPLOYMENT.md`.
2. Read `DEVELOPMENT_LOG.md`'s 2026-08-07 entry for exactly how the current git/GitHub/Cloudflare Pages setup was reached (renamed from `docs/SESSION_NOTES.md`).
3. Once domains are configured, read `docs/SYSTEM_DESIGN_DOCUMENT.md` — it's still the authoritative reference for direction and scope — and resume `ROADMAP.md`'s numbered priorities: Priority 1 is completing the SDD itself (review it against a fixed outline / fill any gaps), then Priority 2 begins overall project architecture design. (`ROADMAP.md` was renamed from `TODO_NEXT.md`.)
4. Backend stack, database technology, and authentication approach are all still undecided as of 2026-08-06 — see the Open Questions in `DEVELOPMENT_LOG.md`'s 2026-08-06 entry, still unresolved.
5. The existing frontend still runs via `npm run dev`, is also live at https://itgeek-productivity-suite.pages.dev, and `npm run build && npm run lint` both currently pass clean — that's the baseline to keep green while backend/platform design work proceeds. Its own known bugs/hardening items (previous section) are deprioritized, not fixed, and not forgotten.
6. **Wait for explicit approval before writing any code** — same standing instruction as every prior session.
