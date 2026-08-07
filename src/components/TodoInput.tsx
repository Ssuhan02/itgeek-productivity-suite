import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Priority, Project } from '../types'
import { getSchedulableDateBounds } from '../utils/date'
import { DEFAULT_PRIORITY } from '../utils/priority'
import { DEFAULT_PROJECT_ID } from '../utils/projects'
import { CalendarIcon } from './icons/CalendarIcon'
import { PrioritySelect } from './PrioritySelect'
import { ProjectSelect } from './ProjectSelect'

interface TodoInputProps {
  projects: Project[]
  onAdd: (text: string, dateISO?: string, time?: string, priority?: Priority, projectId?: string) => void
}

const dateBounds = getSchedulableDateBounds()

export function TodoInput({ projects, onAdd }: TodoInputProps) {
  const [text, setText] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY)
  const [projectId, setProjectId] = useState(projects[0]?.id ?? DEFAULT_PROJECT_ID)

  useEffect(() => {
    if (!projects.some((p) => p.id === projectId)) {
      setProjectId(projects[0]?.id ?? DEFAULT_PROJECT_ID)
    }
  }, [projects, projectId])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const isScheduled = showSchedule && date
    onAdd(
      trimmed,
      isScheduled ? date : undefined,
      isScheduled && time ? time : undefined,
      priority,
      projectId,
    )
    setText('')
    setPriority(DEFAULT_PRIORITY)
  }

  const cancelSchedule = () => {
    setShowSchedule(false)
    setDate('')
    setTime('')
  }

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <div className="todo-input-row">
        <input
          className="app-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          autoFocus
        />
      </div>
      <div className="todo-options-row">
        <PrioritySelect
          value={priority}
          onChange={setPriority}
          ariaLabel="Priority for new task"
          variant="control"
        />
        <ProjectSelect
          value={projectId}
          projects={projects}
          onChange={setProjectId}
          ariaLabel="Project for new task"
          variant="control"
        />
        <button
          type="button"
          className={`schedule-toggle${showSchedule ? ' active' : ''}`}
          onClick={() => setShowSchedule((v) => !v)}
          aria-pressed={showSchedule}
          aria-label="Set a date and time for this task"
          title="Schedule Task"
        >
          <CalendarIcon size={16} />
        </button>
        <button type="submit" className="add-btn" disabled={!text.trim()}>
          Add
        </button>
      </div>
      {showSchedule && (
        <div className="schedule-row">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={dateBounds.min}
            max={dateBounds.max}
            aria-label="Task date"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Task time (optional)"
          />
          <button
            type="button"
            className="cancel-schedule-btn"
            onClick={cancelSchedule}
            aria-label="Don't schedule this task"
          >
            ×
          </button>
        </div>
      )}
    </form>
  )
}
