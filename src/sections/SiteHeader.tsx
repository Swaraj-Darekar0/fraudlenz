import { navItems } from '../data/siteContent'
import { Logo } from '../components/Logo'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Logo as="a" href="#hero" />

      <nav className="site-nav" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
            {item}
          </a>
        ))}
      </nav>

      <div className="site-header__actions">
        <a href="#footer" className="header-link">
          Sign in
        </a>
        <a href="#cta" className="button button--dark button--small">
          Get access
        </a>
      </div>
    </header>
  )
}
