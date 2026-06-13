'use client'

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { cn } from '@/lib/utils/cn'

export type WhatsAppOutboundLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  waHref: string
  children?: ReactNode
}

/**
 * Enlace a wa.me: clic abre WhatsApp en pestaña nueva y navega a /gracias en la actual.
 * En /gracias el enlace manual también usa target _blank.
 *
 * Feedback premium: al hacer clic se marca `aria-busy` + clase `.cta-opening`
 * (pulso sutil) durante ~900 ms, para que el botón acuse el click de inmediato
 * aunque la apertura de WhatsApp / navegación tarde un instante.
 */
export function WhatsAppOutboundLink({
  waHref,
  children,
  onClick,
  className,
  ...rest
}: WhatsAppOutboundLinkProps) {
  const router = useRouter()
  const [opening, setOpening] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      setOpening(true)
      window.setTimeout(() => {
        if (mounted.current) setOpening(false)
      }, 900)
      openWhatsAppWithThankYouPage(waHref, router)
      onClick?.(e)
    },
    [waHref, router, onClick]
  )

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      data-opening={opening ? '' : undefined}
      aria-busy={opening || undefined}
      className={cn(opening && 'cta-opening', className)}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  )
}
