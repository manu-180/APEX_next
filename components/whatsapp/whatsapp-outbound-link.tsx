'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'

export type WhatsAppOutboundLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  waHref: string
  children?: ReactNode
}

/**
 * Enlace a wa.me: clic abre WhatsApp en pestaña nueva y navega a /gracias en la actual.
 * En /gracias el enlace manual también usa target _blank.
 */
export function WhatsAppOutboundLink({
  waHref,
  children,
  onClick,
  ...rest
}: WhatsAppOutboundLinkProps) {
  const router = useRouter()
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault()
        openWhatsAppWithThankYouPage(waHref, router)
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
