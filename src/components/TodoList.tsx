import type { Priority, Project, Todo } from '../types'
import { EmptyState } from './EmptyState'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  projects: Project[]
  searchQuery: string
  /** Ids currently mid-delete-animation — see useDeleteWithUndo. */
  animatingOutIds: Set<string>
  /** Ids that just came back via Undo — see useDeleteWithUndo. */
  restoringIds: Set<string>
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  onRemove: (id: string) => void
  removeLabel: string
  onSchedule: (id: string, dateISO: string, time?: string) => void
  onPriorityChange: (id: string, priority: Priority) => void
  onProjectChange: (id: string, projectId: string) => void
}

export function TodoList({
  todos,
  projects,
  searchQuery,
  animatingOutIds,
  restoringIds,
  onToggle,
  onDelete,
  onEdit,
  onRemove,
  removeLabel,
  onSchedule,
  onPriorityChange,
  onProjectChange,
}: TodoListProps) {
  // Caller (TodoPage's .todo-app__content) owns the flexible, bounded
  // region this renders into — an empty list, a "no results" message, or a
  // page of task rows are each a single flex:1 element (.empty-state /
  // .todo-list already carry that rule), so whichever renders fills that
  // region identically; `todos` is already capped to one page by
  // TodoPage's usePagination.
  if (todos.length === 0) {
    return searchQuery.trim() ? (
      <EmptyState
        className="empty-state--search"
        icon="🔍"
        title="No matching tasks found."
        hint="Try another keyword."
      />
    ) : (
      <EmptyState title="Nothing here yet." />
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          projects={projects}
          searchQuery={searchQuery}
          isDeleting={animatingOutIds.has(todo.id)}
          isRestoring={restoringIds.has(todo.id)}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onRemove={onRemove}
          removeLabel={removeLabel}
          onSchedule={onSchedule}
          onPriorityChange={onPriorityChange}
          onProjectChange={onProjectChange}
        />
      ))}
    </ul>
  )
}
