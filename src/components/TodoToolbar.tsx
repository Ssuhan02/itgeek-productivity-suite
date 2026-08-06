import type { ChangeEvent } from 'react'
import type { Priority, Project, SortOption } from '../types'
import { PRIORITIES, PRIORITY_ICONS, PRIORITY_LABELS } from '../utils/priority'
import { SettingsIcon } from './icons/SettingsIcon'

interface TodoToolbarProps {
  priorityFilter: Priority | 'all'
  onPriorityFilterChange: (value: Priority | 'all') => void
  sort: SortOption
  onSortChange: (value: SortOption) => void
  projects: Project[]
  projectFilter: string | 'all'
  onProjectFilterChange: (value: string | 'all') => void
  onManageProjects: () => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'Alphabetical' },
]

export function TodoToolbar({
  priorityFilter,
  onPriorityFilterChange,
  sort,
  onSortChange,
  projects,
  projectFilter,
  onProjectFilterChange,
  onManageProjects,
}: TodoToolbarProps) {
  return (
    <div className="todo-toolbar">
      <select
        className="project-filter"
        value={projectFilter}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onProjectFilterChange(e.target.value)}
        aria-label="Filter by project"
      >
        <option value="all">All Projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.icon} {project.name}
          </option>
        ))}
      </select>
      <select
        className="priority-filter"
        value={priorityFilter}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onPriorityFilterChange(e.target.value as Priority | 'all')
        }
        aria-label="Filter by priority"
      >
        <option value="all">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_ICONS[p]} {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>
      <select
        className="sort-select"
        value={sort}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort tasks by"
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            Sort: {label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="manage-projects-btn"
        onClick={onManageProjects}
        aria-label="Manage projects"
        title="Manage Projects"
      >
        <SettingsIcon size={15} />
      </button>
    </div>
  )
}
