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
import { useTheme } from 'next-themes'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { CircuitBoardBg } from '@/components/ui/circuit-board-bg'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'
import { WA_MSG_GENERIC, whatsappUrl } from '@/lib/whatsapp'
import { TechCardsSection } from './tech-cards-section'

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
        className="relative pt-20 pb-12 overflow-hidden"
        style={{
          opacity: headerOpacity,
          maskImage: headerMask,
          WebkitMaskImage: headerMask,
        }}
        data-hover
        data-inspector-title="Hero que respira con el scroll"
        data-inspector-desc="Cabecera de la página de tecnologías: se desvanece al bajar y el fondo de circuito reacciona al cursor, alineado con la estética de Servicios."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => {
          bgCursorRef.current = { x: -1, y: -1, active: false }
        }}
      >
        <GridBackground />
        <CircuitBoardBg cursorRef={bgCursorRef} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">Stack</Badge>
                <Badge variant="outline">Full-Stack &amp; Mobile</Badge>
              </div>
              <h1 className="font-heading text-balance leading-tight mb-4">
                <span className="block text-3xl sm:text-4xl md:text-5xl font-extralight text-[var(--color-on-surface-variant)]">
                  Mi stack
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
                  tecnológico.
                </span>
              </h1>
              <p className="text-pretty text-[var(--color-on-surface-variant)] max-w-xl">
                Cada herramienta cumple un rol específico. Estas son las tecnologías que uso para construir
                productos de clase mundial.
              </p>
            </div>
          </SectionReveal>
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
                      ¿Listo para construir?
                    </Badge>
                    <h2 className="font-heading text-balance text-2xl font-bold text-[var(--color-on-surface)] sm:text-3xl md:text-4xl">
                      Transformemos tu idea en un producto premium.
                    </h2>
                    <p className="mt-3 max-w-2xl text-pretty text-[var(--color-on-surface-variant)]">
                      Si ya viste cómo reacciona el sistema de temas, podemos llevar esa misma calidad a tu web o app.
                      Coordinamos una llamada y te propongo arquitectura, tiempos y roadmap.
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
                      Ir a contacto
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
