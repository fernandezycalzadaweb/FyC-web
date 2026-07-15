import { useState, useMemo } from 'react'
import Seo from '../components/Seo'
import productos, { CATEGORIAS, ORIGENES, ORIGEN_LABEL } from '../data/products'

const ORIGEN_FLAG = {
  Colombia: 'CO',
  Ecuador: 'EC',
  Holanda: 'NL',
  Nacional: 'ES',
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${active ? 'filter-chip-active' : 'filter-chip-inactive'}`}
    >
      {label}
    </button>
  )
}

function ProductCard({ product }) {
  const origenChips = product.origen.map((o) => ORIGEN_FLAG[o] || o)

  return (
    <article className="group bg-card border border-mist rounded-[3px] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(20,38,30,0.3)]">
      {/* Placeholder foto */}
      <div
        className="relative h-[148px] flex items-end p-3"
        style={{
          background:
            'repeating-linear-gradient(45deg, rgba(20,38,30,0.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, #DCE3D8, #EDE9D9)',
        }}
      >
        <span className="mono-label text-[9px] text-ink/30 bg-paper/60 px-2 py-1 rounded-sm">
          FOTO PENDIENTE
        </span>

        {/* Stamp origen */}
        <span
          className="absolute top-2.5 right-2.5 w-[42px] h-[42px] rounded-full border border-dashed border-rust/65 bg-paper/85 flex items-center justify-center text-rust font-mono font-semibold text-[8.5px] leading-tight text-center"
          style={{ transform: 'rotate(-7deg)' }}
        >
          {ORIGEN_FLAG[product.origen[0]] || '—'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div>
          <p className="mono-label text-[9.5px] text-rust mb-1">{product.categoria}</p>
          <h3 className="font-serif text-[17px] font-semibold leading-tight">{product.nombre}</h3>
        </div>

        {product.descripcion && (
          <p className="text-[12.5px] text-ink/55 leading-relaxed flex-1">{product.descripcion}</p>
        )}

        <div className="border-t border-dashed border-mist pt-2.5 flex flex-wrap justify-between items-center gap-1.5">
          <div className="flex gap-1">
            {origenChips.map((flag) => (
              <span
                key={flag}
                className="mono-label text-[9px] px-1.5 py-0.5 rounded-sm bg-mist text-leaf-dark"
              >
                {flag}
              </span>
            ))}
          </div>
          <span
            className={`mono-label text-[9px] px-2 py-0.5 rounded-sm ${
              product.disponible ? 'bg-leaf/10 text-leaf-dark' : 'bg-mist/50 text-ink/35'
            }`}
          >
            {product.disponible ? 'Disponible' : 'Temporada'}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function Catalogo() {
  const [catFilter, setCatFilter] = useState(null)
  const [origenFilter, setOrigenFilter] = useState(null)

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      const catOk = !catFilter || p.categoria === catFilter
      const origOk = !origenFilter || p.origen.includes(origenFilter)
      return catOk && origOk
    })
  }, [catFilter, origenFilter])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de flor y planta — Fernández y Calzada',
    description:
      'Listado de flor cortada, verdes, plantas y accesorios disponibles en Fernández y Calzada S.L.',
    numberOfItems: productos.length,
    itemListElement: productos.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.nombre,
    })),
  }

  return (
    <>
      <Seo
        title="Catálogo"
        description="Catálogo completo de flor cortada (Colombia, Ecuador, Holanda), verdes, plantas y accesorios de floristería. Mayoristas en Salamanca."
        path="/catalogo"
        schema={schema}
      />

      {/* Cabecera */}
      <div className="bg-ink-deep text-paper py-12 md:py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <span className="eyebrow text-[11px] text-gold/70 mb-4">Catálogo completo</span>
          <h1
            className="font-serif font-semibold text-paper leading-tight max-w-[26ch]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}
          >
            Flor cortada, planta y accesorios de floristería
          </h1>
          <p className="text-paper/50 mt-3 max-w-[52ch] text-[15px]">
            Selección actualizada de lo que trabajamos. Fotos y fichas detalladas disponibles próximamente.
          </p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-10">
        {/* Filtros */}
        <div className="bg-card border border-mist rounded-[4px] p-4 mb-8 flex flex-col gap-4">
          {/* Categoría */}
          <div>
            <p className="mono-label text-[9.5px] text-leaf-dark/60 mb-2.5">Categoría</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="Todas"
                active={!catFilter}
                onClick={() => setCatFilter(null)}
              />
              {CATEGORIAS.map((c) => (
                <FilterChip
                  key={c}
                  label={c}
                  active={catFilter === c}
                  onClick={() => setCatFilter(catFilter === c ? null : c)}
                />
              ))}
            </div>
          </div>

          {/* Origen */}
          <div className="pt-3 border-t border-mist">
            <p className="mono-label text-[9.5px] text-leaf-dark/60 mb-2.5">País de origen</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="Todos los orígenes"
                active={!origenFilter}
                onClick={() => setOrigenFilter(null)}
              />
              {ORIGENES.map((o) => (
                <FilterChip
                  key={o}
                  label={`${ORIGEN_FLAG[o]} · ${ORIGEN_LABEL[o]}`}
                  active={origenFilter === o}
                  onClick={() => setOrigenFilter(origenFilter === o ? null : o)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Conteo */}
        <p className="mono-label text-[11px] text-leaf-dark/60 mb-6">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          {catFilter || origenFilter ? ' — filtro activo' : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-mist rounded-[4px]">
            <p className="font-serif text-[17px] mb-2">Sin resultados para esos filtros</p>
            <p className="text-[13px] text-ink/50">
              Prueba a cambiar el país de origen o la categoría.
            </p>
          </div>
        )}

        {/* Nota al pie */}
        <div className="mt-12 pt-6 border-t border-mist">
          <p className="text-[12.5px] text-ink/45 max-w-prose">
            Este catálogo es orientativo. La disponibilidad varía según temporada y mercado de origen.
            Contacta con nosotros para confirmar stock, precios y plazos de entrega para tu zona.
          </p>
        </div>
      </div>
    </>
  )
}
