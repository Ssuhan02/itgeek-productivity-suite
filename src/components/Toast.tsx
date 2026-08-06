import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastTone = 'success' | 'neutral' | 'danger'

export interface ToastData {
  id: string
  message: string
  detail?: string
  actionLabel?: string
  onAction?: () => void
  duration: number
  tone?: ToastTone
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void
}

const EXIT_ANIMATION_MS = 200

/**
 * Single toast: glass card, optional Undo-style action, ✕ dismiss, and a
 * shrinking progress bar as the primary "time remaining" signal. Purely
 * presentational — ToastContext owns the list/timing contract, this just
 * renders one entry and animates itself out before asking to be removed.
 */
export function Toast({ id, message, detail, actionLabel, onAction, duration, tone = 'success', onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const hasRequestedDismiss = useRef(false)

  // Guarded by a ref (not the `isExiting` state) so this callback's identity
  // stays stable for the toast's whole lifetime — keeps the auto-dismiss
  // timer below from being cleared/re-armed every time exit starts.
  const requestDismiss = useCallback(() => {
    if (hasRequestedDismiss.current) return
    hasRequestedDismiss.current = true
    setIsExiting(true)
    setTimeout(() => onDismiss(id), EXIT_ANIMATION_MS)
  }, [id, onDismiss])

  useEffect(() => {
    const timer = setTimeout(requestDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, requestDismiss])

  return (
    <div
      className={`toast toast--${tone}${isExiting ? ' toast--exiting' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-body">
        <p className="toast-message">
          {tone === 'success' && <span aria-hidden="true">✓ </span>}
          {message}
        </p>
        {detail && <p className="toast-detail">{detail}</p>}
      </div>
      <div className="toast-actions">
        {actionLabel && onAction && (
          <button
            type="button"
            className="toast-action-btn"
            onClick={() => {
              onAction()
              requestDismiss()
            }}
          >
            {actionLabel}
          </button>
        )}
        <button type="button" className="toast-dismiss-btn" onClick={requestDismiss} aria-label="Dismiss notification">
          ×
        </button>
      </div>
      <div className="toast-progress" aria-hidden="true">
        <div className="toast-progress-fill" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  )
}
