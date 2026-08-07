import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode, RefObject } from 'react'
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock'
import './Dialog.css'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  /** Called whenever the user tries to close via ESC or a backdrop click,
   * before `onClose` actually runs — return (or resolve) `false` to block
   * the close, e.g. to show an "unsaved changes" confirmation first. If
   * omitted, closing proceeds immediately. Consumers that close via their
   * own explicit buttons (Save/Cancel) should run this same check
   * themselves before calling `onClose`, since those don't go through
   * this prop. */
  beforeClose?: () => boolean | Promise<boolean>
  labelledBy: string
  describedBy?: string
  /** Element to focus when the dialog opens. Defaults to the first
   * focusable element inside the panel. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Extra class(es) for the panel — sizing, section-specific layout,
   * anything beyond the shared chrome this component already provides. */
  className?: string
  children: ReactNode
}

/**
 * The application's standard modal primitive: dark blurred backdrop, a
 * centered glass panel with a fade + scale entrance, focus trap, ESC /
 * backdrop-click closing (gated by `beforeClose` when given), background
 * scroll lock while open, and focus restoration to whatever had focus
 * right before the dialog opened (e.g. the task row that triggered it) once
 * it closes.
 *
 * Domain-agnostic on purpose — it renders `children` as-is and knows
 * nothing about tasks, projects, or any other app concept. TaskDetails is
 * the first consumer; Personal Finance, Settings, Profile, and (eventually)
 * the existing confirm/manage-projects/recently-deleted dialogs are meant
 * to build on this same primitive rather than each styling their own
 * overlay + panel from scratch.
 */
export function Dialog({
  isOpen,
  onClose,
  beforeClose,
  labelledBy,
  describedBy,
  initialFocusRef,
  className,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const target = initialFocusRef?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    target?.focus()

    return () => {
      previouslyFocused.current?.focus()
    }
    // `initialFocusRef` is a ref object with a stable identity for the
    // dialog's lifetime, so including it doesn't cause re-runs in practice.
  }, [isOpen, initialFocusRef])

  const attemptClose = async () => {
    if (beforeClose) {
      const canClose = await beforeClose()
      if (!canClose) return
    }
    onClose()
  }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      void attemptClose()
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

  if (!isOpen) return null

  return (
    <div
      className="ui-dialog__overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) void attemptClose()
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        className={`ui-dialog__panel${className ? ` ${className}` : ''}`}
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
