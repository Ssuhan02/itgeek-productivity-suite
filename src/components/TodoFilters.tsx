import type { Filter } from '../types'

interface TodoFiltersProps {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  completedCount: number
  onClearCompleted: () => void
  onOpenRecentlyDeleted: () => void
  isRecentlyDeletedActive: boolean
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function TodoFilters({
  filter,
  onFilterChange,
  completedCount,
  onClearCompleted,
  onOpenRecentlyDeleted,
  isRecentlyDeletedActive,
}: TodoFiltersProps) {
  return (
    <div className="todo-footer">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={filter === value ? 'active' : ''}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
      <button
        type="button"
        className="clear-completed"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear Completed
      </button>
      <button
        type="button"
        className={`recently-deleted-filter-btn${isRecentlyDeletedActive ? ' active' : ''}`}
        onClick={onOpenRecentlyDeleted}
        aria-label="Open Recently Deleted"
      >
        🗂️ Recently Deleted
      </button>
    </div>
  )
}
