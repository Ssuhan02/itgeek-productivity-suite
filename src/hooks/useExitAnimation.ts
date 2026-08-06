import { useCallback, useState } from 'react'

const DEFAULT_DURATION_MS = 240

/**
 * Small reusable "animate, then commit" helper: mark an id as animating out,
 * apply whatever CSS class that drives, then run the real state-changing
 * action after the animation's duration elapses. Generalizes the pattern
 * already used ad hoc for task-row deletion and toast dismissal.
 */
export function useExitAnimation(durationMs: number = DEFAULT_DURATION_MS) {
  const [animatingOutIds, setAnimatingOutIds] = useState<Set<string>>(new Set())

  const animateThenRun = useCallback(
    (id: string, action: () => void) => {
      setAnimatingOutIds((prev) => new Set(prev).add(id))
      setTimeout(() => {
        setAnimatingOutIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        action()
      }, durationMs)
    },
    [durationMs],
  )

  return { animatingOutIds, animateThenRun }
}
