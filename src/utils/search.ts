import type { Priority, Project, Todo } from '../types'
import { PRIORITY_LABELS } from './priority'

export interface SearchContext {
  projects: Project[]
}

/**
 * A search field extractor pulls one searchable string off a Todo (or undefined
 * if that field doesn't apply). Quick Search is scope-driven by SEARCH_FIELDS
 * below rather than hardcoded — to search a new field in a future version
 * (notes, subtasks, tags, attachments, ...), add one more extractor here.
 * The matching engine itself never needs to change.
 */
export type SearchFieldExtractor = (todo: Todo, ctx: SearchContext) => string | undefined

export const SEARCH_FIELDS: SearchFieldExtractor[] = [
  (todo) => todo.text,
  (todo, ctx) => ctx.projects.find((p) => p.id === todo.projectId)?.name,
  (todo) => PRIORITY_LABELS[todo.priority as Priority],
]

/** Trims and lowercases a raw query for case-insensitive partial matching. */
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

/** True if any searchable field on `todo` contains `normalizedQuery`. An empty query always matches. */
export function matchesSearch(todo: Todo, ctx: SearchContext, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true
  return SEARCH_FIELDS.some((extract) => {
    const value = extract(todo, ctx)
    return value ? value.toLowerCase().includes(normalizedQuery) : false
  })
}

/** Returns a new array; never mutates the input. An empty/blank query returns `todos` unchanged. */
export function searchTodos(todos: Todo[], ctx: SearchContext, query: string): Todo[] {
  const normalized = normalizeQuery(query)
  if (!normalized) return todos
  return todos.filter((todo) => matchesSearch(todo, ctx, normalized))
}
