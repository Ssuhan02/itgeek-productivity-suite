// Home Dashboard design tokens.
//
// This project deliberately has no CSS-in-JS and no build-time CSS variable
// injection (see PROJECT_STATUS.md's Tech Stack / Asset & Theme Architecture
// notes) — styling lives entirely in plain CSS (`index.css` / `App.css`),
// bridged from TypeScript only where a value is genuinely computed at
// runtime (e.g. `main.tsx` setting `--app-bg-image`). These tokens are
// static, so the actual rendering source of truth is the matching set of
// CSS custom properties in `index.css`'s `:root` (`--space-*`,
// `--dashboard-max-width`, `--card-*`, `--radius-card`, `--glass-*`,
// `--shadow-card*`) — every value below is kept numerically identical to
// its CSS counterpart.
//
// This file exists so the design system has one typed, documented,
// importable reference — for future non-CSS consumers (tests, tooling,
// a future Storybook-style catalog, or JS-driven layout logic) — rather
// than the values only existing as magic numbers scattered through CSS.

/** 8px-based spacing scale. Use instead of arbitrary spacing values. */
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const

/** Centered dashboard container width. */
export const DASHBOARD_MAX_WIDTH = 960

/** Every module card shares these exact dimensions. */
export const CARD = {
  minWidth: 320,
  maxWidth: 340,
  height: 200,
  radius: 20,
} as const

/** Grid gap — identical horizontal and vertical spacing. */
export const GRID_GAP = SPACING.lg // 32

/** Glassmorphism background opacity (0–1) for dashboard surfaces. */
export const GLASS_OPACITY = {
  card: 0.95,
  cardFeatured: 0.97,
} as const

/** Typography scale — one named size per semantic role, per breakpoint
 * where the role scales down. */
export const TYPOGRAPHY = {
  title: { desktop: 44, tablet: 28, mobile: 24 },
  sectionSubtitle: { desktop: 17, tablet: 16, mobile: 15 },
  cardTitle: 17,
  cardDescription: 13,
  button: 14,
  footer: 24,
} as const

/** Shadow presets. `cardFeatured` is used on the one enabled module (ToDo
 * today) so it reads as the primary, ready-to-use card among "Coming
 * Soon" ones. */
export const SHADOW = {
  card: 'rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px',
  cardFeatured: 'rgba(0, 0, 0, 0.18) 0 16px 28px -6px, rgba(0, 0, 0, 0.1) 0 6px 10px -3px',
} as const
