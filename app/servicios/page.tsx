import type { Metadata } from 'next'
import { ServiciosContent } from './content'
import {
  ServiciosHero,
  ServiciosProcess,
  ServiciosWhyApex,
  ServiciosStaticFaq,
  ServiciosComparisonTable,
} from './static-sections'
import { SERVICIOS_FAQ_ITEMS } from './faq-data'
import { ServiciosFinalCta } from './servicios-final-cta'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { ServiciosShowcase } from '@/components/sections/servicios-showcase'

export const metadata: Metadata = {
  title: 'Páginas web a medida en Argentina | Precios desde $300.000',
  description:
    'Páginas web a medida desde ARS 300.000, con precio fijo y entrega garantizada en 15 días. Webs, e-commerce y apps móviles para empresas y emprendedores en Argentina.',
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
          proceso → diferenciador → comparativa única → FAQ → CTA final */}
      <ServiciosHero />
      <ServiciosContent />
      <ServiciosShowcase />
      <ServiciosProcess />
      <ServiciosWhyApex />
      <ServiciosComparisonTable />
      <ServiciosStaticFaq />
      <ServiciosFinalCta />
    </>
  )
}
