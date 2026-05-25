import type { Metadata } from 'next'
import { ServiciosContent } from './content'
import {
  ServiciosHero,
  ServiciosStaticTop,
  ServiciosStaticFaq,
  ServiciosComparisonTable,
  VerticalsBridge,
  SERVICIOS_FAQ_ITEMS,
} from './static-sections'
import { ServiciosFinalCta } from './servicios-final-cta'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { LeadMagnetSection } from '@/components/sections/lead-magnet'
import { BudgetCalculatorSection } from '@/components/sections/budget-calculator'
import { AfipAddonSection } from '@/components/sections/afip-addon'

export const metadata: Metadata = {
  title: 'Desarrollo de software Argentina | Precios | Manuel Navarro',
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
      <ServiciosHero />
      <ServiciosContent />
      <ServiciosStaticTop />
      <BudgetCalculatorSection />
      <AfipAddonSection />
      <ServiciosComparisonTable />
      <VerticalsBridge />
      <LeadMagnetSection variant="full" source="servicios" />
      <ServiciosStaticFaq />
      <ServiciosFinalCta />
    </>
  )
}
