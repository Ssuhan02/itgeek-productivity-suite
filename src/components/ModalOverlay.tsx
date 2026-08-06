import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

interface ModalOverlayProps {
  panelClassName?: string
  labelledBy: string
  describedBy?: string
  initialFocusRef?: React.RefObject<HTMLElement | null>
  onClose: () => void
  children: ReactNode
}

/**
 * Generic modal primitive: backdrop + centered panel, focus trap, ESC to close,
 * backdrop-click to close, and focus restoration on unmount. Reuses the app's
 * existing `.dialog-overlay` / `.dialog-panel` glass styling (already proven by
 * ManageProjectsDialog) rather than duplicating it — `panelClassName` lets a
 * specific dialog (like ConfirmDialog) add its own sizing/animation on top
 * without touching the shared base rules.
 */
export function ModalOverlay({
  panelClassName,
  labelledBy,
  describedBy,
  initialFocusRef,
  onClose,
  children,
}: ModalOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null
    const target = initialFocusRef?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    target?.focus()

    return () => {
      previouslyFocused.current?.focus()
    }
    // `initialFocusRef` is a ref object with a stable identity for the
    // dialog's lifetime, so including it doesn't cause re-runs in practice.
  }, [initialFocusRef])

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !panelRef.current) return

    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('disabled'),
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        className={`dialog-panel${panelClassName ? ` ${panelClassName}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        {children}
      </div>
    </div>
  )
}
