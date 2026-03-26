'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'

const EVENT = 'apex-botlode-whatsapp'

/**
 * El botón WPP del widget BotLode vive en un iframe; al hacer clic el padre
 * dispara este evento para aplicar el mismo flujo /gracias que el resto del sitio.
 */
export function BotlodeGraciasBridge() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const go = () => {
      if (pathname === ROUTES.gracias) return
      router.push(ROUTES.gracias)
    }
    window.addEventListener(EVENT, go)
    return () => window.removeEventListener(EVENT, go)
  }, [router, pathname])

  return null
}
