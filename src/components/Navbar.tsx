import { useState, useEffect } from 'react'

// Path-style labels: the navbar reads as a filesystem, like the hero's prompt.
const links = [
  { label: '/home', href: '#hero' },
  { label: '/about', href: '#about' },
  { label: '/projects', href: '#projects' },
  { label: '/skills', href: '#skills' },
  { label: '/contact', href: '#contact' },
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
      className={`fixed top-0 right-0 left-0 z-50 font-terminal transition-colors duration-300 ${
        scrolled ? 'border-b border-amber-faint bg-bg/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-[6vw]">
        {/* Logo */}
        <a
          href="#hero"
          className="text-base font-semibold tracking-tight text-amber transition-colors hover:text-amber-bright"
        >
          dair<span className="text-amber-faint">.</span>dev
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] tracking-[0.06em] text-amber-dim transition-colors duration-200 hover:text-amber-bright"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu button — a terminal toggles with glyphs, not hamburgers */}
        <button
          className="text-sm tracking-[0.1em] text-amber-dim transition-colors hover:text-amber-bright md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '[ close ]' : '[ menu ]'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-amber-faint bg-bg/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-4 px-[6vw] py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm tracking-[0.06em] text-amber-dim transition-colors hover:text-amber-bright"
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
