import { useCallback, useEffect, useRef, useState } from 'react'

interface UseUndoableDeleteOptions<T> {
  /** Called once the grace period elapses with no undo — perform the real, permanent removal here. */
  onCommit: (item: T) => void
}

interface UseUndoableDeleteResult<T> {
  /** Ids currently in their undo grace period — exclude these from any rendered/derived view. */
  pendingIds: Set<string>
  /** Starts the grace period for `item`; onCommit fires after `durationMs` unless `undo(item.id)` is called first. */
  requestDelete: (item: T, durationMs: number) => void
  /** Cancels the pending deletion for `id`, if any — the item was never actually removed, so this just un-hides it. */
  undo: (id: string) => void
}

/**
 * Generic deferred-deletion manager: works on any `{ id: string }`-shaped item,
 * not just Todos. The item itself is never touched — callers exclude
 * `pendingIds` from what they render, and only `onCommit` performs the actual
 * permanent removal (e.g. writing to localStorage). This is what makes Undo
 * restore everything (title, fields, list position, ...) automatically: the
 * source data was never mutated in the first place, just hidden.
 */
export function useUndoableDelete<T extends { id: string }>({
  onCommit,
}: UseUndoableDeleteOptions<T>): UseUndoableDeleteResult<T> {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const items = useRef<Map<string, T>>(new Map())
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const clearTimer = (id: string) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }

  const commit = useCallback(
    (id: string) => {
      const item = items.current.get(id)
      clearTimer(id)
      items.current.delete(id)
      setPendingIds((prev) => {
        if (!prev.has(id)) return prev
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      if (item) onCommit(item)
    },
    [onCommit],
  )

  const requestDelete = useCallback(
    (item: T, durationMs: number) => {
      items.current.set(item.id, item)
      setPendingIds((prev) => new Set(prev).add(item.id))
      clearTimer(item.id)
      timers.current.set(
        item.id,
        setTimeout(() => commit(item.id), durationMs),
      )
    },
    [commit],
  )

  const undo = useCallback((id: string) => {
    clearTimer(id)
    items.current.delete(id)
    setPendingIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  // Cancel any outstanding timers if the owning component unmounts.
  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return { pendingIds, requestDelete, undo }
}
