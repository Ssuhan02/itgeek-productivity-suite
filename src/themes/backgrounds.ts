import { mountFujiBg, mountFujiClassicBg } from '../assets'

/**
 * Catalog of every background image the app knows about. This is the seam a
 * future theme-switcher (or seasonal/user-selectable backgrounds) would read
 * from — add a new key here as new backgrounds are added, no other code needs
 * to change.
 */
export const backgrounds = {
  mountFuji: mountFujiBg,
  mountFujiClassic: mountFujiClassicBg,
} as const

export type BackgroundKey = keyof typeof backgrounds
