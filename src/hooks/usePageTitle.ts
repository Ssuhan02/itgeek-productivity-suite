import { useEffect } from 'react'

const DEFAULT_TITLE = 'Home'

/**
 * Single source of truth for the browser tab title (`document.title`).
 *
 * Every page calls this once with its own page name — no page should ever
 * touch `document.title` directly. The tab shows just the page name (no
 * app-name prefix), and centralizes that as new modules (Calendar, Notes,
 * ...) land.
 *
 * @param title - Page name to show in the tab, e.g. `"To-Do"` or a dynamic
 *   value like `` `Edit - ${task.name}` ``. Omit it (or pass `undefined`)
 *   to fall back to `"Home"`.
 *
 * @example
 * usePageTitle('To-Do')                    // "To-Do"
 * usePageTitle()                           // "Home"
 * usePageTitle(`Edit - ${task.name}`)      // "Edit - Exchange Online Migration"
 */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE
  }, [title])
}
