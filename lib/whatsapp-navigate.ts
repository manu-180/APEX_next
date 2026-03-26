'use client'

import { ROUTES } from '@/lib/constants'

/** Misma ruta que usan los CTAs al abrir WhatsApp desde la web. */
export const WHATSAPP_THANK_YOU_ROUTE = ROUTES.gracias

type AppRouterPush = { push: (href: string) => void }

/**
 * Abre wa.me en pestaña nueva y lleva la pestaña actual a /gracias
 * (mismo flujo que el CTA principal del hero).
 */
export function openWhatsAppWithThankYouPage(
  waHref: string,
  router: AppRouterPush,
): void {
  router.push(WHATSAPP_THANK_YOU_ROUTE)
  window.open(waHref, '_blank', 'noopener,noreferrer')
}
