'use client'

import { useEffect, useRef, useState } from 'react'
import type { Variants } from 'framer-motion'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { CheckIcon, WhatsAppIcon, XIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { whatsappUrl } from '@/lib/whatsapp'
import { EASE_OUT } from '@/lib/motion'
import { useParallaxNumber } from '@/hooks/use-parallax-number'
import { cn } from '@/lib/utils/cn'

/* Stagger reveal para listas (contrato §2: 30–50 ms por item).
   El item entra con transform/opacity; salida no aplica (once: true). */
const LIST_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
}
const LIST_ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}

/* Mensajes WA contextuales (brief §1.2/§5): 1-2 líneas, voseo, terminan con pregunta. */
const WA_MSG_PROBLEMA =
  'Hola Manuel, mi negocio necesita vender más online. ¿Qué me recomendás como primer paso?'
const WA_MSG_PROCESO =
  'Hola Manuel, quiero el boceto gratis de mi web. ¿Qué necesitás de mi parte para arrancar?'

/* ════════════════════════════════════════════════════════════════════════
   Sección 02 — Problema → Solución (PAS comprimido, 2 columnas asimétricas)
   ════════════════════════════════════════════════════════════════════════ */

const PAINS = [
  'Te buscan en Google y aparece tu competencia.',
  'Tu única vidriera es Instagram — y el algoritmo decide quién te ve.',
  'Respondés las mismas preguntas por WhatsApp todo el día.',
  'Pediste presupuesto para una web y te contestaron "depende", sin precio ni fecha.',
]

const SOLUTIONS = [
  'Aparecés en Google: SEO técnico desde el primer día, no "más adelante".',
  'Tu web muestra, cotiza y junta consultas mientras vos atendés el negocio.',
  'Precio cerrado por escrito antes de arrancar, en 3 cuotas sin interés.',
  'Entrega en 15 días. Si no cumplo, te devuelvo el depósito.',
  'Hablás directo con quien programa — sin intermediarios ni telefonos rotos.',
]

function AnimatedMetric({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.6, once: true })
  const [display, setDisplay] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isInView) return
    if (prefersReducedMotion) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value])

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-1 border-l border-[var(--color-outline)] pl-3 transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.55)] sm:pl-4"
    >
      <p className="tabular-nums font-heading text-2xl font-extrabold leading-none text-[var(--color-primary)] sm:text-[26px]">
        {display}
        {suffix}
      </p>
      <p className="text-pretty text-[11px] leading-snug text-[var(--color-on-surface-variant)] sm:text-xs">
        {label}
      </p>
    </div>
  )
}

