import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL, toSlug } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'
import { useCesta } from '../context/CestaContext'

const CAT_FALLBACK = { color: '#6E6E73', pillBg: 'rgba(0,0,0,0.08)', placeholderBg: 'rgba(0,0,0,0.05)' }

function origenStr(p) {
  return (Array.isArray(p.origen) ? p.origen : []).map((o) => ORIGEN_LABEL[o] || o).join(' / ')
}

function InfoBadge({ label, value, dimmed }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 5,
      padding: '14px 18px', borderRadius: 14,
      background: dimmed ? 'rgba(0,0,0,0.03)' : 'rgba(74,122,52,0.06)',
      border: `1px solid ${dimmed ? 'rgba(0,0,0,0.09)' : 'rgba(74,122,52,0.18)'}`,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73' }}>
        {label}
      </span>
      <span style={{ fontSize: 15, fontWeight: 600, color: dimmed ? '#8A8A8E' : '#1D1D1F', lineHeight: 1.4, fontStyle: dimmed ? 'italic' : 'normal' }}>
        {value}
      </span>
    </div>
  )
}

function MiniCard({ product }) {
  const s = CAT_STYLES[product.categoria] ?? CAT_FALLBACK
  const [imgOk, setImgOk] = useState(true)
  return (
    <Link
      to={`/catalogo/${toSlug(product.nombre)}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        style={{
          borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)',
          background: '#fff', transition: 'box-shadow 0.15s, transform 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.10)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
        }}
      >
        <div style={{ position: 'relative', paddingBottom: '72%' }}>
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
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.3, marginBottom: 3 }}>{product.nombre}</div>
          <div style={{ fontSize: 11.5, color: '#6E6E73' }}>{origenStr(product)}</div>
        </div>
      </div>
    </Link>
  )
}

export default function Producto() {
  const { slug } = useParams()
  useTrackVisit(`/catalogo/${slug}`)

  const [allProductos, setAllProductos] = useState(productosStatic)
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    setImgOk(true)
    if (!supabaseReady) return
    supabase
      .from('productos')
      .select('*')
      .eq('visible', true)
      .then(({ data, error }) => {
        if (!error && data?.length) setAllProductos(data)
      })
  }, [slug])

  const producto = allProductos.find((p) => toSlug(p.nombre) === slug) ?? null

  if (!producto) {
    return (
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 17, color: '#6E6E73', marginBottom: 24 }}>Producto no encontrado.</p>
        <Link to="/catalogo" className="btn btn-ghost">← Ver catálogo completo</Link>
      </div>
    )
  }

  const { has, toggle } = useCesta()
  const inCesta = has(producto.nombre)

  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: `${producto.nombre} — Fernández y Calzada`,
      text: 'Mira esta variedad en el catálogo de Fernández y Calzada',
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch (_) {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const s = CAT_STYLES[producto.categoria] ?? CAT_FALLBACK
  const origen = origenStr(producto)
  const color = producto.color ?? null

  const otrosProductos = allProductos
    .filter((p) => p.categoria === producto.categoria && toSlug(p.nombre) !== slug && p.visible !== false)
    .slice(0, 4)

  const seoTitle = producto.nombre
  const seoDesc = `${producto.nombre} al por mayor desde Salamanca. Origen: ${origen}. Servicio directo a floristerías sin cantidad mínima.`

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} path={`/catalogo/${slug}`} />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 96px' }}>

        {/* Volver */}
        <Link
          to="/catalogo"
          style={{ fontSize: 13.5, color: '#6E6E73', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
        >
          ← Catálogo completo
        </Link>

        {/* Layout principal — dos columnas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 64,
          alignItems: 'start',
          marginBottom: 80,
        }}>

          {/* Columna izquierda — imagen */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 28, overflow: 'hidden',
              aspectRatio: '4/5',
              background: s.placeholderBg,
              boxShadow: '0 24px 60px -20px rgba(0,0,0,0.18)',
            }}>
              {producto.imagen && imgOk ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  onError={() => setImgOk(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: s.placeholderBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 48, opacity: 0.18 }}>✿</span>
                </div>
              )}
            </div>
            {/* Badge categoría superpuesto */}
            <span style={{
              position: 'absolute', top: 18, left: 18,
              fontSize: 10, fontWeight: 700, padding: '5px 13px', borderRadius: 100,
              background: 'rgba(255,255,255,0.92)', color: s.color,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            }}>
              {producto.categoria}
            </span>
          </div>

          {/* Columna derecha — info */}
          <div style={{ paddingTop: 8 }}>

            {/* Nombre */}
            <h1 style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800,
              letterSpacing: '-0.035em', lineHeight: 1.0,
              margin: '0 0 36px',
            }}>
              {producto.nombre}
            </h1>

            {/* Badges de info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
              <InfoBadge label="Origen" value={origen} dimmed={false} />
              <InfoBadge
                label="Color"
                value={color ?? 'Consultar disponibilidad'}
                dimmed={!color}
              />
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/contacto" className="btn btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                Comprobar disponibilidad
              </Link>
              <button
                onClick={() => toggle(producto.nombre)}
                style={{
                  padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 700,
                  border: `1.5px solid ${inCesta ? '#4A7A34' : 'rgba(140,191,63,0.55)'}`,
                  background: inCesta ? 'rgba(140,191,63,0.12)' : 'transparent',
                  color: '#4A7A34', cursor: 'pointer', textAlign: 'center',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                {inCesta ? '✓ Añadido a la consulta' : '+ Añadir a la consulta'}
              </button>
              <button
                onClick={handleShare}
                style={{
                  padding: '10px 20px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  border: '1px solid rgba(0,0,0,0.14)', background: '#fff',
                  color: '#6E6E73', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
                {copied ? 'Enlace copiado ✓' : 'Compartir'}
              </button>
            </div>

          </div>
        </div>

        {/* Otros en esta categoría */}
        {otrosProductos.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 56 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px', color: '#1D1D1F' }}>
              Otros en {producto.categoria}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {otrosProductos.map((p) => <MiniCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
