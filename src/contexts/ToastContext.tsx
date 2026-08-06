import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContainer } from '../components/ToastContainer'
import type { ToastData } from '../components/Toast'
import { ToastContext } from '../hooks/useToast'
import type { ShowToastOptions } from '../hooks/useToast'

const DEFAULT_TOAST_DURATION_MS = 5000

/**
 * Holds the active toast list and renders the positioned <ToastContainer/>
 * once. Mounted in main.tsx, wrapping <App/>, so useToast() works from any
 * component depth. Array-based state means multiple simultaneous toasts
 * (Feature 14) are already supported — no extra work needed later.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [
      ...prev,
      {
        id,
        message: options.message,
        detail: options.detail,
        actionLabel: options.actionLabel,
        onAction: options.onAction,
        duration: options.duration ?? DEFAULT_TOAST_DURATION_MS,
        tone: options.tone ?? 'success',
      },
    ])
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
