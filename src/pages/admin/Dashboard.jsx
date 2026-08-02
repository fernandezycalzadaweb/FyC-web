import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { getSession, clearSession, canAccess, saveSession } from '../../lib/auth'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL } from '../../data/products'

const ROW = { borderBottom: '1px solid rgba(0,0,0,0.08)' }

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: accent ? 'rgba(140,191,63,0.05)' : '#fff',
        border: accent ? '1px solid rgba(140,191,63,0.28)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 16, padding: '20px 22px',
      }}
    >
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

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function thisMonthStart() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  // Catálogo
  const [productos, setProductos] = useState(productosStatic.map((p) => ({ ...p })))

  // Mensajes
  const [mensajes, setMensajes] = useState([])
  const [mensajesLoading, setMensajesLoading] = useState(true)

  // Analítica
  const [visitas, setVisitas] = useState([])        // raw: [{ pagina, referrer }]
  const [visitasError, setVisitasError] = useState(null)

  // Tab — default 'mensajes', se ajusta tras cargar sesión si no hay acceso
  const [tab, setTab] = useState('mensajes')

  // ── Sesión ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (supabaseReady) {
      supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) return
        const cached = getSession()
        if (cached?.email === data.user.email && cached?.role) {
          setSession(cached)
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, nombre')
          .eq('id', data.user.id)
          .single()
        const s = { email: data.user.email, name: profile?.nombre ?? data.user.email, role: profile?.role ?? 'empresa' }
        saveSession(s)
        setSession(s)
      })
    } else {
      setSession(getSession())
    }
  }, [])

  // ── Catálogo ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('productos').select('*').order('categoria')
      .then(({ data, error }) => { if (!error && data?.length) setProductos(data) })
  }, [])

  // ── Mensajes ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabaseReady) { setMensajesLoading(false); return }
    supabase
      .from('mensajes_contacto')
      .select('id, floristeria, mensaje, email, telefono, created_at, estado')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMensajes(data)
        setMensajesLoading(false)
      })
  }, [])

  // ── Visitas ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabaseReady) { setVisitasError('no_table'); return }
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    supabase
      .from('analytics_visitas')
      .select('pagina, referrer')
      .gte('created_at', since)
      .then(({ data, error }) => {
        if (error) { setVisitasError('no_table'); return }
        setVisitas(data ?? [])
      })
  }, [])

  // ── Toggle tab al cargar sesión si el tab activo no es accesible ──────────
  useEffect(() => {
    if (!session) return
    if (!canAccess(session, tab === 'catalogo' ? 'catalogo' : tab)) {
      const first = ['mensajes', 'metricas', 'catalogo'].find((f) => canAccess(session, f))
      if (first) setTab(first)
    }
  }, [session])

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    clearSession()
    if (supabaseReady) await supabase.auth.signOut()
    navigate('/admin/login')
  }

  // ── Toggle disponible (catálogo) ──────────────────────────────────────────
  const toggleDisponible = async (id) => {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return
    const nuevo = !producto.disponible
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, disponible: nuevo } : p)))
    if (supabaseReady) {
      const { error } = await supabase.from('productos').update({ disponible: nuevo }).eq('id', id)
      if (error) setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, disponible: !nuevo } : p)))
    }
  }

  // ── Toggle estado (mensajes) ──────────────────────────────────────────────
  const toggleEstado = async (id) => {
    const msg = mensajes.find((m) => m.id === id)
    if (!msg) return
    const nuevo = msg.estado === 'respondido' ? 'pendiente' : 'respondido'
    setMensajes((prev) => prev.map((m) => (m.id === id ? { ...m, estado: nuevo } : m)))
    if (supabaseReady) {
      const { error } = await supabase.from('mensajes_contacto').update({ estado: nuevo }).eq('id', id)
      if (error) setMensajes((prev) => prev.map((m) => (m.id === id ? { ...m, estado: msg.estado } : m)))
    }
  }

  // ── Referrer classifier ───────────────────────────────────────────────────
  function classifyReferrer(ref) {
    if (!ref) return 'Directo'
    const r = ref.toLowerCase()
    if (/google|bing|yahoo|duckduckgo|ecosia|baidu/.test(r)) return 'Buscador'
    if (/facebook|instagram|whatsapp|tiktok|twitter|t\.co|x\.com/.test(r)) return 'Redes sociales'
    return 'Otros'
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const pendientes = mensajes.filter((m) => (m.estado ?? 'pendiente') === 'pendiente').length
  const respondidosMes = mensajes.filter((m) => m.estado === 'respondido' && new Date(m.created_at) >= thisMonthStart()).length
  const totalVisitas = visitas.length
  const disponibles = productos.filter((p) => p.disponible).length

  // Agrupaciones para métricas
  const visitasPorPagina = Object.entries(
    visitas.reduce((acc, r) => { acc[r.pagina] = (acc[r.pagina] || 0) + 1; return acc }, {})
  ).map(([pagina, n]) => ({ pagina, n })).sort((a, b) => b.n - a.n)

  const visitasPorOrigen = Object.entries(
    visitas.reduce((acc, r) => { const c = classifyReferrer(r.referrer); acc[c] = (acc[c] || 0) + 1; return acc }, {})
  ).map(([cat, n]) => ({ cat, n })).sort((a, b) => b.n - a.n)

  // ── Tabs (orden: Mensajes, Métricas, Catálogo) ────────────────────────────
  const TABS = [
    { id: 'mensajes', label: `Mensajes${pendientes ? ` (${pendientes})` : ''}`, feature: 'mensajes' },
    { id: 'metricas', label: 'Métricas',                                          feature: 'metricas' },
    { id: 'catalogo', label: 'Catálogo',                                           feature: 'catalogo' },
  ].filter((t) => canAccess(session, t.feature))

  return (
    <div style={{ minHeight: '100vh', background: '#FBFBFD' }}>
      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-fc.png" alt="Fernández y Calzada" style={{ height: 24, width: 'auto', display: 'block' }} />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Panel privado</span>
            {session?.name && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(0,0,0,0.05)', color: '#6E6E73' }}>
                {session.name}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/" style={{ fontSize: 12.5, color: '#6E6E73', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}>
              Ver web →
            </Link>
            <button onClick={handleLogout}
              style={{ background: 'none', border: 'none', fontSize: 12.5, color: '#6E6E73', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 36 }}>
          {canAccess(session, 'mensajes') && (
            <StatCard
              label="Mensajes pendientes"
              value={mensajesLoading ? '…' : pendientes}
              sub="sin responder"
              accent={pendientes > 0}
            />
          )}
          {canAccess(session, 'metricas') && (
            <StatCard
              label="Visitas"
              value={visitasError ? '—' : totalVisitas}
              sub="últimos 30 días"
            />
          )}
          {canAccess(session, 'mensajes') && (
            <StatCard
              label="Respondidos este mes"
              value={mensajesLoading ? '…' : respondidosMes}
              sub="mensajes cerrados"
            />
          )}
          <StatCard
            label="Productos"
            value={`${disponibles} / ${productos.length}`}
            sub="disponibles"
          />
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        {TABS.length > 0 && (
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 28 }}>
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)}
                style={{
                  padding: '10px 20px', fontSize: 13, fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${tab === id ? '#1D1D1F' : 'transparent'}`,
                  marginBottom: -1,
                  color: tab === id ? '#1D1D1F' : '#6E6E73',
                }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── TAB: Mensajes ─────────────────────────────────────────────── */}
        {tab === 'mensajes' && canAccess(session, 'mensajes') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mensajesLoading && (
              <p style={{ color: '#6E6E73', fontSize: 14 }}>Cargando mensajes…</p>
            )}
            {!mensajesLoading && mensajes.length === 0 && (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6E6E73', fontSize: 14, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                No hay mensajes todavía.
              </div>
            )}
            {mensajes.map((m) => {
              const estado = m.estado ?? 'pendiente'
              const esPendiente = estado === 'pendiente'
              return (
                <div key={m.id}
                  style={{
                    borderRadius: 16, padding: '20px 22px', background: '#fff',
                    border: esPendiente ? '1px solid rgba(140,191,63,0.3)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Cabecera */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14.5, margin: '0 0 2px' }}>
                        {m.floristeria || <span style={{ color: '#6E6E73', fontWeight: 400 }}>Sin nombre</span>}
                      </p>
                      <span style={{ fontSize: 11, color: '#6E6E73' }}>{fmtDate(m.created_at)}</span>
                    </div>
                    <button
                      onClick={() => toggleEstado(m.id)}
                      style={{
                        fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                        border: 'none', cursor: 'pointer', flexShrink: 0,
                        background: esPendiente ? 'rgba(140,191,63,0.15)' : 'rgba(0,0,0,0.06)',
                        color: esPendiente ? '#4A7A34' : '#6E6E73',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}
                    >
                      {esPendiente ? 'Pendiente' : 'Respondido'}
                    </button>
                  </div>

                  {/* Campos en orden: petición, email, teléfono */}
                  <p style={{ fontSize: 14, color: '#1D1D1F', margin: '0 0 12px', lineHeight: 1.6, background: 'rgba(0,0,0,0.025)', borderRadius: 10, padding: '12px 14px' }}>
                    {m.mensaje}
                  </p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {m.email && (
                      <a href={`mailto:${m.email}`}
                        style={{ fontSize: 12.5, color: '#4A7A34', textDecoration: 'none', fontWeight: 500 }}>
                        {m.email}
                      </a>
                    )}
                    {m.telefono && (
                      <a href={`tel:${m.telefono}`}
                        style={{ fontSize: 12.5, color: '#6E6E73', textDecoration: 'none' }}>
                        {m.telefono}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: Métricas ─────────────────────────────────────────────── */}
        {tab === 'metricas' && canAccess(session, 'metricas') && (
          visitasError ? (
            <div style={{ padding: '40px 32px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', maxWidth: 560 }}>
              <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 10px' }}>Error al conectar con analytics_visitas</p>
              <p style={{ color: '#6E6E73', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                Comprueba que la tabla existe y que la política RLS permite lectura a roles autenticados.
              </p>
            </div>
          ) : visitas.length === 0 ? (
            <div style={{ padding: '40px 32px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', color: '#6E6E73', fontSize: 14 }}>
              Sin visitas registradas en los últimos 30 días. El tracking está activo — los datos aparecerán en cuanto lleguen visitas.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

              {/* Páginas más visitadas */}
              <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6E6E73' }}>
                    Páginas más visitadas · 30 días
                  </span>
                </div>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <tbody>
                    {visitasPorPagina.map(({ pagina, n }, i) => (
                      <tr key={pagina} style={i < visitasPorPagina.length - 1 ? ROW : undefined}>
                        <td style={{ padding: '12px 18px', fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600 }}>{pagina}</td>
                        <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700 }}>{n}</td>
                        <td style={{ padding: '12px 18px', textAlign: 'right', color: '#6E6E73', minWidth: 52 }}>
                          {((n / totalVisitas) * 100).toFixed(0)}%
                        </td>
                        <td style={{ padding: '12px 18px 12px 0', width: 80 }}>
                          <div style={{ height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.06)' }}>
                            <div style={{ height: '100%', borderRadius: 100, background: '#8CBF3F', width: `${(n / totalVisitas) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Origen del tráfico */}
              <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6E6E73' }}>
                    Origen del tráfico · 30 días
                  </span>
                </div>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <tbody>
                    {visitasPorOrigen.map(({ cat, n }, i) => (
                      <tr key={cat} style={i < visitasPorOrigen.length - 1 ? ROW : undefined}>
                        <td style={{ padding: '12px 18px', fontWeight: 600 }}>{cat}</td>
                        <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700 }}>{n}</td>
                        <td style={{ padding: '12px 18px', textAlign: 'right', color: '#6E6E73', minWidth: 52 }}>
                          {((n / totalVisitas) * 100).toFixed(0)}%
                        </td>
                        <td style={{ padding: '12px 18px 12px 0', width: 80 }}>
                          <div style={{ height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.06)' }}>
                            <div style={{ height: '100%', borderRadius: 100, background: '#4A7A34', width: `${(n / totalVisitas) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )
        )}

        {/* ── TAB: Catálogo ─────────────────────────────────────────────── */}
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
                    <tr key={p.id} style={i < productos.length - 1 ? ROW : undefined}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
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
                          aria-label={p.disponible ? 'Marcar no disponible' : 'Marcar disponible'}>
                          <span style={{
                            position: 'absolute', top: 2, left: 2, width: 16, height: 16,
                            borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            transition: 'transform 0.15s',
                            transform: p.disponible ? 'translateX(16px)' : 'translateX(0)',
                          }} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
