'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { SectionReveal } from '@/components/ui/section-reveal'
import { GridBackground } from '@/components/ui/grid-background'
import { CircuitBoardBg } from '@/components/ui/circuit-board-bg'
import { TiltCtaCard } from '@/components/ui/tilt-cta-card'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { ROUTES } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { EASE_OUT } from '@/lib/motion'
import { TECH_STACK } from '@/lib/types/theme'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import { TechCardsSection } from './tech-cards-section'

/** Mensaje prellenado propio de esta página (tracking centralizado en WhatsAppOutboundLink). */
const WA_MSG_TECNOLOGIAS =
  'Hola Manuel, vi el stack que usás en tu web y quiero saber si encaja con mi proyecto. ¿Lo charlamos?'

const HERO_STATS = [
  { value: '5', label: 'piezas — cero relleno' },
  { value: '8+', label: 'productos y sitios en producción' },
  { value: '15d', label: 'de idea a online' },
] as const

export function TecnologiasContent() {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef({ x: -1, y: -1, active: false })
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0])
  const headerMask = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [
      'linear-gradient(to bottom, black 80%, transparent 100%)',
      'linear-gradient(to bottom, black 0%, transparent 60%)',
    ],
  )

  return (
    <>
      <motion.section
        ref={headerRef}
        className="relative pt-28 sm:pt-32 md:pt-40 pb-12 md:pb-16 overflow-hidden"
        style={{
          opacity: headerOpacity,
          maskImage: headerMask,
          WebkitMaskImage: headerMask,
        }}
        data-hover
        data-inspector-title="Hero editorial /tecnologias"
        data-inspector-desc="Headline en escala dramática, asimetría con stats verticales, marquee de stack y CircuitBoardBg reaccionando al cursor."
        data-inspector-cat="Tipografía · Layout"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => {
          bgCursorRef.current = { x: -1, y: -1, active: false }
        }}
      >
        <GridBackground showRadialLight />
        <CircuitBoardBg cursorRef={bgCursorRef} />

        {/* Glow editorial top-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 18% -5%, rgba(var(--color-primary-rgb), 0.16), transparent 60%)',
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.16), transparent)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <SectionReveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              {/* ── Left column ──────────────────────────────────── */}
              <div className="max-w-3xl">
                {/* Section meta */}
                <p className="editorial-label editorial-label--primary mb-7">
                  Por qué estas herramientas
                </p>

                {/* Headline editorial — escala dramática, peso 200/800 */}
                <h1 className="heading-display text-balance leading-[0.92] mb-7">
                  <span className="block text-4xl sm:text-6xl md:text-7xl text-[var(--color-on-surface-variant)]">
                    Cada herramienta
                  </span>
                  <strong className="block text-5xl sm:text-7xl md:text-[5.5rem] text-[var(--color-on-surface)] tracking-tight -mt-1">
                    es una decisión.
                  </strong>
                  <span className="block text-4xl sm:text-6xl md:text-7xl italic glow-text mt-2"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    No un capricho.
                  </span>
                </h1>

                <p className="text-pretty text-base md:text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed">
                  No elijo herramientas para impresionar. Elijo las que hacen que tu web o app sea
                  rápida, confiable y fácil de mantener. Cinco piezas que se conocen entre sí —
                  sin complejidad innecesaria que te cueste más después.
                </p>
              </div>

              {/* ── Right column: stats ───────────────────────────── */}
              <aside className="lg:min-w-[200px]" aria-label="Métricas del stack">
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
                  {HERO_STATS.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE_OUT }}
                      className="lg:border-l-2 lg:pl-4 lg:py-1"
                      style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.3)' }}
                    >
                      <div
                        className="font-heading text-2xl lg:text-3xl font-extrabold tabular-nums"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] opacity-75 leading-tight mt-0.5">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </aside>
            </div>
          </SectionReveal>

          {/* ── Marquee con nombres del stack — loop seamless ─────────────
              Exactamente 2 copias y x a -50%: el desplazamiento equivale al
              ancho de UNA copia (pr-12 interno en vez de gap del padre), así
              el loop no salta. `linear` es correcto acá (marquee continuo). */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 sm:mt-16 overflow-hidden border-y py-4"
            style={{
              borderColor: 'rgba(var(--color-primary-rgb), 0.12)',
              maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
            aria-hidden
          >
            <motion.div
              className="flex whitespace-nowrap"
              animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
              transition={
                prefersReducedMotion ? undefined : { duration: 28, repeat: Infinity, ease: 'linear' }
              }
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-12 pr-12">
                  {TECH_STACK.map((t) => (
                    <div key={`${copy}-${t.title}`} className="flex items-center gap-12 shrink-0">
                      <span
                        className="font-heading text-2xl sm:text-3xl font-extrabold opacity-60"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        {t.title}
                      </span>
                      <span
                        className="size-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <TechCardsSection />

      <section className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionReveal>
            {/* Tarjeta 3D compartida (components/ui/tilt-cta-card): misma física
                que el cierre de /muestrario — perspective 1000 + SPRING_TILT +
                glare + blob con profundidad real de preserve-3d. */}
            <TiltCtaCard
              inspectorTitle="CTA final — tarjeta con inclinación 3D"
              inspectorDesc="Pensala en tres capas: (1) Estructura: en pantallas grandes es una grilla de dos columnas — texto y badge a la izquierda, botones a la derecha; en móvil se apilan. (2) Estilo: borde tipo vidrio (`glass-border`) y fondo en degradado que mezcla el color de superficie del tema con un poco del primario, más un halo difuminado atrás. (3) Movimiento: al mover el mouse, medimos dónde está el puntero dentro de la tarjeta y aplicamos una rotación 3D suave en X e Y con resortes de Framer Motion (vuelta al neutro fluida); la sombra y el glare siguen esos valores, y el contenido flota a +28px reales de profundidad. Si el sistema tiene “reducir movimiento”, no hay rotación, solo sombra tranquila. La aparición al hacer scroll la hace SectionReveal; el botón de WhatsApp es el sólido verde oficial (el CTA de dinero de todo el sitio) y el secundario es contorno con el primario del tema."
              inspectorCat="Física · 3D"
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <p className="editorial-label editorial-label--primary mb-5">Siguiente paso</p>
                  <h2 className="heading-display text-balance text-2xl sm:text-3xl md:text-4xl">
                    <span className="block text-[var(--color-on-surface-variant)]">Este stack,</span>
                    <strong className="block text-[var(--color-on-surface)]">aplicado a tu negocio.</strong>
                  </h2>
                  <p className="mt-3 max-w-2xl text-pretty text-[var(--color-on-surface-variant)]">
                    Contame qué necesitás — web, app o los dos — y te digo qué piezas lleva,
                    en cuánto tiempo y a qué precio. Sin vueltas.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                  {/* CTA de dinero: sólido verde WhatsApp desde lib/constants/whatsapp-ui
                      (única excepción de hex del sitio, spec §12). */}
                  <WhatsAppOutboundLink
                    waHref={whatsappUrl(WA_MSG_TECNOLOGIAS)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2.5 rounded-xl font-bold text-white select-none',
                      'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]',
                      'motion-reduce:transform-none motion-reduce:transition-none',
                      WA_SHADOW_CLASS,
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                      'h-12 px-7 text-sm',
                    )}
                    style={{ background: WA_GRADIENT }}
                  >
                    <WhatsAppIcon className="size-4" />
                    Escribime por WhatsApp
                  </WhatsAppOutboundLink>
                  <Link
                    href={ROUTES.servicios}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 font-semibold select-none',
                      'transition-transform duration-200 ease-out',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                      'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                      'h-12 px-7 text-sm rounded-xl',
                    )}
                  >
                    Ver planes y precios
                    <ArrowRightIcon className="size-4" />
                  </Link>
                  <p className="text-xs text-[var(--color-on-surface-variant)] opacity-80 sm:ml-1 lg:ml-0 lg:text-center">
                    Te respondo en menos de 1 hora.
                  </p>
                </div>
              </div>
            </TiltCtaCard>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
