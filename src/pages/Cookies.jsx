import Seo from '../components/Seo'
import LegalPage from '../components/LegalPage'

function Body({ children }) {
  return (
    <p className="text-[14.5px] text-ink/65 leading-relaxed mb-4 last:mb-0">{children}</p>
  )
}

export default function Cookies() {
  return (
    <>
      <Seo
        title="Política de Cookies"
        description="Política de cookies de Fernández y Calzada S.L. Información sobre las cookies utilizadas en este sitio web."
        path="/cookies"
      />
      <LegalPage title="Política de Cookies">

        <Body>
          Este sitio web utiliza únicamente cookies técnicas necesarias para su funcionamiento
          (por ejemplo, para mantener la sesión del panel privado de gestión). No se utilizan
          cookies de analítica de terceros ni de publicidad.
        </Body>

        <Body>
          La analítica interna del sitio (visitas, páginas más vistas) se realiza de forma anónima
          y sin cookies de rastreo, por lo que no requiere consentimiento previo del usuario conforme
          a la normativa vigente (LSSI-CE).
        </Body>

        <Body>
          Si en el futuro se incorporan cookies de terceros (por ejemplo, herramientas de analítica
          externas), esta política se actualizará y se mostrará un banner de consentimiento antes
          de su uso.
        </Body>

      </LegalPage>
    </>
  )
}
