import { createContext, useContext } from 'react'
import type { ConfirmOptions } from '../components/ConfirmDialog'

export interface ConfirmContextValue {
  /** Opens the shared confirm dialog and resolves `true`/`false` once the user answers. */
  requestConfirm: (options: ConfirmOptions) => Promise<boolean>
}

export const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider')
  return ctx
}
