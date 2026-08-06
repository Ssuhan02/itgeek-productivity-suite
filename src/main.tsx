import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { backgrounds } from './themes'
import { ConfirmProvider } from './contexts/ConfirmContext'
import { ToastProvider } from './contexts/ToastContext'

// Bridges the active theme background into CSS (which can't `import` a TS value)
// via a custom property, set synchronously before the first paint so there's no
// flash of a missing background. `index.css`'s #root rule consumes this as
// `var(--app-bg-image)`. Swapping which background renders — or, later, wiring
// up a real theme switcher — only ever needs to change this one line.
document.documentElement.style.setProperty('--app-bg-image', `url(${backgrounds.mountFuji})`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfirmProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ConfirmProvider>
    </BrowserRouter>
  </StrictMode>,
)
