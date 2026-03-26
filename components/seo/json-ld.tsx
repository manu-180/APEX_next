import { APP_URL, BRAND_IMAGE_SRC } from '@/lib/constants'

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
    knowsAbout: ['Flutter', 'Next.js', 'Supabase', 'Riverpod', 'TypeScript', 'Tailwind CSS', 'Diseño premium', 'UX'],
    description:
      'Especializado en crear experiencias fluidas, eficientes y con diseño premium, con Flutter, Supabase y Riverpod.',
    image: `${APP_URL.replace(/\/$/, '')}${BRAND_IMAGE_SRC}`,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'APEX Portfolio — Manuel Navarro',
    url: APP_URL,
    description: 'Desarrollo Full-Stack & Mobile con diseño premium. Apps y webs que resuelven problemas reales.',
    author: { '@type': 'Person', name: 'Manuel Navarro' },
    image: `${APP_URL.replace(/\/$/, '')}${BRAND_IMAGE_SRC}`,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function ServiceJsonLd() {
  const services = [
    {
      name: 'Landing Page',
      price: 300000,
      description:
        'Página que trabaja 24/7: quien te busca en Google te encuentra, te conoce y te contacta solo.',
    },
    {
      name: 'Web Interactiva',
      price: 600000,
      description: 'Clientes reservan, cotizan y pagan solos; vos te enfocás en trabajar.',
    },
    {
      name: 'Tienda Online',
      price: 900000,
      description: 'Canal propio con catálogo, carrito y pagos; sin que terceros se queden con tu margen.',
    },
    {
      name: 'App Producto',
      price: 580000,
      description: 'Tu negocio en el celular de cada cliente, en App Store y Google Play.',
    },
    {
      name: 'App + Operaciones',
      price: 1150000,
      description: 'App para clientes y panel para gestionar pedidos, roles, pagos y reportes.',
    },
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
    image: `${APP_URL.replace(/\/$/, '')}${BRAND_IMAGE_SRC}`,
    telephone: '+54 9 11 3427 2488',
    areaServed: 'AR',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
      addressLocality: 'Buenos Aires',
    },
    openingHours: 'Mo-Fr 09:00-19:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '5',
      bestRating: '5',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
