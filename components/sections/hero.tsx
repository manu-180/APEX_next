'use client'

import dynamic from 'next/dynamic'
import { useRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MousePosition } from '@/components/ui/particle-field'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { ROUTES, PROJECTS } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { whatsappUrl } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { trackGoogleAdsHeroCtaClick } from '@/lib/analytics/google-ads'
import { getAvailabilityText } from '@/lib/data/availability'
import Link from 'next/link'

const ParticleField = dynamic(
  () => import('@/components/ui/particle-field').then((m) => m.ParticleField),
  { ssr: false },
)

/**
 * Mensaje de WhatsApp contextual del hero (brief §1.2 y §5):
 * específico, voseo, 1-2 líneas, sin emojis, termina con pregunta.
 */
const WA_MSG_HERO =
  'Hola Manuel, tengo un negocio y quiero una web que venda. ¿Arrancamos con el boceto gratis?'

/* ── Micro-icons for feature tags ── */
function SketchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <path d="M2 6h12" />
      <path d="M5 9.5h4" />
      <path d="M5 12h6" />
    </svg>
  )
}

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

const FEATURES = [
  {
    icon: <SketchIcon />,
    tag: 'BOCETO',
    value: 'Gratis en 24-48 h',
    desc: 'Ves cómo queda tu web antes de pagar un peso. Si no te gusta, no pagás.',
  },
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
    desc: 'Precio cerrado por escrito desde el inicio, en 3 cuotas sin interés.',
  },
]

/** Strip de confianza — solo datos reales y verificables (brief §5). */
const TRUST_ITEMS = [
  'Respuesta en menos de 1 hora',
  'Boceto gratis en 24-48 h',
  'Productos propios en producción',
]

/** Productos propios online — prueba verificable, no claims. */
const LIVE_PRODUCTS = [
  { name: 'Handy', url: PROJECTS.handy },
  { name: 'Byluma Invita', url: PROJECTS.byluma },
  { name: 'Assistify', url: PROJECTS.assistify },
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
      {/* Light: el grid de puntos necesita más alpha sobre blanco; dark conserva 0.03/0.07 originales */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 group-hover:opacity-[0.12] dark:opacity-[0.03] dark:group-hover:opacity-[0.07]"
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
    // Conversión propia del hero (label distinto al de WhatsApp). El tracking
    // de WhatsApp + Meta vive centralizado en openWhatsAppWithThankYouPage.
    trackGoogleAdsHeroCtaClick()
    openWhatsAppWithThankYouPage(whatsappUrl(WA_MSG_HERO), router)
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

      {/* Light: hairlines verticales al doble de alpha (invisibles sobre porcelana);
          dark vuelve al valor original exacto vía opacity-50 (0.12·0.5=0.06 / 0.08·0.5=0.04) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[15%] top-0 h-full w-px dark:opacity-50"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)' }}
        />
        <div
          className="absolute right-[30%] top-0 h-full w-px dark:opacity-50"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(var(--color-accent-rgb), 0.08), transparent)' }}
        />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-center">
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="apex-hero-col-left w-full min-w-0 max-w-none lg:max-w-xl">
            {/* Eyebrow editorial con disponibilidad real (lib/data/availability) */}
            <p className="editorial-label editorial-label--primary mb-8">
              <span
                className="size-2 rounded-full animate-pulse motion-reduce:animate-none"
                style={{ backgroundColor: 'var(--color-online)', boxShadow: '0 0 8px var(--color-online)' }}
                aria-hidden="true"
              />
              {getAvailabilityText().text}
            </p>

            <h1 className="heading-display text-balance mb-6 text-4xl sm:text-5xl md:text-[3.4rem]">
              {/* --color-ink-strong: tinta reforzada en light (la línea fina se lava a 54px),
                  variant original en dark — token de foundation, sin hex locales */}
              <span className="block text-[var(--color-ink-strong)]">Tu negocio</span>
              <strong className="block text-[var(--color-on-surface)]">online y vendiendo</strong>
              <strong
                className="block bg-clip-text text-transparent pb-1"
                style={{
                  backgroundImage:
                    'linear-gradient(95deg, var(--color-on-surface) 35%, var(--color-primary) 105%)',
                }}
              >
                en 15 días.
              </strong>
            </h1>

            <p className="text-pretty text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-10">
              Webs y apps a medida para pymes y emprendedores argentinos — boceto gratis en
              24-48 h y precio cerrado desde{' '}
              <span className="font-semibold text-[var(--color-on-surface)] tabular-nums">ARS 300.000</span>.
            </p>

            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
              <button
                type="button"
                onClick={handleCTAClick}
                data-hover
                data-inspector-title="CTA primario WhatsApp"
                data-inspector-desc="Abre WhatsApp con mensaje contextual del hero y navega a /gracias. Riesgo invertido: pide el boceto gratis, no una compra."
                data-inspector-cat="Conversión"
                className={cn(
                  'group inline-flex w-full shrink-0 items-center justify-center gap-2.5 font-semibold select-none lg:w-auto',
                  'transition-[transform,box-shadow] duration-300 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  'btn-tech text-white hover:scale-[1.01] active:scale-[0.97]',
                  'min-h-12 pl-5 pr-7 py-2.5 text-sm rounded-xl',
                  WA_SHADOW_CLASS,
                )}
                style={{ background: WA_GRADIENT }}
              >
                {/* Button-in-button (spec §8.5): chip interior con el ícono */}
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/15 transition-[background-color,transform] duration-300 ease-out group-hover:translate-x-0.5 group-hover:bg-white/25 motion-reduce:transform-none"
                >
                  <WhatsAppIcon className="size-4 shrink-0" />
                </span>
                <span className="text-center leading-snug transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
                  Quiero mi boceto gratis{' '}
                  <span className="opacity-70 font-normal">(24-48 h)</span>
                </span>
              </button>
              <Link href={ROUTES.servicios} className="w-full lg:w-auto" prefetch={false}>
                <button
                  type="button"
                  className={cn(
                    'group inline-flex w-full items-center justify-center gap-2 font-semibold select-none',
                    'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    'btn-tech btn-outline-tech text-[var(--color-primary)]',
                    'min-h-12 px-7 py-3 text-sm rounded-xl',
                  )}
                >
                  Ver precios
                  <ArrowRightIcon
                    className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden
                  />
                </button>
              </Link>
            </div>

            {/* Strip de confianza — datos reales, sin métricas infladas */}
            <div className="mt-8">
              <div className="divider-theme mb-4" aria-hidden="true" />
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {TRUST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]"
                  >
                    <span
                      className="size-1 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right column ─────────────────── */}
          <div className="apex-hero-col-right hidden lg:flex flex-col gap-2.5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.value} f={f} />
            ))}

            {/* Productos propios online — prueba verificable, links reales */}
            <div
              className="mt-1 rounded-md px-4 py-3 backdrop-blur-[20px] saturate-150"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] opacity-60">
                Productos propios · online ahora
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {LIVE_PRODUCTS.map((p, i) => (
                  <span key={p.name} className="flex items-center gap-3">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]"
                    >
                      {p.name}
                    </a>
                    {i < LIVE_PRODUCTS.length - 1 && (
                      <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
