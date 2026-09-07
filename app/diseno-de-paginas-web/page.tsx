import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { BrowserChrome } from '@/components/ui/browser-chrome'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, CheckIcon, ExternalLinkIcon, StarIcon, WhatsAppIcon } from '@/components/ui/icons'
import { SectionReveal } from '@/components/ui/section-reveal'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { APP_URL } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS, WA_SHADOW_CLASS_LG } from '@/lib/constants/whatsapp-ui'
import { AVG_RATING, REVIEW_COUNT } from '@/lib/data/reviews'
import { STAGGER_BASE } from '@/lib/motion'
import { formatARS, WEB_PLANS } from '@/lib/types/services'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import { FAQ, FIT_NO, FIT_YES, INCLUDED, PAGE_PATH, PROCESS, WORK } from './content'

export const dynamic = 'force-static'

const BASE_URL = APP_URL.replace(/\/$/, '')
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`

const LANDING_PRICE = WEB_PLANS.find((p) => p.id === 'web_basic')?.price ?? 300000

export const metadata: Metadata = {
  title: 'Diseño y desarrollo de páginas web para empresas',
  description:
    'Estudio de diseño y desarrollo web en Buenos Aires. Páginas web profesionales a medida para empresas y PyMEs de toda la Argentina: diseño propio, código propio y entrega en 15 días.',
  keywords: [
    'diseño de paginas web',
    'diseño y desarrollo web',
    'diseño web para empresas',
    'agencia de diseño web',
    'diseño web profesional',
    'desarrollo de sitios web',
    'estudios de diseño web',
    'diseño web Buenos Aires',
    'paginas web profesionales',
    'crear pagina web argentina',
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: 'website',
    title: 'Diseño y desarrollo de páginas web para empresas argentinas',
    description:
      'Diseño a medida y desarrollo propio. Boceto gratis en 48 h, precio cerrado por escrito y entrega en 15 días.',
    url: PAGE_URL,
    siteName: 'APEX Portfolio',
    locale: 'es_AR',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Diseño y desarrollo de páginas web — APEX' }],
  },
}

/* Hover estándar de card del sitio (mismo contrato que app/[vertical]). */
const CARD_HOVER_CLASS = `group border
  transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform
  hover:-translate-y-1 hover:border-[rgba(var(--color-primary-rgb),0.4)]
  hover:shadow-[var(--shadow-card-hover)]
  active:translate-y-0 active:scale-[0.985] active:duration-100
  focus-visible:outline-none focus-visible:-translate-y-1
  focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
  motion-reduce:transition-none motion-reduce:hover:translate-y-0`

const WA_CTA_CLASS = `group inline-flex items-center justify-center gap-2.5 select-none
  h-12 min-h-12 rounded-xl px-6 text-sm font-bold text-white
  transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.02] active:scale-[0.97]
  motion-reduce:hover:scale-100
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]`

const CRUMB_LINK_CLASS =
  'rounded transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]'

const EYEBROW_CLASS = 'inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4'

const WA_MSG =
  'Hola Manuel, quiero el diseño de la web de mi empresa. ¿Cómo arrancamos?'

/* Ficha del estudio: datos duros y verificables, no adjetivos. */
const STUDIO_FACTS = [
  { k: 'Quién diseña y programa', v: 'Manuel Navarro' },
  { k: 'Base', v: 'Buenos Aires, Argentina' },
  { k: 'Desde', v: '2021' },
  { k: 'Stack', v: 'Next.js · Supabase · Flutter' },
  { k: 'Primer boceto', v: 'Gratis, en 24-48 h' },
] as const

export default function DisenoDePaginasWebPage() {
  const waUrl = whatsappUrl(WA_MSG)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${PAGE_URL}#service`,
    name: 'Diseño y desarrollo de páginas web',
    serviceType: 'Diseño y desarrollo de sitios web a medida',
    description:
      'Diseño y desarrollo de páginas web profesionales a medida para empresas y PyMEs en Argentina. Diseño propio sin plantillas, desarrollo en Next.js, SEO técnico y entrega en 15 días.',
    provider: {
      '@type': 'Person',
      name: 'Manuel Navarro',
      url: APP_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressRegion: 'CABA',
        addressCountry: 'AR',
      },
    },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    url: PAGE_URL,
    offers: {
      '@type': 'Offer',
      price: LANDING_PRICE,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/cuanto-cuesta-una-pagina-web`,
    },
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Servicios', url: `${BASE_URL}/servicios` },
          { name: 'Diseño de páginas web', url: PAGE_URL },
        ]}
      />
      <SafeJsonLd data={faqSchema} />
      <SafeJsonLd data={serviceSchema} />

      {/* ── Hero ───────────────────────────────────────────────────────────
          Sin SectionReveal a propósito: el LCP móvil de este sitio es el
          párrafo del hero y un reveal que arranca en opacity:0 lo retrasa
          ~950 ms. Above-the-fold no se anima (ni opacity, ni filter). */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-20">
        <GridBackground showRadialLight />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 12% -10%, rgba(var(--color-primary-rgb), 0.18), transparent 62%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]">
            <Link href="/" className={CRUMB_LINK_CLASS}>
              Inicio
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/servicios" className={CRUMB_LINK_CLASS}>
              Servicios
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-semibold text-[var(--color-on-surface)]">Diseño de páginas web</span>
          </nav>

          <div className="grid items-start gap-10 md:grid-cols-[1.45fr_0.9fr] md:gap-14">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge variant="primary">Estudio de diseño y desarrollo web</Badge>
                <Badge variant="outline">Buenos Aires · Toda la Argentina</Badge>
              </div>

              <h1 className="heading-display heading-display--tight mb-6 text-4xl text-[var(--color-on-surface)] sm:text-5xl md:text-[3.4rem]">
                Diseño y desarrollo de <strong>páginas web</strong> para empresas argentinas
              </h1>

              <p className="mb-8 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
                Soy Manuel Navarro y diseño y programo yo cada sitio que sale de acá. Nada de plantillas
                ni de equipos tercerizados: tu empresa arranca con una hoja en blanco, ve el boceto
                antes de pagar nada y recibe el sitio terminado en 15 días.
              </p>

              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <WhatsAppOutboundLink
                  waHref={waUrl}
                  className={cn(WA_CTA_CLASS, WA_SHADOW_CLASS, 'w-full sm:w-auto')}
                  style={{ background: WA_GRADIENT }}
                >
                  <WhatsAppIcon className="size-4 shrink-0" aria-hidden />
                  Quiero mi boceto gratis
                  <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </WhatsAppOutboundLink>

                <a
                  href="#trabajos"
                  className={cn(
                    'group btn-tech btn-outline-tech inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:w-auto',
                    'text-[var(--color-primary)] transition-transform duration-300 ease-out active:scale-[0.97]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  )}
                >
                  Ver sitios que hice
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                {['Boceto gratis en 24-48 h', 'Diseño a medida, sin plantillas', 'Precio cerrado por escrito'].map(
                  (claim) => (
                    <li
                      key={claim}
                      className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]"
                    >
                      <CheckIcon className="size-3.5 shrink-0 text-[var(--color-primary)]" />
                      {claim}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Ficha del estudio — contrapeso asimétrico del hero. */}
            <aside className="bento-surface p-6 md:mt-16">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                La ficha
              </span>
              <dl className="mt-5 space-y-4">
                {STUDIO_FACTS.map((f) => (
                  <div key={f.k} className="flex flex-col gap-0.5">
                    <dt className="text-[11px] uppercase tracking-wide text-[var(--color-on-surface-variant)] opacity-70">
                      {f.k}
                    </dt>
                    <dd className="text-sm font-bold text-[var(--color-on-surface)]">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/opiniones"
                className="group mt-6 flex items-center gap-2 rounded-lg border border-[rgba(var(--color-primary-rgb),0.2)] px-3 py-2.5 text-xs font-semibold text-[var(--color-on-surface)] transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.45)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <StarIcon className="size-3.5 shrink-0 text-[var(--color-primary)]" />
                <span className="tabular-nums">{AVG_RATING}</span>
                <span className="opacity-70">
                  con {REVIEW_COUNT} opiniones de clientes
                </span>
                <ArrowRightIcon className="ml-auto size-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ── 01 · Trabajo real ─────────────────────────────────────────────── */}
      <section
        id="trabajos"
        className="relative scroll-mt-24 py-16 sm:py-24"
        style={{ backgroundColor: 'var(--color-surface-low)' }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <div className="mb-10 md:flex md:items-end md:justify-between md:gap-10">
              <div>
                <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
                  01 · Trabajo real
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
                  Sitios en vivo, no maquetas
                </h2>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:mt-0">
                Todos estos están online ahora mismo. Abrilos, tocá los botones y fijate cuánto tardan
                en cargar en tu celular.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-6">
            {WORK.map((w, i) => {
              const featured = i === 0
              return (
                <SectionReveal
                  key={w.slug}
                  delay={i * STAGGER_BASE}
                  className={cn('h-full [&>div]:h-full', featured ? 'md:col-span-4' : 'md:col-span-2')}
                >
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'group/card flex h-full flex-col overflow-hidden rounded-2xl',
                      CARD_HOVER_CLASS,
                    )}
                    style={{
                      backgroundColor: 'var(--color-surface-base)',
                      borderColor: 'var(--glass-border)',
                    }}
                  >
                    <BrowserChrome domain={w.domain} />
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-low)]">
                      <Image
                        src={`/projects/showcase/${w.slug}.webp`}
                        alt={`Diseño del sitio web ${w.name} (${w.domain})`}
                        fill
                        sizes={
                          featured
                            ? '(max-width: 768px) 100vw, 620px'
                            : '(max-width: 768px) 100vw, 320px'
                        }
                        className="object-cover object-top transition-transform duration-[1.1s] ease-out will-change-transform group-hover/card:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
                        style={{ background: 'rgba(var(--color-primary-rgb),0.92)' }}
                      >
                        Ver en vivo
                        <ExternalLinkIcon className="size-3" />
                      </span>
                    </div>

                    <div className={cn('flex flex-1 flex-col p-5', featured && 'sm:p-6')}>
                      <div className="mb-2 flex items-center gap-2">
                        <h3
                          className={cn(
                            'font-heading font-extrabold text-[var(--color-on-surface)] transition-colors duration-200 group-hover/card:text-[var(--color-primary)]',
                            featured ? 'text-xl' : 'text-base',
                          )}
                        >
                          {w.name}
                        </h3>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] opacity-70 ring-1 ring-[var(--glass-border)]">
                          {w.kind === 'product' ? 'Producto propio' : 'Cliente'}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'leading-relaxed text-[var(--color-on-surface-variant)]',
                          featured ? 'text-base' : 'text-sm',
                        )}
                      >
                        {w.proof}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                        {w.domain}
                        <ExternalLinkIcon className="size-3" />
                      </span>
                    </div>
                  </a>
                </SectionReveal>
              )
            })}

            <SectionReveal delay={WORK.length * STAGGER_BASE} className="md:col-span-2">
              <Link
                href="/muestrario"
                className={cn('flex h-full flex-col justify-center rounded-2xl p-6', CARD_HOVER_CLASS)}
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <h3 className="font-heading text-base font-extrabold leading-tight text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                  Ver el muestrario completo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  Todos los sitios, con su captura y el link para abrirlos.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                  Entrar
                  <ArrowRightIcon className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </span>
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── 02 · Qué incluye ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              02 · Qué incluye
            </span>
            <h2 className="mb-10 max-w-2xl font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Lo que pasa cuando el diseño y el desarrollo los hace la misma persona
            </h2>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-6">
            {INCLUDED.map((item, i) => {
              const wide = i === 0
              return (
                <SectionReveal
                  key={item.title}
                  delay={i * STAGGER_BASE}
                  className={cn('h-full [&>div]:h-full', wide ? 'md:col-span-6' : 'md:col-span-2')}
                >
                  <article
                    className={cn(
                      'flex h-full items-start gap-4',
                      wide ? 'bento-surface p-7' : 'rounded-xl border p-6',
                    )}
                    style={
                      wide
                        ? undefined
                        : { backgroundColor: 'var(--color-surface-low)', borderColor: 'var(--glass-border)' }
                    }
                  >
                    <div
                      className={cn(
                        'flex shrink-0 items-center justify-center rounded-lg',
                        wide ? 'size-11' : 'size-9',
                      )}
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.14)',
                        color: 'var(--color-primary)',
                      }}
                      aria-hidden
                    >
                      <CheckIcon className={wide ? 'size-5' : 'size-4'} />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'mb-2 font-bold text-[var(--color-on-surface)]',
                          wide ? 'text-lg' : 'text-base',
                        )}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={cn(
                          'leading-relaxed text-[var(--color-on-surface-variant)]',
                          wide ? 'text-base' : 'text-sm',
                        )}
                      >
                        {item.body}
                      </p>
                    </div>
                  </article>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 03 · Proceso ──────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[1fr_1.7fr] md:gap-14">
          <SectionReveal>
            <div className="md:sticky md:top-28">
              <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
                03 · Cómo trabajamos
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
                De la primera charla al sitio online
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Cuatro pasos, sin sorpresas. El segundo es gratis y es el que te deja decidir con el
                diseño delante.
              </p>
            </div>
          </SectionReveal>

          <ol className="relative space-y-3">
            {PROCESS.map((p, i) => (
              <li key={p.step}>
                <SectionReveal delay={i * STAGGER_BASE}>
                  <div
                    className={cn(
                      'flex items-start gap-5 rounded-xl border p-5 sm:p-6',
                      'transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(var(--color-primary-rgb),0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                    )}
                    style={{
                      backgroundColor: 'var(--color-surface-base)',
                      borderColor: 'var(--glass-border)',
                    }}
                  >
                    <span
                      aria-hidden
                      className="font-heading text-3xl font-extrabold leading-none tabular-nums sm:text-4xl"
                      style={{ color: 'rgba(var(--color-primary-rgb), 0.35)' }}
                    >
                      {p.step}
                    </span>
                    <div className="flex-1">
                      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-base font-bold text-[var(--color-on-surface)] sm:text-lg">
                          {p.title}
                        </h3>
                        <span
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {p.meta}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 04 · Para quién sí / para quién no ────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              04 · Encaje
            </span>
            <h2 className="mb-10 font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Con quién funciona esto (y con quién no)
            </h2>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-[1.25fr_0.9fr] md:gap-6">
            <SectionReveal>
              <div className="bento-surface h-full p-7">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                  Somos un buen match si
                </h3>
                <ul className="space-y-4">
                  {FIT_YES.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-[var(--color-primary)]" />
                      <span className="text-sm leading-relaxed text-[var(--color-on-surface-variant)] sm:text-base">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            <SectionReveal delay={STAGGER_BASE}>
              <div
                className="h-full rounded-xl border p-7"
                style={{
                  backgroundColor: 'var(--color-surface-low)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                  Mejor buscá otra opción si
                </h3>
                <ul className="space-y-4">
                  {FIT_NO.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500 dark:bg-red-400"
                      />
                      <span className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal delay={STAGGER_BASE * 2}>
            <Link
              href="/cuanto-cuesta-una-pagina-web"
              className={cn('mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl p-6', CARD_HOVER_CLASS)}
              style={{ backgroundColor: 'var(--color-surface-low)', borderColor: 'var(--glass-border)' }}
            >
              <span className="text-sm font-bold text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                ¿Viniste por el precio?
              </span>
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                Un sitio institucional arranca en {formatARS(LANDING_PRICE)}. Acá está el desglose de
                los tres niveles.
              </span>
              <ArrowRightIcon className="size-4 shrink-0 text-[var(--color-primary)] transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ── 05 · FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <SectionReveal className="mx-auto max-w-3xl px-6">
          <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
            05 · Preguntas
          </span>
          <h2 className="mb-8 font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
            Lo que me preguntan antes de arrancar
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details
                key={item.q}
                name="diseno-web-faq"
                className="group overflow-hidden rounded-xl border transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] open:border-[rgba(var(--color-primary-rgb),0.3)] has-[summary:focus-visible]:border-[rgba(var(--color-primary-rgb),0.45)]"
                style={{
                  borderColor: 'var(--glass-border)',
                  backgroundColor: 'var(--color-surface-base)',
                }}
                open={i === 0}
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.05)] focus-visible:bg-[rgba(var(--color-primary-rgb),0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)] active:bg-[rgba(var(--color-primary-rgb),0.08)] [&::-webkit-details-marker]:hidden">
                  <h3 className="pr-4 text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-200 group-hover:text-[var(--color-primary)] group-open:text-[var(--color-primary)]">
                    {item.q}
                  </h3>
                  <span
                    className="inline-flex shrink-0 transition-transform duration-200 group-open:rotate-180"
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
                <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* ── 06 · CTA final ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 85% 110%, rgba(var(--color-primary-rgb), 0.14), transparent 65%)',
          }}
        />
        <SectionReveal className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="heading-display mb-5 text-3xl text-[var(--color-on-surface)] sm:text-4xl md:text-5xl">
            Escribime y en 48 horas <strong>ves tu página</strong>
          </h2>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
            Contame en dos líneas qué hace tu empresa. Te devuelvo un boceto del diseño, sin costo y
            sin compromiso: si no te gusta, ahí termina y no gastaste nada.
          </p>
          <WhatsAppOutboundLink
            waHref={waUrl}
            className={cn(WA_CTA_CLASS, WA_SHADOW_CLASS_LG, 'w-full sm:h-14 sm:w-auto sm:px-8 sm:text-base')}
            style={{ background: WA_GRADIENT }}
          >
            <WhatsAppIcon className="size-5 shrink-0" aria-hidden />
            Pedir mi boceto gratis
            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </WhatsAppOutboundLink>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-on-surface-variant)]">
            <span>Te contesto yo, normalmente en menos de una hora.</span>
            <Link
              href="/contacto"
              prefetch={false}
              className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
            >
              ¿Preferís agendar 15 minutos?
            </Link>
          </p>
        </SectionReveal>
      </section>
    </>
  )
}
