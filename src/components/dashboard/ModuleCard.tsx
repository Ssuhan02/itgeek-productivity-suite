import { Link } from 'react-router-dom'
import type { ModuleInfo } from '../../config/modules'

interface ModuleCardProps {
  module: ModuleInfo
}

// Every module card is clickable and navigates via `module.route` — the
// module configuration (src/config/modules.ts) is the single source of
// truth for where each card goes and what it's called. Every card shares
// identical styling (see .module-card in App.css); `status` only decides
// the label ("Open" vs "Coming Soon"), never whether the card is clickable
// or how it's styled. Adding a future module only requires a new MODULES
// entry — this component has no per-module or per-route logic.
export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link to={module.route} className="card module-card">
      <span className="module-icon" aria-hidden="true">
        {module.icon}
      </span>
      <h3 className="module-title">{module.title}</h3>
      <p className="module-description">{module.description}</p>
      {module.status === 'active' ? (
        <span className="btn-open">Open</span>
      ) : (
        <span className="status-badge">Coming Soon</span>
      )}
    </Link>
  )
}
