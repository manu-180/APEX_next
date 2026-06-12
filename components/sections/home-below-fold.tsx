'use client'

import dynamic from 'next/dynamic'

/**
 * Wrapper que carga las secciones below-the-fold dynamically (con SSR para
 * preservar SEO). El JS se descarga sólo cuando se hidrata cada sección.
 * Esto saca ~20 KB del critical path del home.
 */

const ClientBenefitsSection = dynamic(
  () => import('./client-benefits').then((m) => m.ClientBenefitsSection),
)

const TrustedClientsSection = dynamic(
  () => import('./trusted-clients').then((m) => m.TrustedClientsSection),
)

const FounderSection = dynamic(
  () => import('./founder').then((m) => m.FounderSection),
)

const HomeFinalCtaSection = dynamic(
  () => import('./home-final-cta').then((m) => m.HomeFinalCtaSection),
)

export function HomeBelowFold() {
  // Orden objetivo (DESIGN_BRIEF §3): prueba social inmediata (01) →
  // problema/solución/proceso (02-03) → founder (04) → CTA final (05).
  return (
    <>
      <TrustedClientsSection />
      <ClientBenefitsSection />
      <FounderSection />
      <HomeFinalCtaSection />
    </>
  )
}
