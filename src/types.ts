export type Priority = 'high' | 'medium' | 'low'

/** Mirrors `completed` as an explicit, named value rather than a bare
 * boolean — `completed` stays the single source of truth everywhere else
 * in the app (filtering, sorting, the checkbox); `status` exists so the
 * Task Details dialog has a proper field, and so future statuses beyond
 * this simple on/off pair have somewhere to grow into without another
 * migration. */
export type TaskStatus = 'active' | 'completed'

export interface Project {
  id: string
  name: string
  icon: string
  color: string
}

export interface Todo {
  id: string
  /** Stable, human-readable identifier ("TSK-000001") — display only; `id`
   * (the UUID) remains the real key everywhere internally. See
   * utils/taskId.ts. */
  taskId: string
  text: string
  completed: boolean
  createdAt: number
  /** Last time any field on this task changed. Set on migration (falls
   * back to createdAt) and whenever the Task Details dialog saves; existing
   * mutators (toggle, drag-schedule, badge changes, ...) don't bump it yet. */
  updatedAt: number
  scheduledDate?: string
  scheduledTime?: string
  priority: Priority
  projectId: string
  /** Longer-form description shown in the Task Details dialog. */
  description?: string
  /** Freeform notes, separate from `description` — its own section in the
   * Task Details dialog. */
  notes?: string
  status: TaskStatus
  /** Distinct from `scheduledDate` (which drives the calendar view) — a
   * plain deadline with no calendar-placement behavior of its own. */
  dueDate?: string
}

export type Filter = 'all' | 'active' | 'completed'

export type SortOption = 'priority' | 'dueDate' | 'newest' | 'oldest' | 'alphabetical'

/**
 * A task sitting in Recently Deleted. `todo` is the complete, untouched
 * original object — this is what lets restore bring back every field
 * (including future ones like notes/subtasks/tags/attachments) with zero
 * field-by-field logic.
 */
export interface DeletedTodo {
  todo: Todo
  deletedAt: number
  expiresAt: number
  /** Position in `todos` at the moment of deletion — descriptive metadata
   *  only. Restore relies on sortTodos() + the untouched `todo` fields to
   *  land in the visually-correct spot, not on this index. */
  originalIndex: number
}
