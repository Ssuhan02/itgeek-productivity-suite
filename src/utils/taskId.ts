/** Zero-pads a task number into its display form: 1 -> "TSK-000001". */
export function formatTaskId(n: number): string {
  return `TSK-${String(n).padStart(6, '0')}`
}

/**
 * The next task number to assign, derived from whatever `taskId`s already
 * exist rather than a separately-persisted counter — so there's nothing to
 * get out of sync with localStorage, and it works identically whether
 * called for a brand-new task or while migrating a batch of old ones.
 */
export function nextTaskNumber(todos: { taskId?: string }[]): number {
  let max = 0
  for (const todo of todos) {
    const match = todo.taskId?.match(/^TSK-(\d+)$/)
    if (!match) continue
    const n = parseInt(match[1], 10)
    if (n > max) max = n
  }
  return max + 1
}
