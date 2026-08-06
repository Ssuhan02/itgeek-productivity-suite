import { useState } from 'react'
import type { Priority } from '../types'
import { PRIORITY_ICONS, PRIORITY_LABELS } from '../utils/priority'
import { PrioritySelect } from './PrioritySelect'

interface PriorityBadgeProps {
  value: Priority
  onChange: (priority: Priority) => void
  taskLabel: string
}

/** A compact colored priority badge that turns into a select for editing, then reverts automatically. */
export function PriorityBadge({ value, onChange, taskLabel }: PriorityBadgeProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <PrioritySelect
        value={value}
        onChange={(priority) => {
          onChange(priority)
          setIsEditing(false)
        }}
        ariaLabel={`Priority for "${taskLabel}"`}
        autoFocus
        onBlur={() => setIsEditing(false)}
      />
    )
  }

  return (
    <button
      type="button"
      className={`badge-pill priority-badge priority-${value}`}
      onClick={() => setIsEditing(true)}
      aria-label={`Priority: ${PRIORITY_LABELS[value]} for "${taskLabel}". Click to change.`}
      title={`Priority: ${PRIORITY_LABELS[value]}`}
    >
      {PRIORITY_ICONS[value]} {PRIORITY_LABELS[value]}
    </button>
  )
}
