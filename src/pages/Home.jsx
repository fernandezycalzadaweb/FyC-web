import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps'
import Seo from '../components/Seo'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL, toSlug } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'
import { useCesta } from '../context/CestaContext'

// ── Iconos inline (stroke thin, coherentes) ───────────────────────────────────
function IconGlobe() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A7A34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
function IconPackage() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A7A34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}
function IconChat() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A7A34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconLightning() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A7A34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// ── Vídeo hero ────────────────────────────────────────────────────────────────
// Archivo: public/videos/portada.mp4 (608×1080, vertical 0.563, 8s, sin audio)
// El contenedor tiene aspectRatio 5/6 (0.833) — más ancho que el vídeo,
// por lo que object-fit:cover recortará los lados del vídeo manteniendo el centro.
function HeroVideo() {
  return (
    <div
      style={{
        position: 'relative', borderRadius: 28, overflow: 'hidden',
        aspectRatio: '7/8',
        boxShadow: '0 30px 60px -30px rgba(0,0,0,0.25)',
      }}
    >
      <video
        src="/videos/portada.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center center',
        }}
      />
    </div>
  )
}

// ── Catálogo preview ──────────────────────────────────────────────────────────
const PREVIEW_NAMES = ['Anastasia/Cremón Natural', 'Alstroemeria', 'Rosa Roja', 'Lilium Oriental']

const CAT_FALLBACK = { color: '#6E6E73', pillBg: 'rgba(0,0,0,0.08)', placeholderBg: 'rgba(0,0,0,0.05)' }

