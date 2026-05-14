'use client'

import Script from 'next/script'
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackGoogleAdsScroll50 } from '@/lib/analytics/google-ads'

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

function GoogleAdsScrollTracking() {
  const hasTrackedScroll50 = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (hasTrackedScroll50.current) return

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight <= 0) return

      const progress = window.scrollY / scrollableHeight
      if (progress < 0.5) return

      hasTrackedScroll50.current = true
      trackGoogleAdsScroll50()
      window.removeEventListener('scroll', onScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}

/**
 * GA4 + Google Ads completamente diferidos al `lazyOnload` para no bloquear
 * el critical path. Stub inline garantiza no perder eventos tempranos antes
 * de descargar gtag.js.
 */
export function GoogleAnalyticsRoot({ gaId }: { gaId: string }) {
  return (
    <>
      {/* Stub previa: encola comandos hasta que se cargue gtag.js */}
      <Script id="google-gtag-bootstrap" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        window.gtag('js', new Date());
        window.gtag('config', '${gaId}', { transport_type: 'beacon' });
        window.gtag('config', '${AW_ID}', { transport_type: 'beacon' });
      `}</Script>
      <Script
        id="google-gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Suspense fallback={null}>
        <GaRoutePageViews gaId={gaId} />
      </Suspense>
      <Suspense fallback={null}>
        <GoogleAdsScrollTracking />
      </Suspense>
    </>
  )
}
