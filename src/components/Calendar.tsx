import { useMemo, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import type { Todo } from '../types'
import {
  getMonthGrid,
  MONTH_LABELS,
  SCHEDULING_YEARS_RANGE,
  toISODate,
  WEEKDAY_LABELS,
} from '../utils/date'

interface CalendarProps {
  todos: Todo[]
  selectedDate: string | null
  onSelectDate: (dateISO: string) => void
  onScheduleTask: (id: string, dateISO: string) => void
}

export function Calendar({ todos, selectedDate, onSelectDate, onScheduleTask }: CalendarProps) {
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const days = useMemo(() => getMonthGrid(year, month), [year, month])
  const todayISO = toISODate(today)

  const minYear = today.getFullYear() - SCHEDULING_YEARS_RANGE
  const maxYear = today.getFullYear() + SCHEDULING_YEARS_RANGE
  const yearOptions = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear],
  )

  const clampToRange = (date: Date) => {
    if (date.getFullYear() < minYear) return new Date(minYear, 0, 1)
    if (date.getFullYear() > maxYear) return new Date(maxYear, 11, 1)
    return date
  }

  const datesWithTasks = useMemo(() => {
    const set = new Set<string>()
    for (const todo of todos) {
      if (todo.scheduledDate) set.add(todo.scheduledDate)
    }
    return set
  }, [todos])

  const datesWithHighPriority = useMemo(() => {
    const set = new Set<string>()
    for (const todo of todos) {
      if (todo.scheduledDate && todo.priority === 'high') set.add(todo.scheduledDate)
    }
    return set
  }, [todos])

  const goToMonth = (delta: number) => {
    setViewDate((prev) => clampToRange(new Date(prev.getFullYear(), prev.getMonth() + delta, 1)))
  }

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setViewDate(clampToRange(new Date(year, Number(e.target.value), 1)))
  }

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setViewDate(clampToRange(new Date(Number(e.target.value), month, 1)))
  }

  const handleDrop = (dateISO: string, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) onScheduleTask(id, dateISO)
    setDragOverDate(null)
  }

  const atMin = year === minYear && month === 0
  const atMax = year === maxYear && month === 11

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          disabled={atMin}
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="calendar-month-year">
          <select value={month} onChange={handleMonthChange} aria-label="Month">
            {MONTH_LABELS.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
          <select value={year} onChange={handleYearChange} aria-label="Year">
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={() => goToMonth(1)} disabled={atMax} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="weekday">
            {label}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((date) => {
          const dateISO = toISODate(date)
          const inMonth = date.getMonth() === month
          const classes = [
            'calendar-day',
            !inMonth && 'outside',
            dateISO === todayISO && 'today',
            datesWithTasks.has(dateISO) && 'has-tasks',
            datesWithHighPriority.has(dateISO) && 'has-high-priority',
            dateISO === selectedDate && 'selected',
            dragOverDate === dateISO && 'drag-over',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={dateISO}
              className={classes}
              onClick={() => onSelectDate(dateISO)}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverDate(dateISO)
              }}
              onDragLeave={() => setDragOverDate((prev) => (prev === dateISO ? null : prev))}
              onDrop={(e) => handleDrop(dateISO, e)}
            >
              <span className="day-number">{date.getDate()}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
