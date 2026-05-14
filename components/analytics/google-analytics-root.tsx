'use client'

import Script from 'next/script'
import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackGoogleAdsScroll50 } from '@/lib/analytics/google-ads'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const AW_ID = 'AW-18041789644'

const FIRST_INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'pointerdown',
  'touchstart',
  'keydown',
  'scroll',
  'mousemove',
]

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
 * GA4 + Google Ads se inyectan SOLO tras la primera interacción del usuario
 * (o 25 s después como failsafe). El bootstrap inline encola comandos para
 * que no se pierda nada antes de que gtag.js cargue.
 *
 * Esto saca completamente al medidor de tráfico del critical path y elimina
 * ~50–80 ms de bloqueo en el FCP/LCP móvil.
 */
export function GoogleAnalyticsRoot({ gaId }: { gaId: string }) {
  const [activate, setActivate] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (activate) return

    const fire = () => {
      cleanup()
      setActivate(true)
    }

    const cleanup = () => {
      FIRST_INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, fire, { capture: true } as EventListenerOptions),
      )
      if (timer != null) window.clearTimeout(timer)
    }

    FIRST_INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, fire, { passive: true, capture: true }),
    )
    const timer = window.setTimeout(fire, 25000)

    return cleanup
  }, [activate])

  if (!activate) return null

  return (
    <>
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