function PreviewCard({ product }) {
  const s = CAT_STYLES[product.categoria] ?? CAT_FALLBACK
  const [imgOk, setImgOk] = useState(true)

  return (
    <Link
      to={`/catalogo/${toSlug(product.nombre)}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
    <div
      style={{
        background: '#fff', borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.15s, transform 0.15s',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <div style={{ position: 'relative', paddingBottom: '72%', flexShrink: 0 }}>
        {product.imagen && imgOk ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            onError={() => setImgOk(false)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: s.placeholderBg }} />
        )}
        <span
          style={{
            position: 'absolute', top: 10, right: 10,
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
            background: 'rgba(255,255,255,0.92)', color: s.color,
            backdropFilter: 'blur(4px)',
          }}
        >
          {product.categoria}
        </span>
      </div>
      <div style={{ padding: '14px 16px 16px', flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4, lineHeight: 1.3 }}>
          {product.nombre}
        </div>
        <div style={{ fontSize: 12.5, color: '#6E6E73' }}>
          {product.origen.map((o) => ORIGEN_LABEL[o] || o).join(' / ')}
        </div>
      </div>
    </div>
    </Link>
  )
}

// ── Mapa de origen (react-simple-maps + world-atlas topojson) ─────────────────
const ORIGIN_KEYS = ['Colombia', 'Ecuador', 'Holanda', 'Nacional']

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric codes
const HIGHLIGHTED = new Set([724, 528, 170, 218]) // España, Holanda, Colombia, Ecuador

// [longitude, latitude]
const PAISES = [
  { coords: [-3.7, 40.4],  label: 'España',   isHub: true,  anchor: 'start' },
  { coords: [4.9, 52.4],   label: 'Holanda',  isHub: false, anchor: 'start' },
  { coords: [-74.1, 4.7],  label: 'Colombia', isHub: false, anchor: 'start' },
  { coords: [-78.5, -0.2], label: 'Ecuador',  isHub: false, anchor: 'start' },
]

const RUTAS = [
  { from: [4.9, 52.4],   to: [-3.7, 40.4], delay: '0s' },    // Holanda → España
  { from: [-74.1, 4.7],  to: [-3.7, 40.4], delay: '0.6s' },  // Colombia → España
  { from: [-78.5, -0.2], to: [-3.7, 40.4], delay: '1.2s' },  // Ecuador → España
]

const ORIGEN_FOTOS = [
  {
    label: 'España',
    sublabel: 'Género nacional de temporada',
    fotos: [
      { src: '/images/productos/girasol.jpg', alt: 'Girasol' },
      { src: '/images/productos/camelia2.jpg', alt: 'Camelia' },
      { src: '/images/productos/eucalipto.jpg', alt: 'Eucalipto' },
    ],
  },
  {
    label: 'Holanda',
    sublabel: 'Importación directa',
    fotos: [
      { src: '/images/productos/tulipan.jpg', alt: 'Tulipán' },
      { src: '/images/productos/peonia.jpg', alt: 'Peonía' },
      { src: '/images/productos/liliumoriental.jpg', alt: 'Lilium oriental' },
    ],
  },
  {
    label: 'Colombia',
    sublabel: 'Importación directa',
    fotos: [
      { src: '/images/productos/rosaexplorer.jpg', alt: 'Rosa Explorer' },
      { src: '/images/productos/clavelrojo.jpg', alt: 'Clavel rojo' },
      { src: '/images/productos/anastasianatural2.jpg', alt: 'Anastasia natural' },
    ],
  },
  {
    label: 'Ecuador',
    sublabel: 'Importación directa',
    fotos: [
      { src: '/images/productos/rosaexplorer.jpg', alt: 'Rosa Explorer' },
      { src: '/images/productos/alstroemeria.jpg', alt: 'Alstroemeria' },
      { src: '/images/productos/paniculata.jpg', alt: 'Paniculata' },
    ],
  },
]

function MapSVG() {
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', background: '#FAFAF5', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <style>{`
        @keyframes rsm-march { to { stroke-dashoffset: -18; } }
      `}</style>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 200, center: [-38, 26] }}
        width={800}
        height={400}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label="Mapa de rutas de origen"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={HIGHLIGHTED.has(geo.id) ? 'rgba(140,191,63,0.60)' : '#DDD5BC'}
                stroke="#fff"
                strokeWidth={0.5}
                style={{ outline: 'none' }}
              />
            ))
          }
        </Geographies>

        {/* Rutas animadas */}
        {RUTAS.map((r, i) => (
          <Line
            key={i}
            from={r.from}
            to={r.to}
            stroke="#4A7A34"
            strokeWidth={1.6}
            strokeDasharray="5,4"
            strokeLinecap="round"
            fill="none"
            style={{ animation: `rsm-march 1.8s linear infinite`, animationDelay: r.delay }}
          />
        ))}

        {/* Marcadores */}
        {PAISES.map(({ coords, label, isHub }) => (
          <Marker key={label} coordinates={coords}>
            {isHub ? (
              <>
                <circle r={8} fill="rgba(74,122,52,0.18)" />
                <circle r={4.5} fill="#4A7A34" />
              </>
            ) : (
              <circle r={3.5} fill="#6E6E73" />
            )}
            <text
              textAnchor="start"
              x={isHub ? 10 : 7}
              y={isHub ? 4 : 4}
              style={{
                fontSize: isHub ? 10 : 9,
                fontWeight: isHub ? 700 : 500,
                fill: isHub ? '#1D1D1F' : '#6E6E73',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {label}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}

// ── Banner newsletter ─────────────────────────────────────────────────────────
const NEWSLETTER_KEY = 'fyc_newsletter_visto'

function BannerNewsletter() {
  const { count } = useCesta()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (localStorage.getItem(NEWSLETTER_KEY)) return
    let fired = false
    const trigger = () => {
      if (fired) return
      fired = true
      window.removeEventListener('scroll', onScroll)
      clearTimeout(fallback)
      setVisible(true)
    }
    const onScroll = () => { if (window.scrollY > 400) trigger() }
    const fallback = setTimeout(trigger, 8000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(fallback)
    }
  }, [])

  if (!visible) return null

  const cerrar = () => {
    localStorage.setItem(NEWSLETTER_KEY, '1')
    setVisible(false)
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (!email.trim() || estado === 'enviando' || estado === 'ok') return
    setEstado('enviando')
    const { error } = await supabase.from('newsletter_suscriptores').insert({ email: email.trim() })
    if (error) {
      setEstado('error')
    } else {
      setEstado('ok')
      localStorage.setItem(NEWSLETTER_KEY, '1')
      setTimeout(() => setVisible(false), 2500)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fyc-slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        ...(isMobile
          ? { bottom: count > 0 ? 64 : 0, left: 0, right: 0 }
          : { bottom: 24, right: 24, width: 340 }),
        zIndex: 80,
        animation: 'fyc-slideUp 0.35s ease',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? '20px 20px 0 0' : 24,
          boxShadow: isMobile ? '0 -4px 32px rgba(0,0,0,0.12)' : '0 12px 48px rgba(0,0,0,0.16)',
          padding: '28px 26px 30px',
          position: 'relative',
        }}>

          <button onClick={cerrar} aria-label="Cerrar" style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
            width: 28, height: 28, cursor: 'pointer', color: '#6E6E73',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>

          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(140,191,63,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="12" cy="6.5" rx="2.5" ry="4"
                  fill="rgba(74,122,52,0.28)" stroke="#4A7A34" strokeWidth="1.2"
                  transform={`rotate(${deg} 12 12)`} />
              ))}
              <circle cx="12" cy="12" r="3" fill="#8CBF3F" />
            </svg>
          </div>

          <h3 style={{
            fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em',
            margin: '0 0 8px', color: '#1D1D1F', paddingRight: 24,
          }}>
            No te pierdas el género de temporada
          </h3>
          <p style={{ fontSize: 13.5, color: '#6E6E73', margin: '0 0 18px', lineHeight: 1.55 }}>
            Avísanos y te escribimos cuando llega Peonía, Poinsetia y otras variedades de temporada limitada.
          </p>

          {estado === 'ok' ? (
            <p style={{ fontSize: 14, fontWeight: 700, color: '#4A7A34', margin: 0 }}>
              ¡Gracias! Te avisaremos cuando llegue.
            </p>
          ) : (
            <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="email" required placeholder="tu@floristeria.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '10px 14px', borderRadius: 100, fontSize: 13.5,
                  border: '1.5px solid rgba(0,0,0,0.14)', outline: 'none',
                  background: '#FAFAF9', width: '100%', boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#8CBF3F')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(0,0,0,0.14)')}
              />
              <button type="submit" disabled={estado === 'enviando'} style={{
                padding: '11px 20px', borderRadius: 100,
                background: '#8CBF3F', border: 'none',
                fontSize: 13.5, fontWeight: 700,
                cursor: estado === 'enviando' ? 'default' : 'pointer',
                color: '#fff', opacity: estado === 'enviando' ? 0.7 : 1,
              }}>
                {estado === 'enviando' ? 'Enviando…' : 'Avisadme'}
              </button>
              {estado === 'error' && (
                <p style={{ fontSize: 12.5, color: '#C0392B', margin: 0, textAlign: 'center' }}>
                  Algo ha ido mal. Inténtalo de nuevo.
                </p>
              )}
              <p style={{ fontSize: 11.5, color: '#8A8A8E', margin: '2px 0 0', textAlign: 'center' }}>
                Sin spam, solo avisos puntuales de temporada.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Home() {
  useTrackVisit('/')

  const [productos, setProductos] = useState(productosStatic)

  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('productos').select('*').eq('visible', true)
      .then(({ data, error }) => { if (!error && data?.length) setProductos(data) })
  }, [])

  const preview = PREVIEW_NAMES.map((name) => productos.find((p) => p.nombre === name)).filter(Boolean)

  const origenesCounts = ORIGIN_KEYS.map((key) => ({
    key, label: ORIGEN_LABEL[key],
    count: productos.filter((p) => Array.isArray(p.origen) && p.origen.includes(key)).length,
  }))

  const STATS = [
    { icon: <IconPackage />, display: 'A tu medida', label: 'pedidos sin cantidad mínima' },
    { icon: <IconGlobe />, display: '+3 países de origen', label: 'Colombia, Ecuador y Holanda' },
    { icon: <IconLightning />, display: 'Envío express', label: 'Pide por la mañana y recíbelo la misma tarde en Salamanca y provincias limítrofes' },
    { icon: <IconChat />, display: 'Trato directo', label: 'respondemos tu solicitud de forma personal en el día' },
  ]

  const STEPS = [
    { num: '1', title: 'Nos contactas',   text: 'Por nuestro teléfono, mail, WhatsApp o formulario.' },
    { num: '2', title: 'Te confirmamos',  text: 'Disponibilidad y precio de lo que necesites.' },
    { num: '3', title: 'Lo recibes',      text: 'Envío express a Salamanca y provincia.' },
  ]

  return (
    <>
      <Seo path="/" />

      {/* ── HERO — dos columnas: texto izquierda, foto derecha ────── */}
      <header style={{ padding: '28px 0 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(40px, 6vw, 72px)',
            alignItems: 'center',
          }}>

            {/* Columna de texto */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6E6E73', marginTop: 0, marginBottom: 16 }}>
                Distribuidor de flores naturales · Salamanca
              </p>
              <h1 style={{
                fontSize: 'clamp(30px, 4vw, 58px)',
                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05,
                margin: '0 0 20px',
              }}>
                Desde Holanda, Colombia y Ecuador,{' '}
                <span style={{ color: '#4A7A34' }}>a tu medida.</span>
              </h1>
              <p style={{ fontSize: 17, color: '#6E6E73', margin: '0 0 36px', lineHeight: 1.6 }}>
                Flor y planta de primera calidad, seleccionada en origen y servida desde Salamanca a tu medida.
              </p>
              <Link to="/contacto" className="btn btn-primary">
                Contáctanos
              </Link>
            </div>

            {/* Columna del vídeo — ancho máximo 500px, centrado */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 500 }}>
                <HeroVideo />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {STATS.map(({ icon, display, label }) => (
            <div
              key={display}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                background: 'rgba(140,191,63,0.05)',
                border: '1px solid rgba(140,191,63,0.15)',
                borderRadius: 16,
                padding: '32px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(140,191,63,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18, flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{ fontSize: 'clamp(15px,2vw,18px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', lineHeight: 1.2, marginBottom: 8 }}>
                {display}
              </div>
              <div style={{ fontSize: 13.5, color: '#6E6E73', lineHeight: 1.5, maxWidth: '18ch' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 PASOS ───────────────────────────────────────────────── */}
      <section style={{ background: 'rgba(140,191,63,0.13)', borderBottom: '1px solid rgba(140,191,63,0.18)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Así de fácil es pedir
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
            {STEPS.map((step, i) => (
              <Fragment key={step.num}>
                <div style={{ flex: '1 1 190px', background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#4A7A34', color: '#fff',
                    fontSize: 15, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 18,
                  }}>
                    {step.num}
                  </div>
                  <strong style={{ fontSize: 15.5, display: 'block', marginBottom: 8, letterSpacing: '-0.01em' }}>{step.title}</strong>
                  <p style={{ color: '#6E6E73', fontSize: 14, margin: 0, lineHeight: 1.65 }}>{step.text}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex" style={{ alignItems: 'center', justifyContent: 'center', color: 'rgba(74,122,52,0.5)', fontSize: 24, flexShrink: 0 }}>
                    →
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── MUESTRA DEL CATÁLOGO ──────────────────────────────────── */}
      <section style={{ padding: '88px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              Una muestra de lo que ofrecemos
            </h2>
            <p style={{ fontSize: 16, color: '#6E6E73', margin: 0 }}>
              Flor cortada, verdes y planta, con origen en tres países.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {preview.map((p) => <PreviewCard key={p.id} product={p} />)}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/catalogo" className="btn btn-ghost" style={{ whiteSpace: 'normal', maxWidth: '100%', textAlign: 'center', lineHeight: 1.4 }}>
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DE DÓNDE VIENE (mapa de origen) ──────────────────────── */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px' }}>
              De dónde viene cada flor
            </h2>
            <p style={{ fontSize: 16, color: '#6E6E73', margin: 0, lineHeight: 1.65 }}>
              Trabajamos directamente con productores en Colombia, Ecuador y Holanda,
              y completamos la oferta con género nacional de temporada.
            </p>
          </div>

          {/* Mapa protagonista — ancho completo */}
          <div style={{ marginBottom: 40 }}>
            <MapSVG />
          </div>

          {/* Tarjetas de país con fotos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 20,
            marginTop: 8,
          }}>
            {ORIGEN_FOTOS.map(({ label, sublabel, fotos }) => (
              <div
                key={label}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid rgba(0,0,0,0.07)',
                  padding: '18px 18px 22px',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 12.5, color: '#8E8E93', marginBottom: 16 }}>{sublabel}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {fotos.map(f => (
                    <img
                      key={f.alt}
                      src={f.src}
                      alt={f.alt}
                      style={{
                        width: 64, height: 64,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BannerNewsletter />
    </>
  )
}
