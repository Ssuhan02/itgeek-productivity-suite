export interface ModuleInfo {
  id: string
  name: string
  icon: string
  description: string
  route: string
  /** Fully implemented and open-able (ToDo). */
  enabled: boolean
  /** Shows a "Coming Soon" badge on its dashboard card and nav item, and
   * resolves its route to the shared ComingSoonPage instead of real content. */
  comingSoon: boolean
  /** Whether this module gets an entry in the Global Navigation Bar. */
  visibleInNavigation: boolean
  /** Which side of the Global Navigation Bar this item renders on. */
  navGroup: 'primary' | 'secondary'
  /** Sort order within its navGroup (and, for the Dashboard grid, overall). */
  displayOrder: number
}

// Drives both the Home Dashboard's module grid and the Global Navigation
// Bar. Add a future module (Notes, Calendar, Habit Tracker, ...) by adding
// an entry here — no component changes needed in either place.
export const MODULES: ModuleInfo[] = [
  {
    id: 'todo',
    name: 'ToDo',
    icon: '📋',
    description: 'Organize, schedule and manage your daily tasks.',
    route: '/todo',
    enabled: true,
    comingSoon: false,
    visibleInNavigation: true,
    navGroup: 'primary',
    displayOrder: 1,
  },
  {
    id: 'personal-finance',
    name: 'Personal Finance',
    icon: '💰',
    description: 'Track expenses, budgets and financial goals.',
    route: '/finance',
    enabled: false,
    comingSoon: true,
    visibleInNavigation: true,
    navGroup: 'primary',
    displayOrder: 2,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    description: 'Manage your profile and application preferences.',
    route: '/settings',
    enabled: false,
    comingSoon: true,
    visibleInNavigation: true,
    navGroup: 'secondary',
    displayOrder: 1,
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: '👤',
    description: 'View and manage your account information.',
    route: '/profile',
    enabled: false,
    comingSoon: true,
    visibleInNavigation: true,
    navGroup: 'secondary',
    displayOrder: 2,
  },
]

export function getModuleById(id: string): ModuleInfo | undefined {
  return MODULES.find((module) => module.id === id)
}
