import type { ChangeEvent } from 'react'
import type { Project } from '../types'
import { projectColorStyle } from '../utils/projects'

interface ProjectSelectProps {
  value: string
  projects: Project[]
  onChange: (projectId: string) => void
  ariaLabel: string
  /** 'compact' (default) is the small pill sizing; 'control' matches toolbar-sized buttons. */
  variant?: 'compact' | 'control'
  autoFocus?: boolean
  onBlur?: () => void
}

/** A native select styled as a colored project badge (e.g. "💼 Work") that also serves as the editor. */
export function ProjectSelect({
  value,
  projects,
  onChange,
  ariaLabel,
  variant = 'compact',
  autoFocus,
  onBlur,
}: ProjectSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)
  const variantClass = variant === 'control' ? ' badge-pill--control' : ''
  const current = projects.find((p) => p.id === value) ?? projects[0]

  return (
    <select
      className={`badge-pill project-select${variantClass}`}
      style={current ? projectColorStyle(current) : undefined}
      value={value}
      onChange={handleChange}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      onBlur={onBlur}
    >
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.icon} {project.name}
        </option>
      ))}
    </select>
  )
}
