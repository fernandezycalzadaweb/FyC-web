import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL } from '../data/products'
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

// ── Carrusel ──────────────────────────────────────────────────────────────────
const HERO_IMAGES = [
  { src: '/images/productos/hortensia-rosa.jpg', label: 'Hortensia rosa · Colombia' },
  { src: '/images/productos/hortensia-azul.jpg', label: 'Hortensia azul · Colombia' },
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
        height: 'min(56vw, 520px)',
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
const PREVIEW_NAMES = ['Hortensia rosa', 'Hortensia azul', 'Tulipán', 'Peonía', 'Rosa', 'Eucalipto', 'Poinsetia', 'Envoltorios']

function CatalogRow({ product }) {
  const s = CAT_STYLES[product.categoria]
  const [imgOk, setImgOk] = useState(true)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 4px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      {product.imagen && imgOk ? (
        <img
          src={product.imagen}
          alt={product.nombre}
          onError={() => setImgOk(false)}
          style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, background: s.placeholderBg }} />
      )}
      <span style={{ fontWeight: 600, fontSize: 15.5, flex: 1 }}>{product.nombre}</span>
      <span style={{ fontSize: 13.5, color: '#6E6E73' }} className="hidden sm:block">
        {product.origen.map((o) => ORIGEN_LABEL[o] || o).join(' / ')}
      </span>
      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: s.pillBg, color: s.color, minWidth: 96, textAlign: 'center', flexShrink: 0 }}>
        {product.categoria}
      </span>
    </div>
  )
}

// ── Mapa de origen ────────────────────────────────────────────────────────────
const ORIGIN_KEYS = ['Colombia', 'Ecuador', 'Holanda', 'Nacional']

