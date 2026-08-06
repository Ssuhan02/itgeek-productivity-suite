import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import TodoPage from './pages/TodoPage'
import ComingSoonPage from './pages/ComingSoonPage'
import { getModuleById } from './config/modules'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/todo" element={<TodoPage />} />
      <Route path="/finance" element={<ComingSoonPage module={getModuleById('personal-finance')!} />} />
      <Route path="/settings" element={<ComingSoonPage module={getModuleById('settings')!} />} />
      <Route path="/profile" element={<ComingSoonPage module={getModuleById('profile')!} />} />
    </Routes>
  )
}

export default App
