'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { TextReveal } from '@/components/ui/text-reveal'
import { GridBackground } from '@/components/ui/grid-background'
import { ParticleField, type MousePosition } from '@/components/ui/particle-field'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { trackGoogleAdsHeroCtaClick } from '@/lib/analytics/google-ads'
import Link from 'next/link'

const STAGGER_BASE = 0.08
const stagger = (i: number) => ({ delay: i * STAGGER_BASE })

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], ...stagger(i) },
  }),
}

/* ── Micro-icons for feature tags ── */
function TimerIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="9" r="5.5" />
      <path d="M8 6.5V9l1.5 1.5" />
      <path d="M5.5 1.5h5" />
      <path d="M8 1.5V3" />
    </svg>
  )
}

function PriceTagIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 1.5h4.5V6L8 11.5a1.5 1.5 0 0 1-2.12 0L2.5 8.12a1.5 1.5 0 0 1 0-2.12L8 1.5Z" />
      <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6.5l6-4.5 6 4.5L8 14 2 6.5Z" />
      <path d="M2 6.5h12" />
    </svg>
  )
}

/* Features shown on the right column — conversion-focused */
const FEATURES = [
  {
    icon: <TimerIcon />,
    tag: 'PLAZO',
    value: 'Entrega en 15 días',
    desc: 'Fecha acordada, fecha cumplida. Sin demoras.',
    inspectorTitle: 'Promesa de Entrega Rápida',
    inspectorDesc: 'Diferenciador clave: la mayoría de agencias tarda 2–3 meses. APEX entrega en 15 días con proceso ágil de iteración.',
    inspectorCat: 'Marketing · Conversión',
  },
  {
    icon: <PriceTagIcon />,
    tag: 'PRECIO',
    value: 'Desde ARS 300k',
    desc: 'Precios transparentes. Sin sorpresas al final.',
    inspectorTitle: 'Precio Visible desde el Primer Momento',
    inspectorDesc: 'Mostrar precio reduce la fricción: el visitante califica o descalifica solo, sin perder tiempo en reuniones iniciales.',
    inspectorCat: 'Marketing · Conversión',
  },
  {
    icon: <DiamondIcon />,
    tag: 'DISEÑO PREMIUM',
    value: 'Diseño premium',
    desc: 'Todo a medida. No templates, no rellenos.',
    inspectorTitle: 'Diseño premium a medida vs plantillas',
    inspectorDesc: 'Cada proyecto parte de cero: wireframe → diseño premium → código. Ninguna página APEX se parece a otra.',
    inspectorCat: 'Propuesta de Valor',
  },
]

/* ── Variant sets for FeatureCard — propagated from parent whileHover ── */
const featureCardVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.018, transition: { duration: 0.15, ease: 'easeOut' } },
}
const fillLineVariants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: { scaleX: 1, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
}

