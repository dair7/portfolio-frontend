import { useState, useEffect } from 'react'

// Plain labels in sans. They used to read as paths (`/about`, `/projects`) —
// but the navbar floats over every section, so terminal language up here
// leaked the console into all of them. The wordmark keeps the mono.
const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-line bg-bg/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Same container as the sections, so the wordmark sits on the same
          vertical line as every section heading. */}
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Wordmark — a logotype, so it stays in mono */}
        <a
          href="#hero"
          className="font-terminal text-base font-semibold tracking-tight text-amber transition-colors hover:text-amber-bright"
        >
          dair<span className="text-amber-faint">.</span>dev
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted transition-colors duration-200 hover:text-amber"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="text-muted transition-colors hover:text-amber md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-amber"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
