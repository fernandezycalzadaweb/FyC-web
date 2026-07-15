import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { getSession, clearSession, hasPerm, PERMISSIONS } from '../../lib/auth'
import productosData from '../../data/products'

const MOCK_MENSAJES = [
  { id: 1, nombre: 'María García', floristeria: 'Flores del Centro', email: 'maria@floresdel.com', mensaje: 'Buenos días, me gustaría saber disponibilidad de peonías para mayo.', created_at: new Date(Date.now() - 3600000).toISOString(), leido: false },
  { id: 2, nombre: 'Juan López', floristeria: 'El Ramo', email: 'juan@elramo.es', mensaje: 'Consulta de precios para pedido semanal de rosas y alstroemerias.', created_at: new Date(Date.now() - 86400000).toISOString(), leido: true },
]

const MOCK_ANALYTICS = [
  { pagina: '/', visitas: 142 },
  { pagina: '/catalogo', visitas: 98 },
  { pagina: '/contacto', visitas: 44 },
  { pagina: '/nosotros', visitas: 21 },
]

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-card border border-mist rounded-[4px] p-5">
      <p className="mono-label text-[9.5px] text-leaf-dark/60 mb-2">{label}</p>
      <p className="font-serif text-[32px] font-semibold leading-none text-ink">{value}</p>
      {sub && <p className="text-[12px] text-ink/45 mt-1.5">{sub}</p>}
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
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          const meta = data.user.user_metadata
          setSession({ email: data.user.email, name: meta?.name || data.user.email, permissions: meta?.permissions || [] })
        }
      })
    } else {
      setSession(getSession())
    }
  }, [])

  const handleLogout = async () => {
    if (supabaseReady) await supabase.auth.signOut()
    else clearSession()
    navigate('/admin/login')
  }

  const toggleDisponible = (id) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, disponible: !p.disponible } : p))
    )
    // TODO: supabase.from('productos').update({ disponible }).eq('id', id)
  }

  const disponibles = productos.filter((p) => p.disponible).length
  const noLeidos = MOCK_MENSAJES.filter((m) => !m.leido).length

  const TABS = [
    { id: 'catalogo', label: 'Catálogo', show: hasPerm(session, PERMISSIONS.CATALOGO_EDIT) },
    { id: 'mensajes', label: `Mensajes${noLeidos ? ` (${noLeidos})` : ''}`, show: hasPerm(session, PERMISSIONS.MENSAJES_VIEW) },
    { id: 'metricas', label: 'Métricas', show: hasPerm(session, PERMISSIONS.METRICAS_VIEW) },
  ].filter((t) => t.show)

  return (
    <div className="min-h-screen bg-paper">
      {/* Topbar */}
      <div className="bg-ink-deep text-paper border-b border-paper/10">
        <div className="max-w-[1180px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-[4px] bg-leaf flex items-center justify-center text-paper font-serif font-bold text-xs select-none flex-shrink-0">
              FC
            </span>
            <span className="font-serif text-[14px] text-paper/80">Panel privado</span>
            {session?.name && (
              <span className="mono-label text-[9px] text-paper/30 px-2 py-0.5 rounded-sm border border-paper/10">
                {session.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[12.5px] text-paper/40 hover:text-paper/70 no-underline transition-colors">
              Ver web →
            </Link>
            <button
              onClick={handleLogout}
              className="text-[12.5px] text-paper/40 hover:text-paper/70 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Productos totales" value={productos.length} sub="en catálogo" />
          <StatCard label="Disponibles" value={disponibles} sub={`de ${productos.length}`} />
          {hasPerm(session, PERMISSIONS.MENSAJES_VIEW) && (
            <StatCard label="Mensajes nuevos" value={noLeidos} sub="sin leer" />
          )}
          {hasPerm(session, PERMISSIONS.METRICAS_VIEW) && (
            <StatCard label="Visitas (mock)" value={MOCK_ANALYTICS.reduce((a, p) => a + p.visitas, 0)} sub="últimos 30 días" />
          )}
        </div>

        {/* Tabs */}
        {TABS.length > 0 && (
          <div className="flex gap-0 border-b border-mist mb-6">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-5 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                  tab === id
                    ? 'border-leaf text-leaf'
                    : 'border-transparent text-ink/50 hover:text-ink/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── TAB: Catálogo ───────────────────────────────────────── */}
        {tab === 'catalogo' && hasPerm(session, PERMISSIONS.CATALOGO_EDIT) && (
          <div>
            <div className="overflow-x-auto rounded-[4px] border border-mist">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-card border-b border-mist">
                    <th className="text-left px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal">Producto</th>
                    <th className="text-left px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal hidden sm:table-cell">Categoría</th>
                    <th className="text-left px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal hidden md:table-cell">Origen</th>
                    <th className="text-center px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal">Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr key={p.id} className={`border-b border-mist/60 hover:bg-card/50 transition-colors ${i === productos.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-4 py-3 font-medium text-ink">{p.nombre}</td>
                      <td className="px-4 py-3 text-ink/60 hidden sm:table-cell">
                        <span className="mono-label text-[9px] px-2 py-0.5 rounded-sm bg-mist">{p.categoria}</span>
                      </td>
                      <td className="px-4 py-3 text-ink/60 hidden md:table-cell">
                        {p.origen.join(' · ')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleDisponible(p.id)}
                          className={`relative w-9 h-5 rounded-full transition-colors duration-150 ${
                            p.disponible ? 'bg-leaf' : 'bg-mist'
                          }`}
                          aria-label={p.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                              p.disponible ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mono-label text-[9.5px] text-ink/35 mt-3">
              Los cambios de disponibilidad se guardarán en Supabase cuando esté conectado.
            </p>
          </div>
        )}

        {/* ── TAB: Mensajes ───────────────────────────────────────── */}
        {tab === 'mensajes' && hasPerm(session, PERMISSIONS.MENSAJES_VIEW) && (
          <div className="flex flex-col gap-3">
            {MOCK_MENSAJES.map((m) => (
              <div
                key={m.id}
                className={`rounded-[4px] border p-5 ${m.leido ? 'border-mist bg-card/50' : 'border-leaf/25 bg-leaf/5'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <p className="font-medium text-[14px]">
                      {m.nombre}
                      {m.floristeria && (
                        <span className="text-ink/50 font-normal"> · {m.floristeria}</span>
                      )}
                    </p>
                    <a href={`mailto:${m.email}`} className="text-[12.5px] text-leaf no-underline hover:underline">
                      {m.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!m.leido && (
                      <span className="mono-label text-[9px] bg-leaf text-paper px-2 py-0.5 rounded-sm">
                        NUEVO
                      </span>
                    )}
                    <span className="mono-label text-[9px] text-ink/35">
                      {new Date(m.created_at).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p className="text-[13.5px] text-ink/70 leading-relaxed">{m.mensaje}</p>
              </div>
            ))}
            <p className="mono-label text-[9.5px] text-ink/35 mt-1">
              Datos de muestra — los mensajes reales se cargarán desde Supabase.
            </p>
          </div>
        )}

        {/* ── TAB: Métricas ───────────────────────────────────────── */}
        {tab === 'metricas' && hasPerm(session, PERMISSIONS.METRICAS_VIEW) && (
          <div>
            <div className="overflow-x-auto rounded-[4px] border border-mist">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-card border-b border-mist">
                    <th className="text-left px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal">Página</th>
                    <th className="text-right px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal">Visitas (30 d)</th>
                    <th className="text-right px-4 py-3 mono-label text-[9.5px] text-leaf-dark/60 font-normal hidden sm:table-cell">%</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = MOCK_ANALYTICS.reduce((a, p) => a + p.visitas, 0)
                    return MOCK_ANALYTICS.map(({ pagina, visitas }, i) => (
                      <tr key={pagina} className={`border-b border-mist/60 ${i === MOCK_ANALYTICS.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3 font-mono text-[12.5px] text-ink">{pagina}</td>
                        <td className="px-4 py-3 text-right font-semibold text-ink">{visitas}</td>
                        <td className="px-4 py-3 text-right text-ink/50 hidden sm:table-cell">
                          {((visitas / total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>
            <p className="mono-label text-[9.5px] text-ink/35 mt-3">
              Datos de muestra — las métricas reales se registrarán en la tabla analytics_visitas de Supabase.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
