import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'

// ── Carrusel ──────────────────────────────────────────────────────────────────
// Para añadir imágenes en el futuro, basta con añadir entradas a este array.
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
      {/* Glass tag */}
      <div
        style={{
          position: 'absolute', left: 20, bottom: 20,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
          padding: '8px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 7,
          transition: 'opacity 0.3s',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8A9A63', flexShrink: 0 }} />
        {HERO_IMAGES[current].label}
      </div>
      {/* Dots */}
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

// ── Mapa de origen (traído desde Nosotros) ────────────────────────────────────
const ORIGIN_KEYS = ['Colombia', 'Ecuador', 'Holanda', 'Nacional']

function MapSVG() {
  return (
    <svg viewBox="0 0 500 340" style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Mapa de rutas de origen">
      <rect width="500" height="340" rx="20" fill="rgba(0,0,0,0.03)" />
      <path d="M 110 230 C 180 160 310 130 370 120" fill="none" stroke="#8CBF3F" strokeWidth="1.8" strokeDasharray="5 4" style={{ animation: 'route-flow 2s linear infinite' }} />
      <path d="M 95 258 C 180 190 310 140 370 120" fill="none" stroke="#8CBF3F" strokeWidth="1.8" strokeDasharray="5 4" style={{ animation: 'route-flow 2.4s linear infinite' }} />
      <path d="M 370 78 C 370 94 370 107 370 120" fill="none" stroke="#8CBF3F" strokeWidth="1.8" strokeDasharray="5 4" style={{ animation: 'route-flow 1.4s linear infinite' }} />
      <circle cx="370" cy="120" r="10" fill="rgba(74,122,52,0.15)" />
      <circle cx="370" cy="120" r="5" fill="#4A7A34" />
      <text x="384" y="124" fontSize="11" fill="#1D1D1F" fontFamily="Inter,sans-serif" fontWeight="600">España</text>
      <circle cx="370" cy="68" r="4.5" fill="#6E6E73" />
      <text x="382" y="72" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">Holanda</text>
      <circle cx="110" cy="230" r="4.5" fill="#6E6E73" />
      <text x="120" y="234" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">Colombia</text>
      <circle cx="95" cy="258" r="4.5" fill="#6E6E73" />
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
            De Holanda, Colombia y Ecuador,{' '}
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
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { display: '3',           size: 'clamp(40px,5.5vw,60px)', label: 'países de origen' },
            { display: 'Sin mínimo',  size: 'clamp(20px,2.8vw,30px)', label: 'pedidos a tu medida' },
            { display: 'Trato directo', size: 'clamp(18px,2.5vw,26px)', label: 'contacto personal' },
          ].map(({ display, size, label }) => (
            <div key={label}>
              <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.02em', color: '#1D1D1F', lineHeight: 1.1 }}>
                {display}
              </div>
              <div style={{ fontSize: 14, color: '#6E6E73', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 PASOS — fondo verde muy sutil ───────────────────────── */}
      <section style={{ background: 'rgba(140,191,63,0.07)', borderBottom: '1px solid rgba(140,191,63,0.12)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Así de fácil es pedir
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
            {[
              { n: '01', title: 'Nos escribes',   text: 'Por WhatsApp, email o teléfono, lo que te venga mejor.' },
              { n: '02', title: 'Te confirmamos', text: 'Disponibilidad y precio de lo que necesites, al momento.' },
              { n: '03', title: 'Lo recibes',     text: 'Envío express directo desde origen a tu floristería.' },
            ].map(({ n, title, text }) => (
              <div key={n}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#4A7A34', marginBottom: 8 }}>{n}</div>
                <strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>{title}</strong>
                <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>{text}</p>
              </div>
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
            {/* Left: copy + origin table */}
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
            {/* Right: map */}
            <div>
              <MapSVG />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
