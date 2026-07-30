import Seo from '../components/Seo'
import productos, { ORIGEN_LABEL } from '../data/products'

// Compute counts per origin dynamically
const ORIGIN_KEYS = ['Colombia', 'Ecuador', 'Holanda', 'Nacional']
const originesCounts = ORIGIN_KEYS.map((key) => ({
  key,
  label: ORIGEN_LABEL[key],
  count: productos.filter((p) => p.origen.includes(key)).length,
}))

// Simple SVG map: Europe + South America, dot markers, curved dashed routes
function MapSVG() {
  return (
    <svg
      viewBox="0 0 500 340"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="Mapa de rutas de origen"
    >
      <rect width="500" height="340" rx="20" fill="rgba(0,0,0,0.03)" />

      {/* Routes — dashed curved lines */}
      {/* Colombia → Spain */}
      <path
        d="M 110 230 C 180 160 310 130 370 120"
        fill="none" stroke="#8CBF3F" strokeWidth="1.8"
        strokeDasharray="5 4"
        style={{ animation: 'route-flow 2s linear infinite' }}
        strokeDashoffset="0"
      />
      {/* Ecuador → Spain */}
      <path
        d="M 95 258 C 180 190 310 140 370 120"
        fill="none" stroke="#8CBF3F" strokeWidth="1.8"
        strokeDasharray="5 4"
        style={{ animation: 'route-flow 2.4s linear infinite' }}
        strokeDashoffset="0"
      />
      {/* Netherlands → Spain */}
      <path
        d="M 370 78 C 370 94 370 107 370 120"
        fill="none" stroke="#8CBF3F" strokeWidth="1.8"
        strokeDasharray="5 4"
        style={{ animation: 'route-flow 1.4s linear infinite' }}
        strokeDashoffset="0"
      />

      {/* Destination: Spain */}
      <circle cx="370" cy="120" r="10" fill="rgba(74,122,52,0.15)" />
      <circle cx="370" cy="120" r="5" fill="#4A7A34" />
      <text x="384" y="124" fontSize="11" fill="#1D1D1F" fontFamily="Inter,sans-serif" fontWeight="600">
        España
      </text>

      {/* Netherlands */}
      <circle cx="370" cy="68" r="4.5" fill="#6E6E73" />
      <text x="382" y="72" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">
        Holanda
      </text>

      {/* Colombia */}
      <circle cx="110" cy="230" r="4.5" fill="#6E6E73" />
      <text x="120" y="234" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">
        Colombia
      </text>

      {/* Ecuador */}
      <circle cx="95" cy="258" r="4.5" fill="#6E6E73" />
      <text x="105" y="262" fontSize="10.5" fill="#6E6E73" fontFamily="Inter,sans-serif">
        Ecuador
      </text>
    </svg>
  )
}

export default function Nosotros() {
  return (
    <>
      <Seo path="/nosotros" />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 96px' }}>

        <h1
          style={{
            fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800,
            letterSpacing: '-0.025em', margin: '0 0 56px',
          }}
        >
          De dónde viene cada flor
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 64,
          }}
        >
          {/* Left: copy + origin table */}
          <div>
            <p style={{ fontSize: 16, color: '#6E6E73', margin: '0 0 32px', lineHeight: 1.65 }}>
              Somos mayoristas de flor cortada, verdes y planta con sede en Salamanca.
              Trabajamos directamente con productores en Colombia, Ecuador y Holanda, y
              completamos la oferta con género nacional de temporada.
            </p>
            <p style={{ fontSize: 16, color: '#6E6E73', margin: '0 0 40px', lineHeight: 1.65 }}>
              Cada semana coordinamos los envíos para que la flor llegue a tu floristería
              en las mejores condiciones, con el mínimo tiempo desde el productor.
            </p>

            {/* Origin table */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              {originesCounts.map(({ key, label, count }) => (
                <div
                  key={key}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
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
    </>
  )
}
