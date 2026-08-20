import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productosStatic, { CAT_STYLES, ORIGEN_LABEL, toSlug } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'

const WA_NUMBER = '34608615272'

function waUrl(nombre) {
  const msg = encodeURIComponent(`Hola, me gustaría consultar disponibilidad de ${nombre}`)
  return `https://wa.me/${WA_NUMBER}?text=${msg}`
}

export default function Producto() {
  const { slug } = useParams()
  const [producto, setProducto] = useState(() =>
    productosStatic.find((p) => toSlug(p.nombre) === slug) ?? null
  )
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    setImgOk(true)
    if (!supabaseReady) return
    supabase
      .from('productos')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data?.length) {
          const found = data.find((p) => toSlug(p.nombre) === slug)
          if (found) setProducto(found)
        }
      })
  }, [slug])

  if (!producto) {
    return (
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 17, color: '#6E6E73', marginBottom: 24 }}>Producto no encontrado.</p>
        <Link to="/catalogo" className="btn btn-ghost">← Ver catálogo completo</Link>
      </div>
    )
  }

  const s = CAT_STYLES[producto.categoria]
  const origenStr = producto.origen.map((o) => ORIGEN_LABEL[o] || o).join(' / ')
  const enStock = producto.en_stock !== false
  const visible = producto.visible !== false

  const seoTitle = producto.nombre
  const seoDesc = `${producto.nombre} al por mayor desde Salamanca. Origen: ${origenStr}. Servicio directo a floristerías sin cantidad mínima.`

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} path={`/catalogo/${slug}`} />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 96px' }}>

        {/* Volver */}
        <Link
          to="/catalogo"
          style={{ fontSize: 13.5, color: '#6E6E73', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
        >
          ← Catálogo completo
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 56,
          alignItems: 'start',
        }}>

          {/* Imagen */}
          <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', position: 'relative', background: s.placeholderBg, flexShrink: 0 }}>
            {producto.imagen && imgOk ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                onError={() => setImgOk(false)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: s.placeholderBg }} />
            )}
          </div>

          {/* Info */}
          <div>
            {/* Categoría */}
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '4px 12px',
              borderRadius: 100, background: s.pillBg, color: s.color, marginBottom: 16,
            }}>
              {producto.categoria}
            </span>

            {/* Nombre */}
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 24px',
            }}>
              {producto.nombre}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              <MetaRow label="Origen" value={origenStr} />
              {producto.color && <MetaRow label="Color" value={producto.color} />}
              {producto.descripcion && (
                <MetaRow label="Descripción" value={producto.descripcion} />
              )}
            </div>

            {/* Estado de stock */}
            {visible && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 100, marginBottom: 32,
                background: enStock ? 'rgba(74,122,52,0.1)' : 'rgba(201,138,31,0.1)',
                color: enStock ? '#4A7A34' : '#C98A1F',
                fontSize: 13, fontWeight: 700,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                  background: enStock ? '#4A7A34' : '#C98A1F',
                }} />
                {enStock ? 'Disponible' : 'Consultar disponibilidad'}
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href={waUrl(producto.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ textAlign: 'center' }}
              >
                Pedir esta variedad →
              </a>
              <Link to="/contacto" className="btn btn-ghost" style={{ textAlign: 'center' }}>
                O escríbenos por formulario
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 14.5, lineHeight: 1.5 }}>
      <span style={{ fontWeight: 700, color: '#1D1D1F', minWidth: 100, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#6E6E73' }}>{value}</span>
    </div>
  )
}
