import type { DeletedTodo, Project } from '../types'
import { PRIORITY_ICONS, PRIORITY_LABELS } from '../utils/priority'
import { projectColorStyle } from '../utils/projects'
import { DeleteForeverButton } from './DeleteForeverButton'
import { RestoreButton } from './RestoreButton'
import { TimerBadge } from './TimerBadge'

interface RecentlyDeletedItemProps {
  entry: DeletedTodo
  projects: Project[]
  isAnimatingOut: boolean
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
}

export function RecentlyDeletedItem({
  entry,
  projects,
  isAnimatingOut,
  onRestore,
  onDeletePermanently,
}: RecentlyDeletedItemProps) {
  const { todo, deletedAt, expiresAt } = entry
  const project = projects.find((p) => p.id === todo.projectId)

  return (
    <li className={`recently-deleted-item${isAnimatingOut ? ' recently-deleted-item--exiting' : ''}`}>
      <div className="recently-deleted-item-main">
        <p className="recently-deleted-item-title">{todo.text}</p>
        <div className="recently-deleted-item-badges">
          {project && (
            <span className="badge-pill project-select" style={projectColorStyle(project)}>
              {project.icon} {project.name}
            </span>
          )}
          <span className={`badge-pill priority-badge priority-${todo.priority}`}>
            {PRIORITY_ICONS[todo.priority]} {PRIORITY_LABELS[todo.priority]}
          </span>
        </div>
        <div className="recently-deleted-item-meta">
          <span>
            Deleted: <TimerBadge mode="elapsed" timestamp={deletedAt} />
          </span>
          <span>
            Expires in: <TimerBadge mode="remaining" timestamp={expiresAt} />
          </span>
        </div>
      </div>
      <div className="recently-deleted-item-actions">
        <RestoreButton onClick={() => onRestore(todo.id)} ariaLabel={`Restore "${todo.text}"`} />
        <DeleteForeverButton
          itemLabel={`"${todo.text}"`}
          onConfirmedDelete={() => onDeletePermanently(todo.id)}
          ariaLabel={`Delete "${todo.text}" permanently`}
        />
      </div>
    </li>
  )
}
