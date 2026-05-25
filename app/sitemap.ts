import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'
import { BLOG_POSTS } from '@/lib/data/blog-posts'
import { VERTICALS } from '@/lib/data/verticals'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/servicios`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${APP_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${APP_URL}/tecnologias`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/sobre-mi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
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
