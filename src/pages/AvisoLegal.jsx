import Seo from '../components/Seo'
import LegalPage from '../components/LegalPage'

const datos = [
  ['Denominación social', 'Fernández y Calzada S.L.'],
  ['CIF', 'B37319829'],
  ['Domicilio', 'Calle Río Tera 2, 37003, Salamanca'],
  ['Email de contacto', 'info@fernandezycalzada.com'],
  ['Teléfono', '923 18 22 22'],
  ['Registro Mercantil', 'Registro Mercantil de Salamanca'],
]

function Section({ title, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2
        className="font-serif font-semibold text-ink mb-4"
        style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', letterSpacing: '-0.01em' }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Body({ children }) {
  return (
    <p className="text-[14.5px] text-ink/65 leading-relaxed mb-3 last:mb-0">{children}</p>
  )
}

export default function AvisoLegal() {
  return (
    <>
      <Seo
        title="Aviso Legal"
        description="Aviso legal de Fernández y Calzada S.L., mayoristas de flor cortada y planta en Salamanca."
        path="/aviso-legal"
      />
      <LegalPage title="Aviso Legal">

        <Section title="Datos identificativos">
          <p className="text-[14px] text-ink/60 leading-relaxed mb-4">
            En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002,
            de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico,
            se facilitan los siguientes datos:
          </p>
          <div className="border-t border-mist">
            {datos.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:gap-8 py-3.5 border-b border-mist"
              >
                <span className="mono-label text-[9.5px] text-leaf-dark/65 sm:w-44 flex-shrink-0 mb-0.5 sm:mb-0 pt-px">
                  {label}
                </span>
                <span className="text-[14px] text-ink">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Objeto">
          <Body>
            Fernández y Calzada S.L. es una empresa dedicada a la compra y distribución de flor
            cortada, planta y accesorios de floristería para profesionales del sector (floristerías
            y viveros). Opera desde sus instalaciones en Salamanca, desde donde distribuye género
            adquirido en los principales mercados productores (Holanda, Colombia y Ecuador) así como
            de origen nacional, adaptando cada pedido a las necesidades concretas de cada cliente.
          </Body>
          <Body>
            Este sitio web tiene carácter meramente informativo y de catálogo. No se realizan ventas
            ni transacciones económicas a través de esta web, ni se ofrece venta al público general.
          </Body>
        </Section>

        <Section title="Propiedad intelectual">
          <Body>
            Los contenidos de este sitio web (textos, imágenes, logotipos, diseño) son propiedad
            de Fernández y Calzada S.L. o de terceros que han autorizado su uso, y están protegidos
            por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción
            total o parcial sin autorización expresa.
          </Body>
        </Section>

        <Section title="Responsabilidad">
          <Body>
            Fernández y Calzada S.L. no se hace responsable de los daños derivados de un uso
            inadecuado de este sitio web ni de la información contenida en enlaces externos.
          </Body>
        </Section>

      </LegalPage>
    </>
  )
}