function MapSVG() {
  return (
    <svg viewBox="0 0 500 340" style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Mapa de rutas de origen">

      {/* Fondo oceánico */}
      <rect width="500" height="340" rx="20" fill="rgba(140,191,63,0.04)" />

      {/* Líneas de cuadrícula sutiles (sensación de mapa) */}
      <line x1="0" y1="170" x2="500" y2="170" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      <line x1="250" y1="0" x2="250" y2="340" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />

      {/* ── MASAS DE TIERRA ── */}

      {/* Continente SA — extensión esquina inferior-izquierda */}
      <path
        d="M 68,200 C 46,192 20,190 0,194 L 0,340 L 110,340 C 100,318 90,304 90,306 C 84,316 76,308 70,298 C 64,286 60,270 60,252 C 60,232 62,216 68,200 Z"
        fill="rgba(140,191,63,0.08)"
      />

      {/* Colombia + Ecuador — masa principal (noroeste de SA) */}
      <path
        d="M 80,205 C 90,190 108,184 126,188 C 146,193 162,208 166,226 C 168,242 162,257 150,265 C 140,271 128,270 120,279 C 113,288 110,302 102,308 C 93,312 82,308 74,298 C 66,286 62,270 62,252 C 62,232 68,214 80,205 Z"
        fill="rgba(140,191,63,0.16)" stroke="rgba(74,122,52,0.4)" strokeWidth="1.2"
      />

      {/* Europa continental — extensión esquina superior-derecha */}
      <path
        d="M 342,70 C 350,50 366,30 392,16 C 422,2 470,0 500,0 L 500,0 L 378,0 C 362,8 350,22 346,38 C 342,50 338,62 342,70 Z"
        fill="rgba(140,191,63,0.08)"
      />

      {/* Península Ibérica (España) */}
      <path
        d="M 342,90 C 352,78 366,74 382,76 C 398,80 410,94 412,112 C 412,130 404,148 390,158 C 375,166 358,164 346,154 C 334,144 328,128 330,110 C 332,98 338,92 342,90 Z"
        fill="rgba(140,191,63,0.16)" stroke="rgba(74,122,52,0.4)" strokeWidth="1.2"
      />

      {/* Países Bajos (Holanda) */}
      <path
        d="M 358,56 C 366,50 376,50 384,56 C 390,62 390,72 384,78 C 376,84 364,84 358,78 C 352,72 352,62 358,56 Z"
        fill="rgba(140,191,63,0.16)" stroke="rgba(74,122,52,0.4)" strokeWidth="1.2"
      />

      {/* Costa atlántica Francia (conecta Holanda con Iberia) */}
      <path
        d="M 358,78 C 350,84 344,90 342,92"
        fill="none" stroke="rgba(74,122,52,0.3)" strokeWidth="1"
      />

      {/* ── RUTAS ── */}
      <path d="M 110 230 C 180 160 310 130 370 120" fill="none" stroke="#8CBF3F" strokeWidth="1.8" strokeDasharray="5 4" style={{ animation: 'route-flow 2s linear infinite' }} />
      <path d="M 95 258 C 180 190 310 140 370 120" fill="none" stroke="#8CBF3F" strokeWidth="1.8" strokeDasharray="5 4" style={{ animation: 'route-flow 2.4s linear infinite' }} />
      <path d="M 370 78 C 370 94 370 107 370 120" fill="none" stroke="#8CBF3F" strokeWidth="1.8" strokeDasharray="5 4" style={{ animation: 'route-flow 1.4s linear infinite' }} />

      {/* ── PUNTOS ── */}
      <circle cx="370" cy="120" r="10" fill="rgba(74,122,52,0.15)" />
      <circle cx="370" cy="120" r="5" fill="#4A7A34" />
      <circle cx="370" cy="68" r="4.5" fill="#6E6E73" />
      <circle cx="110" cy="230" r="4.5" fill="#6E6E73" />
      <circle cx="95" cy="258" r="4.5" fill="#6E6E73" />

      {/* ── ETIQUETAS ── */}
      <text x="384" y="124" fontSize="11" fill="#1D1D1F" fontFamily="Inter,sans-serif" fontWeight="600">España</text>
      <text x="382" y="72" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">Holanda</text>
      <text x="120" y="234" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">Colombia</text>
      <text x="105" y="262" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">Ecuador</text>

    </svg>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Home() {
  useTrackVisit('/')

  const [productos, setProductos] = useState(productosStatic)

  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('productos').select('*').eq('disponible', true)
      .then(({ data, error }) => { if (!error && data?.length) setProductos(data) })
  }, [])

  const preview = PREVIEW_NAMES.map((name) => productos.find((p) => p.nombre === name)).filter(Boolean)

  const origenesCounts = ORIGIN_KEYS.map((key) => ({
    key, label: ORIGEN_LABEL[key],
    count: productos.filter((p) => p.origen.includes(key)).length,
  }))

  const STATS = [
    { icon: <IconGlobe />, display: '3', size: 'clamp(40px,5.5vw,60px)', label: 'países de origen' },
    { icon: <IconPackage />, display: 'A tu medida', size: 'clamp(18px,2.6vw,28px)', label: 'pedidos sin cantidad mínima' },
    { icon: <IconChat />, display: 'Trato directo', size: 'clamp(17px,2.4vw,26px)', label: 'respondemos tu solicitud de forma personal en el día' },
  ]

  const STEPS = [
    { num: '1', title: 'Nos contactas',   text: 'Por nuestro formulario, email o teléfono, contándonos tus necesidades.' },
    { num: '2', title: 'Te confirmamos',  text: 'Disponibilidad y precio de lo que necesites, en horas.' },
    { num: '3', title: 'Lo recibes',      text: 'Envío express desde nuestras instalaciones en Salamanca.' },
  ]

  return (
    <>
      <Seo path="/" />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <header style={{ padding: '80px 0 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6E6E73', marginBottom: 12 }}>
            Distribuidores de flor y planta · Salamanca
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 5.5vw, 72px)',
              fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05,
              margin: '0 auto 16px', maxWidth: '18ch',
            }}
          >
            Desde Holanda, Colombia y Ecuador,{' '}
            <span style={{ color: '#4A7A34' }}>a tu medida.</span>
          </h1>
          <p style={{ fontSize: 17, color: '#6E6E73', maxWidth: '44ch', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Compramos flor y planta de calidad y la distribuimos desde Salamanca a floristerías
            y viveros, en la cantidad que necesites.
          </p>
          <div style={{ marginBottom: 52 }}>
            <Link to="/contacto" className="btn btn-primary">
              Contáctanos
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <HeroCarousel />
        </div>
      </header>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {STATS.map(({ icon, display, size, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ marginBottom: 14, opacity: 0.9 }}>{icon}</div>
              <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', lineHeight: 1.1, marginBottom: 6 }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
            {STEPS.map((step, i) => (
              <Fragment key={step.num}>
                <div style={{ flex: '1 1 190px', background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
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
                  <div className="hidden md:flex" style={{ alignItems: 'center', paddingTop: 34, color: 'rgba(74,122,52,0.5)', fontSize: 24, flexShrink: 0 }}>
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

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {preview.map((p) => <CatalogRow key={p.id} product={p} />)}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/catalogo" className="btn btn-ghost">
              Ver catálogo completo ({productos.length} variedades) →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DE DÓNDE VIENE (mapa de origen) ──────────────────────── */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 48px' }}>
            De dónde viene cada flor
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 56 }}>
            <div>
              <p style={{ fontSize: 16, color: '#6E6E73', margin: '0 0 32px', lineHeight: 1.65 }}>
                Trabajamos directamente con productores en Colombia, Ecuador y Holanda,
                y completamos la oferta con género nacional de temporada.
              </p>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                {origenesCounts.map(({ key, label, count }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{label}</span>
                    <span style={{ fontSize: 13, color: '#6E6E73' }}>
                      {count} {count === 1 ? 'variedad' : 'variedades'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <MapSVG />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
