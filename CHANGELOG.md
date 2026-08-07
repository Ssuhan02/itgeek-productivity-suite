# Changelog

All notable changes to this project are documented here. This file starts from the first working session, which took the project from an unmodified Vite/React scaffold to a feature-complete to-do + calendar app.

## 2026-08-08

_Full-day Claude Code session — the largest single-session frontend expansion so far: the ToDo prototype became a multi-module shell (Home Dashboard + config-driven routing) and the ToDo module gained pagination, a real fixed-height layout architecture, and its first proper task-detail experience via the Suite's first reusable UI component. Full architectural reasoning: `ARCHITECTURE.md`. Working conventions established today: `CLAUDE.md`._

### Added — Home Dashboard & module architecture
- New `DashboardPage` (route `/`) — the platform landing page called for in the SDD, showing a card per module
- New config-driven module system (`src/config/modules.ts`): a single `MODULES` array (`id`, `title`, `icon`, `description`, `route`, `status: 'active' | 'coming-soon'`, `visibleOnDashboard`, `visibleInNavigation`, `navGroup`, `displayOrder`) drives the dashboard grid, the Global Navigation Bar, and route generation — adding a placeholder module is a one-entry change, no component edits
- `App.tsx` generates every `<Route>` from `MODULES`; a small `MODULE_PAGES` registry maps a module id to its real page component when one exists, otherwise the route falls back to a shared `ComingSoonPage` automatically
- New reusable `ComingSoonPage` (`moduleName: string` prop only) — one component serves every not-yet-built module instead of a page per module
- New `GlobalNav` (compact fixed top bar), `AppLayout` (shared page shell: nav + title + content + footer, with `scrollable`/`showNavigation` variants), `usePageTitle` hook (single source of truth for `document.title`, format: bare page name, e.g. "To-Do", no app-name prefix)
- Proved the architecture scales: temporarily added Calendar/Notes/Habits/Inventory/PMP Study/Japanese Learning as fully-routed `coming-soon` modules, then removed all six from the dashboard via `visibleOnDashboard: false` alone — zero component changes either direction. They stay defined and fully routed (`/calendar`, `/notes`, ...) for whenever they're ready to surface

### Added — ToDo module: pagination
- New `usePagination` hook (generic, not todo-specific) + `Pagination` component (Previous/Next, page numbers, active-page highlight, correct disabled states) — 5 tasks per page, applied after the existing search → project → priority → sort pipeline
- New dev-only fixture data (`src/dev/sampleTodos.ts`, 20 realistic tasks) so pagination has something real to exercise; gated behind `import.meta.env.DEV` and marked `/* @__PURE__ */` so it's provably absent from production bundles (verified via `npm run build` + bundle grep)

### Added — ToDo module: Task Details (the Suite's first reusable UI component)
- New reusable `Dialog` primitive (`src/components/ui/Dialog/`) — dark blurred backdrop, fade + scale (0.98→1.00) entrance, focus trap, ESC/backdrop-click closing gated by an optional `beforeClose` hook, background scroll lock (new `useBodyScrollLock` hook), and focus restoration to whatever triggered it. Deliberately self-contained (its own `Dialog.css`, distinct `ui-dialog__*` class names) so it doesn't touch the existing `ConfirmDialog`/`ManageProjectsDialog`/`RecentlyDeletedDialog`/`ModalOverlay` — this is the new standard for Personal Finance, Settings, Profile, and eventually those existing dialogs too, not a replacement made today
- New `TaskDetails` dialog, built on `<Dialog>`: Header (title + read-only Task ID), Task Information (Title, Description), Organization (Project, Priority, Status), Scheduling (Scheduled Date, Due Date), Notes, Footer (Cancel/Save) — reuses `PrioritySelect`/`ProjectSelect` and the shared `.app-input` style rather than inventing new form controls
- `Todo` extended with `taskId`, `description`, `notes`, `status: 'active' | 'completed'`, `dueDate`, `updatedAt` — all optional/backward-compatible; `migrateTodos` backfills every field for pre-existing tasks (stable `createdAt`-ordered Task ID assignment), verified against hand-crafted old-shape data
- New `src/utils/taskId.ts` — human-readable Task IDs (`TSK-000001`); derived from whatever `taskId`s already exist rather than a separately-persisted counter, so there's nothing to desync
- Single click on a task's title opens Task Details; double-click still starts the existing inline rename — both live on the same element via a debounced click handler (~220ms) so a real double-click's second click cancels the pending single-click action before it fires
- Unsaved-changes protection: closing (ESC, backdrop click, Cancel, the × button) with edited-but-unsaved fields shows a confirmation (reusing the existing `useConfirm`/`ConfirmDialog`, not a new confirmation UI) before discarding
- Keyboard accessibility: the task title is a real tab stop (`tabIndex`, `role="button"`, Enter/Space activates it)

