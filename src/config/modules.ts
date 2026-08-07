/** A module is either fully built (`active`) or a placeholder (`coming-soon`).
 * This is the ONLY thing that varies module handling anywhere in the app —
 * every module card is equally clickable regardless of status; status just
 * decides which page (the real one, or the shared ComingSoonPage) and
 * which label (Open / Coming Soon) it gets. */
export type ModuleStatus = 'active' | 'coming-soon'

export interface ModuleInfo {
  id: string
  title: string
  icon: string
  description: string
  route: string
  status: ModuleStatus
  /** Whether this module gets a card on the Home Dashboard. Modules with
   * this off (e.g. early placeholders not yet ready to advertise) still
   * get a working route and Coming Soon page via App.tsx — they're just
   * not listed on Home. Flip to true whenever it's time to surface them. */
  visibleOnDashboard: boolean
  /** Whether this module gets an entry in the Global Navigation Bar. */
  visibleInNavigation: boolean
  /** Which side of the Global Navigation Bar this item renders on. */
  navGroup: 'primary' | 'secondary'
  /** Sort order within its navGroup. */
  displayOrder: number
}

// Drives both the Home Dashboard's module grid and the Global Navigation
// Bar. Add a future module (Password Vault, ...) by adding an entry here —
// no component changes needed in either place. A `coming-soon` module needs
// nothing beyond this entry: its route and placeholder page fall out of the
// config automatically (see App.tsx), and its card appears on Home the
// moment `visibleOnDashboard` is turned on.
//
// V1.0 keeps the Home Dashboard to four modules (To-Do, Personal Finance,
// Settings, Profile) via `visibleOnDashboard`. Calendar, Notes, Habits,
// Inventory, PMP Study, and Japanese Learning are defined and fully routed
// (try /calendar, /notes, ...) but stay off Home until they're ready to be
// surfaced — proof the architecture scales without being cluttered today.
export const MODULES: ModuleInfo[] = [
  {
    id: 'todo',
    title: 'To-Do',
    icon: '📋',
    description: 'Organize, schedule and manage your daily tasks.',
    route: '/todo',
    status: 'active',
    visibleOnDashboard: true,
    visibleInNavigation: true,
    navGroup: 'primary',
    displayOrder: 1,
  },
  {
    id: 'personal-finance',
    title: 'Personal Finance',
    icon: '💰',
    description: 'Track expenses, budgets and financial goals.',
    route: '/finance',
    status: 'coming-soon',
    visibleOnDashboard: true,
    visibleInNavigation: true,
    navGroup: 'primary',
    displayOrder: 2,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: '📅',
    description: 'Plan and keep track of important dates and events.',
    route: '/calendar',
    status: 'coming-soon',
    visibleOnDashboard: false,
    visibleInNavigation: false,
    navGroup: 'primary',
    displayOrder: 3,
  },
  {
    id: 'notes',
    title: 'Notes',
    icon: '📝',
    description: 'Capture and organize quick notes and ideas.',
    route: '/notes',
    status: 'coming-soon',
    visibleOnDashboard: false,
    visibleInNavigation: false,
    navGroup: 'primary',
    displayOrder: 4,
  },
  {
    id: 'habits',
    title: 'Habits',
    icon: '🔁',
    description: 'Build and track daily habits and routines.',
    route: '/habits',
    status: 'coming-soon',
    visibleOnDashboard: false,
    visibleInNavigation: false,
    navGroup: 'primary',
    displayOrder: 5,
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: '📦',
    description: 'Track and manage your belongings.',
    route: '/inventory',
    status: 'coming-soon',
    visibleOnDashboard: false,
    visibleInNavigation: false,
    navGroup: 'primary',
    displayOrder: 6,
  },
  {
    id: 'pmp',
    title: 'PMP Study',
    icon: '🎓',
    description: 'Prepare for the PMP certification exam.',
    route: '/pmp',
    status: 'coming-soon',
    visibleOnDashboard: false,
    visibleInNavigation: false,
    navGroup: 'primary',
    displayOrder: 7,
  },
  {
    id: 'japanese',
    title: 'Japanese Learning',
    // A map-of-Japan pictograph, not the 🇯🇵 flag — regional-indicator flag
    // emoji render as bare letter pairs ("JP") on platforms/fonts without a
    // flag glyph (e.g. stock Windows), unlike every other module's icon.
    icon: '🗾',
    description: 'Learn and practice Japanese.',
    route: '/japanese',
    status: 'coming-soon',
    visibleOnDashboard: false,
    visibleInNavigation: false,
    navGroup: 'primary',
    displayOrder: 8,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    description: 'Manage your profile and application preferences.',
    route: '/settings',
    status: 'coming-soon',
    visibleOnDashboard: true,
    visibleInNavigation: true,
    navGroup: 'secondary',
    displayOrder: 1,
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: '👤',
    description: 'View and manage your account information.',
    route: '/profile',
    status: 'coming-soon',
    visibleOnDashboard: true,
    visibleInNavigation: true,
    navGroup: 'secondary',
    displayOrder: 2,
  },
]

export function getModuleById(id: string): ModuleInfo | undefined {
  return MODULES.find((module) => module.id === id)
}
