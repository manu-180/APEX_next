import type { Metadata } from 'next'
import { ServiciosContent } from './content'
import {
  ServiciosHero,
  ServiciosProcess,
  ServiciosWhyApex,
  ServiciosStaticFaq,
  ServiciosComparisonTable,
  VerticalsBridge,
} from './static-sections'
import { SERVICIOS_FAQ_ITEMS } from './faq-data'
import { ServiciosFinalCta } from './servicios-final-cta'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { ServiciosShowcase } from '@/components/sections/servicios-showcase'
import { AfipAddonSection } from '@/components/sections/afip-addon'

export const metadata: Metadata = {
  title: 'Desarrollo de software Argentina | Precios',
  description:
    'Desarrollo de software a medida para empresas y emprendedores. Precio fijo, entrega garantizada en 15 días. Web, e-commerce y apps móviles desde ARS 300k.',
  keywords: [
    'desarrollo de software argentina',
    'desarrollo web argentina',
    'precio página web argentina',
    'cuánto cuesta una app',
    'software a medida',
    'desarrollador de software',
    'desarrollador full stack',
    'flutter argentina',
    'next.js argentina',
  ],
  alternates: { canonical: '/servicios' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SERVICIOS_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

export default function ServiciosPage() {
  return (
    <>
      <SafeJsonLd data={faqSchema} />
      {/* Orden DESIGN_BRIEF §3: hero corto → pricing → casos reales (prueba) →
          proceso → diferenciador → AFIP → comparativa única →
          verticales → FAQ → CTA final */}
      <ServiciosHero />
      <ServiciosContent />
      <ServiciosShowcase />
      <ServiciosProcess />
      <ServiciosWhyApex />
      <AfipAddonSection />
      <ServiciosComparisonTable />
      <VerticalsBridge />
      <ServiciosStaticFaq />
      <ServiciosFinalCta />
    </>
  )
}
