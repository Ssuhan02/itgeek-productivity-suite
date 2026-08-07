# Architecture

_Created 2026-08-08. Describes the current codebase's structure and the reasoning behind its key decisions — the **why**, not just the **what** (the what is also in `PROJECT_STATUS.md`'s Folder Structure/Data Model, and file-by-file in `file_listing.txt`). Treat `docs/SYSTEM_DESIGN_DOCUMENT.md` as the authority for product **vision**; this file is the authority for **how the current frontend is built**._

## High-level shape

This is a client-only React SPA (no backend yet — see `ROADMAP.md`). It now has two layers:

1. **The Suite shell** — routing, navigation, the Home Dashboard, and a config-driven module registry. New today.
2. **The ToDo module** — the original app, now living at `/todo` instead of being the whole app.

Nothing about the ToDo module's own internal logic changed when the shell was added around it — it moved from `App.tsx` into `pages/TodoPage.tsx` largely as-is.

## Routing & the module system

`App.tsx` no longer contains any application logic — it's purely a route table, generated from one config array:

```ts
// src/config/modules.ts
export const MODULES: ModuleInfo[] = [
  { id: 'todo', title: 'To-Do', route: '/todo', status: 'active', visibleOnDashboard: true, ... },
  { id: 'personal-finance', title: 'Personal Finance', route: '/finance', status: 'coming-soon', ... },
  { id: 'calendar', title: 'Calendar', route: '/calendar', status: 'coming-soon', visibleOnDashboard: false, ... },
  // ...
]
```

```tsx
// App.tsx
const MODULE_PAGES: Record<string, ComponentType> = { todo: TodoPage }

<Routes>
  <Route path="/" element={<DashboardPage />} />
  {MODULES.map((module) => (
    <Route path={module.route} element={
      MODULE_PAGES[module.id] ? <Page /> : <ComingSoonPage moduleName={module.title} />
    } />
  ))}
</Routes>
```

**Why this shape:** the SDD's Core Principle demands modules can be added "with minimal impact on existing functionality." A module that isn't built yet still needs a working route (so the Home Dashboard card and nav links aren't dead ends) and a page (so it doesn't 404). Generating routes from config means a `coming-soon` module needs **zero** code changes anywhere — not in `App.tsx`, not in `DashboardPage`, not in `GlobalNav` — just one array entry. This was proven, not just asserted: six placeholder modules (Calendar, Notes, Habits, Inventory, PMP Study, Japanese Learning) were added and fully routed, then removed from the dashboard again, entirely through config (`visibleOnDashboard`), with no component edits either direction.

`ModuleInfo`'s four boolean/enum fields each answer one independent question — deliberately kept orthogonal rather than inferred from each other:
- `status` (`active` | `coming-soon`) — is there a real page, or does it fall back to `ComingSoonPage`?
- `visibleOnDashboard` — does it get a Home Dashboard card?
- `visibleInNavigation` + `navGroup` — does it get a Global Nav entry, and on which side?

A module can be `coming-soon` and still `visibleOnDashboard: true` (Personal Finance, Settings, Profile all are) — the card just shows a "Coming Soon" label instead of "Open" and routes to the shared placeholder instead of a real page. Building the real module later is exactly one change: flip `status` to `active` and add the page to `MODULE_PAGES`.

## Component tiers

```
src/
├── pages/          — one per route, own their own state (TodoPage owns all ToDo state; DashboardPage is stateless)
├── layouts/         — AppLayout: the shared shell every page renders inside
├── components/
│   ├── ui/          — NEW tier: app-wide, domain-agnostic primitives. Currently just Dialog.
│   ├── dashboard/    — ModuleCard, dashboard-specific
│   └── *.tsx         — everything else: ToDo-domain components (TodoItem, Calendar, TaskDetails, ...) plus a few
│                        already-generic ones from before today (ConfirmDialog, ModalOverlay, EmptyState, Toast)
├── config/          — modules.ts, branding.ts, dashboardTheme.ts — data, not components
├── contexts/        — ConfirmContext, ToastContext — app-wide imperative UI (see State management below)
├── hooks/           — reusable logic with no UI of its own
├── utils/           — pure functions, no React
└── dev/             — dev-only fixtures, excluded from production (see below)
```

