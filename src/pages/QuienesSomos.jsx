import Seo from '../components/Seo'
import { useTrackVisit } from '../hooks/useTrackVisit'

const HITOS = [
  { etiqueta: 'Años 80', titulo: 'Fundación', texto: 'Nace Fernández y Calzada con el objetivo de traer flor de calidad desde Holanda a las floristerías españolas.' },
  { etiqueta: 'Años 90', titulo: 'Expansión internacional', texto: 'Incorporamos Colombia, Ecuador, Kenia e Israel. La variedad y la calidad se multiplican.' },
  { etiqueta: 'Hoy', titulo: 'Empresa familiar', texto: 'Seguimos en Salamanca, con servicio a toda España y los mismos principios de siempre.' },
]

const PARRAFOS = [
  'La empresa Fernández y Calzada se creó a finales de los años 80 por la necesidad de aumentar la calidad y la variedad de las flores que llegaban a las floristerías españolas.',
  'Hay que recordar que en aquellos momentos no existían los teléfonos móviles, ni internet, y por lo tanto tampoco las redes sociales ni WhatsApp. ¿Cómo podríamos vivir y hacer negocios nos preguntamos ahora?',
  'Pues lo hicimos, y en Fernández y Calzada conseguimos hacer llegar una gran variedad de flores, desde las subastas de Holanda, directamente a las floristerías, con medios que ahora se ven como muy rudimentarios. Hay que pensar que la forma de contacto, tanto con Holanda como con los clientes, era solamente a través de llamadas telefónicas, ya que el gran avance de la época, el fax, no se popularizó en España a nivel de las floristerías hasta bien entrada la década de los 90.',
  'Posteriormente seguimos buscando e importando flores de países como Colombia, Ecuador, Kenia, Israel y de cualquier país donde se produjeran flores de primerísima calidad.',
  'Así, en estos momentos disponemos de flores que nos llegan directamente desde las mejores fincas de rosas, alstroemerias, anastasias, claveles y paniculata, además de la gran variedad de flor que ofrece Holanda y las mejores flores de producción nacional.',
  'Fernández y Calzada sigue siendo una empresa familiar, ubicada en Salamanca, con servicio a toda España y con los mismos principios con los que se creó:',
]

export default function QuienesSomos() {
  useTrackVisit('/quienes-somos')

  return (
    <>
      <Seo
        title="Quiénes somos"
        description="Fernández y Calzada — distribuidores mayoristas de flor y planta desde los años 80, con sede en Salamanca y servicio a toda España."
        path="/quienes-somos"
      />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 96px' }}>

        {/* Cabecera */}
        <div style={{ marginBottom: 64 }}>
          <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 12px' }}>
            Quiénes somos
          </h1>
          <p style={{ fontSize: 16, color: '#6E6E73', margin: 0 }}>
            Una empresa familiar de Salamanca con más de tres décadas distribuyendo flor de primerísima calidad.
          </p>
        </div>

        {/* Layout: texto + hitos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 72, alignItems: 'start' }}>

          {/* Columna de texto */}
          <div style={{ maxWidth: 620 }}>
            {PARRAFOS.map((p, i) => (
              <p key={i} style={{ fontSize: 16.5, lineHeight: 1.75, color: i === 0 ? '#1D1D1F' : '#3A3A3C', margin: '0 0 20px', maxWidth: '65ch' }}>
                {p}
              </p>
            ))}
          </div>

          {/* Columna de hitos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {HITOS.map((h, i) => (
              <div key={h.etiqueta} style={{ display: 'flex', gap: 20, paddingBottom: 36, position: 'relative' }}>
                {/* Línea vertical entre hitos */}
                {i < HITOS.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 19, top: 44, bottom: 0,
                    width: 2, background: 'rgba(140,191,63,0.25)',
                  }} />
                )}
                {/* Dot */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(140,191,63,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid rgba(140,191,63,0.35)',
                  zIndex: 1,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8CBF3F' }} />
                </div>
                <div style={{ paddingTop: 8 }}>
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: '#8CBF3F', marginBottom: 4,
                  }}>
                    {h.etiqueta}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', marginBottom: 6 }}>
                    {h.titulo}
                  </div>
                  <p style={{ fontSize: 13.5, color: '#6E6E73', margin: 0, lineHeight: 1.6, maxWidth: '28ch' }}>
                    {h.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Cita final */}
        <div style={{
          marginTop: 72,
          background: 'rgba(140,191,63,0.07)',
          border: '1px solid rgba(140,191,63,0.2)',
          borderLeft: '4px solid #8CBF3F',
          borderRadius: '0 20px 20px 0',
          padding: '36px 40px',
          maxWidth: 720,
        }}>
          <div style={{ fontSize: 56, lineHeight: 1, color: '#8CBF3F', fontFamily: 'Georgia, serif', marginBottom: 8, userSelect: 'none' }}>
            "
          </div>
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#1D1D1F',
            lineHeight: 1.5,
            margin: '0 0 16px',
            letterSpacing: '-0.01em',
          }}>
            Proporcionar a las floristerías una gran variedad de flores y siempre de primerísima calidad.
          </p>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#8CBF3F', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Fernández y Calzada · Desde los años 80
          </span>
        </div>

      </div>
    </>
  )
}
