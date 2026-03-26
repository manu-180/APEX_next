'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

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

/**
 * GA4 vía `@next/third-parties` + `page_path` en cada navegación del App Router
 * (la etiqueta inicial ya cubre la primera carga).
 */
export function GoogleAnalyticsRoot({ gaId }: { gaId: string }) {
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <Suspense fallback={null}>
        <GaRoutePageViews gaId={gaId} />
      </Suspense>
    </>
  )
}
