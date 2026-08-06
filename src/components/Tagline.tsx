import { APP_TAGLINE } from '../config/branding'

export function Tagline() {
  return (
    <footer className="app-footer">
      <span className="footer-divider" aria-hidden="true" />
      <p className="app-tagline">{APP_TAGLINE}</p>
      <span className="footer-divider" aria-hidden="true" />
    </footer>
  )
}
