import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

const hitos = [
  { year: '1985', title: 'Fundación', text: 'La empresa nace en Salamanca con el objetivo de acercar flor de calidad a las floristerías de la región.' },
  { year: '1990s', title: 'Expansión nacional', text: 'Ampliamos la cobertura a toda España peninsular y establecemos relaciones directas con viveros de Holanda.' },
  { year: '2000s', title: 'Importación directa', text: 'Comenzamos a importar directamente desde Colombia y Ecuador, eliminando intermediarios y mejorando la frescura del producto.' },
  { year: 'Hoy', title: 'Cuatro décadas después', text: 'Seguimos siendo una empresa familiar, con los mismos valores de origen: calidad, trato personal y compromiso con el floristero.' },
]

const valores = [
  {
    label: 'Calidad',
    text: 'Seleccionamos personalmente a nuestros proveedores y visitamos sus instalaciones de forma regular.',
  },
  {
    label: 'Frescura',
    text: 'La cadena de frío no se rompe desde el vivero hasta tu puerta. El producto llega en su punto óptimo.',
  },
  {
    label: 'Trato',
    text: 'Somos una empresa familiar. Conocemos a nuestros clientes por su nombre y por lo que necesitan.',
  },
  {
    label: 'Agilidad',
    text: '24–48 horas desde la recepción del pedido. Sin mínimos de pedido que no se adapten a tu negocio.',
  },
]

// Geographic positions — equirectangular projection
// lon range [-100,+20], lat range [-10,+65] → viewBox 0 0 760 360
// x = (lon + 100) / 120 * 760
// y = (65 - lat) / 75 * 360
const ORIGINS = [
  {
    key: 'netherlands',
    label: 'Países Bajos',
    abbrev: 'NL',
    cx: 664, cy: 60,
    routeD: 'M 664 60 C 642 82, 622 102, 598 115',
    flores: ['Tulipán', 'Peonía', 'Lilium Oriental', 'Gerbera', 'Lisianthus', 'Cala', 'Anthurium', 'Astilbe'],
    desc: 'El mayor mercado floral de Europa. Tulipanes, peonías y liliums directamente de los grandes viveros holandeses.',
  },
  {
    key: 'colombia',
    label: 'Colombia',
    abbrev: 'CO',
    cx: 164, cy: 289,
    routeD: 'M 164 289 C 290 236, 442 168, 598 115',
    flores: ['Rosa', 'Clavel', 'Alstroemeria', 'Anastasia / Cremón', 'Paniculata', 'Hortensia cortada'],
    desc: 'La sabana de Bogotá, a 2.600 m de altitud. Rosas y claveles de tallo largo con colores que no se consiguen en Europa.',
  },
  {
    key: 'ecuador',
    label: 'Ecuador',
    abbrev: 'EC',
    cx: 136, cy: 313,
    routeD: 'M 136 313 C 266 255, 436 182, 598 115',
    flores: ['Rosa', 'Mini Clavel', 'Hortensia cortada', 'Alstroemeria', 'Paniculata'],
    desc: 'La línea ecuatorial a 2.850 m crea condiciones únicas. Rosas de tallo extra largo con pétalos de una densidad que no tiene igual.',
  },
]

const DEST = { cx: 598, cy: 115, label: 'Salamanca' }

// Very simplified continent silhouettes for visual context
const LAND_PATCHES = [
  // Iberian Peninsula
  { d: 'M 570 105 C 590 98 628 102 638 107 C 634 126 622 139 598 141 C 582 141 568 133 570 117 Z' },
  // France / BeNeLux (loose blob connecting Spain NE to Netherlands)
  { d: 'M 638 107 C 645 97 658 80 674 58 C 682 54 688 62 680 70 C 668 82 648 96 638 107 Z' },
  // N Africa coast hint
  { d: 'M 568 143 C 582 138 608 141 633 143 C 636 150 618 155 590 153 C 576 153 566 149 568 143 Z' },
  // NW South America
  { d: 'M 118 266 C 138 257 167 261 175 272 C 175 293 163 316 140 323 C 124 327 110 317 112 299 C 114 284 116 273 118 266 Z' },
  // Caribbean islands hint (small dots)
]

