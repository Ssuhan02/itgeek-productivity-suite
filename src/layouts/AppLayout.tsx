import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Tagline } from '../components/Tagline'
import { DeveloperSignature } from '../components/DeveloperSignature'
import { GlobalNav } from '../components/GlobalNav'

interface AppLayoutProps {
  children: ReactNode
  /** Pages whose content can exceed one viewport (e.g. the ToDo module)
   * pass `scrollable` so they grow and scroll naturally instead of being
   * clipped to the viewport like the Dashboard. */
  scrollable?: boolean
  /** The Home Dashboard opts out of the Global Navigation Bar (it *is* the
   * landing page, so there's nowhere for "Home" to usefully go) — every
   * other module leaves this at its default. */
  showNavigation?: boolean
}

// Generic, content-agnostic application shell for the ITGeek Productivity
// Suite: an optional, compact fixed Global Navigation Bar, then the
// application title (identical branding — same component, same CSS —
// whether or not the bar is shown), then the page's own content and the
// footer. Every module page only ever supplies its own main content via
// `children`, and inherits the navigation, branding, spacing, and viewport
// behavior for free.
export function AppLayout({ children, scrollable = false, showNavigation = true }: AppLayoutProps) {
  const layoutClassName = [
    'app-layout',
    scrollable && 'app-layout--scrollable',
    !showNavigation && 'app-layout--no-nav',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {showNavigation && <GlobalNav />}
      <div className={layoutClassName}>
        <header className="app-layout__header">
          <Header />
        </header>
        <main className="app-layout__content">{children}</main>
        <footer className="app-layout__footer">
          <Tagline />
        </footer>
        <DeveloperSignature />
      </div>
    </>
  )
}
