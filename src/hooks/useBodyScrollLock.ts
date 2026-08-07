import { useEffect } from 'react'

// Module-level, reference-counted rather than per-hook-instance: if two
// locks are ever active at once (e.g. a confirm dialog opens on top of an
// already-open Task Details dialog), the second one shouldn't stomp on and
// then prematurely restore the first one's saved `overflow` value.
let lockCount = 0
let previousOverflow = ''

/** Locks page scroll (`document.body`'s overflow) while `locked` is true,
 * restoring whatever it was before on unlock/unmount. */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount++

    return () => {
      lockCount--
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [locked])
}
