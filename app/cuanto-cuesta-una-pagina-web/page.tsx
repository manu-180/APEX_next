import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, CheckIcon, StarIcon, WhatsAppIcon } from '@/components/ui/icons'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SafeJsonLd } from '@/components/seo/safe-json-ld'
import { SectionReveal } from '@/components/ui/section-reveal'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { APP_URL } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS, WA_SHADOW_CLASS_LG } from '@/lib/constants/whatsapp-ui'
import { whatsappUrl } from '@/lib/whatsapp'
import { formatARS } from '@/lib/types/services'
import { REVIEWS } from '@/lib/data/reviews'
import { STAGGER_BASE } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'
import {
  ALWAYS_INCLUDED,
  FAQ_ITEMS,
  PRICE_FACTORS,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_TIERS,
  PROCESS_STEPS,
  arsInline,
} from './content'

export const dynamic = 'force-static'

const PATH = '/cuanto-cuesta-una-pagina-web'
const BASE = APP_URL.replace(/\/$/, '')
const PAGE_URL = `${BASE}${PATH}`

export const metadata: Metadata = {
  // `absolute`: el título ya gasta el presupuesto entero del SERP con la
  // query literal + la respuesta. Un sufijo de marca acá solo empuja el
  // rango de precio fuera de la línea visible.
  title: {
    absolute: `Cuánto cuesta una página web en Argentina: ${arsInline(PRICE_MIN)} a ${arsInline(PRICE_MAX)}`,
  },
  description: `Precio de una página web en Argentina: Landing ${arsInline(PRICE_TIERS[0].price)}, Interactiva ${arsInline(PRICE_TIERS[1].price)} y Tienda Online ${arsInline(PRICE_TIERS[2].price)}. Presupuesto cerrado y entrega en 15 días.`,
  keywords: [
    'cuanto cuesta una pagina web',
    'cuanto cuesta una pagina web en argentina',
    'cuanto sale una pagina web',
    'cuanto sale hacer una pagina web',
    'cuanto cuesta crear una pagina web',
    'presupuesto pagina web',
    'presupuesto sitio web',
    'presupuesto desarrollo web',
    'precio pagina web argentina',
    'precio diseño web',
    'tarifario diseño web argentina',
    'cuanto cuesta una tienda online',
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: 'website',
    title: `Cuánto cuesta una página web en Argentina — ${arsInline(PRICE_MIN)} a ${arsInline(PRICE_MAX)}`,
    description: `Los tres precios reales, qué incluye cada uno y qué hace variar el número. Sin "a cotizar".`,
    url: PAGE_URL,
    siteName: 'APEX Portfolio',
    locale: 'es_AR',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Precios de páginas web en Argentina' }],
  },
}

/* Hover de card: lift + borde primary + sombra token, con rama motion-reduce
   (mismo contrato que las landings verticales). */
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

const LABEL_CLASS = 'inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase'

const WA_MSG =
  'Hola Manuel, quiero saber cuánto me sale mi página web. ¿Me pasás el precio?'

/** Reseñas de proyectos web (las de apps viven en /servicios). */
const WEB_REVIEWS = REVIEWS.filter((r) => r.project === 'mnltecno' || r.project === 'tallerceramica')