### Fixed
- **Task input focus glow removed** — was a `2px` accent outline that read as a soft halo; replaced with a border-color-only change on `:focus-visible`, no outline/box-shadow
- **Status dropdown rendering multiple/mispositioned chevrons on hover/focus** — root cause: `.app-input { background: var(--bg) }` used the `background` shorthand, which resets `background-image`/`-position`/`-repeat`/`-size` to their initial values on any `<select>` using the class (higher specificity than the base `select` rule that sets the custom arrow), while `select:hover`/`:focus-visible` — higher specificity still — re-set only the image, without position or `no-repeat`, so it rendered at natural size and tiled. Fixed by changing to `background-color` (touches only the one sub-property, so the base rule's image/position/repeat apply normally) — benefits every current and future `.app-input` consumer, not just Status
- Dev sample data silently not appearing after the very first visit — `useLocalStorage` writes back `"[]"` the moment a list is empty, which is a truthy stored string, so "is anything stored at all" permanently blocked the seed; fixed by checking the *parsed* array's length instead

### Changed — ToDo module layout (several iterative passes, converging on one architecture)
- `.layout` (the ToDo/Calendar two-column row) converted from Flexbox to **CSS Grid**: a grid row sizes to its tallest item's own content and stretches both cards to match — content-driven equal-height columns with no viewport-binding hack required (an earlier pass had bound the whole page to `100dvh`; removed entirely once Grid made it unnecessary)
- Applied a **single-stretch-responsibility principle** throughout: only one element in any given chain is allowed `flex-grow` — `.layout` stretches the cards; `.todo-app`/`.calendar` do not also stretch to fill their card. Two elements both claiming "fill available space" was the repeated root cause of stray blank gaps across this session's earlier layout passes
- `.calendar-grid` now uses `grid-template-rows: repeat(6, 1fr)` and drops its fixed `aspect-ratio: 1` at the desktop breakpoint, so the month grid visibly grows into whatever height it's stretched to (rows expand evenly, cells grow taller) instead of leaving dead space below the last week; mobile/stacked layout keeps square cells (`aspect-ratio: 1` still applies below the two-column breakpoint, where there's no extra height to distribute)
- Task rows made more compact: padding and title font-size reduced across several passes (title font 15px → 12px); header controls (task input, Priority/Project selects, Add button, calendar-toggle button) shortened ~20%, referencing the footer filter buttons as the compact-control size baseline
- Pointer cursor added across the entire clickable task row (title, checkbox, badges, empty space) via one `cursor: pointer` on `.todo-item` (inherited) plus fixing `.todo-text`'s stale `cursor: text`; action buttons keep their own cursor (`.move-btn`'s `grab`, `.delete-btn`'s `pointer`) since a more specific rule always wins over an inherited one

