import { formatTaskId } from '../utils/taskId'
import type { Priority, Todo } from '../types'

/**
 * DEV-ONLY fixture data — 20 realistic tasks so pagination (5/page, 4
 * pages) and the fixed-height list have something real to test against
 * without hand-typing tasks every time.
 *
 * This file is only ever imported behind an `import.meta.env.DEV` check
 * (see TodoPage.tsx), so Vite/Rollup statically strips it from production
 * builds — it never ships. To disable or remove it entirely: delete this
 * file and the `initialTodos` block that imports it in TodoPage.tsx.
 */

interface SampleTask {
  text: string
  priority: Priority
  projectId: string
  completed?: boolean
}

// projectId values match DEFAULT_PROJECTS in utils/projects.ts.
const SAMPLE_TASKS: SampleTask[] = [
  { text: 'Book Hotel for Tokyo Trip', priority: 'high', projectId: 'travel' },
  { text: 'Schedule Project Kickoff Meeting', priority: 'high', projectId: 'work' },
  { text: 'Submit Monthly Expense Report', priority: 'medium', projectId: 'work' },
  { text: 'Renew Passport', priority: 'high', projectId: 'travel' },
  { text: 'Review Azure Migration Plan', priority: 'high', projectId: 'work' },
  { text: 'Prepare PMP Study Schedule', priority: 'medium', projectId: 'learning' },
  { text: 'Complete Japanese Lesson 15', priority: 'medium', projectId: 'learning' },
  { text: 'Buy Groceries for the Week', priority: 'low', projectId: 'shopping' },
  { text: 'Call Internet Service Provider', priority: 'medium', projectId: 'personal' },
  { text: 'Update LinkedIn Profile', priority: 'low', projectId: 'work', completed: true },
  { text: 'Backup Laptop Files', priority: 'medium', projectId: 'personal', completed: true },
  { text: 'Pay Credit Card Bill', priority: 'high', projectId: 'personal' },
  { text: 'Review Git Pull Requests', priority: 'high', projectId: 'work' },
  { text: 'Organize Project Documentation', priority: 'low', projectId: 'work' },
  { text: 'Create Weekly Team Report', priority: 'medium', projectId: 'work' },
  { text: 'Plan Weekend Trip to Hakone', priority: 'low', projectId: 'travel' },
  { text: 'Schedule Dental Appointment', priority: 'medium', projectId: 'health' },
  { text: 'Research Cloudflare Pages Features', priority: 'low', projectId: 'learning' },
  { text: 'Clean Workspace', priority: 'low', projectId: 'personal', completed: true },
  { text: 'Watch Microsoft Build Session', priority: 'low', projectId: 'learning' },
]

// The /* @__PURE__ */ hint tells Rollup/esbuild this call has no side
// effects, so when `DEV_SAMPLE_TODOS` itself turns out to be unused (i.e.
// production builds, where TodoPage's `import.meta.env.DEV` check folds to
// `false`), the whole computation — and every string above — is eligible
// to be dropped, not just the now-dead reference to it.
export const DEV_SAMPLE_TODOS: Todo[] = /* @__PURE__ */ SAMPLE_TASKS.map((task, index) => {
  // Staggered, oldest-first creation timestamps so default sorting reads
  // naturally instead of every task sharing one instant.
  const createdAt = Date.now() - (SAMPLE_TASKS.length - index) * 60 * 60 * 1000
  const completed = task.completed ?? false
  return {
    id: `dev-sample-${index + 1}`,
    taskId: formatTaskId(index + 1),
    text: task.text,
    completed,
    createdAt,
    updatedAt: createdAt,
    priority: task.priority,
    projectId: task.projectId,
    description: '',
    notes: '',
    status: completed ? 'completed' : 'active',
  }
})
