'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Wrapper below-the-fold de /servicios — mismo patrón que
 * components/sections/home-below-fold.tsx: cada sección se dynamic-importa
 * (con SSR, así el HTML real sigue llegando del servidor para SEO) para sacar
 * su JS del bundle inicial, y `.cv-auto` evita layout/paint hasta que la
 * sección se acerca al viewport.
 *
 * Medido antes del cambio (Lighthouse mobile, throttled): /servicios cargaba
 * las 7 secciones (pricing tabs + showcase + proceso + comparativa + FAQ, casi
 * todas con framer-motion) en el bundle inicial junto con el hero — Style&Layout
 * 1436ms + Script Evaluation 1171ms de main-thread work, con el hero recién
 * pintando a los 3195ms (LCP). Diferir esto imita exactamente lo que ya
 * funcionaba en home.
 */

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

const ServiciosContent = dynamic(
  () => import('./content').then((m) => m.ServiciosContent),
  { loading: () => <SectionSkeleton className="py-16 pb-24" /> },
)

const ServiciosShowcase = dynamic(
  () => import('@/components/sections/servicios-showcase').then((m) => m.ServiciosShowcase),
  { loading: () => <SectionSkeleton className="py-16" /> },
)

const ServiciosProcess = dynamic(
  () => import('./static-sections').then((m) => m.ServiciosProcess),
  { loading: () => <SectionSkeleton className="py-16" /> },
)

const ServiciosWhyApex = dynamic(
  () => import('./static-sections').then((m) => m.ServiciosWhyApex),
  { loading: () => <SectionSkeleton className="py-12" /> },
)

const ServiciosComparisonTable = dynamic(
  () => import('./static-sections').then((m) => m.ServiciosComparisonTable),
  { loading: () => <SectionSkeleton className="py-12" /> },
)

const ServiciosStaticFaq = dynamic(
  () => import('./static-sections').then((m) => m.ServiciosStaticFaq),
  { loading: () => <SectionSkeleton className="py-16" /> },
)

const ServiciosFinalCta = dynamic(
  () => import('./servicios-final-cta').then((m) => m.ServiciosFinalCta),
  { loading: () => <SectionSkeleton className="py-24" /> },
)

export function ServiciosBelowFold() {
  return (
    <>
      {/* Medido: sin cv-auto acá, el pricing (3 cards framer-motion + tabs +
          AnimatePresence) seguía compitiendo por main-thread con el LCP del
          hero incluso ya en su propio chunk async — elementRenderDelay no
          bajaba de ~2.9s. Con cv-auto el layout/paint de esta sección se
          saltea hasta que se acerca al viewport, igual que el resto. */}
      <div className="cv-auto">
        <ServiciosContent />
      </div>
      <div className="cv-auto">
        <ServiciosShowcase />
      </div>
      <div className="cv-auto">
        <ServiciosProcess />
      </div>
      <div className="cv-auto">
        <ServiciosWhyApex />
      </div>
      <div className="cv-auto">
        <ServiciosComparisonTable />
      </div>
      <div className="cv-auto">
        <ServiciosStaticFaq />
      </div>
      <div className="cv-auto">
        <ServiciosFinalCta />
      </div>
    </>
  )
}
