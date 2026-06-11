'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/components/providers/theme-mode-provider'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { CircuitBoardBg } from '@/components/ui/circuit-board-bg'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { ROUTES } from '@/lib/constants'
import { TECH_STACK } from '@/lib/types/theme'
import { cn } from '@/lib/utils/cn'
import { WA_MSG_GENERIC, whatsappUrl } from '@/lib/whatsapp'
import { TechCardsSection } from './tech-cards-section'

const HERO_STATS = [
  { value: '5', label: 'herramientas en total' },
  { value: '8+', label: 'proyectos en producción' },
  { value: '15d', label: 'de idea a live' },
] as const

export function TecnologiasContent() {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef({ x: -1, y: -1, active: false })
  const prefersReducedMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'
  const ctaTiltSpring = { stiffness: 88, damping: 19, mass: 0.82 }
  const tiltXTarget = useMotionValue(0)
  const tiltYTarget = useMotionValue(0)
  const glareXTarget = useMotionValue(50)
  const tiltX = useSpring(tiltXTarget, ctaTiltSpring)
  const tiltY = useSpring(tiltYTarget, ctaTiltSpring)
  const glareX = useSpring(glareXTarget, ctaTiltSpring)

  const ctaCardShadow = useTransform([tiltX, tiltY], ([rx, ry]) => {
    const x = rx as number
    const y = ry as number
    return isLight
      ? `0 ${12 + Math.abs(x) * 2}px ${36 + Math.abs(y) * 4}px rgba(15, 23, 42, 0.08), ${y * 1.5}px ${-x * 1.5}px 28px rgba(var(--color-primary-rgb), 0.12)`
      : `0 ${14 + Math.abs(x) * 3}px ${42 + Math.abs(y) * 5}px rgba(0, 0, 0, 0.55), ${y * 2}px ${-x * 2}px 38px rgba(var(--color-primary-rgb), 0.16)`
  })

  const ctaGlareGradient = useTransform(glareX, (gx) =>
    isLight
      ? `linear-gradient(118deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.05) ${gx}%, rgba(0,0,0,0.025) ${Math.min(gx + 11, 100)}%, rgba(0,0,0,0) ${Math.min(gx + 24, 100)}%)`
      : `linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) ${gx}%, rgba(255,255,255,0.06) ${Math.min(gx + 11, 100)}%, rgba(255,255,255,0) ${Math.min(gx + 24, 100)}%)`,
  )

  const ctaCardShadowStatic = isLight
    ? '0 12px 36px rgba(15, 23, 42, 0.08), 0 0 28px rgba(var(--color-primary-rgb), 0.12)'
    : '0 14px 42px rgba(0, 0, 0, 0.55), 0 0 38px rgba(var(--color-primary-rgb), 0.16)'
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
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className="font-mono text-[10px] font-bold tracking-[0.32em] uppercase"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    / Por qué estas herramientas
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 max-w-[120px]"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5), transparent)',
                    }}
                  />
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <Badge variant="primary">Stack 2026</Badge>
                  <Badge variant="outline">Full-Stack &amp; Mobile</Badge>
                  <Badge variant="outline">Production-ready</Badge>
                </div>

                {/* Headline editorial — escala dramática */}
                <h1 className="font-heading text-balance leading-[0.92] mb-7">
                  <span className="block text-4xl sm:text-6xl md:text-7xl font-extralight text-[var(--color-on-surface-variant)]">
                    Cada herramienta
                  </span>
                  <span className="block text-5xl sm:text-7xl md:text-[5.5rem] font-extrabold text-[var(--color-on-surface)] tracking-tight -mt-1">
                    es una decisión.
                  </span>
                  <span className="block text-4xl sm:text-6xl md:text-7xl font-extralight italic glow-text mt-2"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    no un capricho.
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
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
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

          {/* ── Marquee con nombres del stack ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 sm:mt-16 overflow-hidden border-y py-4"
            style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.12)' }}
            aria-hidden
          >
            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
              transition={
                prefersReducedMotion ? undefined : { duration: 28, repeat: Infinity, ease: 'linear' }
              }
            >
              {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((t, i) => (
                <div key={`${t.title}-${i}`} className="flex items-center gap-12 shrink-0">
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
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <TechCardsSection />

      <section className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionReveal>
            <div style={{ perspective: 1000 }}>
              <motion.div
                data-hover
                data-inspector-title="CTA final — tarjeta con inclinación 3D"
                data-inspector-desc="Pensala en tres capas: (1) Estructura: en pantallas grandes es una grilla de dos columnas — texto y badge a la izquierda, botones a la derecha; en móvil se apilan. (2) Estilo: borde tipo vidrio (`glass-border`) y fondo en degradado que mezcla el color de superficie del tema con un poco del primario, más un halo difuminado atrás. (3) Movimiento: al mover el mouse, medimos dónde está el puntero dentro de la tarjeta y aplicamos una rotación 3D suave en X e Y con resortes de Framer Motion (vuelta al neutro fluida); la sombra y el glare siguen esos valores. Si el sistema tiene “reducir movimiento”, no hay rotación, solo sombra tranquila. La aparición al hacer scroll la hace SectionReveal; los botones usan los mismos estilos `btn-tech` que en el resto del sitio (primario + contorno WhatsApp)."
                data-inspector-cat="Física · 3D"
                className="relative overflow-hidden rounded-3xl border p-7 sm:p-10"
                style={{
                  borderColor: 'var(--glass-border)',
                  background:
                    'linear-gradient(155deg, color-mix(in srgb, var(--color-surface-high) 92%, var(--color-primary) 8%) 0%, var(--color-surface-base) 100%)',
                  ...(prefersReducedMotion
                    ? {
                        transform: 'none',
                        boxShadow: ctaCardShadowStatic,
                      }
                    : {
                        rotateX: tiltX,
                        rotateY: tiltY,
                        translateZ: 0,
                        boxShadow: ctaCardShadow,
                        transformStyle: 'preserve-3d',
                      }),
                }}
                onMouseMove={(e) => {
                  if (prefersReducedMotion) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1
                  const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1
                  const maxTilt = 6
                  tiltXTarget.set(relY * -maxTilt)
                  tiltYTarget.set(relX * maxTilt)
                  glareXTarget.set(((e.clientX - rect.left) / rect.width) * 100)
                }}
                onMouseLeave={() => {
                  tiltXTarget.set(0)
                  tiltYTarget.set(0)
                  glareXTarget.set(50)
                }}
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background: prefersReducedMotion
                      ? isLight
                        ? 'linear-gradient(118deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.025) 61%, rgba(0,0,0,0) 74%)'
                        : 'linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 61%, rgba(255,255,255,0) 74%)'
                      : ctaGlareGradient,
                    opacity: prefersReducedMotion ? (isLight ? 0.45 : 0.35) : isLight ? 0.55 : 0.7,
                    transition: 'opacity 260ms ease',
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full opacity-60 blur-3xl"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.26)' }}
                />
                <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                  <div>
                    <Badge variant="outline" className="mb-3">
                      Siguiente paso
                    </Badge>
                    <h2 className="font-heading text-balance text-2xl font-bold text-[var(--color-on-surface)] sm:text-3xl md:text-4xl">
                      Llevemos este stack a tu proyecto.
                    </h2>
                    <p className="mt-3 max-w-2xl text-pretty text-[var(--color-on-surface-variant)]">
                      Ya viste cómo funciona en la práctica. Si tenés una idea — web, app o los dos —
                      coordinamos una llamada y te propongo arquitectura, plazos y presupuesto sin rodeos.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                    <Link
                      href={ROUTES.contact}
                      className={cn(
                        'inline-flex items-center justify-center gap-2 font-semibold select-none',
                        'transition-all duration-200 ease-out',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                        'btn-tech btn-primary-tech active:scale-[0.97]',
                        'h-12 px-7 text-sm rounded-xl',
                      )}
                    >
                      Empezar mi proyecto
                      <ArrowRightIcon className="size-4" />
                    </Link>
                    <WhatsAppOutboundLink
                      waHref={whatsappUrl(WA_MSG_GENERIC)}
                      className={cn(
                        'inline-flex items-center justify-center gap-2 font-semibold select-none',
                        'transition-all duration-200 ease-out',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                        'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                        'h-12 px-7 text-sm rounded-xl',
                      )}
                    >
                      <WhatsAppIcon className="size-4" />
                      Escribirme por WhatsApp
                    </WhatsAppOutboundLink>
                  </div>
                </div>
              </motion.div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
