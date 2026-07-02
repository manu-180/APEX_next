'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRightIcon, CheckIcon, StarIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { whatsappUrl } from '@/lib/whatsapp'
import { ROUTES } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS_LG } from '@/lib/constants/whatsapp-ui'
import { EASE_OUT, SPRING_SNAP } from '@/lib/motion'
import { useParallaxNumber } from '@/hooks/use-parallax-number'
import { REVIEWS } from '@/lib/data/reviews'
import { cn } from '@/lib/utils/cn'

/**
 * Sección 05 — CTA final de la home, estilo /gracias (blueprint del addendum):
 * UNA acción dominante (WhatsApp sólido verde), de-riskers reales al lado y
 * una review real de /contacto como cierre de prueba social.
 *
 * Tracking: WhatsAppOutboundLink ya navega vía openWhatsAppWithThankYouPage
 * (Google Ads + Meta centralizados) — acá NO se agrega tracking manual.
 */

const WA_MSG_FINAL =
  'Hola Manuel, recorrí tu web y quiero arrancar mi proyecto. ¿Coordinamos 15 minutos?'

/** De-riskers — verdades canónicas del AUDIT_ADDENDUM. */
const DE_RISKERS = [
  'Boceto gratis en 24-48 h',
  'Respuesta en menos de 1 hora',
  'Precio cerrado por escrito',
]

/** Review real de lib/data/reviews (la misma fuente que /contacto). */
const FEATURED_REVIEW = REVIEWS.find((r) => r.id === 2) ?? REVIEWS[0]

/**
 * Magnetic hover (spec §8.6) — ÚNICO magnetic de la home, reservado al CTA
 * de cierre: pull de ±4px con useMotionValue + useSpring (cero re-renders),
 * solo desktop (hover+pointer fine) y gated por useReducedMotion.
 */
function MagneticCta({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, SPRING_SNAP)
  const y = useSpring(my, SPRING_SNAP)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const active = isDesktop && !prefersReducedMotion

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 8)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 8)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      className={className}
      style={active ? { x, y } : undefined}
      onMouseMove={active ? handleMove : undefined}
      onMouseLeave={active ? handleLeave : undefined}
    >
      {children}
    </motion.div>
  )
}

export function HomeFinalCtaSection() {
  const prefersReducedMotion = useReducedMotion()
  const numberRef = useRef<HTMLSpanElement>(null)
  useParallaxNumber(numberRef)

  return (
    <section className="relative overflow-hidden pb-28 pt-24 md:pb-36 md:pt-32">
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Numeración editorial — cierra la serie 01-05 por el borde derecho.
          Parallax GSAP scrub (transform-only, solo lg+, reduced-motion safe). */}
      <span
        ref={numberRef}
        aria-hidden="true"
        className="section-number absolute -right-4 top-10 hidden lg:block"
        style={{ fontSize: 'clamp(7rem, 13vw, 11rem)' }}
      >
        05
      </span>

      {/* Glow de cierre, sutil, del tema */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 18% 70%, rgba(var(--color-primary-rgb), 0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Acción ────────────────────────────────────────────── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
            }
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-7"
          >
            <p className="editorial-label editorial-label--primary mb-6">Último paso</p>

            <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
              <span className="block text-[var(--color-on-surface-variant)]">
                Arrancá esta semana.
              </span>
              <strong className="block text-[var(--color-on-surface)]">
                Tu web, online en 15 días.
              </strong>
            </h2>

            <p className="mt-5 max-w-xl text-pretty leading-relaxed text-[var(--color-on-surface-variant)]">
              Me escribís, charlamos 15 minutos sobre tu negocio y en 24-48 h ves un boceto
              gratis de tu web. Recién ahí decidís — con alcance, fecha y precio por escrito.
            </p>

            {/* De-riskers */}
            <motion.ul
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5"
              variants={
                prefersReducedMotion
                  ? undefined
                  : { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }
              }
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView={prefersReducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.5 }}
            >
              {DE_RISKERS.map((item) => (
                <motion.li
                  key={item}
                  variants={
                    prefersReducedMotion
                      ? undefined
                      : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } } }
                  }
                  className="group flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] transition-colors duration-200 hover:text-[var(--color-on-surface)]"
                >
                  <CheckIcon
                    className="size-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ color: 'var(--color-primary)' }}
                    aria-hidden
                  />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA dominante — único botón de la sección (magnetic, spec §8.6) */}
            <div className="mt-9">
              <MagneticCta className="inline-block w-full sm:w-auto">
                <WhatsAppOutboundLink
                  waHref={whatsappUrl(WA_MSG_FINAL)}
                  data-hover
                  data-inspector-title="CTA final WhatsApp"
                  data-inspector-desc="Acción dominante de cierre de la home. Abre WhatsApp con mensaje contextual y navega a /gracias; tracking centralizado."
                  data-inspector-cat="Conversión"
                  className={cn(
                    'group btn-tech inline-flex w-full items-center justify-center gap-3 rounded-xl font-bold select-none sm:w-auto',
                    'h-14 pl-6 pr-8 text-base text-white',
                    'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.02] active:scale-[0.97]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    WA_SHADOW_CLASS_LG,
                  )}
                  style={{ background: WA_GRADIENT }}
                >
                  {/* Button-in-button (spec §8.5): chip interior con el ícono */}
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 transition-[background-color,transform] duration-300 ease-out group-hover:translate-x-0.5 group-hover:bg-white/25 motion-reduce:transform-none"
                  >
                    <WhatsAppIcon className="size-5" />
                  </span>
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
                    Empezar mi proyecto por WhatsApp
                  </span>
                </WhatsAppOutboundLink>
              </MagneticCta>

              <p className="mt-4 text-xs text-[var(--color-on-surface-variant)] opacity-80">
                Te respondo yo, en menos de 1 hora. ¿Preferís agendar?{' '}
                <Link
                  href={ROUTES.contact}
                  className="group inline-flex items-center gap-1 font-semibold text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none"
                >
                  Reunión de 15 minutos, gratis
                  <ArrowRightIcon
                    className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </p>
            </div>
          </motion.div>

          {/* ── Prueba social de cierre: review real ──────────────── */}
          <motion.figure
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.12 } }
            }
            viewport={{ once: true, amount: 0.3 }}
            className="bento-surface relative p-6 sm:p-7 lg:col-span-4 lg:col-start-9"
          >
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label={`${FEATURED_REVIEW.rating} de 5 estrellas`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  filled={i < FEATURED_REVIEW.rating}
                  className="size-3.5 text-[var(--color-primary)]"
                />
              ))}
            </div>

            <blockquote className="mt-4 text-pretty text-sm leading-relaxed text-[var(--color-on-surface)]">
              “{FEATURED_REVIEW.text}”
            </blockquote>

            <figcaption className="mt-4 text-xs text-[var(--color-on-surface-variant)]">
              <span className="font-semibold text-[var(--color-on-surface)]">
                {FEATURED_REVIEW.name}
              </span>
              {FEATURED_REVIEW.role ? ` · ${FEATURED_REVIEW.role}` : null}
            </figcaption>

            <div className="divider-theme my-4" aria-hidden="true" />

            <Link
              href={ROUTES.contact}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none"
            >
              Ver todas las opiniones
              <ArrowRightIcon
                className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
