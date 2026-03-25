import { APP_URL } from '@/lib/constants'

// These JSON-LD scripts contain only static, developer-controlled data (no user input).
// The dangerouslySetInnerHTML is safe here as all content is hardcoded constants.

export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Manuel Navarro',
    jobTitle: 'Desarrollador Full-Stack & Mobile',
    url: APP_URL,
    sameAs: [
      `https://wa.me/5491134272488`,
    ],
    knowsAbout: ['Flutter', 'Next.js', 'Supabase', 'Riverpod', 'TypeScript', 'Tailwind CSS'],
    description: 'Especializado en crear experiencias de usuario fluidas y eficientes con Flutter, Supabase y Riverpod.',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'APEX Portfolio — Manuel Navarro',
    url: APP_URL,
    description: 'Desarrollo Full-Stack & Mobile. Apps que resuelven problemas reales.',
    author: { '@type': 'Person', name: 'Manuel Navarro' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function ServiceJsonLd() {
  const services = [
    { name: 'Landing Page', price: 300000, description: 'Diseño web a medida para profesionales independientes' },
    { name: 'Web Interactiva', price: 600000, description: 'Web con base de datos, panel admin e integraciones' },
    { name: 'Tienda Online', price: 900000, description: 'E-commerce completo con carrito y pasarela de pagos' },
    { name: 'App Profesional', price: 1200000, description: 'App móvil iOS + Android con Flutter' },
    { name: 'App Empresarial', price: 2700000, description: 'App empresarial con panel admin y roles' },
  ]

  const data = services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    provider: { '@type': 'Person', name: 'Manuel Navarro' },
    description: s.description,
    offers: {
      '@type': 'Offer',
      price: s.price,
      priceCurrency: 'ARS',
    },
  }))

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function AggregateRatingJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'APEX — Manuel Navarro',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '5',
      bestRating: '5',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
