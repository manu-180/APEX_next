import type { Metadata } from 'next'
import { ProductLandingPage } from '@/components/sections/product-landing'
import { ProductLandingJsonLd, productLandingMetadata } from '@/components/seo/product-landing-seo'
import { TIENDA_ONLINE } from '@/lib/data/product-landings'

export const dynamic = 'force-static'

export const metadata: Metadata = productLandingMetadata(TIENDA_ONLINE)

export default function TiendaOnlinePage() {
  return (
    <>
      <ProductLandingJsonLd data={TIENDA_ONLINE} />
      <ProductLandingPage data={TIENDA_ONLINE} />
    </>
  )
}
