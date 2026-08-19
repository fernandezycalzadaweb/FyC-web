import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.fernandezycalzada.com'
const DEFAULT_TITLE = 'Fernández y Calzada · Mayorista de flor y planta · Salamanca'
const DEFAULT_DESC =
  'Mayoristas de flor cortada, planta y accesorios de floristería en Salamanca. Importación directa desde Colombia, Ecuador y Holanda. Entrega en 24–48 h.'

const OG_IMAGE = `${BASE_URL}/og-image.jpg`

export default function Seo({ title, description, path = '', schema }) {
  const fullTitle = title ? `${title} · Fernández y Calzada` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const canonical = `${BASE_URL}${path}`

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#business`,
    name: 'Fernández y Calzada S.L.',
    url: BASE_URL,
    telephone: '+34923182222',
    email: 'info@fernandezycalzada.com',
    description: DEFAULT_DESC,
    image: OG_IMAGE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Río Tera 2',
      postalCode: '37003',
      addressLocality: 'Salamanca',
      addressRegion: 'Castilla y León',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.9671,
      longitude: -5.6636,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    ],
    taxID: 'B37319829',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'España',
    },
    sameAs: [],
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
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schema || orgSchema)}
      </script>
    </Helmet>
  )
}
