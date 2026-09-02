import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    // `/gracias` dispara la conversion de Ads al montarse (y ya lleva
    // `robots: { index: false }` en su metadata); `/api` no tiene nada que
    // indexar. Antes figuraba `/button-lab`: una ruta que no existe en `app/`,
    // asi que la regla no bloqueaba nada.
    //
    // `/lab` queda CRAWLEABLE a proposito: esta linkeado desde el navbar y
    // desde dos secciones de la home, y tiene metadata/canonical/OG propios.
    // Desde 2026-09-02 tambien esta en el sitemap (decision: indexarlo). Si se
    // decide de-indexarlo, el cambio va aca, en `sitemap.ts` y en el `metadata`
    // de `app/lab/page.tsx`.
    rules: { userAgent: '*', allow: '/', disallow: ['/gracias', '/api/'] },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
