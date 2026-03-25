import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/servicios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${APP_URL}/sobre-mi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
