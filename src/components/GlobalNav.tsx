import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MODULES } from '../config/modules'

interface NavItem {
  id: string
  title: string
  icon: string
  route: string
}

const HOME_ITEM: NavItem = { id: 'home', title: 'Home', icon: '🏠', route: '/' }

function byDisplayOrder(a: { displayOrder: number }, b: { displayOrder: number }) {
  return a.displayOrder - b.displayOrder
}

const primaryModules = MODULES.filter((m) => m.visibleInNavigation && m.navGroup === 'primary').sort(
  byDisplayOrder,
)
const secondaryModules = MODULES.filter(
  (m) => m.visibleInNavigation && m.navGroup === 'secondary',
).sort(byDisplayOrder)

const primaryItems: NavItem[] = [HOME_ITEM, ...primaryModules]
const secondaryItems: NavItem[] = secondaryModules

export function GlobalNav() {
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const renderItem = (item: NavItem) => (
    <Link
      key={item.id}
      to={item.route}
      className={`global-nav__item${pathname === item.route ? ' global-nav__item--active' : ''}`}
      onClick={() => setIsMenuOpen(false)}
    >
      <span className="global-nav__icon" aria-hidden="true">
        {item.icon}
      </span>
      {item.title}
    </Link>
  )

  return (
    <nav className="global-nav">
      <div className="global-nav__bar">
        <div className="global-nav__group global-nav__group--primary">
          {primaryItems.map(renderItem)}
        </div>
        <div className="global-nav__spacer" />
        <div className="global-nav__group global-nav__group--secondary">
          {secondaryItems.map(renderItem)}
        </div>
        <button
          type="button"
          className="global-nav__toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      {isMenuOpen && (
        <div className="global-nav__mobile-menu">
          {[...primaryItems, ...secondaryItems].map(renderItem)}
        </div>
      )}
    </nav>
  )
}
