import { useRef } from 'react'
import { ModalOverlay } from './ModalOverlay'

export interface ConfirmOptions {
  title: string
  message: string
  /** e.g. the quoted task title — rendered as its own emphasized line. */
  itemLabel?: string
  /** Small supporting line below the message, e.g. the Undo-window notice. */
  detail?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Controls the confirm button's styling. Defaults to 'danger'. */
  tone?: 'danger' | 'neutral'
}

interface ConfirmDialogProps extends ConfirmOptions {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Generic, reusable confirmation dialog — not tied to task deletion. Any future
 * destructive (or non-destructive) confirmation can reuse this component as-is
 * by passing different copy; see ConfirmContext for the recommended way to
 * invoke it (`useConfirm().requestConfirm({...})`) without prop drilling.
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  itemLabel,
  detail,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  if (!isOpen) return null

  return (
    <ModalOverlay
      panelClassName="confirm-dialog"
      labelledBy="confirm-dialog-title"
      describedBy="confirm-dialog-message"
      initialFocusRef={cancelRef}
      onClose={onCancel}
    >
      <div className="dialog-header">
        <h2 id="confirm-dialog-title">{title}</h2>
      </div>
      <div className="confirm-dialog-body" id="confirm-dialog-message">
        <p>{message}</p>
        {itemLabel && <p className="confirm-dialog-item">{itemLabel}</p>}
        {detail && <p className="confirm-dialog-detail">{detail}</p>}
      </div>
      <div className="confirm-dialog-actions">
        <button ref={cancelRef} type="button" className="dialog-btn dialog-btn--neutral" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`dialog-btn dialog-btn--${tone}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalOverlay>
  )
}
