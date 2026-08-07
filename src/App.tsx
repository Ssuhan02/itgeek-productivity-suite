import type { ComponentType } from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import TodoPage from './pages/TodoPage'
import ComingSoonPage from './pages/ComingSoonPage'
import { MODULES } from './config/modules'

// The only place a real module page gets wired up. Every module's route is
// generated from MODULES below; a module id with no entry here — i.e.
// every `coming-soon` module — automatically falls back to the shared
// ComingSoonPage, so adding a placeholder module needs nothing beyond a
// MODULES entry. Building a module for real means writing its page and
// adding one line here.
const MODULE_PAGES: Record<string, ComponentType> = {
  todo: TodoPage,
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      {MODULES.map((module) => {
        const Page = MODULE_PAGES[module.id]
        return (
          <Route
            key={module.id}
            path={module.route}
            element={Page ? <Page /> : <ComingSoonPage moduleName={module.title} />}
          />
        )
      })}
    </Routes>
  )
}

export default App
