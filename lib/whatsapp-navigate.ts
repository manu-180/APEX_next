'use client'

import { ROUTES } from '@/lib/constants'

/** Misma ruta que usan los CTAs al abrir WhatsApp desde la web. */
export const WHATSAPP_THANK_YOU_ROUTE = ROUTES.gracias

type AppRouterPush = { push: (href: string, options?: { scroll?: boolean }) => void }

/**
 * Abre wa.me en una pestaña nueva (gesto directo del usuario → sin popup blocker)
 * y navega la pestaña actual a /gracias como confirmación.
 */
export function openWhatsAppWithThankYouPage(
  waHref: string,
  router: AppRouterPush,
): void {
  if (typeof window !== 'undefined') {
    window.open(waHref, '_blank', 'noopener,noreferrer')
  }
  const target = `${WHATSAPP_THANK_YOU_ROUTE}?wa=${encodeURIComponent(waHref)}`
  router.push(target, { scroll: true })
}
