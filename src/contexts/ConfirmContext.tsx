import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { ConfirmOptions } from '../components/ConfirmDialog'
import { ConfirmContext } from '../hooks/useConfirm'

/**
 * Mounts a single, shared <ConfirmDialog/> and exposes a promise-based
 * `requestConfirm()` via useConfirm() to any component at any nesting depth —
 * no prop drilling required. This is what lets a future feature (e.g. deleting
 * a project from inside ManageProjectsDialog) reuse the exact same dialog
 * without App.tsx knowing about it.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const requestConfirm = useCallback((next: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setOptions(next)
    })
  }, [])

  const settle = (value: boolean) => {
    resolveRef.current?.(value)
    resolveRef.current = null
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={{ requestConfirm }}>
      {children}
      <ConfirmDialog
        isOpen={options !== null}
        title={options?.title ?? ''}
        message={options?.message ?? ''}
        itemLabel={options?.itemLabel}
        detail={options?.detail}
        confirmLabel={options?.confirmLabel}
        cancelLabel={options?.cancelLabel}
        tone={options?.tone}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  )
}
