import { useState, useEffect } from 'react'
import Seo from '../components/Seo'
import productosStatic, { CATEGORIAS, CAT_STYLES, ORIGEN_LABEL } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'

const TODOS = 'Todas'
const FILTROS = [TODOS, ...CATEGORIAS]
const WA_URL = 'https://wa.me/34923182222'

function origenStr(p) {
  return p.origen.map((o) => ORIGEN_LABEL[o] || o).join(' / ')
}

function CatalogRow({ product }) {
  const s = CAT_STYLES[product.categoria]
  const [imgOk, setImgOk] = useState(true)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
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

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 15.5 }}>{product.nombre}</div>
        <div style={{ fontSize: 13, color: '#6E6E73', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.descripcion}
        </div>
      </div>

      <span style={{ fontSize: 13, color: '#6E6E73', flexShrink: 0 }} className="hidden md:block">
        {origenStr(product)}
      </span>

      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: s.pillBg, color: s.color, minWidth: 96, textAlign: 'center', flexShrink: 0 }}>
        {product.categoria}
      </span>
    </div>
  )
}

export default function Catalogo() {
  const [productos, setProductos] = useState(productosStatic)
  const [filtro, setFiltro] = useState(TODOS)

  useEffect(() => {
    if (!supabaseReady) return
    supabase
      .from('productos')
      .select('*')
      .order('categoria')
      .then(({ data, error }) => {
        if (!error && data?.length) setProductos(data)
      })
  }, [])

  const lista = filtro === TODOS
    ? productos
    : productos.filter((p) => p.categoria === filtro)

  return (
    <>
      <Seo path="/catalogo" />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 96px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
            Catálogo
          </h1>
          <p style={{ fontSize: 16, color: '#6E6E73', margin: 0 }}>
            {productos.length} variedades disponibles · Consulta disponibilidad semanal
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {FILTROS.map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className={`chip${filtro === f ? ' chip-active' : ''}`}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {lista.map((p) => <CatalogRow key={p.id} product={p} />)}
        </div>

        <div style={{ marginTop: 56, padding: '32px 28px', borderRadius: 20, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <strong style={{ fontSize: 17, display: 'block', marginBottom: 4 }}>¿Ves algo que necesitas?</strong>
            <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>Escríbenos y te confirmamos disponibilidad y precio al momento.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="mailto:info@fernandezycalzada.com" className="btn btn-primary">
              Consulta disponibilidad de esta semana
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
          </div>
        </div>

      </div>
    </>
  )
}
