'use client'

import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { TECH_STACK, type ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { GlowCard } from '@/components/ui/glow-card'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, FlutterIcon, NextjsIcon, SupabaseIcon, RiverpodIcon, TypeScriptIcon } from '@/components/ui/icons'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  flutter: FlutterIcon,
  nextjs: NextjsIcon,
  supabase: SupabaseIcon,
  riverpod: RiverpodIcon,
  typescript: TypeScriptIcon,
}

const CATEGORY_LABELS: Record<string, string> = {
  mobile: 'Mobile',
  web: 'Web',
  backend: 'Backend',
  architecture: 'Arquitectura',
  tooling: 'Herramientas',
}

/**
 * Resumen de negocio por tecnología — paráfrasis de los beneficios que ya
 * viven en TECH_STACK (lib/types/theme.ts). Cero claims nuevos.
 */
const BUSINESS_OUTCOMES: Record<string, string> = {
  flutter: 'Pagás un desarrollo, no dos.',
  nextjs: 'Google te encuentra. Tu web convierte.',
  supabase: 'Cero servidores que mantener.',
  riverpod: 'Crece sin reescribirse desde cero.',
  typescript: 'Cambios futuros más rápidos y baratos.',
}

/** Bento: las 2 piezas que el cliente "compra" (app y web) van grandes. */
const BENTO_SPANS = [
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-2',
  'lg:col-span-2',
  'sm:col-span-2 lg:col-span-2',
] as const

