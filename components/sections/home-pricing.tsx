'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useReducedMotion } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { whatsappUrl } from '@/lib/whatsapp'
import { WEB_PLANS } from '@/lib/types/services'
import { EASE_OUT } from '@/lib/motion'
import { useParallaxNumber } from '@/hooks/use-parallax-number'
import { cn } from '@/lib/utils/cn'

/**
 * Precios en la home — patrón "shared inclusions" (Parker AI): un panel único
 * con lo que TODO proyecto incluye + cards de nivel al lado. La lista común
 * se lee una sola vez (no se repite en cada card) y materializa la promesa
 * central de APEX: precio cerrado, sin sorpresas.
 *
 * Los precios NUNCA se hardcodean: salen de WEB_PLANS via arsHome — si
 * cambian en services.ts, esta sección se actualiza sola (misma regla que
 * showcase.ts).
 */

/** Formato ARS SIN Intl: Intl.NumberFormat puede producir espacios distintos
    (NBSP vs narrow NBSP) entre el ICU de Node y el del browser → hydration
    mismatch de texto. Formateo determinístico puro: mismo string en server
    y cliente, siempre. */
function arsHome(amount: number): string {
  return `$ ${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

/** Garantías comunes a todo proyecto web — cada línea existe en la promesa
    real del servicio (hero, proceso o features de WEB_PLANS). */
const INCLUDED_ALWAYS = [
  'Boceto gratis en 24-48 h: ves tu web antes de pagar',
  'Precio cerrado por escrito desde el inicio',
  '3 cuotas sin interés',
  'Diseño 100% a medida, sin plantillas genéricas',
  'Carga en menos de 2 segundos + SEO técnico',
  'Hosting y 3 meses de mantenimiento incluidos',
  'El código queda a tu nombre',
]

/** Los tres niveles web (los de app viven en /servicios). */
const HOME_PLANS = WEB_PLANS.filter((p) => p.price !== null).slice(0, 3)

const WA_MSG_PLAN = (planName: string) =>
  `Hola Manuel, me interesa el plan ${planName}. ¿Arrancamos con el boceto gratis?`

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m3 8.5 3.5 3.5L13 4.5" />
    </svg>
  )
}

/* ── Card de plan ───────────────────────────────────────────────────────── */

function PlanCard({ plan, order }: { plan: (typeof HOME_PLANS)[number]; order: number }) {
  const prefersReducedMotion = useReducedMotion()
  const featured = plan.badge === 'Más elegido'

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.08 + order * 0.08 } }
      }
      viewport={{ once: true, amount: 0.3 }}
      data-hover
      data-inspector-title={`Plan ${plan.name} — ${arsHome(plan.price!)}`}
      data-inspector-desc="Precio real desde WEB_PLANS (nunca hardcodeado). El panel de inclusiones comunes vive aparte — patrón Parker: se lee una vez, no se repite por card."
      data-inspector-cat="Conversión"
      className={cn(
        // Misma caja para las tres: la destacada se distingue por color y peso,
        // no por tamaño. Si es más alta, el grid estira a las hermanas y el
        // sobrante se abre como hueco muerto en el medio de la card.
        'relative flex flex-col gap-5 bento-surface p-6 sm:p-7',
        featured &&
          'border-[rgba(var(--color-primary-rgb),0.4)] shadow-[0_0_0_1px_rgba(var(--color-primary-rgb),0.12),0_18px_50px_-24px_rgba(var(--color-primary-rgb),0.35)]',
      )}
    >
      <div>
        <p
          className={cn(
            'mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]',
            featured
              ? 'text-[var(--color-primary)]'
              : 'text-[var(--color-on-surface-variant)] opacity-70',
          )}
        >
          {plan.badge}
        </p>
        <h3 className="font-heading text-xl font-extrabold text-[var(--color-on-surface)]">
          {plan.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-pretty text-[13px] leading-snug text-[var(--color-on-surface-variant)]">
          {plan.frontHeadline}
        </p>
      </div>

      {/* Hairline separadora (patrón Parker): marca dónde termina la promesa
          y empieza el número. Sin `mt-auto`: empujar el precio al fondo abre
          un hueco muerto porque la card featured estira a las hermanas. */}
      <div className="mt-auto border-t border-dashed border-[var(--glass-border)] pt-5">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span
            className="font-heading text-[28px] font-extrabold leading-none tracking-tight text-[var(--color-on-surface)]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {arsHome(plan.price!)}
          </span>
          {plan.originalPrice && (
            <s className="text-sm leading-none text-[var(--color-on-surface-variant)] opacity-60">
              {arsHome(plan.originalPrice)}
            </s>
          )}
        </p>
        <p className="mt-2 text-xs text-[var(--color-on-surface-variant)] opacity-70">
          Precio final, en 3 cuotas sin interés.
        </p>

        <WhatsAppOutboundLink
          waHref={whatsappUrl(WA_MSG_PLAN(plan.name))}
          className={cn(
            'mt-5 inline-flex w-full items-center justify-center gap-2 font-semibold select-none',
            'transition-[transform,box-shadow] duration-300 ease-out active:scale-[0.97]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
            // whitespace-nowrap: en columna angosta el label caía a dos líneas
            // y el ícono quedaba pegado al texto.
            'h-11 whitespace-nowrap rounded-xl px-3 text-sm btn-tech',
            featured ? 'btn-primary-tech' : 'btn-outline-tech text-[var(--color-primary)]',
          )}
        >
          <WhatsAppIcon className="size-4 shrink-0" />
          Quiero mi boceto
        </WhatsAppOutboundLink>
      </div>
    </m.div>
  )
}

/* ── Sección ────────────────────────────────────────────────────────────── */

export function HomePricingSection() {
  const prefersReducedMotion = useReducedMotion()
  const numberRef = useRef<HTMLSpanElement>(null)
  useParallaxNumber(numberRef)

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GridBackground showRadialLight />

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
          <p className="editorial-label mb-6">Precios claros</p>
          <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
            <span className="block text-[var(--color-on-surface-variant)]">Sabés cuánto sale</span>
            <strong className="block text-[var(--color-on-surface)]">antes de empezar.</strong>
          </h2>
        </m.div>

        {/* Parker layout: inclusiones comunes a la izquierda (se leen UNA vez),
            niveles a la derecha. En mobile el panel va arriba. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <m.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
            }
            viewport={{ once: true, amount: 0.3 }}
            data-hover
            data-inspector-title="Todo proyecto incluye"
            data-inspector-desc="Panel de inclusiones comunes (patrón Parker AI): materializa 'precio cerrado, sin sorpresas' y evita repetir la misma lista en cada card."
            data-inspector-cat="Conversión"
            className="bento-surface flex flex-col p-6 sm:p-7 lg:col-span-4"
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Todo proyecto incluye
            </p>
            <ul className="mt-5 flex-1 space-y-3.5">
              {INCLUDED_ALWAYS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]" />
                  <span className="text-pretty text-sm leading-snug text-[var(--color-on-surface)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[var(--glass-border)] pt-4 text-xs leading-relaxed text-[var(--color-on-surface-variant)] opacity-80">
              Sin costos ocultos ni mensualidades sorpresa. Lo que ves acá está en
              el presupuesto por escrito.
            </p>
          </m.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-8 lg:gap-5">
            {HOME_PLANS.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} order={i} />
            ))}
          </div>
        </div>

        <m.p
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
          viewport={{ once: true, amount: 0.6 }}
          className="mt-8 text-sm text-[var(--color-on-surface-variant)]"
        >
          ¿Necesitás una app o algo más grande?{' '}
          <Link
            href="/servicios"
            data-hover
            className="rounded-sm font-semibold text-[var(--color-primary)] underline-offset-4 transition-opacity hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Ver todos los planes y armar tu presupuesto
          </Link>
        </m.p>
      </div>
    </section>
  )
}
