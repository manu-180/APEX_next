import {
  APP_URL,
  BRAND_IMAGE_SRC,
  GOOGLE_BUSINESS_PROFILE_URL,
  ROUTES,
  WHATSAPP_NUMBER,
  WHATSAPP_PHONE_DISPLAY,
} from '@/lib/constants'
import { WEB_PLANS } from '@/lib/types/services'
import { REVIEWS, AVG_RATING, REVIEW_COUNT } from '@/lib/data/reviews'
import { SafeJsonLd } from './safe-json-ld'

// Todos los datos de schema vienen de constantes en repo. Sin input de usuario.

const BASE = APP_URL.replace(/\/$/, '')
const ABSOLUTE_BRAND_IMAGE = `${BASE}${BRAND_IMAGE_SRC}`
/**
 * Los `@id` de los tres nodos raíz del grafo. Se exportan para que cualquier
 * página los REFERENCIE (`{ '@id': PERSON_ID }`) en vez de redeclarar un
 * `{ '@type': 'Person', name: 'Manuel Navarro' }` inline: dos declaraciones
 * del mismo autor sin `@id` común son dos entidades distintas para Google, y
 * la autoridad se reparte entre ambas en vez de acumularse en una.
 */
export const ORG_ID = `${BASE}/#organization`
export const PERSON_ID = `${BASE}/#person-manuel`
export const WEBSITE_ID = `${BASE}/#website`

/**
 * Perfiles que confirman que la entidad "APEX / Manuel Navarro" es la misma en
 * todos lados. `sameAs` es lo que le permite a Google unir esos perfiles en un
 * solo nodo del Knowledge Graph en vez de tratarlos como homónimos sueltos —
 * y el Perfil de Negocio es el que más pesa para las búsquedas locales.
 */
const SAME_AS = [
  `https://wa.me/${WHATSAPP_NUMBER}`,
  'https://www.instagram.com/apex.stack/',
  'https://www.linkedin.com/in/manuel-navarro-dev',
  GOOGLE_BUSINESS_PROFILE_URL,
]

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
        sameAs: SAME_AS,
        // Ancla geográfica de la persona, no solo del negocio: es lo que
        // conecta "Manuel Navarro" con "desarrollador en Buenos Aires".
        homeLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Buenos Aires',
            addressRegion: 'CABA',
            addressCountry: 'AR',
          },
        },
        knowsLanguage: ['es-AR', 'en'],
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
        // `@id` estable para que otros nodos (BlogPosting, WebPage) puedan
        // referenciarlo con `isPartOf` en vez de duplicar los datos del sitio.
        '@id': WEBSITE_ID,
        name: 'APEX Portfolio — Manuel Navarro',
        url: APP_URL,
        description:
          'Desarrollo Full-Stack & Mobile con diseño premium. Apps y webs que resuelven problemas reales para emprendedores y PyMEs en Argentina.',
        inLanguage: 'es-AR',
        publisher: { '@id': ORG_ID },
        author: { '@id': PERSON_ID },
        image: ABSOLUTE_BRAND_IMAGE,
      }}
    />
  )
}

/**
 * Schema enriquecido por cada plan. Cada Service tiene Offer con ARS.
 * Habilita rich snippets de precio en SERPs y AEO/LLM citation.
 */