export function TechCardsSection() {
  const { activeTheme, applyTheme } = useApexTheme()
  const [pressedId, setPressedId] = React.useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const hintRef = useRef<HTMLDivElement>(null)
  const hintInView = useInView(hintRef, { amount: 0.6 })

  const gridRef = useRef<HTMLDivElement>(null)
  useGsapReveal(gridRef, {
    selector: '[data-tech-card]',
    y: 36,
    stagger: 0.09,
    start: 'top 82%',
  })

  return (
    <section className="relative pb-24 md:pb-32">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* ── Encabezado editorial ─────────────────────────────────────── */}
        <SectionReveal>
          <div className="relative mb-10 md:mb-12">
            {/* Stroke 0.12 solo en dark; en light hereda el 0.34 global (visible sobre porcelana) */}
            <span
              aria-hidden="true"
              className="section-number absolute -top-10 right-0 hidden md:block dark:[--sn-stroke-alpha:0.12]"
            >
              01
            </span>
            <p className="editorial-label mb-6">Qué gana tu negocio</p>
            <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl max-w-3xl mb-4">
              <span className="block text-[var(--color-on-surface-variant)]">Cinco piezas.</span>
              <strong className="block text-[var(--color-on-surface)]">
                Un solo criterio: tu negocio.
              </strong>
            </h2>
            <p className="text-pretty text-base text-[var(--color-on-surface-variant)] max-w-2xl">
              Cada card explica qué te aporta esa tecnología — en beneficios concretos,
              no en specs técnicas.
            </p>
          </div>
        </SectionReveal>

        {/* ── Hint: las cards cambian el tema del sitio ─────────────────── */}
        <SectionReveal>
          <div className="mb-8 flex justify-start">
            <div
              ref={hintRef}
              className="theme-transition relative inline-flex max-w-xl rounded-full p-px shadow-[0_2px_6px_rgba(24,32,60,0.06),0_10px_32px_-14px_rgba(var(--color-primary-rgb),0.38)] dark:shadow-[0_10px_40px_-16px_rgba(var(--color-primary-rgb),0.55)] ring-1 ring-[rgba(var(--color-primary-rgb),0.12)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.55) 0%, rgba(var(--color-accent-rgb), 0.38) 48%, rgba(var(--color-primary-rgb), 0.28) 100%)',
              }}
            >
              <div className="relative flex w-full items-center gap-3.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-surface-low)_90%,transparent)] px-5 py-3.5 backdrop-blur-xl theme-transition dark:bg-[color-mix(in_srgb,var(--color-surface-low)_82%,transparent)] sm:px-6 sm:py-4">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-0 z-[1] h-px rounded-full bg-gradient-to-r from-transparent via-[rgba(var(--color-primary-rgb),0.35)] to-transparent"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-1/4 top-1/2 z-0 h-24 w-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-2xl theme-transition dark:opacity-[0.12]"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(var(--color-primary-rgb), 1) 0%, transparent 70%)',
                  }}
                />
                <span aria-hidden className="relative z-[2] flex size-[22px] shrink-0 items-center justify-center">
                  {!prefersReducedMotion && hintInView ? (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-[rgba(var(--color-primary-rgb),0.45)]"
                      animate={{ scale: [1, 1.28, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    />
                  ) : null}
                  <span
                    className="relative size-2 rounded-full shadow-[0_0_14px_rgba(var(--color-primary-rgb),0.75),0_0_4px_rgba(var(--color-accent-rgb),0.45)] ring-1 ring-inset ring-white/30 theme-transition"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, var(--color-primary) 42%, color-mix(in srgb, var(--color-primary) 65%, black) 100%)',
                    }}
                  />
                </span>
                <p className="relative z-[2] text-pretty text-base sm:text-lg leading-snug theme-transition">
                  <strong
                    className="font-heading font-extrabold glow-text"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Tocá una card
                  </strong>{' '}
                  <span className="font-medium text-[var(--color-on-surface)]">
                    — el sitio entero cambia de tema.
                  </span>{' '}
                  <span className="text-sm text-[var(--color-on-surface-variant)]">
                    En vivo, sin recargar.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* ── Bento de tech cards (glassmorphism + glow preservados) ────── */}
        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {TECH_STACK.map((tech, index) => {
            const Icon = ICON_MAP[tech.themeId]
            const isActive = activeTheme === tech.themeId
            const isFeatured = index < 2
            const features = isFeatured ? tech.features : tech.features.slice(0, 3)
            const outcome = BUSINESS_OUTCOMES[tech.themeId]

            const activate = (e?: React.MouseEvent | null) => {
              setPressedId(tech.themeId)
              window.setTimeout(() => setPressedId(null), 400)
              applyTheme(tech.themeId as ThemeId, e)
            }

            return (
              <div
                key={tech.themeId}
                data-tech-card
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Aplicar el tema ${tech.title} a todo el sitio`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    activate(null)
                  }
                }}
                className={`rounded-2xl outline-none
                  focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
                  ${BENTO_SPANS[index] ?? 'lg:col-span-2'}`}
              >
                <GlowCard
                  active={isActive}
                  className={`h-full rounded-2xl ${pressedId === tech.themeId ? 'card-wave-pressed' : ''}`}
                  onClick={(e) => activate(e)}
                >
                  <div
                    className="flex h-full w-full flex-col p-6 text-left md:p-8"
                    data-hover
                    data-inspector-title="Card con Cambio de Tema Global"
                    data-inspector-desc="Al hacer clic, toda la web cambia su paleta de colores con una ola animada desde el punto del click. El tema viaja por CSS Custom Properties en cascada hacia todos los componentes, sin recargar la página."
                    data-inspector-cat="Tema Dinámico"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className={`tech-icon-box flex size-12 items-center justify-center rounded-xl theme-transition ${
                          isActive
                            ? 'shadow-[0_1px_3px_rgba(24,32,60,0.08),0_4px_14px_-4px_rgba(var(--color-primary-rgb),0.30)] dark:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.20)]'
                            : ''
                        }`}
                        style={{
                          backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {Icon ? <Icon className="size-6" /> : <span className="text-lg font-bold">?</span>}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORY_LABELS[tech.category]}
                      </Badge>
                    </div>

                    <h3
                      className={`mb-1 font-bold text-[var(--color-on-surface)] theme-transition ${
                        isFeatured ? 'text-2xl' : 'text-xl'
                      }`}
                    >
                      {tech.title}
                    </h3>
                    <p className="glow-text mb-3 text-sm font-medium text-[var(--color-primary)] theme-transition">
                      {tech.subtitle}
                    </p>

                    <p className="mb-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                      {tech.description}
                    </p>

                    <ul className="space-y-2">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]"
                        >
                          <CheckIcon className="mt-0.5 size-4 flex-shrink-0 text-[var(--color-primary)] theme-transition" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Resumen de negocio — el "para qué" en una línea */}
                    {outcome ? (
                      <div className="mt-auto pt-5">
                        <div
                          aria-hidden
                          className="mb-3 h-px"
                          style={{
                            background:
                              'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.3), transparent)',
                          }}
                        />
                        <p
                          className="text-sm font-semibold theme-transition"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          → {outcome}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </GlowCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
