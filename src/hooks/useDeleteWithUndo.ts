import { useCallback, useState } from 'react'
import type { Todo } from '../types'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'
import { useUndoableDelete } from './useUndoableDelete'

const EXIT_ANIMATION_MS = 240 // keep in sync with .todo-item--deleting's transition-duration in App.css
const RESTORE_ANIMATION_MS = 280 // keep in sync with .todo-item--restoring's animation-duration in App.css
const UNDO_WINDOW_MS = 5000

/** Wraps the todo + its pre-deletion array index so useUndoableDelete can carry both through untouched. */
interface PendingTodoDelete {
  id: string
  todo: Todo
  originalIndex: number
}

interface UseDeleteWithUndoOptions {
  /** Called once the 5s undo window elapses uninterrupted — move the task into Recently Deleted here. */
  onCommit: (todo: Todo, originalIndex: number) => void
}

interface UseDeleteWithUndoResult {
  /** Ids currently mid-exit-animation (~240ms) — apply the .todo-item--deleting class for these. */
  animatingOutIds: Set<string>
  /** Ids that just came back via Undo (~280ms) — apply the .todo-item--restoring class for these. */
  restoringIds: Set<string>
  /** Ids currently in their 5s undo window — exclude these from every rendered/derived view. */
  pendingDeleteIds: Set<string>
  /** Opens the confirm dialog for `todo`; on confirm, animates it out and starts the undo window. */
  requestDeleteTodo: (todo: Todo, originalIndex: number) => Promise<void>
}

/**
 * Composes useConfirm + useUndoableDelete + useToast into the full task-delete
 * flow: confirm → exit animation → undo-window toast → commit (move to
 * Recently Deleted) or undo. Keeps App.tsx down to calling this hook instead
 * of owning all of this logic inline.
 */
export function useDeleteWithUndo({ onCommit }: UseDeleteWithUndoOptions): UseDeleteWithUndoResult {
  const { requestConfirm } = useConfirm()
  const { showToast } = useToast()

  const handleCommit = useCallback(
    (pending: PendingTodoDelete) => onCommit(pending.todo, pending.originalIndex),
    [onCommit],
  )
  const { pendingIds: pendingDeleteIds, requestDelete, undo } = useUndoableDelete<PendingTodoDelete>({
    onCommit: handleCommit,
  })
  const [animatingOutIds, setAnimatingOutIds] = useState<Set<string>>(new Set())
  const [restoringIds, setRestoringIds] = useState<Set<string>>(new Set())

  const undoDelete = useCallback((id: string) => {
    undo(id)
    setRestoringIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setRestoringIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, RESTORE_ANIMATION_MS)
  }, [undo])

  const requestDeleteTodo = useCallback(
    async (todo: Todo, originalIndex: number) => {
      const confirmed = await requestConfirm({
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task?',
        itemLabel: `"${todo.text}"`,
        detail: 'This task can be restored for the next 24 hours.',
        confirmLabel: '🗑 Delete Task',
        tone: 'danger',
      })
      if (!confirmed) return

      setAnimatingOutIds((prev) => new Set(prev).add(todo.id))
      setTimeout(() => {
        setAnimatingOutIds((prev) => {
          const next = new Set(prev)
          next.delete(todo.id)
          return next
        })
        requestDelete({ id: todo.id, todo, originalIndex }, UNDO_WINDOW_MS)
        showToast({
          message: 'Task moved to Recently Deleted',
          detail: `"${todo.text}"`,
          actionLabel: 'Undo',
          duration: UNDO_WINDOW_MS,
          onAction: () => undoDelete(todo.id),
        })
      }, EXIT_ANIMATION_MS)
    },
    [requestConfirm, requestDelete, showToast, undoDelete],
  )

  return { animatingOutIds, restoringIds, pendingDeleteIds, requestDeleteTodo }
}
