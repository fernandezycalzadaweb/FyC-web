import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productosStatic, { CATEGORIAS, CAT_STYLES, ORIGEN_LABEL, toSlug } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'
import { useCesta } from '../context/CestaContext'

const TODOS = 'Todas'
const FILTROS = [TODOS, ...CATEGORIAS]

function origenStr(p) {
  return (Array.isArray(p.origen) ? p.origen : []).map((o) => ORIGEN_LABEL[o] || o).join(' / ')
}

function sortProductos(lista) {
  const catOrder = Object.fromEntries(CATEGORIAS.map((c, i) => [c, i]))
  return [...lista].sort((a, b) => {
    const catDiff = (catOrder[a.categoria] ?? 99) - (catOrder[b.categoria] ?? 99)
    if (catDiff !== 0) return catDiff
    return a.nombre.localeCompare(b.nombre, 'es')
  })
}

const CAT_FALLBACK = { color: '#6E6E73', pillBg: 'rgba(0,0,0,0.08)', placeholderBg: 'rgba(0,0,0,0.05)' }

function ProductCard({ product }) {
  const s = CAT_STYLES[product.categoria] ?? CAT_FALLBACK
  const [imgOk, setImgOk] = useState(true)
  const sinStock = product.en_stock === false
  const { has, toggle } = useCesta()
  const inCesta = has(product.nombre)

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
        opacity: sinStock ? 0.82 : 1,
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
      {/* Imagen o bloque de color */}
      <div style={{ position: 'relative', paddingBottom: '72%', flexShrink: 0 }}>
        {product.imagen && imgOk ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            onError={() => setImgOk(false)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: s.placeholderBg,
            }}
          />
        )}
        {/* Pill de categoría */}
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
        {/* Etiqueta sin stock */}
        {sinStock && (
          <span
            style={{
              position: 'absolute', bottom: 10, left: 10,
              fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
              background: 'rgba(201,138,31,0.92)', color: '#fff',
              backdropFilter: 'blur(4px)',
            }}
          >
            Consultar disponibilidad
          </span>
        )}
      </div>

      {/* Texto */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4, lineHeight: 1.3 }}>
          {product.nombre}
        </div>
        <div style={{ fontSize: 12.5, color: '#6E6E73', marginBottom: 10 }}>
          {origenStr(product)}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.nombre) }}
          style={{
            alignSelf: 'flex-start',
            padding: '4px 11px', borderRadius: 100, fontSize: 11.5, fontWeight: 700,
            border: `1px solid ${inCesta ? '#8CBF3F' : 'rgba(140,191,63,0.55)'}`,
            background: inCesta ? '#8CBF3F' : 'transparent',
            color: inCesta ? '#fff' : '#4A7A34',
            cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          {inCesta ? '✓ Añadido' : '+ Añadir'}
        </button>
      </div>
    </div>
    </Link>
  )
}

// Barra flotante inferior — se puede cerrar
function StickyBar() {
  const [visible, setVisible] = useState(true)
  const { count } = useCesta()

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed', bottom: count > 0 ? 60 : 0, left: 0, right: 0,
        zIndex: 40,
        background: 'rgba(29,29,31,0.96)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        flexWrap: 'wrap',
        transition: 'bottom 0.25s ease',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, fontWeight: 500 }}>
        ¿Ves algo que necesitas?
      </span>
      <Link
        to="/contacto"
        className="btn btn-primary"
        style={{ fontSize: 13, padding: '8px 20px', background: '#8CBF3F', color: '#fff' }}
      >
        Contactar
      </Link>
      <button
        onClick={() => setVisible(false)}
        aria-label="Cerrar"
        style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)', fontSize: 20, lineHeight: 1, padding: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
      >
        ×
      </button>
    </div>
  )
}

export default function Catalogo() {
  useTrackVisit('/catalogo')

  const [productos, setProductos] = useState(
    sortProductos(productosStatic.filter((p) => p.visible !== false && p.disponible !== false))
  )
  const [filtro, setFiltro] = useState(TODOS)

  useEffect(() => {
    if (!supabaseReady) return
    supabase
      .from('productos')
      .select('*')
      .eq('visible', true)
      .then(({ data, error }) => {
        if (!error && data?.length) setProductos(sortProductos(data))
      })
  }, [])

  const lista = filtro === TODOS
    ? productos
    : productos.filter((p) => p.categoria === filtro)

  return (
    <>
      <Seo path="/catalogo" />

      {/* Padding-bottom extra para que la sticky bar no tape la última fila */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 120px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
            Catálogo
          </h1>
          <p style={{ fontSize: 16, color: '#6E6E73', margin: 0 }}>
            {productos.length} variedades disponibles · Consulta disponibilidad semanal
          </p>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`chip${filtro === f ? ' chip-active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Rejilla de tarjetas: 4 col desktop, 2 tablet, 1 móvil */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {lista.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

      </div>

      <StickyBar />
    </>
  )
}
