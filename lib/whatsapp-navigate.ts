'use client'

import { ROUTES } from '@/lib/constants'

/** Misma ruta que usan los CTAs al abrir WhatsApp desde la web. */
export const WHATSAPP_THANK_YOU_ROUTE = ROUTES.gracias

type AppRouterPush = { push: (href: string) => void }

/**
 * Lleva la pestaña actual a /gracias y delega allí la redirección a wa.me.
 * Esto asegura que el usuario vea primero el estado de confirmación.
 */
export function openWhatsAppWithThankYouPage(
  waHref: string,
  router: AppRouterPush,
): void {
  const target = `${WHATSAPP_THANK_YOU_ROUTE}?wa=${encodeURIComponent(waHref)}`
  router.push(target)
}
