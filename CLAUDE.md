# CLAUDE.md

_Created 2026-08-08. Practical working instructions for Claude Code sessions on this project — read this before starting work. For **why** things are built the way they are, see `ARCHITECTURE.md`. For **what's done and what's next**, see `PROJECT_STATUS.md` and `ROADMAP.md`._

## Project in one paragraph

ITGeek Productivity Suite — a client-only React SPA today (no backend yet), planned to grow into a multi-module SaaS platform (see `docs/SYSTEM_DESIGN_DOCUMENT.md`). A Home Dashboard (`/`) links to modules defined in `src/config/modules.ts`; ToDo (`/todo`) is the only fully-built module so far. Personal Finance, Settings, Profile, and several other modules exist as routed placeholders.

## Project conventions

- **Adding a module** (even a placeholder): one entry in `src/config/modules.ts`. Never add a route, page, or nav entry by hand — `App.tsx`/`GlobalNav`/`DashboardPage` all derive from that config.
- **Branding:** the app name lives in `src/config/branding.ts` (`APP_NAME`) — never hardcode "ITGeek Productivity Suite" elsewhere.
- **Page titles:** always via `usePageTitle('Page Name')` — never touch `document.title` directly. Format is the bare page name only, no app-name prefix (this was an explicit, deliberate simplification — don't reintroduce a prefix without being asked).
- **Data migration:** any new field on `Todo` (or a future entity) needs a default computed in that entity's `migrate*` function, applied idempotently. See `ARCHITECTURE.md`'s Data Model section for the established pattern — reuse it.

## UI design standards

- Glassmorphism (translucent white panels, `backdrop-filter: blur(...)`, soft shadows), rounded corners, the existing purple accent (`var(--accent)`) — this is the whole app's look. Don't introduce a different visual language for a new feature; match what's already there.
- **Never a colored glow/box-shadow on input focus.** The standard is a border-color-only change on `:focus-visible` (see `.app-input`). This was explicitly requested and fixed twice this session (once for the task input, once when Search's independent focus glow was found still using the old style) — treat it as a hard rule, not a preference.
- **Every text input/textarea/select should be (or extend) `.app-input`.** Don't write a new bordered-input CSS rule from scratch; apply the class and layer on only what's genuinely specific (icon padding, a fixed height for a compact control, etc.) via longhand properties that won't fight the base class's shorthand declarations. Same idea for dialog buttons (`.dialog-btn` + a modifier) and colored pill selects (`.badge-pill`/`.badge-pill--control`).
- **Modals:** use the `Dialog` primitive (`src/components/ui/Dialog`) for anything new. Don't build a new modal from a raw `position: fixed` overlay, and don't extend `ModalOverlay` for new features — that component still serves its existing three dialogs, but `Dialog` is the forward-looking one.

## Naming conventions

- Components: `PascalCase.tsx`, one component per file, named export (not default) except page components (`export default function TodoPage()`).
- CSS: BEM-ish for anything structural — `.block__element`, `.block--modifier` (e.g. `.todo-app__header`, `.dialog-btn--accent`). Older flat names (`.todo-item`, `.todo-checkbox`) predate this and weren't retrofitted; don't feel obligated to rename them, but do follow the convention for anything new.
- Hooks: `useX.ts` in `src/hooks/`, one hook per file, no UI.

## Folder organization

```
pages/       one per route, owns its own state
layouts/     shared page shell (AppLayout)
components/
  ui/        app-wide, domain-agnostic primitives (Dialog is the first) — own folder, own CSS file
  dashboard/ dashboard-specific components
  *.tsx      everything else (feature components)
config/      data, not components (modules.ts, branding.ts, dashboardTheme.ts)
contexts/    cross-cutting imperative UI (ConfirmContext, ToastContext)
hooks/       reusable logic, no UI
utils/       pure functions, no React
dev/         dev-only code, gated behind import.meta.env.DEV (see below)
```

New component decision tree: is it reusable across multiple *future modules*, not just multiple places in ToDo? → `components/ui/<Name>/<Name>.tsx` + `.css` + `index.ts`. Reusable within ToDo only? → `components/*.tsx`. Page-specific and never reused? → keep it inline in the page, or a private component in the same file.

## Reusable component strategy

Extract a shared base the *second* time a pattern repeats, not preemptively and not after the fifth. This session's `.app-input` and `Dialog` both followed that: `.app-input` was pulled out once Search's input needed the same treatment as the task input; `Dialog` was built as a general primitive specifically because the task said Personal Finance/Settings/Profile/future dialogs would need it, not because `TaskDetails` alone justified a new abstraction.

Dev-only fixture data needs `/* @__PURE__ */` immediately before any computed value (not just the `import.meta.env.DEV` guard) to actually disappear from production bundles — see `ARCHITECTURE.md`'s Dev-only code section. Verify with `npm run build` + grep the output for a string unique to the fixture, don't assume the guard alone is enough.

## Development workflow

1. Read relevant existing code and CSS before writing new code — this app has strong existing conventions (shared classes, config-driven patterns); match them rather than introducing a parallel approach.
2. `npx tsc -b` and `npx oxlint src` clean after every change, no exceptions.
3. **Verify against the actual running app, not just the diff.** This project's sessions consistently use Playwright against the dev server (`npm run dev`) to check computed styles, DOM state, keyboard/focus behavior, and take screenshots — do the same for anything visual or interactive. Two real bugs this session were only caught this way (a focus-restore race, a CSS specificity bug producing multiple dropdown arrows) — code review alone wouldn't have found either.
4. For dev-only code, confirm production exclusion with an actual `npm run build`, not just by reasoning about the bundler.
5. Respect explicit scope boundaries. Several tasks this session were framed as "only change X, do not touch Y" — take that literally; when a fix requires touching something outside the stated scope (e.g. a shared base class used elsewhere), explain why before/while doing it rather than silently expanding scope.
6. Clean up temporary verification scripts (Playwright scripts, debug files) — nothing scratch should be committed to the repo.

## Documentation workflow

- **`file_listing.txt` (project root):** regenerate and diff against its previous version after *every* task, not just at the end of a session — this is now a standing rule, not a one-off request. State in the task summary whether it changed.
- **`PROJECT_STATUS.md`, `CHANGELOG.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `CLAUDE.md`:** update **only** on an explicit end-of-day (or similarly explicit) request. Do not touch these during normal feature/fix tasks even if they'd technically be more accurate — the user wants day-to-day work and periodic documentation passes kept separate and deliberate.
- When asked for the end-of-day update: review the *whole* session's actual changes (git log + diffs, not memory) before writing anything, preserve all prior history in `CHANGELOG.md`/`PROJECT_STATUS.md` (append/update, never delete past entries), and make sure every "current state" section (Tech Stack, Folder Structure, Data Model, Completed Features) actually matches the codebase as it stands — stale status docs are worse than none.

## Git workflow

- Commit messages should describe the actual change set, not "misc updates."
- Don't skip hooks, don't force-push, don't amend existing commits — new commits only, per standard guidance.
- This repo deploys automatically (Cloudflare Pages, on push to `main` — see `DEPLOYMENT.md`); treat `main` accordingly.

## Things to avoid

- Hardcoded pixel heights as a layout fix, or empty spacer `<div>`s to absorb leftover flex/grid space — both were explicitly rejected multiple times this session in favor of fixing the actual flex/grid responsibility chain (see `ARCHITECTURE.md`'s "single-stretch-responsibility" note).
- `background: <value>` (the shorthand) on any element that also needs `background-image` from elsewhere in the cascade — use `background-color` instead. This exact shorthand-vs-longhand mistake caused a real, user-visible bug this session (Status dropdown's multiple chevrons).
- Redesigning something you weren't asked to touch, even if it's adjacent to what you were asked to change. Multiple tasks this session explicitly called out "do not change spacing/colors/animations/X" — treat unstated things as **not** in scope by default.
- Reusing `ModalOverlay`/extending the old dialog CSS classes (`.dialog-overlay`/`.dialog-panel`) for new modals — use `Dialog` instead (see UI design standards above).
- Assuming `document.activeElement` is set correctly just because an element is clickable — non-form elements need explicit `tabIndex` + `.focus()` calls to participate correctly in focus capture/restore (see how `TodoItem`'s title span handles this).

## Current Version 1.0 scope

Per the SDD, Version 1.0 is "ITGeek Platform + ToDo." As of 2026-08-08:

- **Frontend shell:** done — Home Dashboard, routing, module config system, Global Nav.
- **ToDo module:** functionally complete and polished — task CRUD, scheduling, calendar, priority/project organization, search, Safe Delete & Recovery, pagination, and now Task Details (rich per-task editing via the new Dialog primitive).
- **Personal Finance, Settings, Profile:** placeholders only (dashboard cards + routes exist, no real functionality) — building these for real is Version 1.0 scope per the module list, just not started.
- **Backend/platform (auth, database, API):** not started at all. This is the large remaining piece of Version 1.0 — see `ROADMAP.md`'s Priority 1–9. The frontend currently runs entirely on `localStorage`; there is no multi-device or multi-user support yet.

Don't assume "Version 1.0" means "just ToDo" — the SDD scopes it as the whole platform, and the backend work is the actual bottleneck, not the frontend.
