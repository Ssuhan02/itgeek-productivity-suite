import type { ChangeEvent } from 'react'
import type { Priority } from '../types'
import { PRIORITIES, PRIORITY_ICONS, PRIORITY_LABELS } from '../utils/priority'

interface PrioritySelectProps {
  value: Priority
  onChange: (priority: Priority) => void
  ariaLabel: string
  /** 'compact' (default) is the small pill sizing; 'control' matches toolbar-sized buttons. */
  variant?: 'compact' | 'control'
  autoFocus?: boolean
  onBlur?: () => void
}

/** A native select styled as a colored priority badge (e.g. "🔴 High") that also serves as the editor. */
export function PrioritySelect({
  value,
  onChange,
  ariaLabel,
  variant = 'compact',
  autoFocus,
  onBlur,
}: PrioritySelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as Priority)
  const variantClass = variant === 'control' ? ' badge-pill--control' : ''

  return (
    <select
      className={`badge-pill priority-select priority-${value}${variantClass}`}
      value={value}
      onChange={handleChange}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      onBlur={onBlur}
    >
      {PRIORITIES.map((p) => (
        <option key={p} value={p}>
          {PRIORITY_ICONS[p]} {PRIORITY_LABELS[p]}
        </option>
      ))}
    </select>
  )
}
