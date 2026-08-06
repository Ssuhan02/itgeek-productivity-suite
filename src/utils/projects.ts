import type { CSSProperties } from 'react'
import type { Project } from '../types'

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'work', name: 'Work', icon: '💼', color: '#4f6bed' },
  { id: 'personal', name: 'Personal', icon: '🏠', color: '#d6548a' },
  { id: 'learning', name: 'Learning', icon: '📚', color: '#d98c2b' },
  { id: 'shopping', name: 'Shopping', icon: '🛒', color: '#0f9488' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#06b6d4' },
  { id: 'health', name: 'Health', icon: '💪', color: '#e2583f' },
]

export const DEFAULT_PROJECT_ID = 'work'

/** Curated swatches offered in the "change color" / "new project" pickers. */
export const PROJECT_COLOR_PALETTE = [
  '#4f6bed',
  '#d6548a',
  '#d98c2b',
  '#0f9488',
  '#06b6d4',
  '#e2583f',
  '#8b5cf6',
  '#64748b',
  '#65a30d',
  '#db2777',
]

/** Curated emoji offered in the "change icon" / "new project" pickers. */
export const PROJECT_ICON_OPTIONS = [
  '💼', '🏠', '📚', '🛒', '✈️', '💪',
  '🎯', '🎨', '🎵', '🍔', '⚽', '🐶',
  '💡', '🔧', '🌱', '💰', '📷', '🎮',
]

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** CSS custom properties consumed by .project-select / .project-badge in App.css. */
export function projectColorStyle(project: Project): CSSProperties {
  return {
    '--proj-color': project.color,
    '--proj-bg': hexToRgba(project.color, 0.14),
    '--proj-border': hexToRgba(project.color, 0.35),
  } as CSSProperties
}
