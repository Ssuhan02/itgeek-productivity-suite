/**
 * Reserved for a future JS-readable typography theme (e.g. per-theme font
 * swaps). Today, font stacks are CSS custom properties in `src/index.css`'s
 * `:root` block (`--sans`, `--heading`, `--mono`), which stays the single
 * source of truth for now — this is just the shape a JS-side theme object
 * would need to fill in later.
 */
export interface ThemeTypography {
  sans: string
  heading: string
  mono: string
}
