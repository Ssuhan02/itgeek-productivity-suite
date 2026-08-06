import { useState } from 'react'
import type { Project } from '../types'
import { projectColorStyle } from '../utils/projects'
import { ProjectSelect } from './ProjectSelect'

interface ProjectBadgeProps {
  value: string
  projects: Project[]
  onChange: (projectId: string) => void
  taskLabel: string
}

/** A compact colored project badge that turns into a select for editing, then reverts automatically. */
export function ProjectBadge({ value, projects, onChange, taskLabel }: ProjectBadgeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const current = projects.find((p) => p.id === value) ?? projects[0]

  if (isEditing) {
    return (
      <ProjectSelect
        value={value}
        projects={projects}
        onChange={(projectId) => {
          onChange(projectId)
          setIsEditing(false)
        }}
        ariaLabel={`Project for "${taskLabel}"`}
        autoFocus
        onBlur={() => setIsEditing(false)}
      />
    )
  }

  if (!current) return null

  return (
    <button
      type="button"
      className="badge-pill project-badge"
      style={projectColorStyle(current)}
      onClick={() => setIsEditing(true)}
      aria-label={`Project: ${current.name} for "${taskLabel}". Click to change.`}
      title={`Project: ${current.name}`}
    >
      {current.icon} {current.name}
    </button>
  )
}
