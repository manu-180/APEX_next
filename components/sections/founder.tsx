'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { whatsappUrl } from '@/lib/whatsapp'
import { PROJECTS, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

/**
 * Sección 04 — Founder card honesta.
 *
 * Es Manuel: atiende él, construye él. Sin agencia, sin vendedores.
 * Prueba = productos propios en producción (links reales, verificables).
 * Solo números canónicos del AUDIT_ADDENDUM — nada de métricas infladas.
 */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Verde oficial WhatsApp — única excepción de hex permitida (DESIGN_BRIEF §2).
 * AUDIT_ADDENDUM: el CTA de dinero es SIEMPRE sólido verde WhatsApp.
 */
const WA_GRADIENT = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
const WA_SHADOW = '0 10px 28px -10px rgba(37, 211, 102, 0.45)'

const WA_MSG_FOUNDER =
  'Hola Manuel, leí quién está detrás de APEX y quiero contarte mi proyecto. ¿Lo charlamos?'

const YEARS_EXP = new Date().getFullYear() - 2021

/** Verdades canónicas (AUDIT_ADDENDUM) — nada inflado. */
const FOUNDER_STATS = [
  { value: `${YEARS_EXP}+`, label: 'Años construyendo' },
  { value: '8+', label: 'En producción' },
  { value: '<1 h', label: 'Respuesta' },
]

/** Compromisos respaldados por el FAQ de /servicios — cero promesas nuevas. */
const COMMITMENTS = [
  'El que te responde el WhatsApp y el que escribe el código somos la misma persona.',
  'Plazo pactado por escrito: si no llego a la fecha, te devuelvo el depósito.',
  'El código es tuyo desde el día uno. Sin lock-in, sin letra chica.',
]

/** Productos propios online — prueba verificable, de lib/constants. */
const LIVE_PRODUCTS = [
  { name: 'Handy', url: PROJECTS.handy },
  { name: 'Byluma Invita', url: PROJECTS.byluma },
  { name: 'Assistify', url: PROJECTS.assistify },
]

/**
 * Foto real (`/manuel.jpg` en public) con fallback elegante al avatar "MN".
 *
 * SSR-safe: el avatar es la capa base SIEMPRE renderizada; la foto se funde
 * encima recién cuando cargó OK (onLoad + chequeo post-mount para imágenes
 * cacheadas que resolvieron antes de hidratar). Si el archivo no existe,
 * la foto queda en opacity-0 y nunca se ve el glifo de imagen rota.
 */
function FounderPortrait() {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [photoLoaded, setPhotoLoaded] = useState(false)

  useEffect(() => {
    const el = imgRef.current
    if (el?.complete && el.naturalWidth > 0) setPhotoLoaded(true)
  }, [])

  return (
    <div className="relative aspect-[4/5] overflow-hidden">
      {/* Capa base: avatar MN — fallback elegante mientras no haya foto */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{
          background:
            'linear-gradient(160deg, rgba(var(--color-primary-rgb), 0.14), rgba(var(--color-primary-rgb), 0.04) 55%, transparent)',
        }}
      >
        <span
          className="flex size-20 select-none items-center justify-center rounded-full text-2xl font-extrabold"
          style={{
            background:
              'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.28), rgba(var(--color-primary-rgb), 0.1))',
            border: '2px solid rgba(var(--color-primary-rgb), 0.38)',
            color: 'var(--color-primary)',
          }}
          aria-hidden="true"
        >
          MN
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] opacity-60">
          Manuel · APEX
        </span>
      </div>

      <Image
        ref={imgRef}
        src="/manuel.jpg"
        alt="Manuel Navarro, el desarrollador detrás de APEX"
        fill
        sizes="(max-width: 1024px) 300px, 360px"
        className={cn(
          'object-cover transition-opacity duration-500',
          photoLoaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={() => setPhotoLoaded(true)}
      />
    </div>
  )
}

export function FounderSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GridBackground />

      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Numeración editorial — rompe el grid por el borde izquierdo */}
      <span
        aria-hidden="true"
        className="section-number absolute -left-6 top-10 hidden lg:block"
        style={{ fontSize: 'clamp(7rem, 13vw, 11rem)' }}
      >
        04
      </span>

      {/* Glow lateral sutil del tema */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 92% 50%, rgba(var(--color-primary-rgb), 0.07), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Grid asimétrico: contenido 7 cols + retrato 4 cols (gutter col 8) */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Contenido ─────────────────────────────────────────── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
            }
            viewport={{ once: true, amount: 0.25 }}
            className="lg:col-span-7"
          >
            <p className="editorial-label mb-6">Quién está detrás</p>

            <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
              <span className="block text-[var(--color-on-surface-variant)]">
                Sin agencia, sin vendedores.
              </span>
              <strong className="block text-[var(--color-on-surface)]">Hola, soy Manuel.</strong>
            </h2>

            <p className="mt-5 max-w-xl text-pretty leading-relaxed text-[var(--color-on-surface-variant)]">
              Diseño, programo y entrego cada proyecto de principio a fin. Además construyo
              productos propios que funcionan en producción y que gente real usa todos los
              días. Si tu proyecto tiene sentido técnico y comercial, lo armamos juntos. Si
              no, te lo digo de frente — y te ahorro tiempo y plata.
            </p>

            <ul className="mt-7 max-w-xl space-y-2.5 text-sm">
              {COMMITMENTS.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-[var(--color-on-surface-variant)]"
                >
                  <ArrowRightIcon
                    className="mt-0.5 size-3.5 shrink-0"
                    style={{ color: 'var(--color-primary)' }}
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Prueba: productos propios online ahora */}
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] opacity-60">
                Mis productos · online ahora
              </span>
              {LIVE_PRODUCTS.map((p, i) => (
                <span key={p.name} className="flex items-center gap-3">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none"
                  >
                    {p.name}
                  </a>
                  {i < LIVE_PRODUCTS.length - 1 && (
                    <span
                      className="text-[var(--color-on-surface-variant)] opacity-40"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* CTAs: dinero = verde WhatsApp sólido · navegación = link discreto */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <WhatsAppOutboundLink
                waHref={whatsappUrl(WA_MSG_FOUNDER)}
                data-hover
                data-inspector-title="CTA WhatsApp del founder"
                data-inspector-desc="Mensaje contextual de la sección founder. Tracking centralizado en openWhatsAppWithThankYouPage."
                data-inspector-cat="Conversión"
                className={cn(
                  'btn-tech inline-flex items-center justify-center gap-2.5 rounded-xl font-semibold select-none',
                  'h-12 px-7 text-sm text-white',
                  'transition-all duration-200 ease-out hover:brightness-110 hover:scale-[1.02] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                )}
                style={{ background: WA_GRADIENT, boxShadow: WA_SHADOW }}
              >
                <WhatsAppIcon className="size-4" />
                Contame tu proyecto
              </WhatsAppOutboundLink>

              <Link
                href={ROUTES.about}
                prefetch={false}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none"
              >
                Conocé mi historia
                <ArrowRightIcon
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </motion.div>

          {/* ── Retrato ───────────────────────────────────────────── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.1 } }
            }
            viewport={{ once: true, amount: 0.25 }}
            className="mx-auto w-full max-w-[300px] lg:col-span-4 lg:col-start-9 lg:max-w-none"
          >
            <div className="bento-surface overflow-hidden lg:-rotate-1 lg:transition-transform lg:duration-300 lg:hover:rotate-0">
              <FounderPortrait />

              <div className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-online)',
                      boxShadow: '0 0 6px var(--color-online)',
                    }}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-bold text-[var(--color-on-surface)]">
                    Manuel Navarro
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-on-surface-variant)]">
                  Full-stack · Web y apps a medida · Buenos Aires
                </p>

                <div className="divider-theme my-4" aria-hidden="true" />

                <dl className="grid grid-cols-3 gap-2 text-center">
                  {FOUNDER_STATS.map((s) => (
                    <div key={s.label} className="flex flex-col-reverse">
                      <dt className="text-[9px] leading-tight text-[var(--color-on-surface-variant)]">
                        {s.label}
                      </dt>
                      <dd
                        className="text-base font-extrabold tabular-nums"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
