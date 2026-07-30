import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ padding: '32px 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div
        style={{
          maxWidth: 1120, margin: '0 auto', padding: '0 24px',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
          gap: 10, fontSize: 12.5, color: '#6E6E73',
        }}
      >
        <span>© {year} Fernández y Calzada S.L. · CIF B37319829</span>
        <span style={{ display: 'flex', gap: 0 }}>
          {[
            { to: '/aviso-legal', label: 'Aviso legal' },
            { to: '/privacidad', label: 'Privacidad' },
            { to: '/cookies', label: 'Cookies' },
            { to: '/admin', label: 'Acceso privado' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ marginLeft: 16, color: '#6E6E73', textDecoration: 'none', transition: 'color 0.1s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
            >
              {label}
            </Link>
          ))}
        </span>
      </div>
    </footer>
  )
}
