import { useEffect, useState } from 'react'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#menu', label: 'Menú' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-cream font-display text-lg">
            A
          </span>
          <span
            className={`font-display text-xl tracking-tight ${
              scrolled ? 'text-espresso' : 'text-espresso'
            }`}
          >
            Café Ámbar
          </span>
        </a>
        <ul className="hidden gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-sm font-medium text-espresso/80 transition-colors hover:text-terracotta"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#menu"
          className="rounded-full bg-espresso px-5 py-2 font-sans text-sm font-semibold text-cream transition-colors hover:bg-terracotta"
        >
          Ver menú
        </a>
      </nav>
    </header>
  )
}
