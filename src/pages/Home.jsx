import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps'
import Seo from '../components/Seo'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL, toSlug } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'

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

// ── Carrusel ──────────────────────────────────────────────────────────────────
const HERO_IMAGES = [
  { src: '/images/hero/0449.jpg', label: 'Eryngium · Holanda',      position: 'center center' },
  { src: '/images/hero/0445.jpg', label: 'Poinsetia · Nacional',    position: 'center center' },
  { src: '/images/hero/0443.jpg', label: 'Alstroemeria · Colombia', position: 'center center' },
  { src: '/images/hero/0440.jpg', label: 'Clavel · Colombia',       position: 'center center' },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (HERO_IMAGES.length < 2) return
    const t = setInterval(() => setCurrent((i) => (i + 1) % HERO_IMAGES.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      style={{
        position: 'relative', borderRadius: 28, overflow: 'hidden',
        aspectRatio: '5/6',
        boxShadow: '0 30px 60px -30px rgba(0,0,0,0.25)',
      }}
    >
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.label}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: img.position,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute', left: 20, bottom: 20,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
          padding: '8px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 7,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8A9A63', flexShrink: 0 }} />
        {HERO_IMAGES[current].label}
      </div>
      {HERO_IMAGES.length > 1 && (
        <div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 5 }}>
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 18 : 6, height: 6, borderRadius: 100,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s',
              }}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Catálogo preview ──────────────────────────────────────────────────────────
const PREVIEW_NAMES = ['Anastasia', 'Alstroemeria', 'Rosa Roja', 'Mini Clavel']

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

function MapSVG() {
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(140,191,63,0.04)', border: '1px solid rgba(140,191,63,0.12)' }}>
      <style>{`
        @keyframes rsm-march { to { stroke-dashoffset: -18; } }
      `}</style>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [-28, 22] }}
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
                fill={HIGHLIGHTED.has(geo.id) ? 'rgba(140,191,63,0.55)' : '#D6D6D6'}
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
      <header style={{ padding: '80px 0 72px' }}>
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

            {/* Columna del carrusel — ancho máximo 500px, centrado */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 500 }}>
                <HeroCarousel />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
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

          {/* Lista de países — horizontal, sin cifras */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {origenesCounts.map(({ key, label }) => (
              <div key={key} style={{ flex: '1 1 150px', padding: '16px 0 16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', marginRight: 32 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
