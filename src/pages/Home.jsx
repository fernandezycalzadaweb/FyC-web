import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import productos from '../data/products'

const FEATURED_IDS = ['col-01', 'hol-09', 'hol-13', 'col-07', 'hol-02', 'ver-01']
const featured = productos.filter((p) => FEATURED_IDS.includes(p.id))

const pillars = [
  {
    num: '01',
    label: 'Origen',
    text: 'Producto directo desde el vivero, sin cadena de intermediarios.',
  },
  {
    num: '02',
    label: 'Plazo',
    text: '24–48 h desde la recepción del pedido a cualquier punto de España.',
  },
  {
    num: '03',
    label: 'Trato',
    text: 'Asesoramiento personal en cada pedido. Conocemos el nombre de tu floristería.',
  },
]

const ORIGEN_FLAG = {
  Colombia: 'CO',
  Ecuador: 'EC',
  Holanda: 'NL',
  Nacional: 'ES',
}

function ProductCard({ product }) {
  const origenStr = product.origen
    .map((o) => ORIGEN_FLAG[o] || o)
    .join(' · ')

  return (
    <article className="group bg-card border border-mist rounded-[3px] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_32px_-16px_rgba(20,38,30,0.32)]">
      {/* Photo placeholder */}
      <div
        className="relative h-44 flex items-end p-3 overflow-hidden"
        style={{
          background: 'repeating-linear-gradient(45deg, rgba(20,38,30,0.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, #DCE3D8, #EDE9D9)',
        }}
      >
        <span className="mono-label text-[9px] text-ink/35 bg-paper/70 px-2 py-1 rounded-sm">
          FOTO PENDIENTE
        </span>
        {/* Stamp badge — rotates more on hover */}
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
        style={{
          background: 'linear-gradient(165deg, #14261E 0%, #0E1C15 100%)',
        }}
      >
        {/* Hatch overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 36px)',
          }}
        />

        {/* Botanical background illustration */}
        <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none overflow-hidden opacity-[0.055]">
          <svg viewBox="0 0 480 480" className="absolute right-[-6%] top-[50%] -translate-y-1/2 w-[90%] max-w-[520px]" fill="none" stroke="white" strokeWidth="0.8">
            {/* Outer ring */}
            <circle cx="240" cy="240" r="220" strokeDasharray="4 6" />
            <circle cx="240" cy="240" r="195" />
            {/* Petals (8 elongated ellipses) */}
            {[0,45,90,135,180,225,270,315].map(angle => (
              <ellipse key={angle} cx="240" cy="240" rx="22" ry="130"
                transform={`rotate(${angle} 240 240)`} />
            ))}
            {/* Inner details */}
            <circle cx="240" cy="240" r="32" />
            <circle cx="240" cy="240" r="18" />
            {/* Stem lines */}
            {[0,45,90,135,180,225,270,315].map(angle => (
              <line key={`s${angle}`}
                x1="240" y1="240"
                x2={240 + Math.cos((angle - 90) * Math.PI / 180) * 192}
                y2={240 + Math.sin((angle - 90) * Math.PI / 180) * 192}
                strokeOpacity="0.4"
              />
            ))}
          </svg>
        </div>

        <div className="relative max-w-[1180px] mx-auto px-6 py-24 md:py-36 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div className="animate-fade-up">
            <p className="eyebrow text-[11px] mb-5 text-gold/70">
              Mayoristas de flor y planta · Salamanca
            </p>
            <h1
              className="font-serif font-semibold leading-[1.03] text-paper max-w-[13ch]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', letterSpacing: '-0.025em' }}
            >
              Del mejor vivero de Europa{' '}
              <em className="text-gold" style={{ fontStyle: 'italic' }}>a tu floristería</em>,{' '}
              sin escalas.
            </h1>
            <p className="text-paper/55 mt-5 mb-8 max-w-[44ch] text-[15.5px] leading-relaxed">
              Importamos flor cortada y planta directamente del productor —Colombia, Ecuador y Holanda— y la
              entregamos a floristerías y viveros de toda España en 24–48 horas.
            </p>
            <div className="flex gap-3 flex-wrap">
              {/* CTA principal: desplaza a la selección destacada de esta página */}
              <a href="#seleccion" className="btn btn-primary">
                Ver selección
              </a>
              <Link to="/contacto" className="btn btn-ghost-light">
                Hablar con nosotros
              </Link>
            </div>
          </div>

          {/* Stamp */}
          <div className="hidden md:flex justify-center animate-fade-up-2">
            <div
              className="relative w-[200px] h-[200px]"
              style={{ transform: 'rotate(-8deg)' }}
            >
              <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-gold/50" />
              <div className="absolute inset-[18px] rounded-full border border-gold/30 flex flex-col items-center justify-center text-center gap-2 p-4">
                <span className="mono-label text-[9.5px] text-gold/80">Origen verificado</span>
                <strong className="font-serif text-[14.5px] font-semibold text-paper/90 leading-snug">
                  Directo del<br />productor
                </strong>
                <span className="mono-label text-[9.5px] text-gold/80">Sin intermediarios</span>
              </div>
              <div
                className="absolute inset-[-8px] rounded-full border border-dashed border-gold/20"
                style={{ animation: 'spin-slow 22s linear infinite' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PILARES ──────────────────────────────────────────────── */}
      <div className="bg-leaf-dark text-paper">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-3">
          {pillars.map(({ num, label, text }, i) => (
            <div
              key={num}
              className={`py-6 px-5 flex flex-col gap-1.5 ${i < pillars.length - 1 ? 'md:border-r md:border-paper/10 border-b md:border-b-0 border-paper/10' : ''}`}
            >
              <span className="mono-label text-[9.5px] text-gold/80">{num} — {label}</span>
              <p className="font-serif text-[16px] font-medium leading-snug text-paper/90">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUIÉNES SOMOS preview ─────────────────────────────────── */}
      <section className="bg-card border-y border-mist py-20">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="section-eyebrow">Quiénes somos</span>
            <h2 className="section-title mb-4">
              Casi cuatro décadas llevando flor de calidad a floristerías de toda España
            </h2>
            <p className="text-[15px] text-ink/65 leading-relaxed mb-4">
              Desde nuestra sede en Salamanca trabajamos cada día con productores y viveros
              para llevar flor cortada y planta de calidad a floristerías y viveros de toda
              España, sin intermediarios que encarezcan o retrasen el producto.
            </p>
            <p className="text-[15px] text-ink/65 leading-relaxed mb-6">
              Conocemos a nuestros proveedores de origen personalmente y visitamos sus
              instalaciones con regularidad para asegurarnos de que lo que llega a tu
              negocio cumple el nivel que esperas.
            </p>
            <Link to="/nosotros" className="btn btn-ghost-dark">
              Conoce nuestra historia
            </Link>
          </div>

          {/* Ficha de datos */}
          <div className="border-t border-mist">
            {[
              { label: 'Sede', value: 'Salamanca' },
              { label: 'Cobertura', value: 'España peninsular' },
              { label: 'Entrega', value: '24–48 h' },
              { label: 'Desde', value: '1985' },
              { label: 'Clientes', value: 'Floristerías · Viveros' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-4 border-b border-mist">
                <span className="mono-label text-[10px] text-leaf-dark/70">{label}</span>
                <strong className="font-serif text-[19px] font-semibold">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO preview ──────────────────────────────────────── */}
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