**Why `components/ui/` is new:** everything under `components/*.tsx` before today was either ToDo-specific or a one-off "generic enough for now" component (`ConfirmDialog`, `ModalOverlay`) built for its first caller, not designed as a public primitive. `Dialog` is the first component explicitly built to be **the** modal primitive for the whole Suite — Personal Finance, Settings, Profile, and future confirmation dialogs are all expected to use it. Giving it its own folder (with its own `Dialog.css`, not appended to the global `App.css`) marks that distinction structurally, not just by convention: `components/ui/` is where "for everyone" primitives live; `components/*.tsx` is where "for this feature" components live. When a second `ui/` primitive is needed, follow the same shape (`ui/ComponentName/ComponentName.tsx` + `.css` + `index.ts`).

**Why `Dialog` doesn't replace `ModalOverlay`/`ConfirmDialog` yet:** those three existing dialogs (`ConfirmDialog`, `ManageProjectsDialog`, `RecentlyDeletedDialog`, all built on `ModalOverlay`) work correctly today and weren't part of this session's task. Migrating them to `Dialog` is real, worthwhile future cleanup (noted in `ROADMAP.md`) — but doing it as a drive-by inside an unrelated feature task would have risked regressing three proven flows to build one new one. `Dialog` was built self-contained (distinct `ui-dialog__*` class names, its own CSS file) specifically so it introduces zero risk to the existing dialogs while it proves itself on `TaskDetails`.

## CSS architecture

Still one global stylesheet (`App.css`, ~2,560 lines) plus `index.css` for resets/tokens — no CSS Modules, no Tailwind, no CSS-in-JS, unchanged as a deliberate constraint from earlier sessions. What's new is a firmer set of conventions within that file:

- **BEM-ish naming for structural sections:** `.todo-app__header`, `.todo-app__footer`, `.task-details__section`, `.task-details__field` — a block's internal sections are namespaced under it, making "does this rule belong to this component" unambiguous at a glance. Older code (`.todo-item`, `.todo-checkbox`) predates this convention and wasn't renamed; new sections should follow it.
- **Shared base classes over duplication:** `.app-input` (any text input/textarea/select needing the standard bordered look + clean focus state), `.dialog-btn`/`.dialog-btn--neutral`/`.dialog-btn--danger`/`.dialog-btn--accent` (any dialog's action buttons), `.badge-pill`/`.badge-pill--control` (colored pill-style selects). When a new component needs "an input" or "a dialog button," the first move is applying an existing base class, then layering only the genuinely-specific difference on top (sizing, icon padding, a color) — never re-declaring border/radius/background/focus from scratch. This session's `.app-input` rollout is the clearest example: extracting it out of the task-input's one-off styling, then pointing Search's input at the same class, is what surfaced (and let us fix) the fact that Search's focus state had silently drifted from the "clean" style established for the task input.
- **One `flex-grow` per chain ("single-stretch-responsibility"):** when a parent needs to fill available height/width, exactly one element in that ancestor chain should carry the `flex-grow`/CSS Grid stretch responsibility — never two. This isn't a named CSS technique, it's a debugging lesson from this session: the ToDo/Calendar layout went through several passes where a spacer div *and* a stretching container *and* the card itself all tried to "help" fill space, each producing its own gap in a different place. The fix each time was removing the redundant claim, not adding a new one. `.layout` (CSS Grid) is now the *only* thing that stretches `.tasks-card`/`.calendar-card`; `.todo-app` and `.calendar` size to their own content and simply receive whatever height the grid row gives their card.
- **CSS Grid over Flexbox specifically for equal-height columns:** Flexbox's `align-items: stretch` only produces genuinely content-driven equal heights if some ancestor already has a definite height to stretch *within* — otherwise you need a workaround (this session tried, then removed, binding the whole page to `100dvh` for exactly this reason). A CSS Grid row's height is the max of its items' own content by default, and `align-items: stretch` (also Grid's default) then matches every item to *that* — no externally-imposed height required. `.layout` uses this for the ToDo/Calendar columns; it's the recommended pattern for any future "two panels must match height, driven by whichever is taller" layout.

