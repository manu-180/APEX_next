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
const LEGACY_HASH_TARGETS: Record<string, string> = {
  '#precios': '/servicios#pricing',
  '#calculadora': '/servicios#pricing',
}

export function LegacyHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const target = LEGACY_HASH_TARGETS[window.location.hash.toLowerCase()]
    if (!target) return

    // `replace` para no dejar el hash roto en el historial: el back del
    // usuario tiene que volver al buscador, no volver a disparar el redirect.
    router.replace(target)
  }, [router])

  return null
}
