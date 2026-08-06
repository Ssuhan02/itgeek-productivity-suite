import type { Priority } from '../types'

export const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export const DEFAULT_PRIORITY: Priority = 'medium'

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const PRIORITY_ICONS: Record<Priority, string> = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
}

/** Sort weight: lower sorts first (High first). */
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}
