import { createContext, useContext } from 'react'
import type { ToastTone } from '../components/Toast'

export interface ShowToastOptions {
  message: string
  detail?: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
  tone?: ToastTone
}

export interface ToastContextValue {
  showToast: (options: ShowToastOptions) => string
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
