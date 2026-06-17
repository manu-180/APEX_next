import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'
import { BLOG_POSTS } from '@/lib/data/blog-posts'
import { VERTICALS } from '@/lib/data/verticals'

export default function sitemap(): MetadataRoute.Sitemap {
  // Fecha de último deploy — para blog posts y verticals sin fecha propia.
  const now = new Date('2026-06-09')
  // Fechas reales por página estática — evita que Google vea todo con el mismo timestamp.
  const base: MetadataRoute.Sitemap = [
    { url: APP_URL,                      lastModified: new Date('2026-06-09'), changeFrequency: 'weekly',  priority: 1    },
    { url: `${APP_URL}/servicios`,        lastModified: new Date('2026-06-09'), changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${APP_URL}/muestrario`,       lastModified: new Date('2026-06-17'), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${APP_URL}/blog`,             lastModified: new Date('2026-06-09'), changeFrequency: 'daily',   priority: 0.85 },
    { url: `${APP_URL}/tecnologias`,      lastModified: new Date('2026-05-15'), changeFrequency: 'monthly', priority: 0.7  },
    { url: `${APP_URL}/sobre-mi`,         lastModified: new Date('2026-05-15'), changeFrequency: 'monthly', priority: 0.7  },
    { url: `${APP_URL}/contacto`,         lastModified: new Date('2026-05-15'), changeFrequency: 'monthly', priority: 0.8  },
  ]

  const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${APP_URL.replace(/\/$/, '')}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const verticalUrls: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${APP_URL.replace(/\/$/, '')}/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  return [...base, ...blogUrls, ...verticalUrls]
}
