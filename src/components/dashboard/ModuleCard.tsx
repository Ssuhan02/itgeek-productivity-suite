import { Link } from 'react-router-dom'
import type { ModuleInfo } from '../../config/modules'

interface ModuleCardProps {
  module: ModuleInfo
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <div className={`card module-card${module.enabled ? '' : ' module-card--disabled'}`}>
      <span className="module-icon" aria-hidden="true">
        {module.icon}
      </span>
      <h3 className="module-title">{module.name}</h3>
      <p className="module-description">{module.description}</p>
      {module.enabled ? (
        <Link to={module.route} className="btn-open">
          Open
        </Link>
      ) : (
        <span className="status-badge">Coming Soon</span>
      )}
    </div>
  )
}
