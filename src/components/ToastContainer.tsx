import { Toast } from './Toast'
import type { ToastData } from './Toast'

interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

/**
 * Positions and stacks the active toast list — fixed bottom-right on desktop/
 * tablet, bottom-center on mobile (via the app's existing ≤480px breakpoint
 * tier). Rendering an array here, not a single slot, is what makes stacked/
 * simultaneous toasts (Feature 14) already work with no extra plumbing.
 */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
