'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { SectionReveal } from '@/components/ui/section-reveal'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

type BenefitItem = {
  title: string
  description: string
  anchor: string
  sizeClass: string
  /** Bullets extra para tiles altos (p. ej. row-span-2) */
  highlights?: string[]
}

const BENEFITS: BenefitItem[] = [
  {
    title: 'Mas clientes desde Google',
    description:
      'SEO tecnico y contenido comercial desde el dia uno. Tu web nace preparada para aparecer cuando te buscan en Argentina.',
    anchor: 'SEO desde el lanzamiento',
    sizeClass: 'lg:col-span-7 lg:row-span-2',
    highlights: [
      'Indexacion, sitemap y robots listos desde el deploy',
      'Schema y metadatos alineados a intencion de busqueda en tu zona',
      'Rendimiento y buenas practicas pensadas para Core Web Vitals',
      'Estructura de contenidos y titulos orientados a convertir visitas en consultas',
    ],
  },
  {
    title: 'Tu negocio vendiendo 24/7',
    description:
      'Mientras dormis, tu sitio sigue mostrando servicios, respondiendo dudas y capturando contactos listos para comprar.',
    anchor: 'Canal de ventas siempre activo',
    sizeClass: 'lg:col-span-5 lg:row-span-1',
  },
  {
    title: 'Entrega en 15 dias',
    description:
      'Proceso agil, foco total y entregables concretos. Evitamos proyectos eternos y salis al mercado mas rapido.',
    anchor: 'Velocidad con calidad visual',
    sizeClass: 'lg:col-span-5 lg:row-span-1',
  },
  {
    title: 'Diseno que genera confianza',
    description:
      'Interfaz premium, copy claro y jerarquia visual que posiciona tu marca como una empresa seria, moderna y vendible.',
    anchor: 'Primera impresion que vende',
    sizeClass: 'lg:col-span-7 lg:row-span-1',
  },
  {
    title: 'Sin sorpresas en el precio',
    description:
      'Presupuesto cerrado, alcance claro y decisiones transparentes. Sabes cuanto invertis antes de empezar.',
    anchor: 'Costo definido desde el inicio',
    sizeClass: 'lg:col-span-4 lg:row-span-1',
  },
  {
    title: 'Soporte post-entrega',
    description:
      'No desaparecemos despues del lanzamiento. Tenes acompanamiento para ajustes, mejoras y proximos pasos del negocio.',
    anchor: 'Continuidad real despues del go-live',
    sizeClass: 'lg:col-span-8 lg:row-span-1',
  },
]

/** Superficie compartida con las cards del bento (BenefitTile): borde, vidrio, highlight superior, hover. */
const BENEFIT_CARD_BASE_CLASSES =
  'group relative overflow-hidden rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface-low)]/90 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:z-[2] before:h-px before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-white/12 before:to-transparent transition-[border-color,box-shadow] duration-300 ease-out hover:border-[rgba(var(--color-primary-rgb),0.22)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_14px_48px_-28px_rgba(var(--color-primary-rgb),0.22)]'

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
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value])

  return (
    <motion.div
      ref={ref}
      className={cn(BENEFIT_CARD_BASE_CLASSES, 'flex min-h-[92px] flex-col justify-center px-4 py-4 sm:min-h-[100px] sm:px-5')}
      whileHover={
        prefersReducedMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: 'easeOut' } }
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-on-surface)]/[0.04] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.14]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(var(--color-primary-rgb), 0.14), transparent 58%)',
        }}
      />
      <div className="relative z-[1] flex flex-col gap-1.5">
        <p className="tabular-nums text-2xl font-extrabold leading-none tracking-tight text-[var(--color-on-surface)] sm:text-[28px]">
          {display}
          {suffix}
        </p>
        <p className="text-pretty text-xs leading-snug text-[var(--color-on-surface-variant)] sm:text-sm">
          {label}
        </p>
      </div>
    </motion.div>
  )
}

