import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { VERTICALS, getVertical, getVerticalSlugs } from '@/lib/data/verticals'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { APP_URL, WHATSAPP_NUMBER } from '@/lib/constants'
import { LeadMagnetSection } from '@/components/sections/lead-magnet'
import { formatARS } from '@/lib/types/services'

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

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Inicio
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href="/servicios"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
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
              className="btn-tech btn-primary-tech inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl min-h-12"
            >
              Hablemos de tu caso
              <ArrowRightIcon className="size-4" />
            </a>
            <Link
              href="/proyectos"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Ver proyectos similares →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pains ──────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-4xl px-6">
          <span
            className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            01 · El problema
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] mb-8">
            Lo que vivís hoy
          </h2>
          <ul className="space-y-3">
            {v.pains.map((pain) => (
              <li
                key={pain}
                className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-variant)]"
              >
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red-400"
                />
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <span
            className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            02 · La solución
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] mb-10">
            Lo que armamos juntos
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {v.features.map((f) => (
              <article
                key={f.title}
                className="rounded-xl p-6 border flex gap-4 items-start"
                style={{
                  backgroundColor: 'var(--color-surface-low)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.14)',
                    color: 'var(--color-primary)',
                  }}
                  aria-hidden
                >
                  <CheckIcon className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--color-on-surface)] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {f.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integraciones ──────────────────────────────────────────── */}
      <section
        className="relative py-12 sm:py-16"
        style={{ backgroundColor: 'var(--color-surface-low)' }}
      >
        <div className="mx-auto max-w-5xl px-6">
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
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
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
            className="btn-tech btn-primary-tech inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl min-h-12"
          >
            Validar mi caso por WhatsApp
            <ArrowRightIcon className="size-4" />
          </a>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {v.faq.map((item, i) => (
              <details
                key={i}
                name="vertical-faq"
                className="group rounded-xl overflow-hidden border"
                style={{
                  borderColor: 'var(--glass-border)',
                  backgroundColor: 'var(--color-surface-base)',
                }}
                open={i === 0}
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-semibold text-[var(--color-on-surface)] pr-4">
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
        </div>
      </section>

      {/* ── Lead magnet ─────────────────────────────────────────────── */}
      <LeadMagnetSection variant="compact" source={`vertical-${v.slug}`} />
    </>
  )
}