export function ClientBenefitsSection() {
  const prefersReducedMotion = useReducedMotion()
  const numberRef = useRef<HTMLSpanElement>(null)
  useParallaxNumber(numberRef)

  return (
    <section id="beneficios" className="relative overflow-hidden py-24 md:py-32">
      <GridBackground showRadialLight />

      {/* Numeración editorial — lado izquierdo (alterna con la 01 de la sección anterior).
          Parallax GSAP scrub (transform-only, solo lg+, reduced-motion safe). */}
      <span
        ref={numberRef}
        aria-hidden="true"
        className="section-number absolute -left-6 top-10 hidden lg:block"
        style={{ fontSize: 'clamp(7rem, 13vw, 11rem)' }}
      >
        02
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
          }
          viewport={{ once: true, amount: 0.4 }}
          className="mb-14 max-w-2xl lg:ml-auto lg:text-right"
        >
          <p className="editorial-label mb-6 lg:flex-row-reverse">El problema</p>
          <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
            <span className="block text-[var(--color-on-surface-variant)]">Tenés un buen negocio.</span>
            <strong className="block text-[var(--color-on-surface)]">Online, nadie lo nota.</strong>
          </h2>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* ── Columna problema (agitación) ──────────────────────────── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT, delay: 0.05 } }
            }
            viewport={{ once: true, amount: 0.3 }}
            className="lg:mt-12"
            data-hover
            data-inspector-title="Agitación del problema"
            data-inspector-desc="Fórmula PAS: dolores concretos del dueño de pyme, sin estadísticas inventadas."
            data-inspector-cat="Copy · Conversión"
          >
            <motion.ul
              className="space-y-5"
              variants={prefersReducedMotion ? undefined : LIST_CONTAINER}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView={prefersReducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.3 }}
            >
              {PAINS.map((pain) => (
                <motion.li
                  key={pain}
                  variants={prefersReducedMotion ? undefined : LIST_ITEM}
                  className="group flex items-start gap-3.5"
                >
                  <span
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] opacity-70 transition-[opacity,border-color] duration-200 group-hover:opacity-100 group-hover:border-[rgba(var(--color-primary-rgb),0.4)]"
                    aria-hidden="true"
                  >
                    <XIcon className="size-3" />
                  </span>
                  <p className="text-pretty text-base leading-relaxed text-[var(--color-on-surface-variant)] transition-colors duration-200 group-hover:text-[var(--color-on-surface)] sm:text-lg">
                    {pain}
                  </p>
                </motion.li>
              ))}
            </motion.ul>

            <div className="divider-theme my-7" aria-hidden="true" />

            <p className="text-pretty text-sm font-medium text-[var(--color-on-surface)]">
              Cada día así, hay clientes que te buscaron y le compraron a otro.
            </p>
          </motion.div>

          {/* ── Columna solución (elevada, rompe la simetría) ─────────── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.12 } }
            }
            viewport={{ once: true, amount: 0.25 }}
            className="bento-surface p-6 sm:p-8 lg:p-9"
            data-hover
            data-inspector-title="La solución"
            data-inspector-desc="Respuesta directa a cada dolor con claims reales: SEO desde el día uno, precio cerrado, 15 días garantizados."
            data-inspector-cat="Copy · Conversión"
          >
            <p className="editorial-label editorial-label--primary mb-5">La solución</p>
            <h3 className="heading-display text-balance text-2xl sm:text-3xl">
              <span className="text-[var(--color-on-surface-variant)]">Una web que </span>
              <strong className="text-[var(--color-on-surface)]">trabaja para vos.</strong>
            </h3>

            <motion.ul
              className="mt-6 space-y-3.5"
              aria-label="Qué incluye trabajar con APEX"
              variants={prefersReducedMotion ? undefined : LIST_CONTAINER}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView={prefersReducedMotion ? undefined : 'show'}
              viewport={{ once: true, amount: 0.25 }}
            >
              {SOLUTIONS.map((line) => (
                <motion.li
                  key={line}
                  variants={prefersReducedMotion ? undefined : LIST_ITEM}
                  className="group flex gap-2.5 text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)] transition-colors duration-200 hover:text-[var(--color-on-surface)] sm:text-base"
                >
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)] transition-transform duration-200 group-hover:scale-110" aria-hidden />
                  <span>{line}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              <AnimatedMetric value={15} suffix="d" label="Entrega garantizada" />
              <AnimatedMetric value={48} suffix="h" label="Boceto gratis (24-48 h)" />
              <AnimatedMetric value={3} suffix="" label="Cuotas sin interés" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <WhatsAppOutboundLink
                waHref={whatsappUrl(WA_MSG_PROBLEMA)}
                className={cn(
                  'group inline-flex items-center justify-center gap-2 font-semibold select-none',
                  'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  'btn-tech btn-primary-tech',
                  'h-12 px-7 text-sm rounded-xl',
                )}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                Contame qué te está frenando
              </WhatsAppOutboundLink>
              <p className="text-xs text-[var(--color-on-surface-variant)] opacity-70">
                Sin compromiso, sin tecnicismos.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   Sección 03 — Proceso en 4 pasos, con el boceto gratis como riesgo invertido
   ════════════════════════════════════════════════════════════════════════ */

interface ProcessStep {
  number: string
  title: string
  description: string
  /** Paso destacado: la oferta de riesgo invertido (boceto gratis). */
  highlight?: boolean
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Charlamos por WhatsApp',
    description:
      'Me contás tu idea en 5 minutos, sin formularios eternos. Te respondo en menos de 1 hora.',
  },
  {
    number: '02',
    title: 'Boceto gratis en 24-48 h',
    description:
      'Diseño cómo se va a ver tu web antes de que pagues un peso. ¿No te convence? No pagás nada.',
    highlight: true,
  },
  {
    number: '03',
    title: 'Desarrollo en 15 días',
    description:
      'Aprobás el boceto, cerramos precio por escrito y arranca el reloj. Pagás en 3 cuotas sin interés.',
  },
  {
    number: '04',
    title: 'Lanzamiento y soporte',
    description:
      'Tu web online, en tu dominio y con el código a tu nombre. No desaparezco después de entregar.',
  },
]

