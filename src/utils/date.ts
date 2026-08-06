export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const SCHEDULING_YEARS_RANGE = 10

/** Inclusive min/max ISO dates spanning `SCHEDULING_YEARS_RANGE` years before/after today. */
export function getSchedulableDateBounds(): { min: string; max: string } {
  const today = new Date()
  const min = new Date(today.getFullYear() - SCHEDULING_YEARS_RANGE, today.getMonth(), today.getDate())
  const max = new Date(today.getFullYear() + SCHEDULING_YEARS_RANGE, today.getMonth(), today.getDate())
  return { min: toISODate(min), max: toISODate(max) }
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Returns a 42-cell (6-week) grid of Dates covering the given month, starting on Sunday. */
export function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })
}

/** Formats a 'YYYY-MM-DD' string as e.g. "Friday, August 14". */
export function formatLongDate(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/** Formats a 'HH:MM' 24-hour string as e.g. "2:30 PM". */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS

/** Formats time elapsed since `fromMs` as e.g. "Just now" / "5 minutes ago" / "2 hours ago". */
export function formatElapsed(fromMs: number, nowMs: number = Date.now()): string {
  const elapsed = Math.max(0, nowMs - fromMs)
  if (elapsed < MINUTE_MS) return 'Just now'
  if (elapsed < HOUR_MS) {
    const minutes = Math.floor(elapsed / MINUTE_MS)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }
  const hours = Math.floor(elapsed / HOUR_MS)
  return `${hours} hour${hours === 1 ? '' : 's'} ago`
}

/** Formats time remaining until `untilMs` as e.g. "23h 55m" / "45m" / "Expiring soon". */
export function formatRemaining(untilMs: number, nowMs: number = Date.now()): string {
  const remaining = untilMs - nowMs
  if (remaining <= MINUTE_MS) return 'Expiring soon'
  const hours = Math.floor(remaining / HOUR_MS)
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS)
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}
