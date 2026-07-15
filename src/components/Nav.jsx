import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/nosotros', label: 'Quiénes somos' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_1px_0_rgba(20,38,30,0.1)]' : ''
      }`}
      style={{ background: 'rgba(241,236,221,0.93)', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between h-[62px]">
        {/* Marca */}
        <Link to="/" className="flex items-center gap-3 no-underline" onClick={() => setOpen(false)}>
          <span className="w-8 h-8 rounded-[5px] bg-leaf flex items-center justify-center text-paper font-serif font-bold text-sm select-none flex-shrink-0">
            FC
          </span>
          <span>
            <span className="font-serif font-semibold text-[16.5px] text-ink leading-none">
              Fernández y Calzada
            </span>
            <span className="mono-label text-[9.5px] text-leaf-dark/75 block mt-0.5 tracking-[0.1em]">
              Flor natural · Salamanca
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-[13.5px] font-medium no-underline pb-0.5 border-b border-transparent transition-colors duration-100 ${
                  isActive ? 'border-rust text-ink' : 'text-ink/75 hover:text-ink hover:border-rust/50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/contacto"
            className="btn btn-primary text-[13px] py-2 px-4 ml-2"
          >
            Contactar
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className={`block w-5 h-px bg-ink transition-transform duration-200 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-transform duration-200 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[62px] bg-paper z-40 flex flex-col p-8 gap-6">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-serif text-2xl font-semibold no-underline ${isActive ? 'text-leaf' : 'text-ink'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-4 border-t border-mist pt-6">
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full justify-center text-base py-3.5"
            >
              Contactar
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