## State management

Still no Redux/Zustand/global state library — deliberately, matching the existing "React local state + hooks" convention. What changed is *where* state lives, now that there's more than one page:

- **Route/page-local state stays local.** `TodoPage` owns everything ToDo-related (`todos`, `projects`, filters, sort, pagination position, dialog-open state) via `useState`/`useLocalStorage`, exactly as `App.tsx` used to — it just moved. `DashboardPage` has no state at all (purely derived from `MODULES`).
- **Cross-cutting, imperative UI concerns use React Context**, not prop drilling: `ConfirmContext` (`useConfirm().requestConfirm(options)` returns a `Promise<boolean>`) and `ToastContext` both predate today but are the established pattern any future "show me a floating UI element from anywhere, await the result" need should follow — `TaskDetails`' unsaved-changes prompt reuses `useConfirm()` rather than inventing its own confirmation UI.
- **Derived state stays derived, not duplicated.** `Todo.status` was added as an explicit field (the Task Details dialog needs a real form control for it) but is kept in sync with the existing `completed: boolean` rather than becoming a second, independently-mutable source of truth — every existing filter/sort/checkbox code path still only reads `completed`, unchanged and unaffected by the new field.

## Data model & migration

`Todo` grew six fields this session (`taskId`, `description`, `notes`, `status`, `dueDate`, `updatedAt`), all backward-compatible. The established migration pattern (`migrateTodos`, called once inside `useLocalStorage`'s lazy initializer) is: every new field gets a computed default for old records, applied idempotently (re-running it on already-migrated data is a no-op). This is now the second time this pattern has been used (Priority/Project fields were migrated the same way in an earlier session) — it's the project's standard approach to schema evolution on top of `localStorage`, and should be reused rather than reinvented for the next field addition.

Task IDs (`TSK-000001`) are deliberately **derived, not separately persisted** — `nextTaskNumber()` scans existing `taskId`s and returns `max + 1`, used identically for both migration (backfilling old todos) and new-task creation. A separate `localStorage` counter was considered and rejected: it's one more piece of state that could drift from reality (e.g. after a failed write, or manual `localStorage` editing), where a derived value can't.

## Dev-only code

`src/dev/sampleTodos.ts` exports 20 fixture tasks, wired into `TodoPage.tsx` behind `import.meta.env.DEV`. This is the project's first dev-only code path, and it needed a specific technique to actually disappear from production, not just go unused at runtime: a bare `const X = [...].map(...)` at module scope is treated by Rollup as a possible side effect and left in the bundle even when the binding using it is dead-code-eliminated. The fix is the `/* @__PURE__ */` annotation immediately before the `.map()` call, which tells the bundler the call is safe to drop if unused — verified by grepping the actual `npm run build` output for the fixture text and confirming it's absent. Any future dev-only computed constant should use the same annotation, not just the `import.meta.env.DEV` guard alone.

## Coding standards (carried forward, reaffirmed this session)

- Function components + hooks only, no class components.
- No `any`; the codebase's existing null-safety style (optional chaining, explicit `| undefined` unions) is followed for all new fields/props.
- Hooks called unconditionally, accurate dependency arrays — including this session's `useState(() => draftFromTodo(todo))` lazy-initializer pattern in `TaskDetails`, chosen specifically over `useEffect`-based state seeding after a real bug (see `CHANGELOG.md`) showed the effect-based version runs one render too late for `Dialog`'s focus-on-open logic.
- Every non-trivial change this session was verified against the actual running app via Playwright (computed styles, DOM assertions, screenshots) before being considered done — not just read back from the diff. `tsc -b` and `oxlint` clean on every change; no exceptions taken.
