import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { VERTICALS, getVertical, getVerticalSlugs } from '@/lib/data/verticals'
import { getPostsByKeywords } from '@/lib/data/blog-posts'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { APP_URL, WHATSAPP_NUMBER } from '@/lib/constants'
import { formatARS } from '@/lib/types/services'
import { SectionReveal } from '@/components/ui/section-reveal'
import { STAGGER_BASE } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'

/**
 * Hover estándar de card (spec §8.2): lift + borde primary + sombra token,
 * con active y rama motion-reduce. Reemplaza los `transition-all` previos.
 */
const CARD_HOVER_CLASS = `group border
  transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform
  hover:-translate-y-1 hover:border-[rgba(var(--color-primary-rgb),0.4)]
  hover:shadow-[var(--shadow-card-hover)]
  active:translate-y-0 active:scale-[0.985] active:duration-100
  focus-visible:outline-none focus-visible:-translate-y-1
  focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
  motion-reduce:transition-none motion-reduce:hover:translate-y-0`

/** Focus visible para links de texto (breadcrumbs). */
const CRUMB_LINK_CLASS =
  'rounded transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 86400

/**
 * Catch-all para landings verticales. Sólo matchea los slugs definidos en
 * VERTICALS (mediante dynamicParams=false + generateStaticParams).
 *
 * Cualquier otra ruta que no esté declarada en otro lugar de app/* y no
 * coincida con un vertical conocido devuelve 404.
 */

