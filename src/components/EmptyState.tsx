interface EmptyStateProps {
  icon?: string
  title: string
  hint?: string
  className?: string
}

/**
 * Reusable empty-state block: optional icon, a title line, an optional hint
 * line. Used for the plain "no tasks" and "no search results" states in
 * TodoList, and for Recently Deleted's empty state — one component, one set
 * of CSS rules, instead of duplicated inline markup per feature.
 */
export function EmptyState({ icon, title, hint, className }: EmptyStateProps) {
  return (
    <div className={`empty-state${className ? ` ${className}` : ''}`}>
      {icon && (
        <span className="empty-state-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <p>{title}</p>
      {hint && <p className="empty-state-hint">{hint}</p>}
    </div>
  )
}
