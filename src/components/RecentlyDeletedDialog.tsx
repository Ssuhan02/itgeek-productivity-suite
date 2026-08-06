import type { DeletedTodo, Project } from '../types'
import { useExitAnimation } from '../hooks/useExitAnimation'
import { ModalOverlay } from './ModalOverlay'
import { RecentlyDeletedEmptyState } from './RecentlyDeletedEmptyState'
import { RecentlyDeletedItem } from './RecentlyDeletedItem'

interface RecentlyDeletedDialogProps {
  deletedTodos: DeletedTodo[]
  projects: Project[]
  onClose: () => void
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
}

export function RecentlyDeletedDialog({
  deletedTodos,
  projects,
  onClose,
  onRestore,
  onDeletePermanently,
}: RecentlyDeletedDialogProps) {
  const { animatingOutIds, animateThenRun } = useExitAnimation()

  // Sort newest-deleted first — most relevant to a user checking this view.
  const sorted = [...deletedTodos].sort((a, b) => b.deletedAt - a.deletedAt)

  return (
    <ModalOverlay
      panelClassName="recently-deleted-dialog"
      labelledBy="recently-deleted-title"
      onClose={onClose}
    >
      <div className={`dialog-header${sorted.length === 0 ? ' dialog-header--divided' : ''}`}>
        <h2 id="recently-deleted-title">🗂 Recently Deleted</h2>
        <button type="button" className="dialog-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      {sorted.length === 0 ? (
        <RecentlyDeletedEmptyState onClose={onClose} />
      ) : (
        <ul className="recently-deleted-list">
          {sorted.map((entry) => (
            <RecentlyDeletedItem
              key={entry.todo.id}
              entry={entry}
              projects={projects}
              isAnimatingOut={animatingOutIds.has(entry.todo.id)}
              onRestore={(id) => animateThenRun(id, () => onRestore(id))}
              onDeletePermanently={(id) => animateThenRun(id, () => onDeletePermanently(id))}
            />
          ))}
        </ul>
      )}
    </ModalOverlay>
  )
}
