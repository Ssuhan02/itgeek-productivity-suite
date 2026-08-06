import { useCallback, useEffect, useRef } from 'react'
import type { DeletedTodo, Todo } from '../types'
import { useLocalStorage } from './useLocalStorage'

const RETENTION_MS = 24 * 60 * 60 * 1000
const SWEEP_INTERVAL_MS = 60_000

function purgeExpired(entries: DeletedTodo[]): DeletedTodo[] {
  const now = Date.now()
  const next = entries.filter((entry) => entry.expiresAt > now)
  return next.length === entries.length ? entries : next
}

interface UseRecentlyDeletedResult {
  deletedTodos: DeletedTodo[]
  /** Archives `todo` — called once the 5s undo window elapses uninterrupted. */
  moveToRecentlyDeleted: (todo: Todo, originalIndex: number) => void
  /** Removes the entry and returns its `Todo` so the caller can re-add it to the active list. */
  restoreFromRecentlyDeleted: (id: string) => Todo | undefined
  /** Permanently, irreversibly removes the entry. */
  deletePermanently: (id: string) => void
}

/**
 * Owns the 24-hour Recently Deleted archive: its own localStorage key,
 * startup cleanup (via useLocalStorage's existing migrate param), and a
 * periodic sweep while the app stays open. Independent of the 5s undo
 * mechanism (useUndoableDelete) — that hook only decides *when* to call
 * moveToRecentlyDeleted; everything after that lives here.
 */
export function useRecentlyDeleted(): UseRecentlyDeletedResult {
  const [deletedTodos, setDeletedTodos] = useLocalStorage<DeletedTodo[]>('deletedTodos', [], purgeExpired)
  const deletedTodosRef = useRef(deletedTodos)
  deletedTodosRef.current = deletedTodos

  // Periodic sweep — catches expiries that occur while the tab stays open.
  // The startup case (tab was closed past expiry) is covered by the
  // purgeExpired migrate step above, which runs once on load.
  useEffect(() => {
    const interval = setInterval(() => {
      setDeletedTodos((prev) => purgeExpired(prev))
    }, SWEEP_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [setDeletedTodos])

  const moveToRecentlyDeleted = useCallback(
    (todo: Todo, originalIndex: number) => {
      const deletedAt = Date.now()
      setDeletedTodos((prev) => [
        ...prev,
        { todo, deletedAt, expiresAt: deletedAt + RETENTION_MS, originalIndex },
      ])
    },
    [setDeletedTodos],
  )

  const restoreFromRecentlyDeleted = useCallback(
    (id: string) => {
      const entry = deletedTodosRef.current.find((d) => d.todo.id === id)
      if (!entry) return undefined
      setDeletedTodos((prev) => prev.filter((d) => d.todo.id !== id))
      return entry.todo
    },
    [setDeletedTodos],
  )

  const deletePermanently = useCallback(
    (id: string) => {
      setDeletedTodos((prev) => prev.filter((d) => d.todo.id !== id))
    },
    [setDeletedTodos],
  )

  return { deletedTodos, moveToRecentlyDeleted, restoreFromRecentlyDeleted, deletePermanently }
}
