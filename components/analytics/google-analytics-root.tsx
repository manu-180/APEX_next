'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const AW_ID = 'AW-18041789644'

function GaRoutePageViews({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    if (typeof window.gtag !== 'function') return

    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname

    if (isFirst.current) {
      isFirst.current = false
      return
    }

    window.gtag('config', gaId, { page_path: pagePath })
  }, [gaId, pathname, searchParams])

  return null
}

function GoogleAdsInit() {
  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('config', AW_ID)
  }, [])

  return null
}

/**
 * GA4 vía `@next/third-parties` + Google Ads (AW-18041789644) init en cada carga.
 */
export function GoogleAnalyticsRoot({ gaId }: { gaId: string }) {
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <Suspense fallback={null}>
        <GaRoutePageViews gaId={gaId} />
      </Suspense>
      <Suspense fallback={null}>
        <GoogleAdsInit />
      </Suspense>
    </>
  )
}
