import { useMemo, useState } from 'react'
import { Dialog } from './ui/Dialog'
import { PrioritySelect } from './PrioritySelect'
import { ProjectSelect } from './ProjectSelect'
import { useConfirm } from '../hooks/useConfirm'
import { getSchedulableDateBounds } from '../utils/date'
import type { Priority, Project, TaskStatus, Todo } from '../types'

const dateBounds = getSchedulableDateBounds()

interface TaskDetailsDraft {
  text: string
  description: string
  notes: string
  projectId: string
  priority: Priority
  status: TaskStatus
  scheduledDate: string
  dueDate: string
}

function draftFromTodo(todo: Todo): TaskDetailsDraft {
  return {
    text: todo.text,
    description: todo.description ?? '',
    notes: todo.notes ?? '',
    projectId: todo.projectId,
    priority: todo.priority,
    status: todo.status,
    scheduledDate: todo.scheduledDate ?? '',
    dueDate: todo.dueDate ?? '',
  }
}

interface TaskDetailsProps {
  todo: Todo
  projects: Project[]
  onClose: () => void
  onSave: (id: string, changes: Partial<Todo>) => void
}

/**
 * The Task Details dialog — built entirely on top of the reusable <Dialog>
 * primitive (see components/ui/Dialog). This component owns everything
 * task-specific (the form fields, the draft/unsaved-changes tracking, Task
 * ID display, Save/Cancel); Dialog itself has no idea any of this exists.
 *
 * The caller (TodoPage) only mounts this when a task is actually selected,
 * with `key={todo.id}` — so switching tasks (or reopening after a close)
 * always gets a fresh instance, and `draft` below can be seeded
 * synchronously from `todo` on the very first render via useState's lazy
 * initializer. That matters: Dialog's own "focus the first focusable
 * element on open" effect runs on that same first render, so the form
 * fields it's looking for need to already exist — an effect-based reset
 * (running a render *after* mount) left Dialog with nothing to focus,
 * which meant keyboard focus silently stayed outside the dialog and ESC
 * never reached it.
 */
export function TaskDetails({ todo, projects, onClose, onSave }: TaskDetailsProps) {
  const { requestConfirm } = useConfirm()
  const [draft, setDraft] = useState<TaskDetailsDraft>(() => draftFromTodo(todo))

  const hasUnsavedChanges = useMemo(() => {
    const original = draftFromTodo(todo)
    return (Object.keys(original) as (keyof TaskDetailsDraft)[]).some((key) => draft[key] !== original[key])
  }, [todo, draft])

  const confirmDiscardIfNeeded = async (): Promise<boolean> => {
    if (!hasUnsavedChanges) return true
    return requestConfirm({
      title: 'Discard changes?',
      message: 'This task has unsaved changes.',
      detail: 'Closing now will discard them.',
      confirmLabel: 'Discard Changes',
      cancelLabel: 'Keep Editing',
      tone: 'danger',
    })
  }

  const handleCancel = async () => {
    if (await confirmDiscardIfNeeded()) onClose()
  }

  const handleSave = () => {
    const trimmedText = draft.text.trim()
    onSave(todo.id, {
      text: trimmedText || todo.text,
      description: draft.description,
      notes: draft.notes,
      projectId: draft.projectId,
      priority: draft.priority,
      status: draft.status,
      completed: draft.status === 'completed',
      scheduledDate: draft.scheduledDate || undefined,
      dueDate: draft.dueDate || undefined,
      updatedAt: Date.now(),
    })
    onClose()
  }

  return (
    <Dialog
      isOpen
      onClose={onClose}
      beforeClose={confirmDiscardIfNeeded}
      labelledBy="task-details-title"
      className="task-details"
    >
      <div className="dialog-header">
        <div>
          <h2 id="task-details-title">Task Details</h2>
          <span className="task-details__id">{todo.taskId}</span>
        </div>
        <button type="button" className="dialog-close-btn" onClick={handleCancel} aria-label="Close">
          ×
        </button>
      </div>

      <section className="task-details__section">
        <h3>Task Information</h3>
        <label className="task-details__field">
          <span>Title</span>
          <input
            className="app-input"
            type="text"
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
        </label>
        <label className="task-details__field">
          <span>Description</span>
          <textarea
            className="app-input task-details__description"
            rows={5}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Add more detail about this task..."
          />
        </label>
      </section>

      <section className="task-details__section">
        <h3>Organization</h3>
        <div className="task-details__grid">
          <label className="task-details__field">
            <span>Project</span>
            <ProjectSelect
              value={draft.projectId}
              projects={projects}
              onChange={(projectId) => setDraft({ ...draft, projectId })}
              ariaLabel="Project"
              variant="control"
            />
          </label>
          <label className="task-details__field">
            <span>Priority</span>
            <PrioritySelect
              value={draft.priority}
              onChange={(priority) => setDraft({ ...draft, priority })}
              ariaLabel="Priority"
              variant="control"
            />
          </label>
          <label className="task-details__field">
            <span>Status</span>
            <select
              className="app-input task-details__status"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })}
              aria-label="Status"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
      </section>

      <section className="task-details__section">
        <h3>Scheduling</h3>
        <div className="task-details__grid task-details__grid--2">
          <label className="task-details__field">
            <span>Scheduled Date</span>
            <input
              className="app-input"
              type="date"
              value={draft.scheduledDate}
              min={dateBounds.min}
              max={dateBounds.max}
              onChange={(e) => setDraft({ ...draft, scheduledDate: e.target.value })}
            />
          </label>
          <label className="task-details__field">
            <span>Due Date</span>
            <input
              className="app-input"
              type="date"
              value={draft.dueDate}
              min={dateBounds.min}
              max={dateBounds.max}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="task-details__section">
        <h3>Notes</h3>
        <textarea
          className="app-input task-details__notes"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Anything else worth remembering about this task..."
          aria-label="Notes"
        />
      </section>

      <div className="task-details__footer">
        <button type="button" className="dialog-btn dialog-btn--neutral" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" className="dialog-btn dialog-btn--accent" onClick={handleSave}>
          Save
        </button>
      </div>
    </Dialog>
  )
}
