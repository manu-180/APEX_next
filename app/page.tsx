import { HeroSection } from '@/components/sections/hero'
import { ClientBenefitsSection } from '@/components/sections/client-benefits'
import { ProjectsSection } from '@/components/sections/projects'
import { TrustedClientsSection } from '@/components/sections/trusted-clients'
import { HomeFinalCtaSection } from '@/components/sections/home-final-cta'

/** Shell del home sin datos remotos en SSR; ISR 1h para reducir TTFB en CDN. */
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientBenefitsSection />
      <ProjectsSection />
      <TrustedClientsSection />
      <HomeFinalCtaSection />
    </>
  )
}
