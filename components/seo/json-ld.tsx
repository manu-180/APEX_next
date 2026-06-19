import { APP_URL, BRAND_IMAGE_SRC, WHATSAPP_NUMBER, WHATSAPP_PHONE_DISPLAY } from '@/lib/constants'
import { REVIEWS, AVG_RATING, REVIEW_COUNT } from '@/lib/data/reviews'
import { SafeJsonLd } from './safe-json-ld'

// Todos los datos de schema vienen de constantes en repo. Sin input de usuario.

const ABSOLUTE_BRAND_IMAGE = `${APP_URL.replace(/\/$/, '')}${BRAND_IMAGE_SRC}`
const ORG_ID = `${APP_URL.replace(/\/$/, '')}/#organization`
const PERSON_ID = `${APP_URL.replace(/\/$/, '')}/#person-manuel`

export function PersonJsonLd() {
  return (
    <SafeJsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Manuel Navarro',
        jobTitle: 'Desarrollador Full-Stack & Mobile',
        url: APP_URL,
        sameAs: [
          `https://wa.me/${WHATSAPP_NUMBER}`,
          'https://www.instagram.com/apex.stack/',
          'https://www.linkedin.com/in/manuel-navarro-dev',
        ],
        knowsAbout: [
          'Flutter',
          'Next.js',
          'Supabase',
          'Riverpod',
          'TypeScript',
          'Tailwind CSS',
          'Desarrollo de apps móviles',
          'Desarrollo web premium',
          'UX',
        ],
        description:
          'Especializado en crear experiencias fluidas, eficientes y con diseño premium, con Flutter, Next.js, Supabase y Riverpod. Atiende emprendedores y PyMEs en Argentina.',
        image: ABSOLUTE_BRAND_IMAGE,
        worksFor: { '@id': ORG_ID },
      }}
    />
  )
}

export function WebSiteJsonLd() {
  return (
    <SafeJsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'APEX Portfolio — Manuel Navarro',
        url: APP_URL,
        description:
          'Desarrollo Full-Stack & Mobile con diseño premium. Apps y webs que resuelven problemas reales para emprendedores y PyMEs en Argentina.',
        inLanguage: 'es-AR',
        publisher: { '@id': ORG_ID },
        author: { '@id': PERSON_ID },
        image: ABSOLUTE_BRAND_IMAGE,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${APP_URL}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

/**
 * Schema enriquecido por cada plan. Cada Service tiene Offer con ARS.
 * Habilita rich snippets de precio en SERPs y AEO/LLM citation.
 */
export function ServiceJsonLd() {
  const services = [
    {
      slug: 'landing-page',
      name: 'Landing Page',
      price: 300000,
      description:
        'Página con diseño premium que trabaja 24/7: quien te busca en Google te encuentra, te conoce y te contacta solo.',
      serviceType: 'Diseño y desarrollo de landing page',
    },
    {
      slug: 'web-interactiva',
      name: 'Web Interactiva',
      price: 600000,
      description: 'Clientes reservan, cotizan y pagan solos; vos te enfocás en trabajar.',
      serviceType: 'Diseño y desarrollo de web interactiva',
    },
    {
      slug: 'tienda-online',
      name: 'Tienda Online',
      price: 900000,
      description:
        'Canal propio con catálogo, carrito y pagos; sin que terceros se queden con tu margen.',
      serviceType: 'Diseño y desarrollo de e-commerce',
    },
    {
      slug: 'app-producto',
      name: 'App Producto',
      price: 580000,
      description: 'Tu negocio en el celular de cada cliente, en App Store y Google Play.',
      serviceType: 'Desarrollo de app móvil',
    },
    {
      slug: 'app-operaciones',
      name: 'App + Operaciones',
      price: 1150000,
      description: 'App para clientes y panel para gestionar pedidos, roles, pagos y reportes.',
      serviceType: 'Desarrollo de app móvil + backend',
    },
  ]

  const data = services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${APP_URL.replace(/\/$/, '')}/servicios#${s.slug}`,
    name: s.name,
    serviceType: s.serviceType,
    provider: { '@id': PERSON_ID },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    description: s.description,
    offers: {
      '@type': 'Offer',
      price: s.price,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      url: `${APP_URL.replace(/\/$/, '')}/servicios`,
    },
  }))

  return <SafeJsonLd data={data} />
}

/**
 * LocalBusiness completo con teléfono correcto, priceRange, openingHours,
 * AggregateRating y Reviews individuales. Habilita rich snippets ★ + AEO.
 */
export function LocalBusinessJsonLd() {
  return (
    <SafeJsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': ORG_ID,
        name: 'APEX — Manuel Navarro',
        alternateName: 'APEX Portfolio',
        image: ABSOLUTE_BRAND_IMAGE,
        url: APP_URL,
        telephone: WHATSAPP_PHONE_DISPLAY,
        email: 'manunv97@gmail.com',
        priceRange: '$$',
        areaServed: { '@type': 'Country', name: 'AR' },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AR',
          addressRegion: 'CABA',
          addressLocality: 'Buenos Aires',
        },
        // Agente de WhatsApp responde 24/7 → el negocio esta "abierto" siempre.
        // Consistente con el horario "Abierto las 24 horas" del Perfil de Negocio (Google).
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        founder: { '@id': PERSON_ID },
        sameAs: [
          `https://wa.me/${WHATSAPP_NUMBER}`,
          'https://www.instagram.com/apex.stack/',
          'https://www.linkedin.com/in/manuel-navarro-dev',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: AVG_RATING,
          reviewCount: String(REVIEW_COUNT),
          bestRating: '5',
          worstRating: '1',
        },
        review: REVIEWS.map((r) => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(r.rating),
            bestRating: '5',
            worstRating: '1',
          },
          author: { '@type': 'Person', name: r.name },
          datePublished: r.date,
          reviewBody: r.text,
        })),
      }}
    />
  )
}

/** @deprecated Renombrado a LocalBusinessJsonLd — alias por compatibilidad. */
export const AggregateRatingJsonLd = LocalBusinessJsonLd

/** BreadcrumbList JSON-LD para páginas internas. */
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <SafeJsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}
