import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
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
import { Skeleton } from '@/components/ui/skeleton'

/**
 * AfipAddonSection es below-the-fold y no participa del contenido crítico de
 * pricing/SEO (su copy no es distinto de lo que ya se ve más arriba en la
 * página). next/dynamic lo saca del chunk inicial de /servicios; ssr:true
 * (default) mantiene el HTML servido para SEO — solo se fragmenta el JS.
 */
const AfipAddonSection = dynamic(
  () => import('@/components/sections/afip-addon').then((m) => m.AfipAddonSection),
  { loading: () => <AfipAddonSkeleton /> },
)

/** Reserva el alto aproximado de la sección (evita CLS mientras carga el chunk). */
function AfipAddonSkeleton() {
  return (
    <section className="relative py-16 sm:py-20" aria-hidden="true">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-[var(--glass-border)] p-8 sm:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-4 h-10 w-3/4" />
              <Skeleton className="mt-3 h-16 w-full" />
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
              <Skeleton className="mt-6 h-11 w-52 rounded-xl" />
            </div>
            <Skeleton className="hidden aspect-[3/4] w-40 rounded-2xl md:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

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