### Changed — Shared design system
- New `.app-input` base class — the standard for every text input in the Suite (border, radius, padding, font, background, placeholder, disabled, and the clean border-color-only focus state). Task title input and Search input both refactored onto it, removing duplicated CSS (Search's old glow-style focus box-shadow was removed as part of this, so both inputs now share **identical** focus behavior, not just similar-looking ones)

### Documentation / process
- Established `file_listing.txt` (root) as a maintained project file map — regenerated and diffed against its previous version after every task this session, not just at the end
- Adopted (via user instruction, recorded for future sessions) a standing rule: `file_listing.txt` updates every task; `PROJECT_STATUS.md`/`CHANGELOG.md`/`ROADMAP.md`/`ARCHITECTURE.md`/`CLAUDE.md` update only on an explicit end-of-day request — this session is the first of the latter
- New `ARCHITECTURE.md` and `CLAUDE.md` added today (see below)

### Implementation notes
- Every change this session was verified with Playwright-driven browser automation (screenshots, DOM/computed-style assertions, focus/keyboard checks) against the running dev server; scripts were written per-task into a scratch directory and deleted after use — nothing checked into the repo
- `tsc -b` and `oxlint` both kept clean after every change; a production build (`npm run build`) was run specifically to verify the dev-only sample data is excluded
- Two real bugs were caught by the verification process itself (not just by inspection) before being fixed: the Task Details focus-restore race (draft state seeded via `useEffect`, one render too late for Dialog's focus-on-open logic to find real content — fixed by seeding via `useState`'s lazy initializer and remounting per task via `key={todo.id}`) and the Status dropdown's CSS shorthand bug above

## 2026-08-07

_Source control, deployment, and infrastructure session — done manually outside Claude Code, documented here after the fact. Full narrative: `DEVELOPMENT_LOG.md`. Full deployment reference: `DEPLOYMENT.md`._

### Added — Source control & hosting
- Git initialized and configured with a GitHub account; project committed and pushed to a new repository: https://github.com/Ssuhan02/itgeek-productivity-suite
- Cloudflare Pages connected to the GitHub repository; first deployment completed successfully. Live at https://itgeek-productivity-suite.pages.dev, with automatic deployment on every push to `main`

### Changed
- `vite.config.ts`: removed `base: '/itgeek-productivity-suite/'`, which was needed only for GitHub Pages' sub-path hosting and is unnecessary (and would break asset paths) on Cloudflare Pages

### Deployment note — GitHub Pages abandoned
- A GitHub Actions workflow (`.github/workflows/deploy.yml`) was configured first, targeting GitHub Pages, but could not complete deployment due to a global outage of GitHub Actions' hosted runners at the time
- Decision made to abandon GitHub Pages in favor of Cloudflare Pages going forward, rather than wait out the outage — see `DEPLOYMENT.md` for the full reasoning
- The GitHub Pages workflow file remains in the repo but is no longer the active deployment path

### Documentation
- Renamed `TODO_NEXT.md` → `ROADMAP.md`, and `docs/SESSION_NOTES.md` → `DEVELOPMENT_LOG.md` (moved to project root) for consistent naming; content carried over unchanged aside from the new entries below
- Added `DEPLOYMENT.md` documenting the hosting setup and the planned production domain architecture (`productivity.itgeek.xyz`, `todo.itgeek.xyz`, `finance.itgeek.xyz`, DNS remaining on GoDaddy)
- Updated `PROJECT_STATUS.md`, `DEVELOPMENT_LOG.md`, `ROADMAP.md`, and `README.md` to reflect the above

## 2026-08-05

### Added — Priority System
- Every task now carries a `Priority` (`high` | `medium` | `low`), defaulting to Medium
- New `PrioritySelect` (native select styled as a colored pill/control) and `PriorityBadge` (click-to-edit compact badge that reverts to a read-only badge automatically after a change or on blur)
- Priority selectable when creating a task; changeable any time directly on the task row
- New Priority filter in the task-list toolbar
- New `sortTodos` utility supporting 5 sort modes: Priority, Due Date, Newest First, Oldest First, Alphabetical
- Calendar days containing a scheduled High-priority task now show a small red corner indicator

### Added — Project System
- New first-class `Project` entity (id, name, icon, hex color) — explicitly *not* called "Category"
- Six default projects seeded on first load: Work, Personal, Learning, Shopping, Travel, Health
- New `ProjectSelect` and `ProjectBadge`, mirroring the Priority components but driven by arbitrary per-project hex colors via CSS custom properties (`projectColorStyle()` in `utils/projects.ts`) rather than a fixed set of classes — supports unlimited user-created projects with no new CSS per project
- New Project filter in the task-list toolbar, composing with the Priority filter, Status filter, and calendar date selection simultaneously
- New `ManageProjectsDialog`: create, inline-rename, change icon (inline emoji picker grid), change color (inline swatch picker grid), and delete projects. Deleting is blocked when it's the last remaining project; otherwise affected tasks are reassigned to the first remaining project rather than deleted
- `localStorage` gained a new `'projects'` key; existing tasks migrate their `projectId` to the default Work project on first load after this update

### Added — Developer Signature
- Fixed bottom-right, non-interactive attribution badge ("Developed by ITGeek © 2026"), translucent glass styling matching the app's card aesthetic, `pointer-events: none` and unselectable

### Added — Dev tooling
- Playwright added as a `devDependency` (browser automation for manual verification during development); Chromium binary installed locally. Used throughout this session to drive the app, screenshot UI states, and check for console errors and layout overflow. **Not yet wired into a persisted test suite** — see `TODO_NEXT.md`

### Changed — Task row & toolbar layout (several iterative passes)
- Add-task toolbar restructured into two rows (full-width text input, then Priority/Project/Calendar/Add below) — fixes an overflow bug where the Add button was pushed outside the panel
- Task-row action buttons (Calendar, Delete) changed from hover-only to always-visible at reduced opacity, improving discoverability; the "×" delete glyph replaced with a proper Trash icon; both buttons standardized to a shared 24×24 size with consistent tooltips and hover/focus treatment
- Task title given `flex: 1 1 auto` with a small `min-width` floor (was a large fixed floor) so short titles stay on one line while long titles wrap across multiple balanced-width lines instead of one word per line, pushing the badge/button cluster to its own right-aligned line below via `flex-wrap`
- Task-list panel widened from ~50/50 to ~55/45 against the calendar panel
- Priority/Project badges and selects reduced to a more compact "chip" sizing (smaller font, tighter padding, rounder corners) and grouped into a single `.todo-actions` cluster with tighter internal spacing
- Extracted a shared `.badge-pill` / `.badge-pill--control` CSS base so Priority and Project badge/select styling isn't duplicated

### Changed — Dropdown indicators (two passes)
- Replaced every `<select>`'s native, unstylable browser arrow with a custom SVG chevron (`appearance: none` + `background-image`), consistently positioned and sized across every dropdown in the app (Priority/Project selects, the filter toolbar, calendar month/year)
- Follow-up pass: enlarged the chevron ~25%, thickened its stroke, and added an accent-purple hover/focus tint consistent with the app's existing hover conventions — implemented as one shared base rule plus one consolidated "standard size" rule, so any future dropdown automatically matches

### Fixed
- `useLocalStorage` gained an optional `migrate?: (value: T) => T` parameter, applied once on initial load, used to backfill `priority` and `projectId` on task data predating those features — verified against data missing both fields simultaneously

### Known issue found, not fixed
- `TodoInput`'s schedule toggle/date/time fields don't reset after a successful submit — a task added right after a scheduled one can silently inherit the same date/time. Reproduced via automated verification this session; documented in `PROJECT_STATUS.md` and `TODO_NEXT.md` as the top priority for the next session, not fixed here per this session's scope (verification + documentation only)

### Implementation notes
- All of the above was verified via Playwright-driven browser automation (screenshots, DOM assertions, console-error checks) during development; scripts were written per-change and deleted immediately after — nothing is checked into the repo
- `npm run build` and `npm run lint` (oxlint) both pass cleanly as of the end of this session; `tsc` reports no type errors
- Still not a git repository — see `PROJECT_STATUS.md`'s Git Commit Suggestion

## 2026-08-04

### Added — Core app (from empty Vite scaffold)
- Full to-do CRUD: add, edit (double-click to rename), toggle complete, delete
- Filter by All / Active / Completed, with a live "N items left" counter and a "Clear completed" action
- Persistence to `localStorage` via a new generic `useLocalStorage` hook
- Removed all unused Vite/React template boilerplate (default counter demo, template hero/logo assets, docs/social links section) and replaced `index.html`'s title

### Added — Visual design
- Pinned the theme to a plain white/light background (removed the template's `prefers-color-scheme: dark` auto-switching)
- Added a user-supplied Mt. Fuji photo as the full-page background (`src/assets/background.jpeg`, copied into the project so it's independent of the original file on the user's Desktop), with a dark overlay for contrast and a translucent "glass" card style for content

### Added — Calendar & scheduling (the majority of this session)
- Introduced a two-column layout: task list on the left, month-view calendar on the right
- Drag-and-drop scheduling: added a dedicated calendar-icon "move" button on each task (not the whole row) as the sole drag handle, so dragging doesn't conflict with clicking/editing
- Clicking a calendar date filters the left panel to that date's tasks, with a "Show all" control to return to the backlog
- Made the × (remove) button context-aware: deletes permanently on the backlog view, but moves the task back to the backlog (unschedules) when viewing a date's filtered list
- Added a schedule toggle + date/time fields to the add-task form, so a task can be created already scheduled (with an optional time), or left in the backlog to schedule later
- Added the same date/time picker inline on existing tasks (via clicking, not dragging, the move button) so any task can be scheduled or rescheduled without drag-and-drop
- Added a 12-hour time badge (e.g. "2:30 PM") on any task with a scheduled time
- Added month/year `<select>` dropdowns to the calendar header for jumping directly to a month, alongside the existing ‹ › step buttons
- Bounded all date selection (calendar navigation and every date `<input>` in the app) to 10 years before/after today, with the ‹ › buttons disabling automatically at that boundary

### Changed — Iterative refinement based on feedback
- Reduced the calendar's overall height and made day cells perfect squares (`aspect-ratio: 1`) instead of tall rectangles
- Forced the task-list and calendar cards to equal height via flexbox `align-items: stretch`, so they visually match regardless of content length
- Replaced the calendar's original per-day mini task list (`CalendarChip` chips rendered inside each day cell) with a simple color-only indicator (`.has-tasks`), after the chips proved illegible at the compact cell size — task detail is now viewed by clicking the date instead
- Added a full-row hover highlight on task rows and calendar elements (previously only the delete button reacted to hover, giving the impression only part of the row was interactive)

### Fixed
- Fixed a bug where the new-task date/time picker's `min`/`max` bounds weren't applied consistently everywhere a date could be picked — now applied uniformly via `getSchedulableDateBounds()` in both the add-form and the inline per-task picker

### Removed
- Deleted `CalendarChip.tsx` and its associated CSS (`.calendar-chip`, `.chip-text`, `.chip-remove`, `.chip-edit-input`, `.day-tasks`) after replacing per-day task chips with the color-only calendar indicator
- Deleted unused template assets (`hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`)

### Documentation
- Added `PROJECT_STATUS.md`, `TODO_NEXT.md`, and this `CHANGELOG.md` to close out the session and hand off cleanly to the next one

### Implementation notes
- All of the above was verified manually in a live browser session (Chrome DevTools automation) after every change — no automated test suite exists yet (tracked in `TODO_NEXT.md`).
- `npm run build` and `npm run lint` (oxlint) both pass cleanly as of the end of this session.
- This is not yet a git repository, so the above is not reflected in commit history — see `PROJECT_STATUS.md`'s Git Commit Suggestion for how to capture it once one is initialized.
