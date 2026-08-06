import { useConfirm } from '../hooks/useConfirm'

interface DeleteForeverButtonProps {
  itemLabel: string
  onConfirmedDelete: () => void
  ariaLabel: string
}

/**
 * Reusable "Delete Permanently" action — owns its own confirm step via
 * useConfirm(), so it's a genuine drop-in for any future "permanently delete
 * X" button, not just Recently Deleted tasks. Callers never need to wire up
 * their own confirmation dialog.
 */
export function DeleteForeverButton({ itemLabel, onConfirmedDelete, ariaLabel }: DeleteForeverButtonProps) {
  const { requestConfirm } = useConfirm()

  const handleClick = async () => {
    const confirmed = await requestConfirm({
      title: 'Delete Permanently',
      message: 'This action cannot be undone.',
      itemLabel,
      detail: 'This task will be permanently removed and cannot be recovered.',
      confirmLabel: '🗑 Delete Permanently',
      tone: 'danger',
    })
    if (confirmed) onConfirmedDelete()
  }

  return (
    <button type="button" className="dialog-btn dialog-btn--danger delete-forever-btn" onClick={handleClick} aria-label={ariaLabel}>
      Delete Permanently
    </button>
  )
}
