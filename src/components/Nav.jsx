import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Prensa' },
]

// Drawer renderizado en document.body via portal — evita el stacking context
// creado por backdropFilter + z-index del header, que limita el z-index del drawer.
function MobileDrawer({ open, onClose }) {
  if (!open) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        top: 60,
        zIndex: 200,
        background: '#FBFBFD',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        gap: 4,
        overflowY: 'auto',
      }}
    >
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          style={({ isActive }) => ({
            fontSize: 28,
            fontWeight: 700,
            color: isActive ? '#1D1D1F' : '#6E6E73',
            textDecoration: 'none',
            padding: '8px 0',
          })}
        >
          {label}
        </NavLink>
      ))}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Link
          to="/contacto"
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: 16, padding: '14px 22px' }}
        >
          Contactar
        </Link>
      </div>
    </div>,
    document.body
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(251,251,253,0.92)' : 'rgba(251,251,253,0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
            height: 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            onClick={close}
            style={{
              display: 'flex', alignItems: 'center', textDecoration: 'none',
              background: 'rgba(140,191,63,0.08)',
              borderRadius: 14,
              padding: '8px 16px',
            }}
          >
            <img
              src="/logo-fc.png"
              alt="Fernández y Calzada"
              style={{ height: 56, width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? '#1D1D1F' : '#6E6E73',
                  textDecoration: 'none',
                  transition: 'color 0.1s',
                })}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/contacto" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
              Contactar
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            style={{ background: 'none', border: 'none', position: 'relative', zIndex: 201 }}
          >
            <span style={{ display: 'block', width: 20, height: 1.5, background: '#1D1D1F', borderRadius: 2, transition: 'transform 0.2s', transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 20, height: 1.5, background: '#1D1D1F', borderRadius: 2, transition: 'opacity 0.2s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 20, height: 1.5, background: '#1D1D1F', borderRadius: 2, transition: 'transform 0.2s', transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </header>

      <MobileDrawer open={open} onClose={close} />
    </>
  )
}
