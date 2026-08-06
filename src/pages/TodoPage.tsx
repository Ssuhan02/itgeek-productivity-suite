import { useMemo, useState } from 'react'
import type { DragEvent } from 'react'
import { AppLayout } from '../layouts/AppLayout'
import { TodoInput } from '../components/TodoInput'
import { TodoList } from '../components/TodoList'
import { TodoFilters } from '../components/TodoFilters'
import { TodoToolbar } from '../components/TodoToolbar'
import { SearchBar } from '../components/SearchBar'
import { Calendar } from '../components/Calendar'
import { ManageProjectsDialog } from '../components/ManageProjectsDialog'
import { RecentlyDeletedDialog } from '../components/RecentlyDeletedDialog'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatLongDate } from '../utils/date'
import { DEFAULT_PRIORITY } from '../utils/priority'
import { DEFAULT_PROJECT_ID, DEFAULT_PROJECTS } from '../utils/projects'
import { sortTodos } from '../utils/sortTodos'
import { searchTodos } from '../utils/search'
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo'
import { useRecentlyDeleted } from '../hooks/useRecentlyDeleted'
import type { Filter, Priority, Project, SortOption, Todo } from '../types'
import '../App.css'

function migrateTodos(todos: Todo[], projects: Project[]): Todo[] {
  const fallbackProjectId = projects[0]?.id ?? DEFAULT_PROJECT_ID
  return todos.map((todo) => {
    const t = todo as Partial<Todo>
    return {
      ...todo,
      priority: t.priority ?? DEFAULT_PRIORITY,
      projectId: t.projectId ?? fallbackProjectId,
    }
  })
}

function TodoPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', DEFAULT_PROJECTS)
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [], (stored) => migrateTodos(stored, projects))
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('oldest')
  const [isManagingProjects, setIsManagingProjects] = useState(false)
  const [isRecentlyDeletedOpen, setIsRecentlyDeletedOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const addTodo = (
    text: string,
    dateISO?: string,
    time?: string,
    priority: Priority = DEFAULT_PRIORITY,
    projectId: string = projects[0]?.id ?? DEFAULT_PROJECT_ID,
  ) => {
    const scheduledDate = dateISO ?? selectedDate ?? undefined
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
        scheduledDate,
        scheduledTime: scheduledDate ? time : undefined,
        priority,
        projectId,
      },
    ])
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // Recently Deleted (24h) archive — separate localStorage key, own cleanup.
  const { deletedTodos, moveToRecentlyDeleted, restoreFromRecentlyDeleted, deletePermanently } =
    useRecentlyDeleted()

  // Backlog "Delete Task" flow: confirm → animate out → 5s undo window (toast)
  // → moved into Recently Deleted here, only once the window elapses
  // uninterrupted (never straight to permanent deletion anymore).
  // The calendar-view "Move to main list" button (unscheduleTodo, below) is
  // unaffected — it isn't destructive, so it stays immediate.
  const { animatingOutIds, restoringIds, pendingDeleteIds, requestDeleteTodo } = useDeleteWithUndo({
    onCommit: (todo, originalIndex) => {
      deleteTodo(todo.id)
      moveToRecentlyDeleted(todo, originalIndex)
    },
  })

  const requestRemoveTodo = (id: string) => {
    const originalIndex = todos.findIndex((t) => t.id === id)
    if (originalIndex === -1) return
    requestDeleteTodo(todos[originalIndex], originalIndex)
  }

  const handleRestoreFromRecentlyDeleted = (id: string) => {
    const todo = restoreFromRecentlyDeleted(id)
    if (todo) setTodos((prev) => [...prev, todo])
  }

  const editTodo = (id: string, text: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const scheduleTodo = (id: string, dateISO: string, time?: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, scheduledDate: dateISO, scheduledTime: time } : todo,
      ),
    )
  }

  const changePriority = (id: string, priority: Priority) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, priority } : todo)))
  }

  const changeProject = (id: string, projectId: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, projectId } : todo)))
  }

  const unscheduleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, scheduledDate: undefined, scheduledTime: undefined } : todo,
      ),
    )
  }

  const handleBacklogDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) unscheduleTodo(id)
  }

  const handleSelectDate = (dateISO: string) => {
    setSelectedDate((prev) => (prev === dateISO ? null : dateISO))
  }

  const addProject = (name: string, icon: string, color: string) => {
    setProjects((prev) => [...prev, { id: crypto.randomUUID(), name, icon, color }])
  }

  const renameProject = (id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)))
  }

  const updateProject = (id: string, changes: Partial<Pick<Project, 'icon' | 'color'>>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)))
  }

  const deleteProject = (id: string) => {
    if (projects.length <= 1) return
    const remaining = projects.filter((p) => p.id !== id)
    const fallback = remaining[0]
    setTodos((prev) =>
      prev.map((todo) => (todo.projectId === id ? { ...todo, projectId: fallback.id } : todo)),
    )
    setProjects(remaining)
    setProjectFilter((prev) => (prev === id ? 'all' : prev))
  }

  // Todos mid-undo-window are excluded from every derived view (list, counts,
  // calendar dots) — they're still in `todos`/localStorage, just hidden while
  // Undo remains possible. See useDeleteWithUndo / useUndoableDelete.
  const activeTodos = useMemo(
    () => (pendingDeleteIds.size === 0 ? todos : todos.filter((todo) => !pendingDeleteIds.has(todo.id))),
    [todos, pendingDeleteIds],
  )

  const visibleTodos = useMemo(
    () =>
      selectedDate
        ? activeTodos.filter((todo) => todo.scheduledDate === selectedDate)
        : activeTodos.filter((todo) => !todo.scheduledDate),
    [activeTodos, selectedDate],
  )

  const projectFilteredTodos = useMemo(
    () =>
      projectFilter === 'all'
        ? visibleTodos
        : visibleTodos.filter((todo) => todo.projectId === projectFilter),
    [visibleTodos, projectFilter],
  )

  const priorityFilteredTodos = useMemo(
    () =>
      priorityFilter === 'all'
        ? projectFilteredTodos
        : projectFilteredTodos.filter((todo) => todo.priority === priorityFilter),
    [projectFilteredTodos, priorityFilter],
  )

  const searchContext = useMemo(() => ({ projects }), [projects])

  const searchFilteredTodos = useMemo(
    () => searchTodos(priorityFilteredTodos, searchContext, searchQuery),
    [priorityFilteredTodos, searchContext, searchQuery],
  )

  const statusFilteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return searchFilteredTodos.filter((todo) => !todo.completed)
      case 'completed':
        return searchFilteredTodos.filter((todo) => todo.completed)
      default:
        return searchFilteredTodos
    }
  }, [searchFilteredTodos, filter])

  const filteredTodos = useMemo(() => sortTodos(statusFilteredTodos, sort), [statusFilteredTodos, sort])

  const activeCount = useMemo(
    () => searchFilteredTodos.filter((todo) => !todo.completed).length,
    [searchFilteredTodos],
  )
  const completedCount = searchFilteredTodos.length - activeCount

  return (
    <AppLayout scrollable>
      <div className="layout">
        <div className="card tasks-card" onDragOver={(e) => e.preventDefault()} onDrop={handleBacklogDrop}>
          <div className="todo-app">
            {selectedDate && (
              <div className="tasks-header">
                <h2>{formatLongDate(selectedDate)}</h2>
                <button type="button" className="show-all-btn" onClick={() => setSelectedDate(null)}>
                  Show all
                </button>
              </div>
            )}
            <TodoInput projects={projects} onAdd={addTodo} />
            {visibleTodos.length > 0 && (
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            )}
            {visibleTodos.length > 0 && (
              <TodoToolbar
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                sort={sort}
                onSortChange={setSort}
                projects={projects}
                projectFilter={projectFilter}
                onProjectFilterChange={setProjectFilter}
                onManageProjects={() => setIsManagingProjects(true)}
              />
            )}
            <TodoList
              todos={filteredTodos}
              projects={projects}
              searchQuery={searchQuery}
              animatingOutIds={animatingOutIds}
              restoringIds={restoringIds}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              onRemove={selectedDate ? unscheduleTodo : requestRemoveTodo}
              removeLabel={selectedDate ? 'Move to main list' : 'Delete Task'}
              onSchedule={scheduleTodo}
              onPriorityChange={changePriority}
              onProjectChange={changeProject}
            />
            {(visibleTodos.length > 0 || deletedTodos.length > 0) && (
              <TodoFilters
                filter={filter}
                onFilterChange={setFilter}
                completedCount={completedCount}
                onClearCompleted={clearCompleted}
                onOpenRecentlyDeleted={() => setIsRecentlyDeletedOpen(true)}
                isRecentlyDeletedActive={isRecentlyDeletedOpen}
              />
            )}
          </div>
        </div>
        <div className="card calendar-card">
          <Calendar
            todos={activeTodos}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onScheduleTask={scheduleTodo}
          />
        </div>
      </div>
      {isManagingProjects && (
        <ManageProjectsDialog
          projects={projects}
          onClose={() => setIsManagingProjects(false)}
          onAddProject={addProject}
          onRenameProject={renameProject}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
        />
      )}
      {isRecentlyDeletedOpen && (
        <RecentlyDeletedDialog
          deletedTodos={deletedTodos}
          projects={projects}
          onClose={() => setIsRecentlyDeletedOpen(false)}
          onRestore={handleRestoreFromRecentlyDeleted}
          onDeletePermanently={deletePermanently}
        />
      )}
    </AppLayout>
  )
}

export default TodoPage
