'use client'

import Script from 'next/script'
import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: IArguments[]
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

  /**
   * Cola sincrónica, sin red. Define `window.gtag` y encola `js` + `config`
   * apenas hidrata, mucho antes de que gtag.js baje.
   *
   * Sin esto, quien llega de un anuncio y clickea el CTA en los primeros
   * segundos encuentra `window.gtag === undefined` y `trackGoogleAdsConversion`
   * hace `return` en silencio: el clic pago se cobra y la conversión no se
   * registra. Justo los visitantes de más intención son los que se perdían.
   *
   * El orden importa: gtag.js procesa `dataLayer` en secuencia, así que `js` y
   * `config` tienen que estar encolados ANTES que cualquier evento de
   * conversión o el evento se descarta por falta de config.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof window.gtag === 'function') return

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, { transport_type: 'beacon' })
    window.gtag('config', AW_ID, { transport_type: 'beacon' })
  }, [gaId])

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
      {/* `js` y los `config` ya quedaron encolados en dataLayer al hidratar
          (ver efecto de arriba). Acá sólo falta bajar gtag.js, que consume la
          cola en orden al ejecutarse. */}
      <Script
        id="google-gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Suspense fallback={null}>
        <GaRoutePageViews gaId={gaId} />
      </Suspense>
    </>
  )
}
