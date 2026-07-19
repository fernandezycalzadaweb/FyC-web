import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productos from '../data/products'

const FEATURED_IDS = ['col-01', 'hol-09', 'hol-13', 'col-07', 'hol-02', 'ver-01']
const featured = productos.filter((p) => FEATURED_IDS.includes(p.id))

// Each pillar must say something the hero does NOT already say
const pillars = [
  {
    num: '01',
    label: 'Catálogo',
    text: 'Más de 40 variedades activas: flor cortada, planta, verdes y accesorios de floristería.',
  },
  {
    num: '02',
    label: 'Entrega',
    text: '24–48 h a cualquier destino de España peninsular desde la confirmación del pedido.',
  },
  {
    num: '03',
    label: 'Trato',
    text: 'Hablas directamente con quien gestiona tu pedido. Sin centralitas, sin intermediarios internos.',
  },
]

const ORIGEN_FLAG = { Colombia: 'CO', Ecuador: 'EC', Holanda: 'NL', Nacional: 'ES' }

// Botanical tulip — line-art, fills no fill, SVG strokes only
function TulipIllustration() {
  return (
    <svg
      viewBox="0 0 240 400"
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Main stem */}
      <path d="M 120 392 C 118 352 115 315 120 278 C 122 253 127 236 125 204 C 123 180 120 165 120 142" strokeWidth="1.4" />

      {/* Leaf right (mid) */}
      <path d="M 122 284 C 150 268 178 276 180 294 C 183 310 163 322 122 313" strokeWidth="1.2" />

      {/* Leaf left (lower) */}
      <path d="M 117 332 C 91 320 72 330 69 346 C 66 360 84 370 117 362" strokeWidth="1.2" />

      {/* Small leaf right (upper) */}
      <path d="M 123 218 C 146 205 165 213 167 227 C 170 241 152 250 123 242" strokeWidth="0.9" />

      {/* Petal far-left */}
      <path d="M 120 142 C 91 118 74 90 83 62 C 90 40 107 44 120 66" strokeWidth="1.3" />
      {/* Petal far-right */}
      <path d="M 120 142 C 149 118 166 90 157 62 C 150 40 133 44 120 66" strokeWidth="1.3" />

      {/* Petal mid-left */}
      <path d="M 120 142 C 99 124 89 102 96 80 C 101 63 114 67 120 84" strokeWidth="1.1" />
      {/* Petal mid-right */}
      <path d="M 120 142 C 141 124 151 102 144 80 C 139 63 126 67 120 84" strokeWidth="1.1" />

      {/* Center petal */}
      <path d="M 120 142 C 115 124 113 104 120 86 C 127 104 125 124 120 142" strokeWidth="1.0" />

      {/* Sepal left */}
      <path d="M 112 145 C 106 156 108 167 120 169" strokeWidth="0.8" />
      {/* Sepal right */}
      <path d="M 128 145 C 134 156 132 167 120 169" strokeWidth="0.8" />
    </svg>
  )
}

