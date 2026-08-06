interface RestoreButtonProps {
  onClick: () => void
  ariaLabel: string
}

/** Reusable "Restore" action — instant, no confirmation (matches spec: only permanent delete needs one). */
export function RestoreButton({ onClick, ariaLabel }: RestoreButtonProps) {
  return (
    <button type="button" className="dialog-btn dialog-btn--neutral restore-btn" onClick={onClick} aria-label={ariaLabel}>
      Restore
    </button>
  )
}
