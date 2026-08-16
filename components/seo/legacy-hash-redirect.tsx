'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Anclas legadas del home que se siguen usando desde afuera (anuncios de
 * Google Ads, links compartidos) y que hoy NO existen en el DOM.
 *
 * `#precios` es la final URL de los dos ad groups activos de la campaña
 * "Apex search" (`23721057489`). El home nunca tuvo sección de precios: el
 * único bloque real vive en /servicios#pricing. Sin este redirect el tráfico
 * pago cae arriba de todo del home, sin un precio a la vista.
 *
 * `#calculadora` apunta a `BudgetCalculatorSection`, que quedó definida pero
 * sin renderizar en ninguna página.
 *
 * Esto es una red de contención, no la solución de fondo: lo correcto es
 * corregir las final URLs en Google Ads. Mientras tanto, ningún clic pago se
 * pierde. Es seguro dejarlo puesto después de esa corrección.
 */
const LEGACY_HASH_TARGETS: Record<string, { path: string; hash: string }> = {
  '#precios': { path: '/servicios', hash: '#pricing' },
  '#calculadora': { path: '/servicios', hash: '#pricing' },
}

export function LegacyHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectIfLegacy = () => {
      const target = LEGACY_HASH_TARGETS[window.location.hash.toLowerCase()]
      if (!target) return

      // La query string viaja SIEMPRE con el redirect. gtag.js se baja recién
      // tras la primera interacción (ver GoogleAnalyticsRoot), así que lee el
      // `gclid` de la URL que haya en ese momento: si el redirect lo tira, el
      // clic pago queda sin `_gcl_aw` y la conversión no se atribuye.
      const search = window.location.search
      const destination = `${target.path}${search}${target.hash}`

      // `replace` para no dejar el hash roto en el historial: el back del
      // usuario tiene que volver al buscador, no volver a disparar el redirect.
      router.replace(destination)
    }

    // El caso que importa es la llegada desde el anuncio (carga completa), pero
    // un cambio de sólo-hash no remonta el componente: sin el listener, un link
    // legado clickeado ya dentro del sitio se quedaría en el home sin precios.
    redirectIfLegacy()
    window.addEventListener('hashchange', redirectIfLegacy)
    return () => window.removeEventListener('hashchange', redirectIfLegacy)
  }, [router])

  return null
}
