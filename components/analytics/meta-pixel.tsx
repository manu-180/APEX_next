'use client'

import Script from 'next/script'
import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

const FIRST_INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'pointerdown',
  'touchstart',
  'keydown',
  'scroll',
  'mousemove',
]

function FbqRoutePageViews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    if (typeof window.fbq !== 'function') return
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    // Track virtual pageview on SPA navigation
    window.fbq('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

/**
 * Meta (Facebook) Pixel — carga sólo tras primera interacción del usuario
 * (mismo patrón que GoogleAnalyticsRoot) para no afectar LCP/FCP.
 *
 * Habilita audiencias de retargeting en Meta Ads (Facebook + Instagram).
 * El pixel ID viene de NEXT_PUBLIC_META_PIXEL_ID — si no está configurado,
 * el componente no renderiza nada (no rompe el build).
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  const [activate, setActivate] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (activate) return

    let timer: number | null = null

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
    timer = window.setTimeout(fire, 25000)

    return cleanup
  }, [activate])

  if (!activate) return null

  return (
    <>
      <Script id="meta-pixel-bootstrap" strategy="lazyOnload">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
      `}</Script>
      <Suspense fallback={null}>
        <FbqRoutePageViews />
      </Suspense>
    </>
  )
}

/* ──────────────────────────────────────────────────────────────────
   Helpers para eventos de conversión cliente-side
   ────────────────────────────────────────────────────────────────── */

export function trackMetaLead() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', 'Lead')
}

export function trackMetaContact() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', 'Contact')
}

export function trackMetaInitiateCheckout() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', 'InitiateCheckout')
}