export async function generateStaticParams() {
  return getVerticalSlugs().map((vertical) => ({ vertical }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>
}): Promise<Metadata> {
  const { vertical: slug } = await params
  const v = getVertical(slug)
  if (!v) return { title: 'Página no encontrada' }

  const title = `Página web para ${v.nounPlural} en Argentina | Desde ${formatARS(v.priceFrom)} | APEX`
  const description = v.subheadline

  return {
    title,
    description,
    keywords: v.keywords,
    alternates: {
      canonical: `${APP_URL.replace(/\/$/, '')}/${v.slug}`,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${APP_URL.replace(/\/$/, '')}/${v.slug}`,
      siteName: 'APEX Portfolio',
      locale: 'es_AR',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function VerticalLandingPage({
  params,
}: {
  params: Promise<{ vertical: string }>
}) {
  const { vertical: slug } = await params
  const v = getVertical(slug)
  if (!v) notFound()

  const url = `${APP_URL.replace(/\/$/, '')}/${v.slug}`
  const waMessage = encodeURIComponent(
    `Hola Manuel, vengo de la landing de "${v.nounPlural}" y quiero saber más.`,
  )
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`

  // Internal linking: otras verticals + guías del blog relevantes al rubro.
  const otherVerticals = VERTICALS.filter((x) => x.slug !== v.slug)
  const relatedPosts = getPostsByKeywords(v.keywords, 3)

  // FAQ schema para AEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: v.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  // Service schema específico del vertical
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Diseño web para ${v.nounPlural}`,
    description: v.subheadline,
    provider: {
      '@type': 'Person',
      name: 'Manuel Navarro',
      url: APP_URL,
    },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    serviceType: `Desarrollo web para ${v.category.toLowerCase()}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ARS',
      lowPrice: v.priceFrom,
      highPrice: v.priceTo,
      offerCount: 1,
      url,
    },
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Servicios', url: `${APP_URL.replace(/\/$/, '')}/servicios` },
          { name: `Web para ${v.nounPlural}`, url },
        ]}
      />
      <SafeJsonLd data={faqSchema} />
      <SafeJsonLd data={serviceSchema} />

      {/* ── Hero editorial ────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-16 overflow-hidden">
        <GridBackground showRadialLight />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 15% -5%, rgba(var(--color-primary-rgb), 0.16), transparent 60%)',
          }}
        />

        <SectionReveal className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
            <Link href="/" className={CRUMB_LINK_CLASS}>
              Inicio
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/servicios" className={CRUMB_LINK_CLASS}>
              Servicios
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-semibold text-[var(--color-on-surface)]">{v.category}</span>
          </nav>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{v.category}</Badge>
            <Badge variant="outline">Desde {formatARS(v.priceFrom)}</Badge>
            <Badge variant="outline">{v.timeline}</Badge>
          </div>

          <h1 className="font-heading text-balance leading-[0.95] mb-6 max-w-3xl">
            <span className="block text-4xl sm:text-5xl md:text-6xl font-extralight text-[var(--color-on-surface-variant)]">
              {v.headline.soft}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--color-on-surface)] mt-1">
              {v.headline.strong}
            </span>
          </h1>

          <p className="text-pretty text-base md:text-lg text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed mb-8">
            {v.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-tech btn-primary-tech inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl min-h-12 active:scale-[0.97]"
            >
              Hablemos de tu caso
              <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </a>
          </div>
        </SectionReveal>
      </section>

      {/* ── Pains — 2 columnas asimétricas, h2 sticky ─────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-[1fr_1.6fr] md:gap-14">
          <SectionReveal>
            <div className="md:sticky md:top-28">
              <span
                className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
                style={{ color: 'var(--color-primary)' }}
              >
                01 · El problema
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)]">
                Lo que vivís hoy
              </h2>
            </div>
          </SectionReveal>
          <ul className="space-y-3">
            {v.pains.map((pain, i) => (
              <li key={pain}>
                <SectionReveal delay={i * STAGGER_BASE}>
                  <div className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red-500 dark:bg-red-400"
                    />
                    <span>{pain}</span>
                  </div>
                </SectionReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Features — bento asimétrico, primera card destacada ──────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span
              className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              02 · La solución
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] mb-10">
              Lo que armamos juntos
            </h2>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-6">
            {v.features.map((f, i) => {
              const isFeatured = i === 0
              return (
                <SectionReveal
                  key={f.title}
                  delay={i * STAGGER_BASE}
                  className={cn(
                    'h-full [&>div]:h-full',
                    isFeatured ? 'md:col-span-4' : 'md:col-span-2',
                  )}
                >
                  <article
                    className={cn(
                      'flex h-full items-start gap-4',
                      isFeatured
                        ? 'bento-surface p-7'
                        : 'rounded-xl border p-6',
                    )}
                    style={
                      isFeatured
                        ? undefined
                        : {
                            backgroundColor: 'var(--color-surface-low)',
                            borderColor: 'var(--glass-border)',
                          }
                    }
                  >
                    <div
                      className={cn(
                        'flex shrink-0 items-center justify-center rounded-lg',
                        isFeatured ? 'size-11' : 'size-9',
                      )}
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.14)',
                        color: 'var(--color-primary)',
                      }}
                      aria-hidden
                    >
                      <CheckIcon className={isFeatured ? 'size-5' : 'size-4'} />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'font-bold text-[var(--color-on-surface)] mb-2',
                          isFeatured ? 'text-lg' : 'text-base',
                        )}
                      >
                        {f.title}
                      </h3>
                      <p
                        className={cn(
                          'leading-relaxed text-[var(--color-on-surface-variant)]',
                          isFeatured ? 'text-base' : 'text-sm',
                        )}
                      >
                        {f.body}
                      </p>
                    </div>
                  </article>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Integraciones ──────────────────────────────────────────── */}
      <section
        className="relative py-12 sm:py-16"
        style={{ backgroundColor: 'var(--color-surface-low)' }}
      >
        <SectionReveal className="mx-auto max-w-5xl px-6">
          <span
            className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Stack + Integraciones
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-6">
            Lo que viene incluido
          </h2>
          <div className="flex flex-wrap gap-2">
            {v.integrations.map((i) => (
              <span
                key={i}
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                }}
              >
                {i}
              </span>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <SectionReveal className="mx-auto max-w-3xl px-6 text-center">
          <span
            className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            Inversión
          </span>
          <h2 className="font-heading text-balance text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-4">
            Web para {v.nounPlural}
          </h2>
          <div
            className="font-heading text-5xl sm:text-6xl font-extrabold tabular-nums mb-2"
            style={{ color: 'var(--color-primary)' }}
          >
            Desde {formatARS(v.priceFrom)}
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            hasta{' '}
            <span className="font-bold text-[var(--color-on-surface)] tabular-nums">
              {formatARS(v.priceTo)}
            </span>{' '}
            según alcance · Entrega en {v.timeline}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group btn-tech btn-primary-tech inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl min-h-12 active:scale-[0.97]"
          >
            Validar mi caso por WhatsApp
            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </a>
        </SectionReveal>
      </section>

      {/* ── FAQ — estados de focus/hover/open (paridad con blog) ─────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <SectionReveal className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {v.faq.map((item, i) => (
              <details
                key={i}
                name="vertical-faq"
                className="group rounded-xl overflow-hidden border transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] has-[summary:focus-visible]:border-[rgba(var(--color-primary-rgb),0.45)] open:border-[rgba(var(--color-primary-rgb),0.3)]"
                style={{
                  borderColor: 'var(--glass-border)',
                  backgroundColor: 'var(--color-surface-base)',
                }}
                open={i === 0}
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.05)] active:bg-[rgba(var(--color-primary-rgb),0.08)] focus-visible:outline-none focus-visible:bg-[rgba(var(--color-primary-rgb),0.06)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]">
                  <span className="text-sm font-semibold text-[var(--color-on-surface)] pr-4 transition-colors duration-200 group-hover:text-[var(--color-primary)] group-open:text-[var(--color-primary)]">
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
        </SectionReveal>
      </section>

      {/* ── Seguí explorando · internal linking ─────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <SectionReveal className="mx-auto max-w-5xl px-6">
          <span
            className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            Seguí explorando
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] mb-10">
            Antes de decidir
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/servicios"
              className={cn('rounded-xl p-6 md:col-span-2', CARD_HOVER_CLASS)}
              style={{ backgroundColor: 'var(--color-surface-low)', borderColor: 'var(--glass-border)' }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}
              >
                Servicios y precios
              </span>
              <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)] mt-1 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                Todos los planes de desarrollo web y apps
              </h3>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                Compará Landing, Web Interactiva, Tienda Online y apps — con precios en pesos.
              </p>
            </Link>

            {otherVerticals.map((o) => (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className={cn('rounded-xl p-5', CARD_HOVER_CLASS)}
                style={{ backgroundColor: 'var(--color-surface-low)', borderColor: 'var(--glass-border)' }}
              >
                <Badge variant="outline" className="mb-3 text-[10px]">
                  {o.category}
                </Badge>
                <h3 className="font-heading text-base font-extrabold text-[var(--color-on-surface)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  Web para {o.nounPlural}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                  Ver landing
                  <ArrowRightIcon className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </span>
              </Link>
            ))}
          </div>

          {relatedPosts.length > 0 && (
            <>
              <h3 className="font-heading text-xl font-bold text-[var(--color-on-surface)] mt-12 mb-5">
                Guías que te pueden servir
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className={cn('block rounded-xl p-5', CARD_HOVER_CLASS)}
                    style={{ backgroundColor: 'var(--color-surface-low)', borderColor: 'var(--glass-border)' }}
                  >
                    <h4 className="font-heading text-sm font-extrabold text-[var(--color-on-surface)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {p.title}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                      Leer
                      <ArrowRightIcon className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </SectionReveal>
      </section>
    </>
  )
}