function OriginMap() {
  const [active, setActive] = useState(null)

  const activeData = ORIGINS.find((o) => o.key === active)

  return (
    <section
      className="py-20 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0E1C15 0%, #14261E 100%)' }}
    >
      {/* Hatch */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.016) 0px, rgba(255,255,255,0.016) 1px, transparent 1px, transparent 38px)',
        }}
      />

      <div className="relative max-w-[1180px] mx-auto px-6">
        {/* Header */}
        <div className="mb-10 max-w-[48ch]">
          <span className="eyebrow text-[11px] text-gold/70 mb-4">Ruta de importación</span>
          <h2
            className="font-serif font-semibold text-paper leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}
          >
            Del vivero a tu floristería,{' '}
            <em className="text-gold" style={{ fontStyle: 'italic' }}>sin escalas</em>
          </h2>
          <p className="text-paper/40 mt-3 text-[14px]">
            Pasa el cursor por cada origen para ver qué flores importamos desde allí.
          </p>
        </div>

        {/* Map + panel */}
        <div className="grid md:grid-cols-[1fr_300px] gap-6 lg:gap-10 items-center">
          {/* SVG Map */}
          <div
            className="rounded-[5px] overflow-hidden relative"
            style={{
              border: '1px solid rgba(201,162,39,0.12)',
              background: 'rgba(0,0,0,0.15)',
            }}
          >
            <svg
              viewBox="0 0 760 360"
              width="100%"
              style={{ display: 'block' }}
              onMouseLeave={() => setActive(null)}
            >
              {/* Latitude reference lines */}
              {Array.from({ length: 6 }, (_, i) => (
                <line
                  key={i}
                  x1="0" y1={60 * i} x2="760" y2={60 * i}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                />
              ))}

              {/* Simplified land patches */}
              {LAND_PATCHES.map((p, i) => (
                <path
                  key={i}
                  d={p.d}
                  fill="rgba(76,122,94,0.18)"
                  stroke="rgba(76,122,94,0.3)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Route lines */}
              {ORIGINS.map((o) => {
                const isActive = active === o.key
                return (
                  <path
                    key={o.key}
                    d={o.routeD}
                    fill="none"
                    stroke={isActive ? '#C9A227' : 'rgba(201,162,39,0.28)'}
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray="7 5"
                    style={{
                      transition: 'stroke 0.25s, stroke-width 0.25s',
                      filter: isActive ? 'drop-shadow(0 0 4px rgba(201,162,39,0.55))' : 'none',
                      animation: isActive ? 'route-flow 1.8s linear infinite' : 'none',
                    }}
                  />
                )
              })}

              {/* Origin markers */}
              {ORIGINS.map((o) => {
                const isActive = active === o.key
                return (
                  <g
                    key={o.key}
                    onMouseEnter={() => setActive(o.key)}
                    onClick={() => setActive(active === o.key ? null : o.key)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulse ring (active only) */}
                    {isActive && (
                      <circle
                        cx={o.cx} cy={o.cy} r={14}
                        className="map-pulse-ring"
                        fill="none"
                        stroke="rgba(201,162,39,0.4)"
                        strokeWidth="1"
                        style={{ animation: 'marker-pulse 1.5s ease-out infinite' }}
                      />
                    )}
                    {/* Outer dashed ring */}
                    <circle
                      cx={o.cx} cy={o.cy}
                      r={isActive ? 13 : 9}
                      fill="none"
                      stroke={isActive ? '#C9A227' : 'rgba(201,162,39,0.45)'}
                      strokeWidth="1"
                      strokeDasharray={isActive ? 'none' : '3 2'}
                      style={{ transition: 'r 0.2s, stroke 0.2s' }}
                    />
                    {/* Center dot */}
                    <circle
                      cx={o.cx} cy={o.cy}
                      r={isActive ? 5 : 3}
                      fill={isActive ? '#C9A227' : 'rgba(201,162,39,0.65)'}
                      style={{ transition: 'r 0.2s, fill 0.2s' }}
                    />
                    {/* Abbreviation label */}
                    <text
                      x={o.cx} y={o.cy - (isActive ? 20 : 16)}
                      textAnchor="middle"
                      fill={isActive ? '#C9A227' : 'rgba(201,162,39,0.5)'}
                      fontSize="9"
                      fontFamily='"IBM Plex Mono", monospace'
                      fontWeight="700"
                      letterSpacing="0.1em"
                      style={{ transition: 'fill 0.2s', userSelect: 'none' }}
                    >
                      {o.abbrev}
                    </text>
                  </g>
                )
              })}

              {/* Destination: Salamanca */}
              <g>
                <circle cx={DEST.cx} cy={DEST.cy} r={18} fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5" />
                <circle cx={DEST.cx} cy={DEST.cy} r={11} fill="rgba(201,162,39,0.08)" stroke="rgba(201,162,39,0.25)" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx={DEST.cx} cy={DEST.cy} r={4.5} fill="#C9A227" />
                <text
                  x={DEST.cx + 26} y={DEST.cy + 4}
                  fill="rgba(201,162,39,0.75)"
                  fontSize="9"
                  fontFamily='"IBM Plex Mono", monospace'
                  fontWeight="700"
                  letterSpacing="0.1em"
                  style={{ userSelect: 'none' }}
                >
                  SALAMANCA
                </text>
              </g>
            </svg>
          </div>

          {/* Info panel */}
          <div className="min-h-[200px] md:min-h-[260px] flex flex-col justify-center py-4">
            {activeData ? (
              <div key={activeData.key} className="animate-fade-up">
                <p className="mono-label text-[9px] text-gold/50 mb-2 tracking-[0.15em]">
                  {activeData.abbrev} — origen
                </p>
                <h3
                  className="font-serif font-semibold text-paper mb-3 leading-tight"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', letterSpacing: '-0.02em' }}
                >
                  {activeData.label}
                </h3>
                <p className="text-[13.5px] text-paper/50 leading-relaxed mb-5">
                  {activeData.desc}
                </p>
                <div>
                  <p className="mono-label text-[9px] text-paper/25 mb-2.5">Importamos desde aquí</p>
                  <div className="flex flex-col gap-1.5">
                    {activeData.flores.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-gold/60 flex-shrink-0" />
                        <span className="font-serif text-[15px] text-paper/80">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-paper/25 px-4">
                <div
                  className="w-12 h-12 rounded-full border border-dashed border-paper/15 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="mono-label text-[10px]">⊕</span>
                </div>
                <p className="mono-label text-[9.5px] mb-2 tracking-[0.12em]">Explora los orígenes</p>
                <p className="font-serif text-[15px] leading-snug">
                  Pasa el cursor por cada<br />punto del mapa
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile quick-tap chips (visible only on small screens) */}
        <div className="flex gap-2 mt-6 md:hidden flex-wrap">
          {ORIGINS.map((o) => (
            <button
              key={o.key}
              onClick={() => setActive(active === o.key ? null : o.key)}
              className={`mono-label text-[9.5px] px-3 py-1.5 rounded-sm border transition-all duration-150 ${
                active === o.key
                  ? 'bg-gold/20 border-gold/60 text-gold'
                  : 'border-paper/15 text-paper/40'
              }`}
            >
              {o.abbrev} · {o.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Nosotros() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Quiénes somos — Fernández y Calzada',
    description:
      'Historia y valores de Fernández y Calzada S.L., empresa mayorista de flores y plantas en Salamanca desde 1985.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Fernández y Calzada S.L.',
      foundingDate: '1985',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Río Tera 2',
        postalCode: '37003',
        addressLocality: 'Salamanca',
        addressCountry: 'ES',
      },
    },
  }

  return (
    <>
      <Seo
        title="Quiénes somos"
        description="Mayoristas de flor y planta en Salamanca desde 1985. Importación directa desde Colombia, Ecuador y Holanda. Empresa familiar con cuatro décadas de experiencia."
        path="/nosotros"
        schema={schema}
      />

      {/* Cabecera */}
      <div
        className="text-paper py-16 md:py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #14261E 0%, #0E1C15 100%)' }}
      >
        {/* Decorative botanical */}
        <div
          className="absolute right-0 top-0 h-full w-[40%] pointer-events-none select-none overflow-hidden opacity-[0.06]"
          aria-hidden
        >
          <svg viewBox="0 0 320 320" className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[80%]" fill="none" stroke="white" strokeWidth="0.7">
            <circle cx="160" cy="160" r="150" strokeDasharray="5 7" />
            <circle cx="160" cy="160" r="120" />
            {[0,45,90,135,180,225,270,315].map((a) => (
              <ellipse key={a} cx="160" cy="160" rx="16" ry="90" transform={`rotate(${a} 160 160)`} />
            ))}
            <circle cx="160" cy="160" r="22" />
          </svg>
        </div>

        <div className="relative max-w-[1180px] mx-auto px-6">
          <span className="eyebrow text-[11px] text-gold/70 mb-4">Quiénes somos</span>
          <h1
            className="font-serif font-semibold text-paper leading-[1.02] max-w-[18ch]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.025em' }}
          >
            Cuatro décadas llevando{' '}
            <em className="text-gold" style={{ fontStyle: 'italic' }}>flor al floristero</em>{' '}
            de a pie
          </h1>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 md:py-20 bg-card border-b border-mist">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[16px] text-ink/75 leading-relaxed mb-4">
              Fernández y Calzada S.L. nació en 1985 en Salamanca con un propósito sencillo: llevar flor
              cortada y planta de calidad a las floristerías de la región sin que el precio y el tiempo de
              tránsito lo estropeen todo.
            </p>
            <p className="text-[15.5px] text-ink/65 leading-relaxed mb-4">
              Cuarenta años después seguimos siendo una empresa familiar. Hemos crecido y hemos ampliado
              nuestra cobertura a toda España, pero el trato con el cliente sigue siendo exactamente el
              mismo: personal, directo y honesto.
            </p>
            <p className="text-[15.5px] text-ink/65 leading-relaxed">
              Importamos directamente desde los principales mercados mundiales —Colombia, Ecuador y Holanda—
              y complementamos con producto nacional de temporada. Todo con control de cadena de frío desde
              el vivero hasta tu puerta.
            </p>
          </div>

          {/* Placeholder foto */}
          <div
            className="rounded-[4px] h-72 md:h-80 flex items-center justify-center border border-mist relative overflow-hidden"
            style={{
              background: 'repeating-linear-gradient(45deg, rgba(20,38,30,0.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, #DCE3D8, #EDE9D9)',
            }}
          >
            <div className="text-center">
              <span className="mono-label text-[10px] text-ink/30 block mb-1">FOTO EQUIPO</span>
              <span className="mono-label text-[9px] text-ink/20">Pendiente de contenido real</span>
            </div>
            <div
              className="absolute bottom-4 left-4 w-16 h-16 rounded-full border border-dashed border-gold/40 flex items-center justify-center"
              style={{ transform: 'rotate(-5deg)' }}
            >
              <span className="font-serif text-[11px] font-semibold text-gold/60 text-center leading-tight">
                Desde<br />1985
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAPA INTERACTIVO DE ORIGEN ─────────────────────────────── */}
      <OriginMap />

      {/* Valores */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <span className="section-eyebrow">Cómo trabajamos</span>
          <h2 className="section-title mb-10">Lo que nos define</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-mist rounded-[4px] overflow-hidden">
            {valores.map(({ label, text }, i) => (
              <div
                key={label}
                className={`p-6 flex flex-col gap-3 transition-colors duration-200 hover:bg-card ${i < valores.length - 1 ? 'lg:border-r border-b lg:border-b-0 border-mist' : ''}`}
              >
                <span className="mono-label text-[10px] text-rust">{String(i + 1).padStart(2, '0')} — {label}</span>
                <p className="font-serif text-[15.5px] font-medium leading-snug">{label}</p>
                <p className="text-[13.5px] text-ink/60 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Línea de tiempo */}
      <section className="py-16 md:py-20 bg-card border-y border-mist">
        <div className="max-w-[1180px] mx-auto px-6">
          <span className="section-eyebrow">Historia</span>
          <h2 className="section-title mb-12">Cuatro décadas en cuatro momentos</h2>
          <div className="relative">
            {/* Línea vertical */}
            <div className="hidden md:block absolute left-[110px] top-0 bottom-0 w-px bg-mist" />
            <div className="flex flex-col gap-10">
              {hitos.map(({ year, title, text }) => (
                <div key={year} className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="md:w-[110px] md:text-right flex-shrink-0">
                    <span className="font-mono font-semibold text-[15px] text-leaf-dark">{year}</span>
                  </div>
                  <div className="relative md:pl-8 pb-4">
                    <div className="hidden md:block absolute left-0 top-[5px] -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-leaf bg-card" />
                    <p className="font-serif text-[17px] font-semibold mb-2">{title}</p>
                    <p className="text-[14px] text-ink/60 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Datos legales */}
      <section className="py-12 bg-ink-deep text-paper">
        <div className="max-w-[1180px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="mono-label text-[9.5px] text-gold/60 mb-2 block">Datos de empresa</span>
            <p className="font-serif text-[16px] font-medium">Fernández y Calzada S.L.</p>
            <p className="text-paper/50 text-[13.5px] mt-1">
              CIF B37319829 · Calle Río Tera 2, 37003 Salamanca
            </p>
          </div>
          <Link to="/contacto" className="btn btn-primary flex-shrink-0">
            Contactar con nosotros
          </Link>
        </div>
      </section>
    </>
  )
}
