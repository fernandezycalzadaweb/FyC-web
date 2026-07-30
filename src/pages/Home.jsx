import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productos, { CAT_STYLES, ORIGEN_LABEL } from '../data/products'

// 8 productos de muestra para el Home — variedad de categorías
const PREVIEW_IDS = ['col-07', 'col-08', 'hol-09', 'hol-13', 'col-01', 'ver-01', 'pla-01', 'acc-01']
const preview = PREVIEW_IDS.map((id) => productos.find((p) => p.id === id)).filter(Boolean)

const WA_URL = 'https://wa.me/34923182222'

// Origen display: Nacional → España, join multi-origen
function origenStr(p) {
  return p.origen.map((o) => ORIGEN_LABEL[o] || o).join(' / ')
}

function CatalogRow({ product }) {
  const s = CAT_STYLES[product.categoria]
  const [imgOk, setImgOk] = useState(true)

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 4px', borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {/* Foto o bloque de color */}
      {product.imagen && imgOk ? (
        <img
          src={product.imagen}
          alt={product.nombre}
          onError={() => setImgOk(false)}
          style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: 52, height: 52, borderRadius: 12, flexShrink: 0,
            background: s.placeholderBg,
          }}
        />
      )}

      <span style={{ fontWeight: 600, fontSize: 15.5, flex: 1 }}>{product.nombre}</span>
      <span style={{ fontSize: 13.5, color: '#6E6E73' }} className="hidden sm:block">
        {origenStr(product)}
      </span>
      <span
        style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
          background: s.pillBg, color: s.color,
          minWidth: 96, textAlign: 'center', flexShrink: 0,
        }}
      >
        {product.categoria}
      </span>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Seo path="/" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header style={{ padding: '88px 0 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6E6E73', marginBottom: 10 }}>
            Mayoristas de flor y planta · Salamanca
          </p>
          <h1
            style={{
              fontSize: 'clamp(38px, 6.4vw, 84px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              margin: '0 auto 14px',
              maxWidth: '15ch',
            }}
          >
            Del vivero a tu{' '}
            <span style={{ color: '#4A7A34' }}>floristería.</span>
          </h1>
          <p
            style={{
              fontSize: 18, color: '#6E6E73',
              maxWidth: '34ch', margin: '0 auto 32px',
            }}
          >
            Flor cortada, verdes y planta, importados directamente del productor,
            con envío express a tu floristería.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 56, flexWrap: 'wrap' }}>
            <Link to="/contacto" className="btn btn-primary">
              Consulta disponibilidad de esta semana
            </Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        {/* Foto hero */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              borderRadius: 28, overflow: 'hidden', position: 'relative',
              boxShadow: '0 30px 60px -30px rgba(0,0,0,0.25)',
            }}
          >
            <img
              src="/images/productos/hortensia-rosa.jpg"
              alt="Hortensia rosa"
              style={{ width: '100%', height: 'min(56vw, 520px)', objectFit: 'cover', display: 'block' }}
            />
            {/* Glass tag */}
            <div
              style={{
                position: 'absolute', left: 20, bottom: 20,
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                padding: '8px 14px', borderRadius: 100,
                fontSize: 12.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8A9A63', flexShrink: 0 }} />
              Hortensia rosa · España
            </div>
          </div>
        </div>
      </header>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div
          style={{
            maxWidth: 1120, margin: '0 auto', padding: '0 24px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32, textAlign: 'center',
          }}
        >
          {[
            { num: productos.length, label: 'variedades activas' },
            { num: 'Express', label: 'envío directo desde origen' },
            { num: 3, label: 'países de origen' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#1D1D1F',
                }}
              >
                {num}
              </div>
              <div style={{ fontSize: 14, color: '#6E6E73', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 PASOS ───────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 64px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', paddingTop: 72 }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 32px' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Así de fácil es pedir
            </h2>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}
          >
            {[
              { n: '01', title: 'Nos escribes', text: 'Por WhatsApp, email o teléfono, lo que te venga mejor.' },
              { n: '02', title: 'Te confirmamos', text: 'Disponibilidad y precio de lo que necesites, al momento.' },
              { n: '03', title: 'Lo recibes', text: 'Envío express directo desde origen a tu floristería.' },
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

      {/* ── CATÁLOGO (preview) ────────────────────────────────────── */}
      <section style={{ padding: '88px 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2
              style={{
                fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800,
                letterSpacing: '-0.02em', margin: '0 0 10px',
              }}
            >
              El catálogo
            </h2>
            <p style={{ fontSize: 16, color: '#6E6E73', margin: 0 }}>
              Una selección de lo que trabajamos esta semana.
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
    </>
  )
}