export default function CuantoCuestaUnaPaginaWebPage() {
  const waUrl = whatsappUrl(WA_MSG)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Diseño y desarrollo de páginas web en Argentina',
    description: `Páginas web a medida con precio cerrado: de ${arsInline(PRICE_MIN)} a ${arsInline(PRICE_MAX)} ARS, entrega en 15 días.`,
    provider: { '@type': 'Person', name: 'Manuel Navarro', url: APP_URL },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    serviceType: 'Desarrollo web',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ARS',
      lowPrice: PRICE_MIN,
      highPrice: PRICE_MAX,
      offerCount: PRICE_TIERS.length,
      url: PAGE_URL,
      offers: PRICE_TIERS.map((t) => ({
        '@type': 'Offer',
        name: t.name,
        price: t.price,
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        url: PAGE_URL,
      })),
    },
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Servicios', url: `${BASE}/servicios` },
          { name: 'Cuánto cuesta una página web', url: PAGE_URL },
        ]}
      />
      <SafeJsonLd data={faqSchema} />
      <SafeJsonLd data={offerSchema} />

      {/* ── Hero: la respuesta antes del scroll ──────────────────────────
          SIN reveal ni animación de opacity/filter: el LCP móvil de este
          sitio es el texto del hero y arrancar en opacity:0 lo retrasa
          ~950 ms medidos. Todo lo de acá arriba pinta en el primer frame;
          las micro-interacciones son sólo transform. */}
      <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 md:pt-36 md:pb-20">
        <GridBackground showRadialLight />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 12% -5%, rgba(var(--color-primary-rgb), 0.18), transparent 62%)',
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-[1.08fr_0.92fr] md:items-start md:gap-12">
          {/* Columna izquierda — bloque 1 */}
          <div className="md:col-start-1">
            <nav
              aria-label="Migas de pan"
              className="mb-5 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]"
            >
              <Link href="/" className={CRUMB_LINK_CLASS}>
                Inicio
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/servicios" className={CRUMB_LINK_CLASS}>
                Servicios
              </Link>
              <span className="opacity-40">/</span>
              <span className="font-semibold text-[var(--color-on-surface)]">Precios</span>
            </nav>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="primary">Precios 2026</Badge>
              <Badge variant="outline">Argentina</Badge>
            </div>

            <h1 className="font-heading mb-5 text-balance leading-[0.98]">
              <span className="block text-3xl font-extralight text-[var(--color-on-surface-variant)] sm:text-4xl md:text-[2.75rem]">
                ¿Cuánto cuesta
              </span>
              <span className="block text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl md:text-[2.75rem]">
                una página web en Argentina?
              </span>
            </h1>
          </div>

          {/* Panel de respuesta — en desktop va a la derecha ocupando dos filas;
              en mobile queda inmediatamente debajo del h1, sin scrollear. */}
          <div className="md:col-start-2 md:row-start-1 md:row-span-2">
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: 'var(--color-surface-base)',
                borderColor: 'rgba(var(--color-primary-rgb), 0.28)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                aria-hidden
                className="h-[3px] w-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.9) 50%, transparent)',
                }}
              />
              <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                <p className={cn(LABEL_CLASS, 'mb-2')} style={{ color: 'var(--color-primary)' }}>
                  La respuesta corta
                </p>
                {/* flex-wrap y no una línea sola: a 375 px el rango completo
                    no entra y con `white-space` normal se cortaba contra el
                    borde de la tarjeta. Envuelve a dos líneas en vez de recortar. */}
                <p className="font-heading flex flex-wrap items-baseline gap-x-2 text-[1.65rem] font-extrabold leading-[1.05] tracking-tight tabular-nums text-[var(--color-on-surface)] sm:text-4xl">
                  <span>{formatARS(PRICE_MIN)}</span>
                  <span className="font-extralight text-[var(--color-on-surface-variant)]">a</span>
                  <span>{formatARS(PRICE_MAX)}</span>
                </p>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                  Según lo que la página tenga que hacer. Precio cerrado por escrito, en pesos.
                </p>

                <ul className="mt-5 space-y-px">
                  {PRICE_TIERS.map((tier) => (
                    <li key={tier.id}>
                      <a
                        href={`#${tier.id}`}
                        className="group flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 transition-[transform,background-color] duration-200 ease-out hover:translate-x-1 hover:bg-[rgba(var(--color-primary-rgb),0.07)] focus-visible:outline-none focus-visible:bg-[rgba(var(--color-primary-rgb),0.07)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                      >
                        <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                          {tier.name}
                        </span>
                        <span
                          className="shrink-0 font-heading text-base font-extrabold tabular-nums sm:text-lg"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {formatARS(tier.price)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Columna izquierda — bloque 2 */}
          <div className="md:col-start-1">
            <p className="mb-7 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
              Tres precios, publicados. No hay una versión cara para el que parece tener plata ni un
              &laquo;a cotizar&raquo; que aparece al final de la charla: elegís cuál necesitás y ese es el
              número que pagás.
            </p>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <WhatsAppOutboundLink
                waHref={waUrl}
                className={cn(WA_CTA_CLASS, WA_SHADOW_CLASS, 'w-full sm:w-auto')}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 shrink-0" aria-hidden />
                Pedir mi número exacto
                <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </WhatsAppOutboundLink>
              <a
                href="#planes"
                className={cn(
                  'group btn-tech btn-outline-tech inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:w-auto',
                  'text-[var(--color-primary)] transition-transform duration-300 ease-out active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                )}
              >
                Ver qué incluye cada uno
              </a>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {['Boceto gratis antes de pagar', '3 cuotas sin interés', 'Entrega en 15 días'].map(
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
        </div>
      </section>

      {/* ── Los tres precios en detalle ──────────────────────────────── */}
      <section
        id="planes"
        className="relative scroll-mt-24 py-16 sm:py-20"
        style={{ backgroundColor: 'var(--color-surface-low)' }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
              01 · Los tres precios
            </span>
            <h2 className="font-heading mb-3 text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Qué te llevás por cada número
            </h2>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
              La diferencia entre un plan y el siguiente no es &laquo;más diseño&raquo;: es qué puede hacer
              tu cliente sin que vos intervengas.
            </p>
          </SectionReveal>

          <div className="grid items-start gap-5 md:grid-cols-3">
            {PRICE_TIERS.map((tier, i) => (
              <SectionReveal
                key={tier.id}
                delay={i * STAGGER_BASE}
                className={cn('h-full [&>div]:h-full', tier.featured && 'md:-mt-4')}
              >
                <article
                  id={tier.id}
                  className={cn(
                    'flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border',
                    tier.featured
                      ? 'shadow-[var(--shadow-card-lg)]'
                      : 'shadow-[var(--shadow-card)]',
                  )}
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: tier.featured
                      ? 'rgba(var(--color-primary-rgb), 0.42)'
                      : 'var(--glass-border)',
                  }}
                >
                  {tier.featured && (
                    <div
                      aria-hidden
                      className="h-[3px] w-full"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.95) 50%, transparent)',
                      }}
                    />
                  )}

                  {/* Cabecera de precio sobre superficie teñida (patrón de
                      comparación: número grande arriba, entregables abajo) */}
                  <header
                    className="px-6 pb-6 pt-6"
                    style={{
                      backgroundColor: tier.featured
                        ? 'rgba(var(--color-primary-rgb), 0.07)'
                        : 'transparent',
                    }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)]">
                        {tier.name}
                      </h3>
                      {tier.featured && (
                        <Badge variant="primary" className="text-[10px]">
                          Más elegido
                        </Badge>
                      )}
                    </div>
                    <p
                      className="font-heading text-3xl font-extrabold tabular-nums leading-none"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {formatARS(tier.price)}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-on-surface)]">
                      {tier.eyebrow}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                      {tier.forWho}
                    </p>
                  </header>

                  <div
                    aria-hidden
                    className="mx-6 h-px"
                    style={{ backgroundColor: 'var(--glass-border)' }}
                  />

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      {tier.inheritsFrom ? `Todo lo de ${tier.inheritsFrom}, más:` : 'Incluye:'}
                    </p>
                    {/* flex-1 en la lista, no `mt-auto` en el CTA: así los tres
                        botones quedan alineados abajo aunque los planes tengan
                        distinta cantidad de items. */}
                    <ul className="flex-1 space-y-2.5">
                      {tier.includes.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <CheckIcon
                            className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]"
                            aria-hidden
                          />
                          <span className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <WhatsAppOutboundLink
                      waHref={whatsappUrl(
                        `Hola Manuel, quiero el plan ${tier.name} (${formatARS(tier.price)}). ¿Cómo arrancamos?`,
                      )}
                      className={cn(WA_CTA_CLASS, WA_SHADOW_CLASS, 'mt-6 w-full')}
                      style={{ background: WA_GRADIENT }}
                    >
                      <WhatsAppIcon className="size-4 shrink-0" aria-hidden />
                      Quiero este
                    </WhatsAppOutboundLink>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Qué hace variar el precio — h2 sticky + lista numerada ────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-[1fr_1.6fr] md:gap-14">
          <SectionReveal>
            <div className="md:sticky md:top-28">
              <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
                02 · La letra chica
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
                Qué hace que el número suba
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Nadie cobra igual dos proyectos distintos. Esto es lo que miro cuando te paso el precio
                — para que puedas estimarlo vos antes de escribirme.
              </p>
            </div>
          </SectionReveal>

          <ul className="space-y-4">
            {PRICE_FACTORS.map((f, i) => (
              <li key={f.title}>
                <SectionReveal delay={i * STAGGER_BASE}>
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-black"
                      style={{
                        color:
                          f.moves === 'sube'
                            ? 'var(--color-primary)'
                            : 'var(--color-on-surface-variant)',
                        backgroundColor:
                          f.moves === 'sube'
                            ? 'rgba(var(--color-primary-rgb), 0.12)'
                            : 'var(--color-surface-high)',
                        border:
                          f.moves === 'sube'
                            ? '1px solid rgba(var(--color-primary-rgb), 0.3)'
                            : '1px solid var(--glass-border)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[var(--color-on-surface)]">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                        {f.body}
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Lo que va incluido siempre ───────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <SectionReveal className="mx-auto max-w-5xl px-6">
          <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
            03 · Sin extras
          </span>
          <h2 className="font-heading mb-3 text-2xl font-extrabold text-[var(--color-on-surface)] sm:text-3xl">
            Lo que otros cobran aparte y acá está adentro
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
            En los tres planes, sin importar cuál elijas.
          </p>
          <ul className="flex flex-wrap gap-2">
            {ALWAYS_INCLUDED.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                }}
              >
                <CheckIcon className="size-3.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </SectionReveal>
      </section>

      {/* ── Plazo y forma de pago ────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
              04 · Plazo y pago
            </span>
            <h2 className="font-heading mb-10 text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              De la consulta a tu web online
            </h2>
          </SectionReveal>

          <ol className="grid gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.num} className="h-full">
                <SectionReveal delay={i * STAGGER_BASE} className="h-full [&>div]:h-full">
                  <div
                    className={cn('flex h-full flex-col rounded-2xl p-6', CARD_HOVER_CLASS)}
                    style={{
                      backgroundColor: 'var(--color-surface-low)',
                      borderColor: 'var(--glass-border)',
                    }}
                  >
                    <span
                      className="font-heading text-4xl font-extrabold leading-none tabular-nums"
                      style={{ color: 'rgba(var(--color-primary-rgb), 0.35)' }}
                      aria-hidden
                    >
                      {step.num}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-[var(--color-on-surface)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                      {step.body}
                    </p>
                  </div>
                </SectionReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Prueba social — reseñas reales de proyectos web ───────────── */}
      {WEB_REVIEWS.length > 0 && (
        <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
          <div className="mx-auto max-w-5xl px-6">
            <SectionReveal>
              <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
                05 · Quiénes ya pagaron estos precios
              </span>
              <h2 className="font-heading mb-10 text-2xl font-extrabold text-[var(--color-on-surface)] sm:text-3xl">
                Lo que dicen después de la entrega
              </h2>
            </SectionReveal>

            <div className="grid gap-5 md:grid-cols-2">
              {WEB_REVIEWS.map((r, i) => (
                <SectionReveal key={r.id} delay={i * STAGGER_BASE} className="h-full [&>div]:h-full">
                  <figure
                    className="flex h-full flex-col rounded-2xl border p-6"
                    style={{
                      backgroundColor: 'var(--color-surface-base)',
                      borderColor: 'var(--glass-border)',
                    }}
                  >
                    <div
                      className="mb-4 flex items-center gap-0.5"
                      role="img"
                      aria-label={`${r.rating} de 5 estrellas`}
                    >
                      {Array.from({ length: 5 }, (_, s) => (
                        <StarIcon
                          key={s}
                          filled={s < r.rating}
                          className={cn(
                            'size-4',
                            s < r.rating
                              ? 'text-[var(--color-primary)]'
                              : 'text-[var(--color-on-surface-variant)] opacity-40',
                          )}
                        />
                      ))}
                    </div>
                    <blockquote className="flex-1 text-base leading-relaxed text-[var(--color-on-surface)]">
                      &laquo;{r.text}&raquo;
                    </blockquote>
                    <figcaption className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
                      <span className="font-bold text-[var(--color-on-surface)]">{r.name}</span>
                      {r.role && <span> · {r.role}</span>}
                    </figcaption>
                  </figure>
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={WEB_REVIEWS.length * STAGGER_BASE}>
              <p className="mt-6 text-sm text-[var(--color-on-surface-variant)]">
                <Link
                  href="/opiniones"
                  className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-low)]"
                >
                  Ver todas las opiniones
                </Link>
              </p>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <SectionReveal className="mx-auto max-w-3xl px-6">
          <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
            06 · Preguntas
          </span>
          <h2 className="font-heading mb-8 text-2xl font-extrabold text-[var(--color-on-surface)] sm:text-3xl">
            Lo que se pregunta todo el mundo antes de decidir
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={item.q}
                name="precio-web-faq"
                className="group overflow-hidden rounded-xl border transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.3)] has-[summary:focus-visible]:border-[rgba(var(--color-primary-rgb),0.45)] open:border-[rgba(var(--color-primary-rgb),0.3)]"
                style={{
                  borderColor: 'var(--glass-border)',
                  backgroundColor: 'var(--color-surface-low)',
                }}
                open={i === 0}
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.05)] focus-visible:bg-[rgba(var(--color-primary-rgb),0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)] active:bg-[rgba(var(--color-primary-rgb),0.08)] [&::-webkit-details-marker]:hidden">
                  <h3 className="pr-4 text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-200 group-hover:text-[var(--color-primary)] group-open:text-[var(--color-primary)]">
                    {item.q}
                  </h3>
                  <span
                    className="inline-flex shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
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

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <GridBackground showRadialLight />
        <SectionReveal className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading mb-4 text-balance text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
            ¿Cuál de los tres es el tuyo?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
            Contame en dos líneas qué necesitás y te devuelvo el número exacto, con el alcance escrito.
            Te respondo en menos de una hora.
          </p>
          <WhatsAppOutboundLink
            waHref={waUrl}
            className={cn(
              WA_CTA_CLASS,
              WA_SHADOW_CLASS_LG,
              'w-full sm:h-14 sm:w-auto sm:px-8 sm:text-base',
            )}
            style={{ background: WA_GRADIENT }}
          >
            <WhatsAppIcon className="size-5 shrink-0" aria-hidden />
            Pedir mi presupuesto por WhatsApp
            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </WhatsAppOutboundLink>
          <p className="mt-3 text-xs text-[var(--color-on-surface-variant)]">
            Sin compromiso. Si el proyecto no es para mí, te lo digo.
          </p>
        </SectionReveal>
      </section>

      {/* ── Seguí leyendo · internal linking ─────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <SectionReveal className="mx-auto max-w-5xl px-6">
          <span className={cn(LABEL_CLASS, 'mb-4')} style={{ color: 'var(--color-primary)' }}>
            Seguí explorando
          </span>
          <h2 className="font-heading mb-8 text-2xl font-extrabold text-[var(--color-on-surface)] sm:text-3xl">
            Antes de decidir
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/blog/cuanto-cuesta-pagina-web-argentina-2026"
              className={cn('rounded-xl p-6 md:col-span-2', CARD_HOVER_CLASS)}
              style={{
                backgroundColor: 'var(--color-surface-low)',
                borderColor: 'var(--glass-border)',
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}
              >
                Guía completa
              </span>
              <h3 className="font-heading mb-1 mt-1 text-lg font-extrabold text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                Precios del mercado argentino 2026, comparados
              </h3>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                Qué cobran agencias, freelancers y plataformas por cada tipo de sitio — y por qué los
                números difieren tanto.
              </p>
            </Link>

            {[
              {
                href: '/servicios',
                eyebrow: 'Servicios',
                title: 'Todos los planes, incluidas las apps',
                body: 'Web, e-commerce y apps móviles con la comparativa contra WordPress, Wix y Tiendanube.',
              },
              {
                href: '/muestrario',
                eyebrow: 'Trabajos',
                title: 'Webs que ya están online',
                body: 'Proyectos reales entregados, para que veas qué comprás antes de pagar.',
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={cn('rounded-xl p-5', CARD_HOVER_CLASS)}
                style={{
                  backgroundColor: 'var(--color-surface-low)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <Badge variant="outline" className="mb-3 text-[10px]">
                  {c.eyebrow}
                </Badge>
                <h3 className="font-heading mb-2 text-base font-extrabold leading-tight text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                  {c.title}
                </h3>
                <p className="mb-3 text-sm text-[var(--color-on-surface-variant)]">{c.body}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                  Ver
                  <ArrowRightIcon className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </span>
              </Link>
            ))}
          </div>
        </SectionReveal>
      </section>
    </>
  )
}