function FeatureCard({
  f,
}: {
  f: (typeof FEATURES)[number]
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg backdrop-blur-[20px] saturate-150"
      style={{
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
      initial="rest"
      whileHover="hover"
      variants={featureCardVariants}
      data-hover
      data-inspector-title={f.inspectorTitle}
      data-inspector-desc={f.inspectorDesc}
      data-inspector-cat={f.inspectorCat}
    >
      {/* ── Dot grid — da textura "HUD" al fondo ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
        aria-hidden="true"
      />

      {/* ── Radial glow desde arriba al hacer hover ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(var(--color-primary-rgb), 0.14), transparent)',
        }}
        aria-hidden="true"
      />

      {/* ── Left accent bar ── */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-px opacity-0 transition-opacity duration-200 group-hover:opacity-60"
        style={{ backgroundColor: 'var(--color-primary)' }}
        aria-hidden="true"
      />

      {/* ── Corner brackets ── */}
      <span
        className="pointer-events-none absolute left-2.5 top-2.5 size-3 border-l border-t opacity-25 transition-opacity duration-200 group-hover:opacity-90"
        style={{ borderColor: 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute right-2.5 top-2.5 size-3 border-r border-t opacity-25 transition-opacity duration-200 group-hover:opacity-90"
        style={{ borderColor: 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-2.5 left-2.5 size-3 border-b border-l opacity-25 transition-opacity duration-200 group-hover:opacity-90"
        style={{ borderColor: 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-2.5 right-2.5 size-3 border-b border-r opacity-25 transition-opacity duration-200 group-hover:opacity-90"
        style={{ borderColor: 'var(--color-primary)' }}
        aria-hidden="true"
      />

      {/* ── Bottom fill line ── */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left"
        style={{ backgroundColor: 'var(--color-primary)' }}
        variants={fillLineVariants}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative px-5 py-4">
        {/* Icon + monospace tag — reemplaza el contador 01/03 */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span
            className="opacity-50 transition-opacity duration-150 group-hover:opacity-100"
            style={{ color: 'var(--color-primary)' }}
          >
            {f.icon}
          </span>
          <p
            className="font-mono text-[9px] font-bold tracking-[0.18em] opacity-40 transition-opacity duration-150 group-hover:opacity-100"
            style={{ color: 'var(--color-primary)' }}
          >
            {f.tag}
          </p>
        </div>
        {/* Value */}
        <p className="text-sm font-bold text-[var(--color-on-surface)] mb-1">{f.value}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">{f.desc}</p>
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const heroCtaAnchorRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const particleMouseRef = useRef<MousePosition>({ x: -9999, y: -9999, active: false })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false)
  const [heroCtaVisible, setHeroCtaVisible] = useState(true)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [2, -2]), { stiffness: 150, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-2, 2]), { stiffness: 150, damping: 25 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
    particleMouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    particleMouseRef.current.active = false
  }, [])

  const handleCTAClick = useCallback(() => {
    trackGoogleAdsHeroCtaClick()
    openWhatsAppWithThankYouPage(whatsappUrl(WA_MSG_NAV), router)
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const onChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches)
    setIsMobileViewport(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)

    return () => {
      mediaQuery.removeEventListener('change', onChange)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const footer = document.getElementById('site-footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      { threshold: 0.01 }
    )

    observer.observe(footer)

    return () => {
      observer.disconnect()
    }
  }, [])

  /** Barra fija solo cuando el CTA principal ya no se ve — evita dos "Contame tu idea" a la vez. */
  useEffect(() => {
    if (!isMobileViewport) {
      setShowMobileStickyCta(false)
      return
    }
    setShowMobileStickyCta(!heroCtaVisible && !isFooterVisible)
  }, [heroCtaVisible, isFooterVisible, isMobileViewport])

  useEffect(() => {
    if (typeof window === 'undefined' || !isMobileViewport) return
    const el = heroCtaAnchorRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px 8px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isMobileViewport])

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="relative z-0 -mt-[calc(4rem+env(safe-area-inset-top,0px))] min-h-dvh flex items-center overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-base)',
        paddingTop:
          'calc(env(safe-area-inset-top, 0px) + 4rem + clamp(1.25rem, 3.5vw, 2rem))',
        paddingBottom: 'var(--section-py-hero)',
      }}
    >
      {/* ── Background layers ──────────────────────────────────────────── */}
      <GridBackground showScanline showRadialLight />

      <div
        className="pointer-events-none absolute inset-0"
        data-hover
        data-inspector-title="Campo de Partículas Reactivo"
        data-inspector-desc="300 partículas con física de repulsión en Canvas 2D puro — huyen del cursor calculando vectores a 60fps con requestAnimationFrame. Sin WebGL."
        data-inspector-cat="Animación"
      >
        <ParticleField
          externalMouse={particleMouseRef}
          particleCount={300}
          connectionDistance={152}
          mouseForce={1.45}
          mouseImpulseScale={0.58}
          returnDelayMs={3000}
          particleRadiusMin={1.05}
          particleRadiusMax={3.35}
          particleAlphaMin={0.3}
          particleAlphaMax={0.78}
          lineAlphaMax={0.28}
          lineWidth={1.1}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 35% at 50% -2%, rgba(var(--color-primary-rgb), 0.10), transparent 65%),
            radial-gradient(ellipse 40% 25% at 50% 0%, rgba(var(--color-accent-rgb), 0.06), transparent 55%)
          `,
        }}
      />

      {/* Structural decorative lines */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[15%] top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.06), transparent)' }}
        />
        <div
          className="absolute right-[30%] top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(var(--color-accent-rgb), 0.04), transparent)' }}
        />
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <motion.div
        style={isMobileViewport ? undefined : { rotateX, rotateY, perspective: 1200 }}
        className="relative mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6"
        data-hover
        data-inspector-title="Hero con Física de Spring"
        data-inspector-desc="Todo este bloque gira en 3D siguiendo tu mouse con física de resorte real — masa, amortiguación y velocidad por frame. Framer Motion."
        data-inspector-cat="Física · 3D"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-center"
        >
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="w-full min-w-0 max-w-none lg:max-w-xl">
            {/* Status badges */}
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-8 flex flex-wrap items-center gap-2"
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-card glow-border"
                data-hover
                data-inspector-title="Badge de Disponibilidad en Vivo"
                data-inspector-desc="Punto verde con pulse CSS puro. Borde glass morphism con backdrop-filter difuminando el fondo en tiempo real."
                data-inspector-cat="CSS · Ambiance"
              >
                <span
                  className="size-2 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--color-online)', boxShadow: '0 0 8px var(--color-online)' }}
                />
                <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                  Disponible para proyectos
                </span>
              </div>
              <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold">
                Diseño premium
              </Badge>
            </motion.div>

            {/* Heading — Oxanium weight contrast, reasonable size */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-heading text-balance leading-tight mb-6"
            >
              <span className="block text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-on-surface-variant)]">
                <TextReveal text="Tu negocio" delay={0.1} />
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
                <TextReveal text="en internet," delay={0.18} />
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-primary pb-1">
                <TextReveal text="hecho para vender." delay={0.26} />
              </span>
            </motion.h1>

            {/* Marketing tagline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-pretty text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-10"
            >
              Páginas web y apps móviles para emprendedores y pymes en Argentina.
              Diseño premium, entrega en 15 días y precios transparentes desde{' '}
              <span className="font-semibold text-[var(--color-on-surface)] tabular-nums">ARS 300k</span>.
            </motion.p>

            {/* CTAs — en móvil solo "Ver precios" a ancho completo; WhatsApp vía barra fija al scroll */}
            <motion.div
              ref={heroCtaAnchorRef}
              custom={3}
              variants={fadeUp}
              className="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:gap-4"
              data-hover
              data-inspector-title="Botones con Microinteracción Spring"
              data-inspector-desc="Escala spring al hover, press a 0.97 con 80ms para sensación de peso real. Framer Motion."
              data-inspector-cat="UX · Motion"
            >
              <button
                type="button"
                onClick={handleCTAClick}
                className={cn(
                  'inline-flex w-full shrink-0 items-center justify-center gap-2 font-semibold select-none lg:w-auto',
                  'transition-all duration-200 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  'btn-tech btn-primary-tech active:scale-[0.97]',
                  'min-h-12 px-7 py-3 text-sm rounded-xl',
                )}
                data-hover
              >
                <span className="text-center leading-snug">
                  Contame tu idea{' '}
                  <span className="opacity-70 font-normal">(15 min gratis)</span>
                </span>
                <ArrowRightIcon className="size-4 shrink-0" aria-hidden />
              </button>
              <Link href={ROUTES.servicios} className="w-full lg:w-auto">
                <button
                  type="button"
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 font-semibold select-none',
                    'transition-all duration-200 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                    'min-h-12 px-7 py-3 text-sm rounded-xl',
                  )}
                  data-hover
                >
                  Ver precios
                </button>
              </Link>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.p
              custom={4}
              variants={fadeUp}
              className="mt-5 text-xs text-[var(--color-on-surface-variant)] opacity-60"
            >
              Respondemos en menos de 2 horas · Sin compromiso
            </motion.p>
          </div>

          {/* ── Right column: tech feature cards ─────────────────── */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="hidden lg:flex flex-col gap-2.5"
          >
            {FEATURES.map((f) => (
              <FeatureCard key={f.value} f={f} />
            ))}

            {/* ── Stat row ── */}
            <div className="mt-1 grid grid-cols-3 gap-2">
              {[
                { value: '+15', label: 'Proyectos' },
                { value: '4.9', label: 'Rating' },
                { value: '15d', label: 'Entrega' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-md px-3 py-2.5 text-center stat-card-shine backdrop-blur-[20px] saturate-150"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                  }}
                  initial="rest"
                  whileHover="hover"
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.06, transition: { duration: 0.15, ease: 'easeOut' } } }}
                >
                  {/* Tiny corner brackets */}
                  <span className="pointer-events-none absolute left-1 top-1 size-2 border-l border-t opacity-20 transition-opacity duration-150 group-hover:opacity-80" style={{ borderColor: 'var(--color-primary)' }} aria-hidden="true" />
                  <span className="pointer-events-none absolute right-1 top-1 size-2 border-r border-t opacity-20 transition-opacity duration-150 group-hover:opacity-80" style={{ borderColor: 'var(--color-primary)' }} aria-hidden="true" />
                  <span className="pointer-events-none absolute bottom-1 left-1 size-2 border-b border-l opacity-20 transition-opacity duration-150 group-hover:opacity-80" style={{ borderColor: 'var(--color-primary)' }} aria-hidden="true" />
                  <span className="pointer-events-none absolute bottom-1 right-1 size-2 border-b border-r opacity-20 transition-opacity duration-150 group-hover:opacity-80" style={{ borderColor: 'var(--color-primary)' }} aria-hidden="true" />
                  <div className="relative text-sm font-extrabold text-[var(--color-on-surface)] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="relative text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={handleCTAClick}
        className={cn(
          '!fixed bottom-0 left-0 right-0 z-[100001] sm:hidden',
          'h-[52px] w-full rounded-none',
          'inline-flex items-center justify-center gap-2 px-4',
          'btn-primary-tech text-sm font-semibold',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
          showMobileStickyCta ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        initial={{ y: '100%' }}
        animate={{ y: showMobileStickyCta ? '0%' : '100%' }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!showMobileStickyCta}
        tabIndex={showMobileStickyCta ? 0 : -1}
      >
        Contame tu idea
        <ArrowRightIcon className="size-4" />
      </motion.button>
    </section>
  )
}
