'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Wrapper que carga las secciones below-the-fold dynamically (con SSR para
 * preservar SEO). El JS se descarga sólo cuando se hidrata cada sección.
 * Esto saca ~20 KB del critical path del home.
 *
 * Cada `loading` reserva el alto aproximado de su sección (anti-CLS) y muestra
 * un barrido mientras el chunk se descarga en navegaciones cliente. Con SSR
 * activo el HTML real ya llega del servidor, así que esto NO afecta el SEO.
 */

/** Placeholder genérico con barrido que reserva alto para evitar saltos. */
function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className="relative mx-auto max-w-6xl px-6" aria-hidden="true">
      <div className={className}>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-5 h-12 w-3/4 max-w-xl" />
        <Skeleton className="mt-8 h-40 w-full" />
      </div>
    </div>
  )
}

const ClientBenefitsSection = dynamic(
  () => import('./client-benefits').then((m) => m.ClientBenefitsSection),
  { loading: () => <SectionSkeleton className="py-24 md:py-32" /> },
)

const HomeProcessSection = dynamic(
  () => import('./client-benefits').then((m) => m.HomeProcessSection),
  { loading: () => <SectionSkeleton className="py-24 md:py-32" /> },
)

const TrustedClientsSection = dynamic(
  () => import('./trusted-clients').then((m) => m.TrustedClientsSection),
  { loading: () => <SectionSkeleton className="py-16 md:py-20" /> },
)

const FounderSection = dynamic(
  () => import('./founder').then((m) => m.FounderSection),
  { loading: () => <SectionSkeleton className="py-24 md:py-32" /> },
)

const HomeFinalCtaSection = dynamic(
  () => import('./home-final-cta').then((m) => m.HomeFinalCtaSection),
  { loading: () => <SectionSkeleton className="pb-28 pt-24 md:pb-36 md:pt-32" /> },
)

export function HomeBelowFold() {
  // Orden objetivo (DESIGN_BRIEF §3): prueba social inmediata (01) →
  // problema/solución (02) → proceso con boceto gratis (03) → founder (04) →
  // CTA final (05). La serie de numeración editorial queda sin agujeros.
  return (
    <>
      <TrustedClientsSection />
      <ClientBenefitsSection />
      <HomeProcessSection />
      <FounderSection />
      <HomeFinalCtaSection />
    </>
  )
}