function ProcessStepRow({ step, order }: { step: ProcessStep; order: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.li
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: order * 0.06 } }
      }
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        'relative grid grid-cols-[4.5rem_1fr] items-start gap-4 sm:grid-cols-[5.5rem_1fr] sm:gap-6',
        step.highlight && 'bento-surface p-5 sm:p-6 lg:-mx-6',
      )}
      data-hover
      data-inspector-title={`Paso ${step.number}: ${step.title}`}
      data-inspector-desc={
        step.highlight
          ? 'Oferta de riesgo invertido: el visitante ve el valor antes de pagar. Es la promesa real del proceso APEX.'
          : 'Paso del proceso con tiempos concretos — reduce la incertidumbre antes del contacto.'
      }
      data-inspector-cat="Conversión"
    >
      <span
        aria-hidden="true"
        className="section-number self-center justify-self-end"
        style={{
          fontSize: 'clamp(2.6rem, 5vw, 3.4rem)',
          ...(step.highlight ? ({ '--sn-stroke-alpha': '0.65' } as React.CSSProperties) : null),
        }}
      >
        {step.number}
      </span>

      <div className="min-w-0 py-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)] sm:text-xl">
            {step.title}
          </h3>
          {step.highlight && (
            <span className="rounded-md border border-[rgba(var(--color-primary-rgb),0.3)] bg-[rgba(var(--color-primary-rgb),0.1)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Riesgo cero
            </span>
          )}
        </div>
        <p className="mt-1.5 max-w-xl text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)] sm:text-base">
          {step.description}
        </p>
      </div>
    </motion.li>
  )
}

export function HomeProcessSection() {
  const prefersReducedMotion = useReducedMotion()
  const numberRef = useRef<HTMLSpanElement>(null)
  useParallaxNumber(numberRef)

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GridBackground />

      <span
        ref={numberRef}
        aria-hidden="true"
        className="section-number absolute -right-4 top-10 hidden lg:block"
        style={{ fontSize: 'clamp(7rem, 13vw, 11rem)' }}
      >
        03
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* ── Header sticky a la izquierda (asimetría editorial) ───── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
            }
            viewport={{ once: true, amount: 0.4 }}
            className="lg:sticky lg:top-28"
          >
            <p className="editorial-label mb-6">El proceso</p>
            <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
              <span className="block text-[var(--color-on-surface-variant)]">De tu idea</span>
              <strong className="block text-[var(--color-on-surface)]">a estar online.</strong>
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-[var(--color-on-surface-variant)]">
              Cuatro pasos con tiempos concretos. El primero no te cuesta nada — literal:
              ves el boceto de tu web antes de pagar un peso.
            </p>

            <div className="mt-8 hidden lg:block">
              <WhatsAppOutboundLink
                waHref={whatsappUrl(WA_MSG_PROCESO)}
                className={cn(
                  'group inline-flex items-center justify-center gap-2 font-semibold select-none',
                  'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  'btn-tech btn-primary-tech',
                  'h-12 px-7 text-sm rounded-xl',
                )}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                Arrancar con el boceto gratis
              </WhatsAppOutboundLink>
              <p className="mt-3 text-xs text-[var(--color-on-surface-variant)] opacity-70">
                Si el boceto no te convence, no pagás nada.
              </p>
            </div>
          </motion.div>

          {/* ── Timeline de pasos ─────────────────────────────────────── */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[2.25rem] top-6 hidden w-px sm:left-[2.75rem] sm:block"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.25) 15%, rgba(var(--color-primary-rgb), 0.25) 85%, transparent)',
              }}
            />
            <ol className="relative space-y-8 sm:space-y-10">
              {PROCESS_STEPS.map((step, i) => (
                <ProcessStepRow key={step.number} step={step} order={i} />
              ))}
            </ol>

            {/* CTA mobile (en desktop vive en la columna izquierda) */}
            <div className="mt-10 lg:hidden">
              <WhatsAppOutboundLink
                waHref={whatsappUrl(WA_MSG_PROCESO)}
                className={cn(
                  'group inline-flex w-full items-center justify-center gap-2 font-semibold select-none sm:w-auto',
                  'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  'btn-tech btn-primary-tech',
                  'h-12 px-7 text-sm rounded-xl',
                )}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                Arrancar con el boceto gratis
              </WhatsAppOutboundLink>
              <p className="mt-3 text-xs text-[var(--color-on-surface-variant)] opacity-70">
                Si el boceto no te convence, no pagás nada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
