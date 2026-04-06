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
        <SectionReveal>
          <div className="mb-8 flex justify-start">
            <div
              ref={hintRef}
              className="theme-transition relative inline-flex max-w-xl rounded-full p-px shadow-[0_10px_40px_-16px_rgba(var(--color-primary-rgb),0.55)] ring-1 ring-[rgba(var(--color-primary-rgb),0.12)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.55) 0%, rgba(var(--color-accent-rgb), 0.38) 48%, rgba(var(--color-primary-rgb), 0.28) 100%)',
              }}
            >
              <div className="relative flex w-full items-center gap-3.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-surface-low)_90%,transparent)] px-4 py-2.5 backdrop-blur-xl theme-transition dark:bg-[color-mix(in_srgb,var(--color-surface-low)_82%,transparent)] sm:px-5 sm:py-3">
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
                <p className="relative z-[2] text-pretty text-sm leading-snug text-[var(--color-on-surface-variant)] theme-transition">
                  Hacé click en una card para cambiar el tema de todo el sitio.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>

        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TECH_STACK.map((tech) => {
            const Icon = ICON_MAP[tech.themeId]
            const isActive = activeTheme === tech.themeId

            return (
              <div key={tech.themeId} data-tech-card>
                <GlowCard
                  active={isActive}
                  className={`h-full rounded-2xl ${pressedId === tech.themeId ? 'card-wave-pressed' : ''}`}
                  onClick={(e) => {
                    setPressedId(tech.themeId)
                    setTimeout(() => setPressedId(null), 400)
                    applyTheme(tech.themeId as ThemeId, e)
                  }}
                >
                  <div
                    className="w-full p-6 text-left md:p-8"
                    data-hover
                    data-inspector-title="Card con Cambio de Tema Global"
                    data-inspector-desc="Al hacer clic, toda la web cambia su paleta de colores con una ola animada desde el punto del click. El tema viaja por CSS Custom Properties en cascada hacia todos los componentes, sin recargar la página."
                    data-inspector-cat="Tema Dinámico"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className="tech-icon-box flex size-12 items-center justify-center rounded-xl theme-transition"
                        style={{
                          backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                          color: 'var(--color-primary)',
                          boxShadow: isActive ? '0 0 20px rgba(var(--color-primary-rgb), 0.20)' : 'none',
                        }}
                      >
                        {Icon ? <Icon className="size-6" /> : <span className="text-lg font-bold">?</span>}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORY_LABELS[tech.category]}
                      </Badge>
                    </div>

                    <h3 className="mb-1 text-xl font-bold text-[var(--color-on-surface)] theme-transition">
                      {tech.title}
                    </h3>
                    <p className="glow-text mb-3 text-sm font-medium text-[var(--color-primary)] theme-transition">
                      {tech.subtitle}
                    </p>

                    <p className="mb-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                      {tech.description}
                    </p>

                    <ul className="space-y-2">
                      {tech.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]"
                        >
                          <CheckIcon className="mt-0.5 size-4 flex-shrink-0 text-[var(--color-primary)] theme-transition" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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
