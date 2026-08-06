import { AppLayout } from '../layouts/AppLayout'
import { ModuleCard } from '../components/dashboard/ModuleCard'
import { MODULES } from '../config/modules'
import '../App.css'

function DashboardPage() {
  return (
    <AppLayout showNavigation={false}>
      <div className="dashboard-container">
        <div className="module-grid-wrapper">
          <div className="module-grid">
            {MODULES.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default DashboardPage
