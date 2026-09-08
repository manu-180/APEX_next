import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { APP_URL, ROUTES } from '@/lib/constants'
import type { ProductLanding } from '@/lib/data/product-landings'

const BASE = APP_URL.replace(/\/$/, '')
const PERSON_ID = `${BASE}/#person-manuel`
const ORG_ID = `${BASE}/#organization`

/**
 * Metadata y datos estructurados de las landings por producto.
 *
 * Vive acá y no en cada `page.tsx` porque el contrato del schema es lo que
 * más fácil se desincroniza entre páginas hermanas: un `@id` mal armado o un
 * `Offer` sin `priceCurrency` no rompe el build ni se ve en pantalla — se ve
 * tres semanas después en Search Console, cuando el rich result ya no salió.
 */

export function productLandingMetadata(data: ProductLanding): Metadata {
  const url = `${BASE}${data.path}`
  return {
    // `absolute`: el título ya lleva el producto + el país + el precio. Un
    // sufijo de marca acá empuja el precio fuera de la línea visible del SERP.
    title: { absolute: data.seoTitle },
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: data.path },
    openGraph: {
      type: 'website',
      title: data.seoTitle,
      description: data.metaDescription,
      url,
      siteName: 'APEX Portfolio',
      locale: 'es_AR',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: data.seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seoTitle,
      description: data.metaDescription,
      images: ['/opengraph-image'],
    },
  }
}

export function ProductLandingJsonLd({ data }: { data: ProductLanding }) {
  const url = `${BASE}${data.path}`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    // `@id` propio por página: sin él, el Service de esta landing y el de
    // `ServiceJsonLd` (que corre en el layout, o sea también acá) se leen
    // como el mismo nodo y el precio de uno pisa al del otro.
    '@id': `${url}#service`,
    name: data.seoTitle,
    description: data.answer,
    provider: { '@id': PERSON_ID },
    brand: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    serviceType: data.eyebrow.replace('/ ', ''),
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      url,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Servicios', url: `${BASE}${ROUTES.servicios}` },
          { name: data.shortName, url },
        ]}
      />
      <SafeJsonLd data={faqSchema} />
      <SafeJsonLd data={serviceSchema} />
    </>
  )
}
