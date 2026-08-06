export type Priority = 'high' | 'medium' | 'low'

export interface Project {
  id: string
  name: string
  icon: string
  color: string
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  scheduledDate?: string
  scheduledTime?: string
  priority: Priority
  projectId: string
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
