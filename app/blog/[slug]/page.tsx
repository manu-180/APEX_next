import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BLOG_POSTS,
  getBlogPost,
  getBlogSlugs,
  getRelatedPosts,
} from '@/lib/data/blog-posts'
import { VERTICALS } from '@/lib/data/verticals'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon } from '@/components/ui/icons'
import {
  BlogBlockRenderer,
  BlogToc,
  ReadingProgress,
  type TocHeading,
} from '@/components/blog/blog-block-renderer'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { APP_URL } from '@/lib/constants'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 86400

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Artículo no encontrado' }

  const url = `${APP_URL.replace(/\/$/, '')}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: 'APEX Portfolio',
      locale: 'es_AR',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ['Manuel Navarro'],
      tags: post.tags,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/opengraph-image'],
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  pricing: 'Precios',
  tecnologia: 'Tecnología',
  cro: 'Conversión',
  estrategia: 'Estrategia',
}

/** Texto plano de un bloque con markdown inline (para ids y TOC). */
function plainText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

/** Slug estable para anchors de headings — server-side, misma fuente que el TOC. */
function slugifyHeading(text: string): string {
  return plainText(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const url = `${APP_URL.replace(/\/$/, '')}/blog/${post.slug}`
  const related = getRelatedPosts(slug, 3)

  // Anchors por heading (server-side, sin colisiones) + datos del TOC.
  // La misma lista alimenta los ids del renderer y los links del índice.
  const seenSlugs = new Map<string, number>()
  const headingIds = post.blocks.map((block) => {
    if (block.type !== 'heading') return undefined
    const base = slugifyHeading(block.text) || 'seccion'
    const n = seenSlugs.get(base) ?? 0
    seenSlugs.set(base, n + 1)
    return n === 0 ? base : `${base}-${n + 1}`
  })
  const tocHeadings: TocHeading[] = post.blocks.flatMap((block, i) =>
    block.type === 'heading'
      ? [{ id: headingIds[i]!, text: plainText(block.text), level: block.level }]
      : [],
  )
  const firstParagraphIdx = post.blocks.findIndex((b) => b.type === 'paragraph')

  // FAQ schema — critical para AEO
  const faqSchema = post.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    : null

  // BlogPosting schema — para SEO + AI Overviews
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
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
    keywords: post.tags.join(', '),
    inLanguage: 'es-AR',
    articleSection: CATEGORY_LABELS[post.category],
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Blog', url: `${APP_URL.replace(/\/$/, '')}/blog` },
          { name: post.title, url },
        ]}
      />
      <SafeJsonLd data={blogPostingSchema} />
      {faqSchema && <SafeJsonLd data={faqSchema} />}

      {/* Barra de progreso de lectura — 2px bajo el navbar, solo transform */}
      <ReadingProgress />

      {/* ── Hero del post ──────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-32 pb-12 overflow-hidden">
        <GridBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(var(--color-primary-rgb), 0.12), transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[42rem] px-6">
          <nav className="mb-8 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
            <Link
              href="/"
              className="rounded transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
            >
              Inicio
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href="/blog"
              className="rounded transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
            >
              Blog
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-semibold text-[var(--color-on-surface)] truncate">
              {post.title}
            </span>
          </nav>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{CATEGORY_LABELS[post.category]}</Badge>
            <Badge variant="outline">{post.readingMinutes} min de lectura</Badge>
            <time
              dateTime={post.publishedAt}
              className="text-xs text-[var(--color-on-surface-variant)] opacity-60 tabular-nums uppercase tracking-wider"
            >
              {new Date(post.publishedAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <h1 className="font-heading text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[var(--color-on-surface)] mb-6">
            {post.title}
          </h1>

          {/* TL;DR — magnet para AI Overviews */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
              borderColor: 'rgba(var(--color-primary-rgb), 0.2)',
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              TL;DR
            </p>
            <p className="text-base leading-relaxed text-[var(--color-on-surface)]">
              {post.tldr}
            </p>
          </div>
        </div>
      </section>

      {/* ── Contenido del post ─────────────────────────────────────── */}
      <article className="relative pb-16">
        {/* Measure editorial: 42rem ≈ 68ch (spec §10 lectura larga) */}
        <div className="relative mx-auto max-w-[42rem] px-6">
          {/* TOC sticky — solo xl, estado activo por IntersectionObserver */}
          {tocHeadings.length >= 3 && (
            <aside className="absolute bottom-0 left-full top-0 hidden w-60 pl-10 xl:block">
              <div className="sticky top-28">
                <BlogToc headings={tocHeadings} />
              </div>
            </aside>
          )}

          {post.blocks.map((block, i) => (
            <BlogBlockRenderer
              key={i}
              block={block}
              headingId={headingIds[i]}
              isFirst={i === firstParagraphIdx}
            />
          ))}

          {/* FAQ del post — citable por LLMs */}
          {post.faq.length > 0 && (
            <section
              className="mt-12 rounded-2xl p-6 sm:p-8 border"
              style={{
                backgroundColor: 'var(--color-surface-low)',
                borderColor: 'var(--glass-border)',
              }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-6">
                Preguntas frecuentes
              </h2>
              <div className="space-y-3">
                {post.faq.map((item, i) => (
                  <details
                    key={i}
                    name="post-faq"
                    className="group rounded-xl overflow-hidden border transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] has-[summary:focus-visible]:border-[rgba(var(--color-primary-rgb),0.45)] open:border-[rgba(var(--color-primary-rgb),0.3)]"
                    style={{
                      borderColor: 'var(--glass-border)',
                      backgroundColor: 'var(--color-surface-base)',
                    }}
                    open={i === 0}
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.05)] active:bg-[rgba(var(--color-primary-rgb),0.08)] focus-visible:outline-none focus-visible:bg-[rgba(var(--color-primary-rgb),0.06)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]">
                      <span className="text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-200 group-hover:text-[var(--color-primary)] group-open:text-[var(--color-primary)]">
                        {item.q}
                      </span>
                      <span
                        className="shrink-0 inline-flex transition-transform duration-200 group-open:rotate-180"
                        style={{ color: 'var(--color-primary)' }}
                        aria-hidden
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.25}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-5"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
                  color: 'var(--color-on-surface-variant)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.14)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* ── CTA + internal linking a páginas money ───────────────────── */}
      <section className="relative pb-4">
        <div className="mx-auto max-w-[42rem] px-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border"
            style={{
              backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
              borderColor: 'rgba(var(--color-primary-rgb), 0.22)',
            }}
          >
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[var(--color-on-surface)] mb-2">
              ¿Lo querés para tu negocio?
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
              Desarrollo webs y apps a medida para PyMEs argentinas, con precio fijo y fecha
              garantizada. Mirá los planes o escribime y lo charlamos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/servicios"
                className="group btn-tech btn-primary-tech inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl min-h-12
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
              >
                Ver servicios y precios
                <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl min-h-12 border
                  transition-[background-color,border-color,transform] duration-200
                  hover:bg-[var(--color-surface-low)] hover:border-[rgba(var(--color-primary-rgb),0.35)]
                  active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
                style={{ borderColor: 'var(--glass-border)', color: 'var(--color-on-surface)' }}
              >
                Agendá una consulta gratis
              </Link>
            </div>

            <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
                Páginas pensadas por rubro:
              </p>
              <div className="flex flex-wrap gap-2">
                {VERTICALS.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/${v.slug}`}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold
                      transition-[color,background-color,border-color,transform] duration-200
                      hover:text-[var(--color-primary)] hover:border-[rgba(var(--color-primary-rgb),0.35)] hover:bg-[rgba(var(--color-primary-rgb),0.06)]
                      active:scale-[0.97]
                      focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
                    style={{
                      backgroundColor: 'var(--color-surface-low)',
                      color: 'var(--color-on-surface)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    Web para {v.nounPlural}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Posts relacionados ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-8">
              <span className="font-extralight text-[var(--color-on-surface-variant)]">Seguí</span>{' '}
              leyendo
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-xl p-5 border
                    transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform
                    hover:-translate-y-1 hover:border-[rgba(var(--color-primary-rgb),0.4)]
                    hover:shadow-[var(--shadow-card-hover)]
                    active:translate-y-0 active:scale-[0.985] active:duration-100
                    focus-visible:outline-none focus-visible:-translate-y-1
                    focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
                    motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <Badge variant="outline" className="mb-3 text-[10px]">
                    {CATEGORY_LABELS[r.category]}
                  </Badge>
                  <h3 className="font-heading text-base font-extrabold text-[var(--color-on-surface)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2 mb-4">
                    {r.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                    Leer
                    <ArrowRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