function BenefitTile({
  item,
  order,
  activeIndex,
  setActiveIndex,
}: {
  item: BenefitItem
  order: number
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const isActive = activeIndex === order
  const isNeighbor = activeIndex !== null && activeIndex !== order && Math.abs(activeIndex - order) <= 1

  return (
    <motion.article
      className={cn(
        BENEFIT_CARD_BASE_CLASSES,
        'flex h-full min-h-[210px] w-full flex-col sm:min-h-[230px]',
        isActive &&
          'border-[rgba(var(--color-primary-rgb),0.32)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(var(--color-primary-rgb),0.12),0_12px_40px_-24px_rgba(var(--color-primary-rgb),0.35)]',
        isNeighbor &&
          !isActive &&
          'border-[rgba(var(--color-primary-rgb),0.2)] shadow-[0_0_0_1px_rgba(var(--color-primary-rgb),0.12),0_10px_36px_-20px_rgba(var(--color-primary-rgb),0.28)]',
        item.sizeClass,
      )}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: order * 0.06 },
            }
      }
      viewport={{ once: true, amount: 0.25 }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -3, transition: { duration: 0.22, ease: 'easeOut' } }
      }
      onMouseEnter={() => setActiveIndex(order)}
      onMouseMove={(e) => {
        if (prefersReducedMotion) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setSpotlight({ x, y })
      }}
      onMouseLeave={() => {
        setActiveIndex(null)
        setSpotlight({ x: 50, y: 50 })
      }}
      data-hover
      data-inspector-title={item.title}
      data-inspector-desc={item.description}
      data-inspector-cat="Conversión"
    >
      {/* Capa base: gradiente plano (profundidad sin perspectiva 3D) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-on-surface)]/[0.04] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
        style={{
          background: `radial-gradient(420px circle at ${spotlight.x}% ${spotlight.y}%, rgba(var(--color-primary-rgb), 0.2), rgba(var(--color-primary-rgb), 0.06) 38%, transparent 65%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isActive ? 0.95 : isNeighbor ? 0.45 : 0.14,
          transition: 'opacity 380ms ease',
        }}
      />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col p-6 md:p-7">
        <div className="mb-8 flex flex-wrap justify-end">
          <span className="max-w-full text-right text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]">
            {item.anchor}
          </span>
        </div>

        <h3 className="text-balance text-2xl font-extrabold leading-tight text-[var(--color-on-surface)] sm:text-[30px]">
          {item.title}
        </h3>
        <p className="mt-4 max-w-[46ch] text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)] sm:text-base">
          {item.description}
        </p>

        {item.highlights && item.highlights.length > 0 ? (
          <ul
            className="mt-auto space-y-3 border-t border-[var(--color-outline)] pt-6"
            aria-label="Incluye en el lanzamiento"
          >
            {item.highlights.map((line) => (
              <li
                key={line}
                className="flex gap-2.5 text-pretty text-sm leading-snug text-[var(--color-on-surface-variant)]"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.article>
  )
}

export function ClientBenefitsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="beneficios" className="relative py-24 md:py-32">
      <GridBackground showRadialLight />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">Beneficios</Badge>
                <Badge variant="outline">Para pymes argentinas</Badge>
              </div>
              <h2 className="font-heading text-balance leading-tight">
                <span className="block text-3xl font-light text-[var(--color-on-surface-variant)] sm:text-4xl md:text-5xl">
                  No vendemos codigo.
                </span>
                <span className="block text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl md:text-5xl">
                  Vendemos resultados.
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              <p className="max-w-xl text-pretty text-[var(--color-on-surface-variant)]">
                Esta seccion esta pensada para emprendedores y dueños de pymes que quieren crecer sin perder tiempo en
                tecnicismos. Cada decision de diseno y estrategia esta orientada a facturar mejor.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <AnimatedMetric value={15} suffix="d" label="Entrega inicial" />
                <AnimatedMetric value={24} suffix="/7" label="Canal activo" />
                <AnimatedMetric value={3} suffix="" label="Cuotas sin interés" />
              </div>
            </div>
          </div>
        </SectionReveal>

        <motion.div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(170px,auto)]">
          {BENEFITS.map((item, index) => (
            <BenefitTile
              key={item.title}
              item={item}
              order={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </motion.div>

        <SectionReveal delay={0.2}>
          <div className="mt-10 flex justify-start">
            <Link
              href={ROUTES.contact}
              className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                'h-12 px-7 text-sm rounded-xl',
              )}
            >
              Ver como aplicarlo a tu negocio
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
