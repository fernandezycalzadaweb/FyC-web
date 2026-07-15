import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.fernandezycalzada.com'
const DEFAULT_TITLE = 'Fernández y Calzada · Mayorista de flor y planta · Salamanca'
const DEFAULT_DESC =
  'Mayoristas de flor cortada, planta y accesorios de floristería en Salamanca. Importación directa desde Colombia, Ecuador y Holanda. Entrega en 24–48 h.'

export default function Seo({ title, description, path = '', schema }) {
  const fullTitle = title ? `${title} · Fernández y Calzada` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const canonical = `${BASE_URL}${path}`

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fernández y Calzada S.L.',
    url: BASE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Río Tera 2',
      postalCode: '37003',
      addressLocality: 'Salamanca',
      addressCountry: 'ES',
    },
    taxID: 'B37319829',
    areaServed: 'ES',
    description: DEFAULT_DESC,
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:site_name" content="Fernández y Calzada" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schema || orgSchema)}
      </script>
    </Helmet>
  )
}
