interface RecentlyDeletedEmptyStateProps {
  onClose: () => void
}

/**
 * Rich, purpose-built empty view for RecentlyDeletedDialog only — distinct
 * from the generic EmptyState (still used as-is by TodoList for its simpler
 * cases). The illustration is pure CSS (gradient ring + badge + sparkles),
 * reusing the app's existing accent tokens and the same 🗂️ emoji already
 * used for this feature elsewhere — no external image, no new icon asset.
 */
export function RecentlyDeletedEmptyState({ onClose }: RecentlyDeletedEmptyStateProps) {
  return (
    <div className="recently-deleted-empty-state">
      <div className="empty-state-illustration" aria-hidden="true">
        <div className="empty-state-illustration-ring" />
        <div className="empty-state-illustration-badge">
          <span className="empty-state-illustration-icon">🗂️</span>
        </div>
        <span className="empty-state-illustration-sparkle empty-state-illustration-sparkle--1" />
        <span className="empty-state-illustration-sparkle empty-state-illustration-sparkle--2" />
        <span className="empty-state-illustration-sparkle empty-state-illustration-sparkle--3" />
      </div>

      <h3 className="recently-deleted-empty-title">No recently deleted tasks</h3>
      <p className="recently-deleted-empty-description">
        Tasks you delete will appear here and remain available for restoration for the next 24 hours.
      </p>

      <div className="empty-state-info-card">
        <span aria-hidden="true">🕒</span>
        <span>Deleted tasks are automatically removed after 24 hours.</span>
      </div>

      <button type="button" className="dialog-btn dialog-btn--neutral" onClick={onClose}>
        Close
      </button>
    </div>
  )
}
