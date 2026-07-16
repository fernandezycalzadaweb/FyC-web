import Seo from '../components/Seo'
import LegalPage from '../components/LegalPage'

function Section({ title, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2
        className="font-serif font-semibold text-ink mb-3"
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

export default function Privacidad() {
  return (
    <>
      <Seo
        title="Política de Privacidad"
        description="Política de privacidad de Fernández y Calzada S.L. Información sobre el tratamiento de datos personales conforme al RGPD y la LOPDGDD."
        path="/privacidad"
      />
      <LegalPage title="Política de Privacidad">

        <p className="text-[14.5px] text-ink/65 leading-relaxed mb-10">
          En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección
          de Datos Personales y garantía de los derechos digitales (LOPDGDD):
        </p>

        <Section title="Responsable del tratamiento">
          <div className="border-t border-mist">
            {[
              ['Empresa', 'Fernández y Calzada S.L.'],
              ['CIF', 'B37319829'],
              ['Domicilio', 'Calle Río Tera 2, 37003, Salamanca'],
              ['Contacto', 'info@fernandezycalzada.com'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:gap-8 py-3 border-b border-mist"
              >
                <span className="mono-label text-[9.5px] text-leaf-dark/65 sm:w-36 flex-shrink-0 mb-0.5 sm:mb-0 pt-px">
                  {label}
                </span>
                <span className="text-[14px] text-ink">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Finalidad del tratamiento">
          <Body>
            Los datos facilitados a través del formulario de contacto se utilizan exclusivamente para
            responder a la consulta o solicitud realizada, y para gestionar la relación comercial con
            floristerías y viveros que lo soliciten.
          </Body>
        </Section>

        <Section title="Legitimación">
          <Body>
            El tratamiento se basa en el consentimiento del interesado al rellenar el formulario
            de contacto.
          </Body>
        </Section>

        <Section title="Conservación de los datos">
          <Body>
            Los datos se conservarán durante el tiempo necesario para atender la solicitud y, en su
            caso, mientras exista relación comercial, salvo obligación legal de conservación superior.
          </Body>
        </Section>

        <Section title="Destinatarios">
          <Body>
            No se ceden datos a terceros, salvo obligación legal.
          </Body>
        </Section>

        <Section title="Derechos">
          <Body>
            El interesado puede ejercer sus derechos de acceso, rectificación, supresión, oposición,
            limitación y portabilidad escribiendo a{' '}
            <a
              href="mailto:info@fernandezycalzada.com"
              className="text-leaf underline underline-offset-2 hover:text-leaf-dark transition-colors"
            >
              info@fernandezycalzada.com
            </a>
            , indicando el derecho que desea ejercer y adjuntando copia de un documento identificativo.
          </Body>
          <Body>
            También puede presentar una reclamación ante la Agencia Española de Protección de Datos
            ({' '}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-leaf underline underline-offset-2 hover:text-leaf-dark transition-colors"
            >
              www.aepd.es
            </a>
            {' '}) si considera que el tratamiento no se ajusta a la normativa vigente.
          </Body>
        </Section>

      </LegalPage>
    </>
  )
}
