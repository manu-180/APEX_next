import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CASE_STUDIES, getCaseStudy, getCaseStudySlugs } from '@/lib/data/case-studies'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { APP_URL } from '@/lib/constants'
import { CaseStudyView } from './case-study-view'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 86400 // 24h

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return { title: 'Caso no encontrado' }

  const title = `${cs.title} — ${cs.tagline}`
  const description = cs.summary
  const url = `${APP_URL.replace(/\/$/, '')}/proyectos/${cs.slug}`

  return {
    title,
    description,
    keywords: cs.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'APEX Portfolio',
      locale: 'es_AR',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: cs.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const url = `${APP_URL.replace(/\/$/, '')}/proyectos/${cs.slug}`
  const others = CASE_STUDIES.filter((c) => c.slug !== slug).slice(0, 3)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Proyectos', url: `${APP_URL.replace(/\/$/, '')}/proyectos` },
          { name: cs.title, url },
        ]}
      />
      {/* CaseStudy schema.org Article para AI Overviews + Featured Snippets */}
      <SafeJsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${cs.title} — ${cs.tagline}`,
          description: cs.summary,
          author: {
            '@type': 'Person',
            name: 'Manuel Navarro',
            url: APP_URL,
          },
          publisher: {
            '@type': 'Organization',
            name: 'APEX Portfolio',
            url: APP_URL,
          },
          mainEntityOfPage: url,
          about: cs.tags,
          inLanguage: 'es-AR',
        }}
      />
      <CaseStudyView caseStudy={cs} others={others} />
    </>
  )
}
