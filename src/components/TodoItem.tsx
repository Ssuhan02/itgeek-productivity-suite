import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Priority, Project, Todo } from '../types'
import { formatTime, getSchedulableDateBounds } from '../utils/date'
import { getHighlightSegments } from '../utils/highlight'
import { CalendarIcon } from './icons/CalendarIcon'
import { TrashIcon } from './icons/TrashIcon'
import { PriorityBadge } from './PriorityBadge'
import { ProjectBadge } from './ProjectBadge'

const dateBounds = getSchedulableDateBounds()

interface TodoItemProps {
  todo: Todo
  projects: Project[]
  searchQuery: string
  /** True while this task is playing its exit animation (see useDeleteWithUndo). */
  isDeleting: boolean
  /** True briefly after this task was brought back via Undo (see useDeleteWithUndo). */
  isRestoring: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  onRemove: (id: string) => void
  removeLabel: string
  onSchedule: (id: string, dateISO: string, time?: string) => void
  onPriorityChange: (id: string, priority: Priority) => void
  onProjectChange: (id: string, projectId: string) => void
  /** Opens the Task Details dialog for this task (single click/Enter on
   * its title). */
  onOpenDetails: (id: string) => void
}

const SINGLE_CLICK_DELAY_MS = 220 // long enough for a real double-click to cancel it — see handleTextClick.

export function TodoItem({
  todo,
  projects,
  searchQuery,
  isDeleting,
  isRestoring,
  onToggle,
  onDelete,
  onEdit,
  onRemove,
  removeLabel,
  onSchedule,
  onPriorityChange,
  onProjectChange,
  onOpenDetails,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [isScheduling, setIsScheduling] = useState(false)
  const [pickDate, setPickDate] = useState('')
  const [pickTime, setPickTime] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  // Pending single-click timer must not fire after the row unmounts (e.g.
  // deleted mid-click).
  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current)
  }, [])

  const startEditing = () => {
    setDraft(todo.text)
    setIsEditing(true)
  }

  const openDetails = () => {
    // Focus the title itself first, so Dialog's focus-restore-on-close
    // (which captures document.activeElement at open time) lands back on
    // this exact task afterward, per the "restore focus to the previously
    // selected task" requirement.
    textRef.current?.focus()
    onOpenDetails(todo.id)
  }

  // A single click opens Task Details; a double click starts the existing
  // inline rename instead. Both land on the same element, and a real
  // double-click always fires two `click` events before `dblclick` — so a
  // naive onClick would open the dialog on the very first click of every
  // double-click too. Debouncing the single-click action lets the second
  // click (handled below) cancel it before that happens.
  const handleTextClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      return
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      openDetails()
    }, SINGLE_CLICK_DELAY_MS)
  }

  const handleTextDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
    }
    startEditing()
  }

  const handleTextKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openDetails()
    }
  }

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      onEdit(todo.id, trimmed)
    } else {
      onDelete(todo.id)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitEdit()
    } else if (e.key === 'Escape') {
      setDraft(todo.text)
      setIsEditing(false)
    }
  }

  const toggleScheduler = () => {
    if (isScheduling) {
      setIsScheduling(false)
      return
    }
    setPickDate(todo.scheduledDate ?? '')
    setPickTime(todo.scheduledTime ?? '')
    setIsScheduling(true)
  }

  const applySchedule = () => {
    if (!pickDate) return
    onSchedule(todo.id, pickDate, pickTime || undefined)
    setIsScheduling(false)
  }

  return (
    <li
      className={`todo-item${todo.completed ? ' completed' : ''}${isEditing ? ' editing' : ''}${isDeleting ? ' todo-item--deleting' : ''}${isRestoring ? ' todo-item--restoring' : ''}`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          aria-label="Edit todo"
        />
      ) : (
        <>
          <div className="todo-row">
            <label className="todo-checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'complete'}`}
              />
              <span className="checkmark" aria-hidden="true" />
            </label>
            <span
              ref={textRef}
              className="todo-text"
              tabIndex={0}
              role="button"
              aria-label={`View details for "${todo.text}"`}
              onClick={handleTextClick}
              onDoubleClick={handleTextDoubleClick}
              onKeyDown={handleTextKeyDown}
            >
              {getHighlightSegments(todo.text, searchQuery).map((segment, i) =>
                segment.match ? <mark key={i}>{segment.text}</mark> : <span key={i}>{segment.text}</span>,
              )}
            </span>
            <div className="todo-actions">
              <ProjectBadge
                value={todo.projectId}
                projects={projects}
                onChange={(projectId) => onProjectChange(todo.id, projectId)}
                taskLabel={todo.text}
              />
              <PriorityBadge
                value={todo.priority}
                onChange={(priority) => onPriorityChange(todo.id, priority)}
                taskLabel={todo.text}
              />
              {todo.scheduledTime && (
                <span className="todo-time">🕒 {formatTime(todo.scheduledTime)}</span>
              )}
              <button
                type="button"
                className={`move-btn${isScheduling ? ' active' : ''}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', todo.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onClick={toggleScheduler}
                aria-label={`Schedule "${todo.text}"`}
                title="Schedule Task"
              >
                <CalendarIcon />
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => onRemove(todo.id)}
                aria-label={`${removeLabel} "${todo.text}"`}
                title={removeLabel}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          {isScheduling && (
            <div className="inline-schedule-row">
              <input
                type="date"
                value={pickDate}
                onChange={(e) => setPickDate(e.target.value)}
                min={dateBounds.min}
                max={dateBounds.max}
                aria-label="Task date"
                autoFocus
              />
              <input
                type="time"
                value={pickTime}
                onChange={(e) => setPickTime(e.target.value)}
                aria-label="Task time (optional)"
              />
              <button
                type="button"
                className="apply-schedule-btn"
                onClick={applySchedule}
                disabled={!pickDate}
                aria-label="Confirm date"
              >
                ✓
              </button>
              <button
                type="button"
                className="cancel-schedule-btn"
                onClick={() => setIsScheduling(false)}
                aria-label="Cancel"
              >
                ×
              </button>
            </div>
          )}
        </>
      )}
    </li>
  )
}
