'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { trackGoogleAdsWhatsAppClick } from '@/lib/analytics/google-ads'

const EVENT = 'apex-botlode-whatsapp'

/**
 * El botón WPP del widget BotLode vive en un iframe; al hacer clic el padre
 * dispara este evento para aplicar el mismo flujo /gracias que el resto del sitio.
 */
export function BotlodeGraciasBridge() {
  const router = useRouter()
  const pathname = usePathname()
  const waHref = whatsappUrl(WA_MSG_NAV)

  useEffect(() => {
    const go = () => {
      if (pathname === ROUTES.gracias) return
      trackGoogleAdsWhatsAppClick()
      openWhatsAppWithThankYouPage(waHref, router)
    }
    window.addEventListener(EVENT, go)
    return () => window.removeEventListener(EVENT, go)
  }, [router, pathname, waHref])

  return null
}
