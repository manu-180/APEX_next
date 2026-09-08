import type { Metadata } from 'next'
import { ProductLandingPage } from '@/components/sections/product-landing'
import { ProductLandingJsonLd, productLandingMetadata } from '@/components/seo/product-landing-seo'
import { LANDING_PAGE } from '@/lib/data/product-landings'

export const dynamic = 'force-static'

export const metadata: Metadata = productLandingMetadata(LANDING_PAGE)

export default function LandingPagePage() {
  return (
    <>
      <ProductLandingJsonLd data={LANDING_PAGE} />
      <ProductLandingPage data={LANDING_PAGE} />
    </>
  )
}
