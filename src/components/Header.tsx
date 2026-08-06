import { APP_NAME } from '../config/branding'

export function Header() {
  return (
    <header className="app-header">
      <h1 className="app-title">{APP_NAME}</h1>
    </header>
  )
}
