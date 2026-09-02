import type { MetadataRoute } from 'next'
import { APP_URL, ROUTES } from '@/lib/constants'
import { BLOG_POSTS } from '@/lib/data/blog-posts'
import { VERTICALS } from '@/lib/data/verticals'

const BASE = APP_URL.replace(/\/$/, '')

/**
 * Fechas de última modificación REAL de cada página estática.
 *
 * Google descarta el `lastmod` de un sitio que miente (fechas que no se
 * corresponden con cambios visibles), y a partir de ahí lo ignora para todas
 * las URLs. Estas fechas salen de `git log -1 --format=%cs -- <ruta>`:
 * al tocar el contenido de una página hay que bumpear su fila acá.
 *
 * Las que SÍ se derivan solas (blog y verticales) no están en esta tabla.
 */
const PAGE_LAST_MODIFIED = {
  home:        '2026-08-30',
  servicios:   '2026-08-30',
  muestrario:  '2026-08-24',
  tecnologias: '2026-08-30',
  sobreMi:     '2026-08-30',
  contacto:    '2026-08-24',
  opiniones:   '2026-08-24',
  /** Los verticales comparten plantilla y data (`lib/data/verticals.ts`). */
  verticales:  '2026-07-02',
} as const

/** 'YYYY-MM-DD' → Date al mediodía UTC: nunca corre de día al serializarse. */
const day = (ymd: string) => new Date(`${ymd}T12:00:00.000Z`)

export default function sitemap(): MetadataRoute.Sitemap {
  const postDate = (p: (typeof BLOG_POSTS)[number]) =>
    day(p.updatedAt ?? p.publishedAt)

  // El índice del blog es tan reciente como su post más nuevo — derivado, no
  // hardcodeado: publicar un artículo actualiza el lastmod del índice solo.
  const newestPost = BLOG_POSTS.reduce<Date | null>((acc, p) => {
    const d = postDate(p)
    return acc === null || d > acc ? d : acc
  }, null)

  const base: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: day(PAGE_LAST_MODIFIED.home),        changeFrequency: 'weekly',  priority: 1    },
    { url: `${BASE}${ROUTES.servicios}`,   lastModified: day(PAGE_LAST_MODIFIED.servicios),   changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE}${ROUTES.muestrario}`,  lastModified: day(PAGE_LAST_MODIFIED.muestrario),  changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/blog`,             lastModified: newestPost ?? day(PAGE_LAST_MODIFIED.home), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}${ROUTES.tecnologias}`, lastModified: day(PAGE_LAST_MODIFIED.tecnologias), changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}${ROUTES.about}`,       lastModified: day(PAGE_LAST_MODIFIED.sobreMi),     changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}${ROUTES.contact}`,     lastModified: day(PAGE_LAST_MODIFIED.contacto),    changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE}/opiniones`,        lastModified: day(PAGE_LAST_MODIFIED.opiniones),   changeFrequency: 'monthly', priority: 0.6  },
  ]

  const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: postDate(post),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const verticalUrls: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${BASE}/${v.slug}`,
    lastModified: day(PAGE_LAST_MODIFIED.verticales),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Fuera del sitemap a propósito: `/gracias` (noindex, dispara conversión de
  // Ads al montarse) y `/lab` (WebGL, no es una página comercial — sigue
  // crawleable porque está linkeada desde el navbar).
  return [...base, ...blogUrls, ...verticalUrls]
}
