import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/quienes-somos', label: 'Quiénes somos' },
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
        top: 100,
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
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a
          href="tel:923182222"
          style={{
            fontSize: 17, fontWeight: 600, color: '#6E6E73',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          923 18 22 22
        </a>
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
          background: scrolled ? 'rgba(245,250,235,0.95)' : 'rgba(245,250,235,0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(140,191,63,0.15)',
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            onClick={close}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img
              src="/logo-fc.png"
              alt="Fernández y Calzada"
              style={{ height: 76, width: 'auto', display: 'block' }}
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
            <a
              href="tel:923182222"
              style={{
                fontSize: 13, fontWeight: 500, color: '#6E6E73',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
                transition: 'color 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#1D1D1F' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6E6E73' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              923 18 22 22
            </a>
            <Link to="/contacto" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
              Contactar
            </Link>
          </nav>

          {/* Teléfono — solo visible en móvil */}
          <a
            href="tel:923182222"
            className="md:hidden"
            style={{
              fontSize: 13, fontWeight: 600, color: '#6E6E73',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            923 18 22 22
          </a>

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
