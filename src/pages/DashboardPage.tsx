import { AppLayout } from '../layouts/AppLayout'
import { ModuleCard } from '../components/dashboard/ModuleCard'
import { MODULES } from '../config/modules'
import { usePageTitle } from '../hooks/usePageTitle'
import '../App.css'

function DashboardPage() {
  usePageTitle('Home')

  // Only modules flagged for Home get a card here — everything else
  // (config, routing, the Coming Soon page) stays fully intact, so a module
  // just needs `visibleOnDashboard: true` whenever it's ready to be shown.
  const dashboardModules = MODULES.filter((module) => module.visibleOnDashboard)

  return (
    <AppLayout showNavigation={false}>
      <div className="dashboard-container">
        <div className="module-grid-wrapper">
          <div className="module-grid">
            {dashboardModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default DashboardPage
