'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useReducedMotion } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { REVIEWS } from '@/lib/data/reviews'
import { EASE_OUT } from '@/lib/motion'
import { useParallaxNumber } from '@/hooks/use-parallax-number'
import { cn } from '@/lib/utils/cn'

/**
 * Muro de resultados — mosaico que alterna métricas verificables y quotes
 * reales (patrón "results wall" de Jasper/Amplemarket: número grande + quote
 * con nombre + contexto, intercalados; una sola vista responde "¿funciona?"
 * desde dos ángulos: dato y voz de cliente).
 *
 * Reglas de honestidad (mismas que trusted-clients):
 * - Los quotes salen de REVIEWS (single source of truth, ya expuesta en
 *   JSON-LD). Cero testimonios inventados.
 * - Las métricas son promesas operativas del servicio (boceto 24-48 h,
 *   entrega 15 días, 3 cuotas) o derivadas de REVIEWS (rating promedio).
 *   Nada de contadores inflados.
 */

/** Rating promedio real, derivado — si REVIEWS cambia, esto se actualiza solo. */
const AVG_RATING =
  Math.round((REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10) / 10

/** Quotes elegidos: resultado concreto > elogio genérico. */
const QUOTE_IDS = [2, 1, 3]
const QUOTES = QUOTE_IDS.map((id) => REVIEWS.find((r) => r.id === id)!).filter(Boolean)

interface StatTile {
  value: string
  label: string
  /** Aclaración honesta de qué es el número. */
  caption: string
  accent?: boolean
}

const STATS: StatTile[] = [
  {
    value: '24-48 h',
    label: 'Boceto gratis',
    caption: 'Ves tu web antes de pagar un peso',
    accent: true,
  },
  {
    value: '15 días',
    label: 'De boceto a online',
    caption: 'Fecha pactada por escrito',
  },
  {
    value: `${AVG_RATING}★`,
    label: `${REVIEWS.length} opiniones de clientes`,
    caption: 'Todas reales, con nombre y proyecto',
  },
]

/* ── Tiles ──────────────────────────────────────────────────────────────── */

function StatCard({ stat, order }: { stat: StatTile; order: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: order * 0.07 } }
      }
      viewport={{ once: true, amount: 0.4 }}
      data-hover
      data-inspector-title={`Métrica: ${stat.label}`}
      data-inspector-desc="Promesa operativa del servicio o dato derivado de las reviews reales. El mosaico métrica+quote responde '¿funciona?' desde dos ángulos."
      data-inspector-cat="Conversión"
      className={cn(
        'flex flex-col justify-between gap-6 bento-surface p-6 sm:p-7',
        stat.accent && 'bento-surface--framed',
      )}
    >
      <p
        className={cn(
          'font-heading text-4xl font-extrabold tracking-tight sm:text-5xl',
          stat.accent ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]',
        )}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {stat.value}
      </p>
      <div>
        <p className="font-heading text-sm font-extrabold text-[var(--color-on-surface)]">
          {stat.label}
        </p>
        <p className="mt-1 text-pretty text-[13px] leading-snug text-[var(--color-on-surface-variant)]">
          {stat.caption}
        </p>
      </div>
    </m.div>
  )
}

function QuoteCard({
  quote,
  order,
  wide,
}: {
  quote: (typeof REVIEWS)[number]
  order: number
  wide?: boolean
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.figure
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: order * 0.07 } }
      }
      viewport={{ once: true, amount: 0.35 }}
      data-hover
      data-inspector-title={`Opinión real: ${quote.name}`}
      data-inspector-desc="Review de REVIEWS (misma fuente que el JSON-LD de rich snippets). Con nombre, rol y proyecto: verificable, no inventada."
      data-inspector-cat="Conversión"
      className={cn(
        'flex flex-col justify-between gap-5 bento-surface p-6 sm:p-7',
        wide && 'sm:col-span-2',
      )}
    >
      <blockquote
        className={cn(
          'text-pretty leading-relaxed text-[var(--color-on-surface)]',
          wide ? 'text-base sm:text-lg' : 'text-sm sm:text-[15px]',
        )}
      >
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-extrabold text-[var(--color-on-surface)]">
            {quote.name}
          </p>
          {quote.role && (
            <p className="truncate text-xs text-[var(--color-on-surface-variant)] opacity-80">
              {quote.role}
            </p>
          )}
        </div>
        <span
          aria-label={`${quote.rating} de 5 estrellas`}
          className="shrink-0 font-mono text-xs font-bold tracking-[0.1em] text-[var(--color-primary)]"
        >
          {'★'.repeat(quote.rating)}
        </span>
      </figcaption>
    </m.figure>
  )
}

/* ── Sección ────────────────────────────────────────────────────────────── */

export function ResultsWallSection() {
  const prefersReducedMotion = useReducedMotion()
  const numberRef = useRef<HTMLSpanElement>(null)
  useParallaxNumber(numberRef)

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <m.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
          }
          viewport={{ once: true, amount: 0.4 }}
          className="mb-12 max-w-2xl"
        >
          <p className="editorial-label mb-6">Resultados</p>
          <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
            <span className="block text-[var(--color-on-surface-variant)]">Los números y los clientes</span>
            <strong className="block text-[var(--color-on-surface)]">dicen lo mismo.</strong>
          </h2>
        </m.div>

        {/* Mosaico: fila de métricas + fila de quotes (el quote con resultado
            concreto — "duplicó mis consultas" — va ancho y protagonista). */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} order={i} />
          ))}
          {QUOTES.map((quote, i) => (
            <QuoteCard key={quote.id} quote={quote} order={i} wide={i === 0} />
          ))}
        </div>

        <m.p
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
          viewport={{ once: true, amount: 0.6 }}
          className="mt-8 text-sm text-[var(--color-on-surface-variant)]"
        >
          <Link
            href="/opiniones"
            data-hover
            className="font-semibold text-[var(--color-primary)] underline-offset-4 transition-opacity hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm"
          >
            Ver todas las opiniones
          </Link>{' '}
          — con nombre, proyecto y fecha.
        </m.p>
      </div>
    </section>
  )
}
