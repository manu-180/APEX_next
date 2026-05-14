import { HeroSection } from '@/components/sections/hero'
import { HomeBelowFold } from '@/components/sections/home-below-fold'

/**
 * Home — hero estático crítico arriba, resto en componente separado que se
 * dynamic-importa (con SSR) para fragmentar el JS y mejorar TBT/LCP.
 *
 * ISR 1h en CDN + force-static reduce el TTFB de 1.4s → CDN edge cache.
 */
export const revalidate = 3600
export const dynamic = 'force-static'
export const dynamicParams = false

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeBelowFold />
    </>
  )
}
