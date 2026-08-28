import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { getSession, clearSession, canAccess, saveSession } from '../../lib/auth'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL, toSlug } from '../../data/products'

const ROW = { borderBottom: '1px solid rgba(0,0,0,0.08)' }
const CAT_FALLBACK = { pillBg: 'rgba(0,0,0,0.08)', color: '#6E6E73' }

// Páginas fijas que se muestran siempre en el resumen de cabecera
const PAGINAS_RESUMEN = [
  { ruta: '/',              label: 'Inicio' },
  { ruta: '/catalogo',      label: 'Catálogo' },
  { ruta: '/quienes-somos', label: 'Quiénes somos' },
  { ruta: '/prensa',        label: 'Prensa' },
  { ruta: '/contacto',      label: 'Contactar' },
]

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

function BarRow({ label, n, max, color = '#8CBF3F', labelWidth = 88 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{ width: labelWidth, flexShrink: 0, fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#1D1D1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 6, borderRadius: 100, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 100, background: color, width: `${(n / max) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ width: 28, flexShrink: 0, textAlign: 'right', fontSize: 11, fontWeight: 700 }}>{n}</div>
    </div>
  )
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  const [productos, setProductos] = useState(productosStatic.map((p) => ({ ...p })))
  const [mensajes, setMensajes] = useState([])
  const [mensajesLoading, setMensajesLoading] = useState(true)
  const [visitas, setVisitas] = useState([])
  const [visitasError, setVisitasError] = useState(null)
  const [tab, setTab] = useState('mensajes')
  const [searchMsg, setSearchMsg] = useState('')

  // ── Sesión ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (supabaseReady) {
      supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) return
        const cached = getSession()
        if (cached?.email === data.user.email && cached?.role) { setSession(cached); return }
        const { data: profile } = await supabase.from('profiles').select('role, nombre').eq('id', data.user.id).single()
        const s = { email: data.user.email, name: profile?.nombre ?? data.user.email, role: profile?.role ?? 'empresa' }
        saveSession(s); setSession(s)
      })
    } else {
      setSession(getSession())
    }
  }, [])

  // ── Catálogo ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('productos').select('*').order('categoria').order('nombre')
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
    supabase.from('analytics_visitas').select('pagina, referrer').gte('created_at', since)
      .then(({ data, error }) => {
        if (error) { setVisitasError('no_table'); return }
        setVisitas(data ?? [])
      })
  }, [])

  // ── Ajuste de tab al cargar sesión ────────────────────────────────────────
  useEffect(() => {
    if (!session) return
    if (!canAccess(session, tab)) {
      const first = ['mensajes', 'catalogo', 'metricas'].find((f) => canAccess(session, f))
      if (first) setTab(first)
    }
  }, [session])

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    clearSession()
    if (supabaseReady) await supabase.auth.signOut()
    navigate('/admin/login')
  }

  // ── Toggles catálogo ──────────────────────────────────────────────────────
  const toggleCampo = async (id, campo) => {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return
    const nuevo = !producto[campo]
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: nuevo } : p)))
    if (supabaseReady) {
      const { error } = await supabase.from('productos').update({ [campo]: nuevo }).eq('id', id)
      if (error) setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: !nuevo } : p)))
    }
  }

  // ── Toggle estado mensajes ────────────────────────────────────────────────
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

  // ── Stats derivados ───────────────────────────────────────────────────────
  const pendientes = mensajes.filter((m) => (m.estado ?? 'pendiente') === 'pendiente').length
  const respondidosTotal = mensajes.filter((m) => m.estado === 'respondido').length
  const totalVisitas = visitas.length
  const disponibles = productos.filter((p) => p.visible !== false).length

  const filteredMensajes = mensajes.filter((m) => {
    if (!searchMsg) return true
    const q = searchMsg.toLowerCase()
    return [m.floristeria, m.mensaje, m.email, m.telefono].some((f) => f?.toLowerCase().includes(q))
  })

  // Para la cabecera: 5 páginas fijas
  const visitasPorPaginaMap = visitas.reduce((acc, r) => {
    acc[r.pagina] = (acc[r.pagina] || 0) + 1; return acc
  }, {})
  const visitasResumen = PAGINAS_RESUMEN.map(({ ruta, label }) => ({ label, n: visitasPorPaginaMap[ruta] ?? 0 }))
  const maxResumen = Math.max(1, ...visitasResumen.map((v) => v.n))

  // Para la pestaña Métricas: ranking dinámico completo
  const visitasPorPagina = Object.entries(visitasPorPaginaMap)
    .map(([pagina, n]) => ({ pagina, n })).sort((a, b) => b.n - a.n)

  const visitasPorOrigen = Object.entries(
    visitas.reduce((acc, r) => { const c = classifyReferrer(r.referrer); acc[c] = (acc[c] || 0) + 1; return acc }, {})
  ).map(([cat, n]) => ({ cat, n })).sort((a, b) => b.n - a.n)

  const productosTop = visitasPorPagina
    .filter(({ pagina }) => pagina.startsWith('/catalogo/') && pagina.length > '/catalogo/'.length)
    .map(({ pagina, n }) => {
      const slug = pagina.slice('/catalogo/'.length)
      const prod = productos.find((p) => toSlug(p.nombre) === slug)
      return { nombre: prod?.nombre ?? slug, n }
    })
    .slice(0, 10)

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'mensajes',  label: `Mensajes${pendientes ? ` (${pendientes})` : ''}`, feature: 'mensajes' },
    { id: 'catalogo',  label: 'Catálogo',                                         feature: 'catalogo' },
    { id: 'metricas',  label: 'Métricas',                                         feature: 'metricas' },
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

        {/* ── CABECERA: 2 stats + tarjeta de métricas resumida ──────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>

          {/* Columna izquierda: Pendientes + Respondidos */}
          {canAccess(session, 'mensajes') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '0 0 auto' }}>
              <StatCard label="Pendientes"  value={mensajesLoading ? '…' : pendientes}      sub="sin responder" accent={pendientes > 0} />
              <StatCard label="Respondidos" value={mensajesLoading ? '…' : respondidosTotal} sub="en total" />
            </div>
          )}

          {/* Tarjeta ancha de métricas — resumen fijo de 5 páginas */}
          {canAccess(session, 'metricas') && (
            <div style={{
              flex: '1 1 300px',
              background: 'rgba(140,191,63,0.05)',
              border: '1.5px solid rgba(140,191,63,0.3)',
              borderRadius: 16, padding: '20px 22px',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4A7A34', margin: '0 0 6px' }}>
                Visitas · 30 días
              </p>
              <p style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1, color: '#1D1D1F' }}>
                {visitasError ? '—' : totalVisitas}
              </p>

              {visitasError ? (
                <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>Sin conexión con analytics_visitas</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {visitasResumen.map(({ label, n }) => (
                    <BarRow key={label} label={label} n={n} max={maxResumen} color="#8CBF3F" labelWidth={100} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
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
            <div style={{ position: 'relative', maxWidth: 360 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="2" strokeLinecap="round"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search" value={searchMsg} onChange={(e) => setSearchMsg(e.target.value)}
                placeholder="Buscar por nombre, mensaje o email…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '9px 12px 9px 34px', borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
                  fontSize: 13.5, outline: 'none', color: '#1D1D1F',
                }}
              />
            </div>

            {mensajesLoading && <p style={{ color: '#6E6E73', fontSize: 14 }}>Cargando mensajes…</p>}
            {!mensajesLoading && mensajes.length === 0 && (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6E6E73', fontSize: 14, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                No hay mensajes todavía.
              </div>
            )}
            {!mensajesLoading && mensajes.length > 0 && filteredMensajes.length === 0 && (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6E6E73', fontSize: 14, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                Sin resultados para "{searchMsg}".
              </div>
            )}
            {filteredMensajes.map((m) => {
              const estado = m.estado ?? 'pendiente'
              const esPendiente = estado === 'pendiente'
              return (
                <div key={m.id} style={{
                  borderRadius: 16, padding: '20px 22px', background: '#fff',
                  border: esPendiente ? '1px solid rgba(140,191,63,0.3)' : '1px solid rgba(0,0,0,0.08)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14.5, margin: '0 0 2px' }}>
                        {m.floristeria || <span style={{ color: '#6E6E73', fontWeight: 400 }}>Sin nombre</span>}
                      </p>
                      <span style={{ fontSize: 11, color: '#6E6E73' }}>{fmtDate(m.created_at)}</span>
                    </div>
                    <button onClick={() => toggleEstado(m.id)} style={{
                      fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                      border: 'none', cursor: 'pointer', flexShrink: 0,
                      background: esPendiente ? 'rgba(140,191,63,0.15)' : 'rgba(0,0,0,0.06)',
                      color: esPendiente ? '#4A7A34' : '#6E6E73',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {esPendiente ? 'Pendiente' : 'Respondido'}
                    </button>
                  </div>
                  <p style={{ fontSize: 14, color: '#1D1D1F', margin: '0 0 12px', lineHeight: 1.6, background: 'rgba(0,0,0,0.025)', borderRadius: 10, padding: '12px 14px' }}>
                    {m.mensaje}
                  </p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {m.email && (
                      <a href={`mailto:${m.email}`} style={{ fontSize: 12.5, color: '#4A7A34', textDecoration: 'none', fontWeight: 500 }}>
                        {m.email}
                      </a>
                    )}
                    {m.telefono && (
                      <a href={`tel:${m.telefono}`} style={{ fontSize: 12.5, color: '#6E6E73', textDecoration: 'none' }}>
                        {m.telefono}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: Catálogo ─────────────────────────────────────────────── */}
        {tab === 'catalogo' && canAccess(session, 'catalogo') && (
          <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6E6E73' }}>Catálogo</span>
              <span style={{ fontSize: 12, color: '#6E6E73' }}>{disponibles} de {productos.length} disponibles</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 620, fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.025)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    {['Producto', 'Categoría', 'Origen'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73' }}>{h}</th>
                    ))}
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73', textAlign: 'center', whiteSpace: 'nowrap' }}>En stock</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E73', textAlign: 'center', whiteSpace: 'nowrap' }}>Visible en catálogo</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => {
                    const s = CAT_STYLES[p.categoria] ?? CAT_FALLBACK
                    const enStock = p.en_stock !== false
                    const visible = p.visible !== false
                    return (
                      <tr key={p.id} style={i < productos.length - 1 ? ROW : undefined}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.nombre}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.pillBg, color: s.color }}>{p.categoria}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#6E6E73' }}>
                          {(Array.isArray(p.origen) ? p.origen : []).map((o) => ORIGEN_LABEL[o] || o).join(' · ')}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <button onClick={() => toggleCampo(p.id, 'en_stock')} style={{
                              position: 'relative', width: 36, height: 20, borderRadius: 100,
                              background: enStock ? '#8CBF3F' : 'rgba(0,0,0,0.12)',
                              border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                            }} aria-label={enStock ? 'Marcar sin stock' : 'Marcar en stock'}>
                              <span style={{
                                position: 'absolute', top: 2, left: 2, width: 16, height: 16,
                                borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                transition: 'transform 0.15s', transform: enStock ? 'translateX(16px)' : 'translateX(0)',
                              }} />
                            </button>
                            {!enStock && <span style={{ fontSize: 9, color: '#C98A1F', fontWeight: 700, whiteSpace: 'nowrap' }}>Consultar</span>}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <button onClick={() => toggleCampo(p.id, 'visible')} style={{
                              position: 'relative', width: 36, height: 20, borderRadius: 100,
                              background: visible ? '#8CBF3F' : 'rgba(0,0,0,0.12)',
                              border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                            }} aria-label={visible ? 'Ocultar en catálogo' : 'Mostrar en catálogo'}>
                              <span style={{
                                position: 'absolute', top: 2, left: 2, width: 16, height: 16,
                                borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                transition: 'transform 0.15s', transform: visible ? 'translateX(16px)' : 'translateX(0)',
                              }} />
                            </button>
                            {!visible && <span style={{ fontSize: 9, color: '#E0566E', fontWeight: 700, whiteSpace: 'nowrap' }}>Oculto</span>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: Métricas ─────────────────────────────────────────────── */}
        {tab === 'metricas' && canAccess(session, 'metricas') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {visitasError ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#6E6E73', fontSize: 14, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
                Sin conexión con analytics_visitas. Conecta Supabase para ver métricas detalladas.
              </div>
            ) : (
              <>
                {/* Productos más vistos */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6E6E73', margin: '0 0 16px' }}>
                    Productos más vistos · 30 días
                  </p>
                  {productosTop.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {productosTop.map(({ nombre, n }) => (
                        <BarRow key={nombre} label={nombre} n={n} max={productosTop[0].n} color="#C9A227" labelWidth={160} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: '#6E6E73', margin: 0 }}>Sin visitas a páginas de producto todavía.</p>
                  )}
                </div>

                {/* Canal de origen */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6E6E73', margin: '0 0 16px' }}>
                    Canal de origen · 30 días
                  </p>
                  {visitasPorOrigen.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {visitasPorOrigen.map(({ cat, n }) => (
                        <BarRow key={cat} label={cat} n={n} max={visitasPorOrigen[0].n} color="#4A7A34" labelWidth={120} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: '#6E6E73', margin: 0 }}>Esperando datos de origen…</p>
                  )}
                </div>

                {/* Todas las páginas — ranking dinámico completo */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6E6E73', margin: '0 0 16px' }}>
                    Todas las páginas · ranking · 30 días
                  </p>
                  {visitasPorPagina.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {visitasPorPagina.map(({ pagina, n }) => (
                        <BarRow key={pagina} label={pagina} n={n} max={visitasPorPagina[0].n} color="#8CBF3F" labelWidth={180} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: '#6E6E73', margin: 0 }}>Tracking activo, esperando visitas…</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