function ProductCard({ product }) {
  const origenStr = product.origen.map((o) => ORIGEN_FLAG[o] || o).join(' · ')

  return (
    <article className="group bg-card border border-mist rounded-[3px] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_32px_-16px_rgba(20,38,30,0.32)]">
      <div
        className="relative h-44 flex items-end p-3 overflow-hidden"
        style={{
          background:
            'repeating-linear-gradient(45deg, rgba(20,38,30,0.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, #DCE3D8, #EDE9D9)',
        }}
      >
        <span className="mono-label text-[9px] text-ink/35 bg-paper/70 px-2 py-1 rounded-sm">
          FOTO PENDIENTE
        </span>
        <span
          className="absolute top-3 right-3 w-10 h-10 rounded-full border border-dashed border-rust/70 bg-paper/80 flex items-center justify-center text-rust font-mono font-semibold text-[8.5px] leading-tight text-center transition-transform duration-500 group-hover:rotate-[-20deg]"
          style={{ transform: 'rotate(-7deg)' }}
        >
          {product.origen[0] ? ORIGEN_FLAG[product.origen[0]] : '—'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="mono-label text-[9.5px] text-rust mb-1">{product.categoria}</p>
          <h3 className="font-serif text-[18px] font-semibold leading-tight">{product.nombre}</h3>
        </div>
        <p className="text-[13px] text-ink/60 leading-relaxed flex-1">{product.descripcion}</p>
        <div className="border-t border-dashed border-mist pt-3 flex justify-between items-center">
          <span className="mono-label text-[9.5px] text-leaf-dark/70">{origenStr}</span>
          <span className={`mono-label text-[9px] px-2 py-0.5 rounded-sm ${product.disponible ? 'bg-leaf/10 text-leaf-dark' : 'bg-mist text-ink/40'}`}>
            {product.disponible ? 'Disponible' : 'Temporada'}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function Home() {
  return (
    <>
      <Seo path="/" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-paper"
        style={{ background: 'linear-gradient(165deg, #14261E 0%, #0E1C15 100%)' }}
      >
        {/* Hatch texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 36px)',
          }}
        />

        {/* Botanical illustration — decorative only, right side */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[42%] pointer-events-none select-none overflow-hidden hidden md:flex items-center justify-end pr-12 opacity-[0.13]"
          aria-hidden
        >
          <TulipIllustration />
        </div>

        <div className="relative max-w-[1180px] mx-auto px-6 py-28 md:py-40">
          <div className="max-w-[600px] animate-fade-up">
            <p className="eyebrow text-[11px] mb-5 text-gold/70">
              Mayoristas de flor y planta · Salamanca
            </p>
            <h1
              className="font-serif font-semibold leading-[1.03] text-paper"
              style={{ fontSize: 'clamp(2.3rem, 5.2vw, 3.75rem)', letterSpacing: '-0.025em' }}
            >
              Del mejor vivero de Europa{' '}
              <em className="text-gold" style={{ fontStyle: 'italic' }}>a tu floristería</em>,{' '}
              sin escalas.
            </h1>
            <p className="text-paper/55 mt-5 mb-9 max-w-[46ch] text-[15.5px] leading-relaxed">
              Importamos flor cortada y planta directamente del productor —Colombia, Ecuador
              y Holanda— y la entregamos en floristerías y viveros de toda España en 24–48 horas.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#seleccion" className="btn btn-primary">
                Ver selección
              </a>
              <Link to="/contacto" className="btn btn-ghost-light">
                Hablar con nosotros
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIRA DE DATOS ────────────────────────────────────────── */}
      {/* Cada pilar dice algo que el hero NO ha dicho */}
      <div className="bg-leaf-dark text-paper">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-3">
          {pillars.map(({ num, label, text }, i) => (
            <div
              key={num}
              className={`py-7 px-5 flex flex-col gap-1.5 ${i < pillars.length - 1 ? 'md:border-r md:border-paper/10 border-b md:border-b-0 border-paper/10' : ''}`}
            >
              <span className="mono-label text-[9.5px] text-gold/80">{num} — {label}</span>
              <p className="font-serif text-[16px] font-medium leading-snug text-paper/90">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUIÉNES SOMOS — historia, no propuesta de venta ──────── */}
      <section className="bg-card border-y border-mist py-20">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="section-eyebrow">Quiénes somos</span>
            <h2 className="section-title mb-5">
              Cuatro décadas como empresa familiar en el sector floral
            </h2>
            <p className="text-[15px] text-ink/65 leading-relaxed mb-4">
              Fernández y Calzada nació en Salamanca en 1985. Llevamos cuatro décadas en el
              sector y seguimos siendo la misma empresa familiar de siempre: trato directo,
              sin capas de gestión que ralenticen la respuesta.
            </p>
            <p className="text-[15px] text-ink/65 leading-relaxed mb-7">
              Hemos visto cambiar el mercado floral por completo —nuevas rutas, nuevas
              variedades, nuevas exigencias— y hemos crecido con él sin perder la escala que
              nos permite conocer a nuestros clientes por su nombre y por lo que necesitan.
            </p>
            <Link to="/nosotros" className="btn btn-ghost-dark">
              Conoce nuestra historia
            </Link>
          </div>

          {/* Ficha de datos objetivos */}
          <div className="border-t border-mist">
            {[
              { label: 'Fundación', value: '1985' },
              { label: 'Sede', value: 'Salamanca' },
              { label: 'Cobertura', value: 'España peninsular' },
              { label: 'Clientes', value: 'Floristerías · Viveros' },
              { label: 'Variedades', value: `${productos.length}+ activas` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-4 border-b border-mist">
                <span className="mono-label text-[10px] text-leaf-dark/70">{label}</span>
                <strong className="font-serif text-[19px] font-semibold">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELECCIÓN DEL CATÁLOGO ────────────────────────────────── */}
      <section id="seleccion" className="py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="section-eyebrow">Selección destacada</span>
              <h2 className="section-title">Una muestra de lo que trabajamos</h2>
            </div>
            <Link to="/catalogo" className="btn btn-ghost-dark self-start md:self-auto flex-shrink-0">
              Ver catálogo completo →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA CONTACTO ─────────────────────────────────────────── */}
      <section
        className="py-20 text-paper"
        style={{ background: 'linear-gradient(165deg, #14261E 0%, #0E1C15 100%)' }}
      >
        <div className="max-w-[1180px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <span className="eyebrow text-[11px] text-gold/70 mb-4">¿Eres floristería o vivero?</span>
            <h2
              className="font-serif font-semibold leading-tight text-paper max-w-[22ch]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}
            >
              Consulta disponibilidad y precios para tu zona
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap flex-shrink-0">
            <Link to="/contacto" className="btn btn-primary">
              Escríbenos
            </Link>
            <Link to="/catalogo" className="btn btn-ghost-light">
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
