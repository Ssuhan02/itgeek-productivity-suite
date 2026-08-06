import { AppLayout } from '../layouts/AppLayout'
import type { ModuleInfo } from '../config/modules'

interface ComingSoonPageProps {
  module: ModuleInfo
}

function ComingSoonPage({ module }: ComingSoonPageProps) {
  return (
    <AppLayout scrollable>
      <div className="coming-soon-page">
        <div className="card module-card coming-soon-card">
          <span className="module-icon" aria-hidden="true">
            {module.icon}
          </span>
          <h2 className="module-title">{module.name}</h2>
          <p className="module-description">{module.description}</p>
          <span className="status-badge">Coming Soon</span>
        </div>
      </div>
    </AppLayout>
  )
}

export default ComingSoonPage
