/**
 * Reserved for a future JS-readable color/theme token system (e.g. light/dark
 * mode). Today, every color token is a CSS custom property defined in
 * `src/index.css`'s `:root` block (`--accent`, `--priority-high`, ...), which
 * stays the single source of truth for now — this file isn't a second copy of
 * those values, just the shape a JS-side theme object would need to fill in
 * once something (like a dark-mode toggle) needs to read colors from JS.
 */
export interface ThemeColors {
  accent: string
  background: string
  text: string
  textHeading: string
  border: string
}
