'use client'

import dynamic from 'next/dynamic'
import { useRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MousePosition } from '@/components/ui/particle-field'
import { TextReveal } from '@/components/ui/text-reveal'
import { GridBackground } from '@/components/ui/grid-background'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { trackGoogleAdsHeroCtaClick } from '@/lib/analytics/google-ads'
import { getAvailabilityText } from '@/lib/data/availability'
import Link from 'next/link'

const ParticleField = dynamic(
  () => import('@/components/ui/particle-field').then((m) => m.ParticleField),
  { ssr: false },
)

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

const FEATURES = [
  {
    icon: <TimerIcon />,
    tag: 'PLAZO',
    value: 'Entrega en 15 días',
    desc: 'Pactamos una fecha. La cumplimos. Sin excusas.',
  },
  {
    icon: <PriceTagIcon />,
    tag: 'PRECIO',
    value: 'Desde ARS 300k',
    desc: 'Precio cerrado desde el inicio. Lo que cotizamos, pagás.',
  },
  {
    icon: <DiamondIcon />,
    tag: 'DISEÑO',
    value: 'A medida, siempre',
    desc: 'Sin templates ni atajos. Todo pensado para tu marca.',
  },
]

function FeatureCard({ f }: { f: (typeof FEATURES)[number] }) {
  return (
    <div
      className="apex-feature-card group relative overflow-hidden rounded-lg backdrop-blur-[20px] saturate-150"
      style={{
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(var(--color-primary-rgb), 0.14), transparent)',
        }}
        aria-hidden="true"
      />
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
      <div className="relative px-5 py-4">
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
        <p className="text-sm font-bold text-[var(--color-on-surface)] mb-1">{f.value}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">{f.desc}</p>
      </div>
    </div>
  )
}

/**
 * Hero — render server-friendly:
 * - HTML completo se sirve estático (sin framer wrapper); LCP es el heading.
 * - Animaciones de entrada con CSS keyframes (no esperan hidratación).
 * - ParticleField se monta sólo post-idle (requestIdleCallback).
 */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const particleMouseRef = useRef<MousePosition>({ x: -9999, y: -9999, active: false })
  const [particlesReady, setParticlesReady] = useState(false)

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    particleMouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    particleMouseRef.current.active = false
  }, [])

  const handleCTAClick = useCallback(() => {
    trackGoogleAdsHeroCtaClick()
    openWhatsAppWithThankYouPage(whatsappUrl(WA_MSG_NAV), router)
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 768) return

    const ric = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number
    }).requestIdleCallback
    const trigger = () => setParticlesReady(true)
    if (typeof ric === 'function') {
      ric(trigger, { timeout: 2500 })
    } else {
      const t = window.setTimeout(trigger, 1500)
      return () => window.clearTimeout(t)
    }
  }, [])

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
      <GridBackground showScanline showRadialLight />

      {particlesReady && (
        <div className="pointer-events-none absolute inset-0">
          <ParticleField
            externalMouse={particleMouseRef}
            particleCount={150}
            connectionDistance={140}
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
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 35% at 50% -2%, rgba(var(--color-primary-rgb), 0.10), transparent 65%),
            radial-gradient(ellipse 40% 25% at 50% 0%, rgba(var(--color-accent-rgb), 0.06), transparent 55%)
          `,
        }}
      />

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

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-center">
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="apex-hero-col-left w-full min-w-0 max-w-none lg:max-w-xl">
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-card glow-border">
                <span
                  className="size-2 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--color-online)', boxShadow: '0 0 8px var(--color-online)' }}
                />
                <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                  {/* Scarcity real: el texto sale de CURRENT_AVAILABILITY (lib/data/availability) */}
                  {getAvailabilityText().text}
                </span>
              </div>
              <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold">
                Diseño premium
              </Badge>
            </div>

            <h1 className="font-heading text-balance leading-tight mb-6">
              <span className="block text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-on-surface-variant)]">
                <TextReveal text="Tu negocio" delay={0.1} />
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
                <TextReveal text="online en 15 días," delay={0.18} />
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-primary pb-1">
                <TextReveal text="listo para vender." delay={0.26} />
              </span>
            </h1>

            <p className="text-pretty text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-10">
              Páginas web y apps móviles para emprendedores y pymes argentinas que quieren vender más.
              Diseño premium, entrega garantizada en 15 días y precio cerrado desde{' '}
              <span className="font-semibold text-[var(--color-on-surface)] tabular-nums">ARS 300k</span>.
            </p>

            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
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
              >
                <span className="text-center leading-snug">
                  Contame tu idea{' '}
                  <span className="opacity-70 font-normal">(15 min gratis)</span>
                </span>
                <ArrowRightIcon className="size-4 shrink-0" aria-hidden />
              </button>
              <Link href={ROUTES.servicios} className="w-full lg:w-auto" prefetch={false}>
                <button
                  type="button"
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 font-semibold select-none',
                    'transition-all duration-200 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                    'min-h-12 px-7 py-3 text-sm rounded-xl',
                  )}
                >
                  Ver precios
                </button>
              </Link>
            </div>

            <p className="mt-5 text-xs text-[var(--color-on-surface-variant)] opacity-60">
              Respuesta en menos de 2 hs · Plazo garantizado o devolvemos · NDA disponible
            </p>
          </div>

          {/* ── Right column ─────────────────── */}
          <div className="apex-hero-col-right hidden lg:flex flex-col gap-2.5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.value} f={f} />
            ))}

            <div className="mt-1 grid grid-cols-3 gap-2">
              {[
                { value: '+150', label: 'Proyectos' },
                { value: '4.9', label: 'Rating' },
                { value: '15d', label: 'Entrega' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-md px-3 py-2.5 text-center stat-card-shine backdrop-blur-[20px] saturate-150"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
