import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Project } from '../types'
import { hexToRgba, PROJECT_COLOR_PALETTE, PROJECT_ICON_OPTIONS, projectColorStyle } from '../utils/projects'
import { TrashIcon } from './icons/TrashIcon'

interface ManageProjectsDialogProps {
  projects: Project[]
  onClose: () => void
  onAddProject: (name: string, icon: string, color: string) => void
  onRenameProject: (id: string, name: string) => void
  onUpdateProject: (id: string, changes: Partial<Pick<Project, 'icon' | 'color'>>) => void
  onDeleteProject: (id: string) => void
}

type OpenPicker = { rowId: string; kind: 'icon' | 'color' } | null

const NEW_ROW_ID = '__new__'

export function ManageProjectsDialog({
  projects,
  onClose,
  onAddProject,
  onRenameProject,
  onUpdateProject,
  onDeleteProject,
}: ManageProjectsDialogProps) {
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState(PROJECT_ICON_OPTIONS[0])
  const [newColor, setNewColor] = useState(PROJECT_COLOR_PALETTE[0])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const togglePicker = (rowId: string, kind: 'icon' | 'color') => {
    setOpenPicker((prev) => (prev?.rowId === rowId && prev.kind === kind ? null : { rowId, kind }))
  }

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddProject(trimmed, newIcon, newColor)
    setNewName('')
    setNewIcon(PROJECT_ICON_OPTIONS[0])
    setNewColor(PROJECT_COLOR_PALETTE[0])
    setOpenPicker(null)
  }

  return (
    <div
      className="dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="manage-projects-title">
        <div className="dialog-header">
          <h2 id="manage-projects-title">Manage Projects</h2>
          <button type="button" className="dialog-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="project-manager-list">
          {projects.map((project) => (
            <div key={project.id} className="project-row">
              <button
                type="button"
                className="project-icon-btn"
                style={projectColorStyle(project)}
                onClick={() => togglePicker(project.id, 'icon')}
                aria-label={`Change icon for ${project.name}`}
                title="Change icon"
              >
                {project.icon}
              </button>
              <input
                type="text"
                className="project-name-input"
                defaultValue={project.name}
                onBlur={(e) => onRenameProject(project.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                }}
                aria-label={`Rename project ${project.name}`}
              />
              <button
                type="button"
                className="project-color-swatch"
                style={{ background: project.color }}
                onClick={() => togglePicker(project.id, 'color')}
                aria-label={`Change color for ${project.name}`}
                title="Change color"
              />
              <button
                type="button"
                className="delete-btn"
                onClick={() => onDeleteProject(project.id)}
                disabled={projects.length <= 1}
                aria-label={`Delete project ${project.name}`}
                title={projects.length <= 1 ? 'At least one project is required' : 'Delete project'}
              >
                <TrashIcon />
              </button>

              {openPicker?.rowId === project.id && openPicker.kind === 'icon' && (
                <div className="picker-grid">
                  {PROJECT_ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option${icon === project.icon ? ' selected' : ''}`}
                      onClick={() => {
                        onUpdateProject(project.id, { icon })
                        setOpenPicker(null)
                      }}
                      aria-label={`Use icon ${icon}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
              {openPicker?.rowId === project.id && openPicker.kind === 'color' && (
                <div className="picker-grid">
                  {PROJECT_COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option${color === project.color ? ' selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => {
                        onUpdateProject(project.id, { color })
                        setOpenPicker(null)
                      }}
                      aria-label={`Use color ${color}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="add-project-form">
          <button
            type="button"
            className="project-icon-btn"
            style={
              {
                '--proj-color': newColor,
                '--proj-bg': hexToRgba(newColor, 0.14),
                '--proj-border': hexToRgba(newColor, 0.35),
              } as CSSProperties
            }
            onClick={() => togglePicker(NEW_ROW_ID, 'icon')}
            aria-label="Choose icon for new project"
            title="Choose icon"
          >
            {newIcon}
          </button>
          <input
            type="text"
            className="project-name-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
            placeholder="New project name..."
            aria-label="New project name"
          />
          <button
            type="button"
            className="project-color-swatch"
            style={{ background: newColor }}
            onClick={() => togglePicker(NEW_ROW_ID, 'color')}
            aria-label="Choose color for new project"
            title="Choose color"
          />
          <button type="button" className="add-btn" onClick={handleAdd} disabled={!newName.trim()}>
            Add
          </button>

          {openPicker?.rowId === NEW_ROW_ID && openPicker.kind === 'icon' && (
            <div className="picker-grid">
              {PROJECT_ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option${icon === newIcon ? ' selected' : ''}`}
                  onClick={() => {
                    setNewIcon(icon)
                    setOpenPicker(null)
                  }}
                  aria-label={`Use icon ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
          {openPicker?.rowId === NEW_ROW_ID && openPicker.kind === 'color' && (
            <div className="picker-grid">
              {PROJECT_COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option${color === newColor ? ' selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => {
                    setNewColor(color)
                    setOpenPicker(null)
                  }}
                  aria-label={`Use color ${color}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
