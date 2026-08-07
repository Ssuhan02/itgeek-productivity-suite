import { Link } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { usePageTitle } from '../hooks/usePageTitle'

interface ComingSoonPageProps {
  /** Display name of the module this placeholder stands in for, e.g.
   * "Calendar" or "PMP Study". One shared component serves every
   * not-yet-built module — no per-module page components. */
  moduleName: string
}

function ComingSoonPage({ moduleName }: ComingSoonPageProps) {
  usePageTitle(moduleName)

  return (
    <AppLayout scrollable>
      <div className="coming-soon-page">
        <div className="card module-card coming-soon-card">
          <h2 className="module-title">{moduleName}</h2>
          <span className="status-badge">Coming Soon</span>
          <p className="module-description">
            This module is currently under development and will be available in a future release.
          </p>
          <Link to="/" className="btn-open">
            Return to Home
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

export default ComingSoonPage
