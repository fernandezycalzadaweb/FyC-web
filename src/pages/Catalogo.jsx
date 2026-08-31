import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productosStatic, { CATEGORIAS, CAT_STYLES, ORIGEN_LABEL, toSlug } from '../data/products'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'
import { useCesta } from '../context/CestaContext'

const TODOS = 'Todas'
const FILTROS = [TODOS, ...CATEGORIAS]

const PAISES_GRUPOS = [
  { label: 'Colombia / Ecuador', keys: ['Colombia', 'Ecuador'] },
  { label: 'Holanda',            keys: ['Holanda'] },
  { label: 'Nacional',           keys: ['Nacional'] },
]

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

// Dentro de cada sección de país, "Verdes" va siempre al final.
// El resto mantiene el orden ya establecido por sortProductos.
function sortSeccionPais(lista) {
  return [...lista].sort((a, b) => {
    const aLast = a.categoria === 'Verdes' ? 1 : 0
    const bLast = b.categoria === 'Verdes' ? 1 : 0
    return aLast - bLast
  })
}

const CAT_FALLBACK = { color: '#6E6E73', pillBg: 'rgba(0,0,0,0.08)', placeholderBg: 'rgba(0,0,0,0.05)' }

const PASOS = [
  {
    titulo: 'Añade lo que te interese',
    desc: 'Pulsa "+ Añadir" en cualquier variedad del catálogo que quieras consultar.',
  },
  {
    titulo: 'Revisa tu consulta',
    desc: 'Cuando tengas alguna añadida, verás un aviso abajo con el total — pulsa ahí para ver el resumen.',
  },
  {
    titulo: 'Envíala en un toque',
    desc: 'Desde ahí puedes mandarnos la consulta completa por WhatsApp o por correo, sin escribir nada a mano.',
  },
]

const TUTORIAL_KEY = 'fyc_tutorial_visto'

function TutorialCesta({ onClose }) {
  const [paso, setPaso] = useState(0)
  const esUltimo = paso === PASOS.length - 1

  const cerrar = () => {
    localStorage.setItem(TUTORIAL_KEY, '1')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 28,
        boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
        padding: '36px 32px 28px',
        maxWidth: 400, width: '100%',
        position: 'relative',
      }}>

        <button onClick={cerrar} aria-label="Cerrar tutorial" style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
          width: 30, height: 30, cursor: 'pointer', color: '#6E6E73',
          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(140,191,63,0.12)',
          border: '2px solid rgba(140,191,63,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, fontSize: 22, fontWeight: 800, color: '#4A7A34',
        }}>
          {paso + 1}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px', color: '#1D1D1F' }}>
          {PASOS[paso].titulo}
        </h2>
        <p style={{ fontSize: 15, color: '#3D3D3F', lineHeight: 1.55, margin: '0 0 28px' }}>
          {PASOS[paso].desc}
        </p>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
          {PASOS.map((_, i) => (
            <div key={i} style={{
              width: i === paso ? 20 : 7, height: 7, borderRadius: 100,
              background: i === paso ? '#8CBF3F' : 'rgba(0,0,0,0.12)',
              transition: 'width 0.2s, background 0.2s',
            }} />
          ))}
        </div>

        <button
          onClick={() => esUltimo ? cerrar() : setPaso((p) => p + 1)}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 100,
            background: '#8CBF3F', border: 'none',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#fff',
            marginBottom: 10,
          }}
        >
          {esUltimo ? 'Entendido' : 'Siguiente →'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button onClick={cerrar} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#6E6E73', textDecoration: 'underline', padding: '4px 8px',
          }}>
            Saltar tutorial
          </button>
        </div>

      </div>
    </div>
  )
}

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

  const [mostrarTutorial, setMostrarTutorial] = useState(
    () => !localStorage.getItem(TUTORIAL_KEY)
  )
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

        {/* Secciones por país de origen */}
        {PAISES_GRUPOS.map(({ label, keys }) => {
          const seccion = sortSeccionPais(productos.filter((p) =>
            Array.isArray(p.origen) && p.origen.some((o) => keys.includes(o)) &&
            (filtro === TODOS || p.categoria === filtro)
          ))
          if (seccion.length === 0) return null
          return (
            <div key={label}>
              <div style={{ marginTop: 40, marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid rgba(140,191,63,0.2)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#1D1D1F' }}>
                  {label}
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 20,
                }}
              >
                {seccion.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )
        })}

      </div>

      <StickyBar />
      {mostrarTutorial && <TutorialCesta onClose={() => setMostrarTutorial(false)} />}
    </>
  )
}
