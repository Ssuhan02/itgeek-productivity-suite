import { useEffect, useState } from 'react'
import { formatElapsed, formatRemaining } from '../utils/date'

interface TimerBadgeProps {
  mode: 'elapsed' | 'remaining'
  /** `deletedAt` for 'elapsed' mode, `expiresAt` for 'remaining' mode. */
  timestamp: number
}

const TICK_MS = 60_000

/**
 * Self-ticking relative-time display — re-renders itself every minute so
 * "2 hours ago" / "21h 48m" stay fresh without any parent data changing.
 * Deliberately decoupled from the cleanup sweep in useRecentlyDeleted: this
 * is purely a display concern, only active while mounted (i.e. while the
 * Recently Deleted dialog is open).
 */
export function TimerBadge({ mode, timestamp }: TimerBadgeProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(interval)
  }, [])

  const label = mode === 'elapsed' ? formatElapsed(timestamp, now) : formatRemaining(timestamp, now)

  return <span className={`timer-badge timer-badge--${mode}`}>{label}</span>
}
