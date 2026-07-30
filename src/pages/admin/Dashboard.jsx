import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { getSession, clearSession, canAccess, saveSession } from '../../lib/auth'
import productosData, { CAT_STYLES, ORIGEN_LABEL } from '../../data/products'

const MOCK_MENSAJES = [
  {
    id: 1,
    floristeria: 'Flores del Centro',
    email: 'maria@floresdel.com',
    mensaje: 'Buenos días, me gustaría saber disponibilidad de peonías para mayo.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    leido: false,
  },
  {
    id: 2,
    floristeria: 'El Ramo',
    email: 'juan@elramo.es',
    mensaje: 'Consulta de precios para pedido semanal de rosas y alstroemerias.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    leido: true,
  },
]

const MOCK_ANALYTICS = [
  { pagina: '/', visitas: 142 },
  { pagina: '/catalogo', visitas: 98 },
  { pagina: '/contacto', visitas: 44 },
  { pagina: '/nosotros', visitas: 21 },
]

const ROW = { borderBottom: '1px solid rgba(0,0,0,0.08)' }

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '20px 22px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73', margin: '0 0 8px' }}>
        {label}
      </p>
      <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: '#6E6E73', marginTop: 6, marginBottom: 0 }}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState(productosData.map((p) => ({ ...p })))
  const [tab, setTab] = useState('catalogo')
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (supabaseReady) {
      supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) return

        // Try to get role from sessionStorage cache first (set during login)
        const cached = getSession()
        if (cached?.email === data.user.email && cached?.role) {
          setSession(cached)
          return
        }

        // Fallback: query profiles table directly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, nombre')
          .eq('id', data.user.id)
          .single()

        const s = {
          email: data.user.email,
          name: profile?.nombre ?? data.user.email,
          role: profile?.role ?? 'empresa',
        }
        saveSession(s)
        setSession(s)
      })
    } else {
      setSession(getSession())
    }
  }, [])

  const handleLogout = async () => {
    clearSession()
    if (supabaseReady) await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const toggleDisponible = (id) => {
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, disponible: !p.disponible } : p)))
  }

  const disponibles = productos.filter((p) => p.disponible).length
  const noLeidos = MOCK_MENSAJES.filter((m) => !m.leido).length
  const totalVisitas = MOCK_ANALYTICS.reduce((a, p) => a + p.visitas, 0)

  const TABS = [
    { id: 'catalogo', label: 'Catálogo',                                           show: canAccess(session, 'catalogo') },
    { id: 'mensajes', label: `Mensajes${noLeidos ? ` (${noLeidos})` : ''}`,        show: canAccess(session, 'mensajes') },
    { id: 'metricas', label: 'Métricas',                                            show: canAccess(session, 'metricas') },
  ].filter((t) => t.show)

  return (
    <div style={{ minHeight: '100vh', background: '#FBFBFD' }}>
      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-fc.png" alt="Fernández y Calzada" style={{ height: 24, width: 'auto', display: 'block' }} />
            <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1D1D1F' }}>Panel privado</span>
            {session?.name && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(0,0,0,0.05)', color: '#6E6E73' }}>
                {session.name}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link
              to="/"
              style={{ fontSize: 12.5, color: '#6E6E73', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
            >
              Ver web →
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', fontSize: 12.5, color: '#6E6E73', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 24px 80px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 36 }}>
          <StatCard label="Productos totales" value={productos.length} sub="en catálogo" />
          <StatCard label="Disponibles" value={disponibles} sub={`de ${productos.length}`} />
          {canAccess(session, 'mensajes') && (
            <StatCard label="Mensajes nuevos" value={noLeidos} sub="sin leer" />
          )}
          {canAccess(session, 'metricas') && (
            <StatCard label="Visitas" value={totalVisitas} sub="últimos 30 días" />
          )}
        </div>

        {/* Tabs */}
        {TABS.length > 0 && (
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 28 }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: '10px 20px', fontSize: 13, fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${tab === id ? '#1D1D1F' : 'transparent'}`,
                  marginBottom: -1,
                  color: tab === id ? '#1D1D1F' : '#6E6E73',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── TAB: Catálogo ─────────────────────────────────────── */}
        {tab === 'catalogo' && canAccess(session, 'catalogo') && (
          <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.025)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  {['Producto', 'Categoría', 'Origen', 'Disponible'].map((h) => (
                    <th key={h} style={{ textAlign: h === 'Disponible' ? 'center' : 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => {
                  const s = CAT_STYLES[p.categoria]
                  return (
                    <tr
                      key={p.id}
                      style={i < productos.length - 1 ? ROW : undefined}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.nombre}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.pillBg, color: s.color }}>
                          {p.categoria}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6E6E73' }}>
                        {p.origen.map((o) => ORIGEN_LABEL[o] || o).join(' · ')}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleDisponible(p.id)}
                          style={{
                            position: 'relative', width: 36, height: 20, borderRadius: 100,
                            background: p.disponible ? '#8CBF3F' : 'rgba(0,0,0,0.12)',
                            border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                          }}
                          aria-label={p.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                        >
                          <span
                            style={{
                              position: 'absolute', top: 2, left: 2, width: 16, height: 16,
                              borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              transition: 'transform 0.15s',
                              transform: p.disponible ? 'translateX(16px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: Mensajes ─────────────────────────────────────── */}
        {tab === 'mensajes' && canAccess(session, 'mensajes') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_MENSAJES.map((m) => (
              <div
                key={m.id}
                style={{
                  borderRadius: 16, padding: '20px 22px', background: '#fff',
                  border: m.leido ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(140,191,63,0.28)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>{m.floristeria}</p>
                    <a href={`mailto:${m.email}`} style={{ fontSize: 12.5, color: '#6E6E73', textDecoration: 'none' }}>{m.email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {!m.leido && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: '#8CBF3F', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Nuevo
                      </span>
                    )}
                    <span style={{ fontSize: 10, color: '#6E6E73', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {new Date(m.created_at).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#6E6E73', margin: 0, lineHeight: 1.6 }}>{m.mensaje}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Métricas ─────────────────────────────────────── */}
        {tab === 'metricas' && canAccess(session, 'metricas') && (
          <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.025)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73' }}>Página</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73' }}>Visitas (30 d)</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ANALYTICS.map(({ pagina, visitas }, i) => (
                  <tr key={pagina} style={i < MOCK_ANALYTICS.length - 1 ? ROW : undefined}>
                    <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600 }}>{pagina}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'right', fontWeight: 700 }}>{visitas}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'right', color: '#6E6E73' }}>
                      {((visitas / totalVisitas) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
