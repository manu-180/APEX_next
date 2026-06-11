'use client'

import { ROUTES } from '@/lib/constants'
import { trackGoogleAdsWhatsAppClick } from '@/lib/analytics/google-ads'
import { trackMetaLead } from '@/components/analytics/meta-pixel'

/** Misma ruta que usan los CTAs al abrir WhatsApp desde la web. */
export const WHATSAPP_THANK_YOU_ROUTE = ROUTES.gracias

type AppRouterPush = { push: (href: string, options?: { scroll?: boolean }) => void }

/**
 * Abre wa.me y deja la pestaña actual en /gracias.
 *
 * Tracking centralizado acá (Google Ads + Meta Lead): los callers NO deben
 * volver a dispararlo o la conversión se cuenta doble.
 *
 * Robustez mobile: window.open SIN 'noopener' en los features (con 'noopener'
 * el spec obliga a devolver null y no podríamos detectar bloqueo). Si el
 * popup fue bloqueado (in-app browsers de Instagram/Facebook/Google app),
 * navegamos la misma pestaña directo a wa.me — la conversión no se pierde.
 */
export function openWhatsAppWithThankYouPage(
  waHref: string,
  router: AppRouterPush,
): void {
  if (typeof window === 'undefined') return

  trackGoogleAdsWhatsAppClick()
  trackMetaLead()

  const win = window.open(waHref, '_blank')
  if (!win) {
    window.location.href = waHref
    return
  }
  try {
    win.opener = null
  } catch {
    /* cross-origin: ignorar */
  }

  const target = `${WHATSAPP_THANK_YOU_ROUTE}?wa=${encodeURIComponent(waHref)}`
  router.push(target, { scroll: true })
}