export function ServiceJsonLd() {
  /**
   * Los precios salen de WEB_PLANS, no de literales acá: antes estaban
   * escritos a mano (300000 / 600000 / 900000) y una actualización de precio
   * en `services.ts` dejaba al schema declarando el número viejo — un
   * desfasaje que no rompe nada visible y que Google sí lee.
   *
   * `landingUrl` apunta a la página propia del servicio cuando existe. Es lo
   * que convierte el catálogo en un grafo navegable en vez de cuatro nodos
   * apuntando todos a /servicios.
   */
  const services: Array<{
    slug: string
    planId?: string
    name: string
    price?: number
    description: string
    serviceType: string
    landingUrl: string
  }> = [
    {
      slug: 'landing-page',
      planId: 'web_basic',
      name: 'Landing Page',
      description:
        'Página con diseño premium que trabaja 24/7: quien te busca en Google te encuentra, te conoce y te contacta solo.',
      serviceType: 'Diseño y desarrollo de landing page',
      landingUrl: `${BASE}${ROUTES.landingPage}`,
    },
    {
      slug: 'web-interactiva',
      planId: 'web_interactive',
      name: 'Web Interactiva',
      description: 'Clientes reservan, cotizan y pagan solos; vos te enfocás en trabajar.',
      serviceType: 'Diseño y desarrollo de web interactiva',
      landingUrl: `${BASE}${ROUTES.servicios}`,
    },
    {
      slug: 'tienda-online',
      planId: 'web_premium',
      name: 'Tienda Online',
      description:
        'Canal propio con catálogo, carrito y pagos; sin que terceros se queden con tu margen.',
      serviceType: 'Diseño y desarrollo de e-commerce',
      landingUrl: `${BASE}${ROUTES.tiendaOnline}`,
    },
    {
      slug: 'software-a-medida',
      name: 'Software y apps a medida',
      description:
        'Apps iOS y Android, sistemas web, paneles, integraciones y automatizaciones con IA. Presupuesto por proyecto, definido en una videollamada.',
      serviceType: 'Desarrollo de software a medida',
      landingUrl: `${BASE}${ROUTES.servicios}`,
    },
  ].map((s) => ({
    ...s,
    price: s.planId ? (WEB_PLANS.find((p) => p.id === s.planId)?.price ?? undefined) : undefined,
  }))

  const data = services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE}/servicios#${s.slug}`,
    name: s.name,
    serviceType: s.serviceType,
    provider: { '@id': PERSON_ID },
    brand: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    description: s.description,
    url: s.landingUrl,
    ...(s.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: s.price,
            priceCurrency: 'ARS',
            availability: 'https://schema.org/InStock',
            url: s.landingUrl,
          },
        }
      : {}),
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
        // `name` EXACTAMENTE como figura en el Perfil de Negocio de Google
        // ("APEX"). La coincidencia literal del nombre es la mitad de la
        // consistencia NAP; las variantes largas van en `alternateName`.
        name: 'APEX',
        alternateName: ['APEX Portfolio', 'APEX — Manuel Navarro'],
        image: ABSOLUTE_BRAND_IMAGE,
        // `logo` es un campo propio de Organization y es el que Google usa
        // para el panel de conocimiento — `image` solo no alcanza.
        logo: {
          '@type': 'ImageObject',
          url: ABSOLUTE_BRAND_IMAGE,
          caption: 'APEX',
        },
        url: APP_URL,
        telephone: WHATSAPP_PHONE_DISPLAY,
        priceRange: '$$',
        currenciesAccepted: 'ARS',
        paymentAccepted: 'Transferencia bancaria, MercadoPago, tarjeta de crédito',
        foundingDate: '2021',
        slogan: 'Precio fijo, boceto gratis y entrega en 15 días.',
        knowsLanguage: ['es-AR', 'en'],
        areaServed: { '@type': 'Country', name: 'AR' },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AR',
          addressRegion: 'CABA',
          addressLocality: 'Buenos Aires',
        },
        // Agente de WhatsApp responde 24/7 → el negocio está "abierto" siempre.
        //
        // ⚠️ 2026-09-07: el Perfil de Negocio de Google YA NO dice 24 horas —
        // dice 9:00 a 22:00. O sea que esto y el perfil se contradicen, y la
        // consistencia de datos entre sitio y perfil pesa en búsqueda local.
        // No se tocó acá a propósito: si la atención real es 24/7 hay que
        // arreglar el perfil, y si es 9-22 hay que arreglar esto. Es una
        // decisión de negocio, no de código.
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        founder: { '@id': PERSON_ID },
        employee: { '@id': PERSON_ID },
        sameAs: SAME_AS,
        /**
         * Catálogo con los precios publicados. Es el bloque que responde
         * "¿cuánto cobra APEX?" sin que el modelo tenga que inferirlo de la
         * prosa, y sale de WEB_PLANS: si cambia un precio en el código,
         * cambia acá. Nunca hardcodear un número en este archivo.
         */
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Planes de desarrollo web',
          itemListElement: WEB_PLANS.filter((p) => p.price != null).map((p) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: p.name,
              description: p.description,
            },
            price: p.price,
            priceCurrency: 'ARS',
            availability: 'https://schema.org/InStock',
            url: `${BASE}/servicios`,
          })),
        },
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

/**
 * Breadcrumb de una página de primer nivel (`/servicios`, `/contacto`…).
 *
 * Google usa el BreadcrumbList para reemplazar la URL cruda del SERP por la
 * ruta legible, y es lo que le dice a un crawler —y a un LLM— dónde encaja la
 * página dentro del sitio. Estaba solo en las landings y el blog: las seis
 * páginas del menú principal no lo tenían.
 */
export function TopLevelBreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  const base = APP_URL.replace(/\/$/, '')
  return <BreadcrumbJsonLd items={[{ name: 'Inicio', url: APP_URL }, { name, url: `${base}${path}` }]} />
}
