import Seo from '../components/Seo'
import { useTrackVisit } from '../hooks/useTrackVisit'

const PRENSA = [
  {
    id: 1,
    titulo: 'El hombre que importa flores con solo un fax y un teléfono',
    fuente: 'La Gaceta de Salamanca',
    fecha: '18 abril 1993',
    imagen: '/documents/prensa/la-gaceta-1993.jpg',
    href: '/documents/prensa/la-gaceta-1993.jpg',
  },
  {
    id: 2,
    titulo: 'En movimiento por la calidad',
    fuente: 'Garden',
    fecha: '1996',
    imagen: '/images/prensa/garden-1996.jpg',
    href: '/documents/prensa/garden-1996.pdf',
  },
  {
    id: 3,
    titulo: 'El futuro del sector será muy competitivo',
    fuente: 'Tribuna de Salamanca',
    fecha: '1 marzo 1998',
    imagen: '/documents/prensa/tribuna-salamanca.jpg',
    href: '/documents/prensa/tribuna-salamanca.jpg',
  },
  {
    id: 4,
    titulo: 'Hobby Flower prepara su expansión por la región',
    fuente: 'Castilla y León Económica',
    fecha: '1999',
    imagen: '/images/prensa/castilla-leon-economica.jpg',
    href: '/documents/prensa/castilla-leon-economica.pdf',
  },
  {
    id: 5,
    titulo: 'Con flores naturales se trabaja mejor',
    fuente: 'Ejecutivos',
    fecha: 'mayo 2004',
    imagen: '/images/prensa/ejecutivos-2004.jpg',
    href: '/documents/prensa/ejecutivos-2004.pdf',
  },
  {
    id: 6,
    titulo: 'La tienda virtual fernandezycalzada.com',
    fuente: 'Extra Florista',
    fecha: '2008',
    imagen: '/images/prensa/extra-florista-2008.jpg',
    href: '/documents/prensa/extra-florista-2008.pdf',
  },
  {
    id: 7,
    titulo: 'Nuestro fin es llegar a las floristerías con flores de calidad lo antes posible',
    fuente: 'Revista Interflora',
    fecha: 'años 90',
    imagen: '/documents/prensa/publireportaje.jpg',
    href: '/documents/prensa/publireportaje.jpg',
  },
  {
    id: 8,
    titulo: 'Este sector nos mantiene alerta cada día',
    fuente: 'Extra Florista',
    fecha: 's/f',
    imagen: '/images/prensa/extra-florista.jpg',
    href: '/documents/prensa/extra-florista.pdf',
  },
]

function PressCard({ item }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={(e) => (e.currentTarget.querySelector('.card-inner').style.borderColor = 'rgba(74,122,52,0.3)')}
      onMouseLeave={(e) => (e.currentTarget.querySelector('.card-inner').style.borderColor = 'rgba(0,0,0,0.08)')}
    >
      <div
        className="card-inner"
        style={{
          background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 20, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', height: '100%',
          transition: 'border-color 0.15s',
        }}
      >
        {/* Imagen o placeholder */}
        <div
          style={{
            height: 160, background: 'rgba(140,191,63,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {item.imagen ? (
            <img src={item.imagen} alt={item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8CBF3F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Imagen pendiente
            </span>
          )}
        </div>

        {/* Texto */}
        <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
            {item.titulo}
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 'auto', paddingTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4A7A34' }}>{item.fuente}</span>
            <span style={{ fontSize: 11, color: '#6E6E73' }}>·</span>
            <span style={{ fontSize: 12, color: '#6E6E73' }}>{item.fecha}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function Nosotros() {
  useTrackVisit('/nosotros')

  return (
    <>
      <Seo path="/nosotros" />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 96px' }}>

        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px' }}>
            En los medios
          </h1>
          <p style={{ fontSize: 16, color: '#6E6E73', margin: 0 }}>
            Apariciones y menciones de Fernández y Calzada en prensa.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {PRENSA.map((item) => <PressCard key={item.id} item={item} />)}
        </div>

      </div>
    </>
  )
}
