import type { SortOption, Todo } from '../types'
import { PRIORITY_ORDER } from './priority'

/** Returns a new array; never mutates the input. */
export function sortTodos(todos: Todo[], sort: SortOption): Todo[] {
  const sorted = [...todos]

  switch (sort) {
    case 'priority':
      sorted.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
      break
    case 'dueDate':
      sorted.sort((a, b) => {
        if (!a.scheduledDate && !b.scheduledDate) return 0
        if (!a.scheduledDate) return 1
        if (!b.scheduledDate) return -1
        const aKey = a.scheduledDate + (a.scheduledTime ?? '')
        const bKey = b.scheduledDate + (b.scheduledTime ?? '')
        return aKey.localeCompare(bKey)
      })
      break
    case 'newest':
      sorted.sort((a, b) => b.createdAt - a.createdAt)
      break
    case 'oldest':
      sorted.sort((a, b) => a.createdAt - b.createdAt)
      break
    case 'alphabetical':
      sorted.sort((a, b) => a.text.localeCompare(b.text))
      break
  }

  return sorted
}
