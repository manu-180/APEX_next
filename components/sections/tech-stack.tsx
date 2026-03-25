'use client'

import React from 'react'
import { TECH_STACK, type ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'
import { GlowCard } from '@/components/ui/glow-card'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
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

export function TechStackSection() {
  const { activeTheme, applyTheme } = useApexTheme()
  const [pressedId, setPressedId] = React.useState<string | null>(null)

  return (
    <section id="stack" className="relative py-24 md:py-32">
      <GridBackground showRadialLight />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="primary">Tech Stack</Badge>
              <Badge variant="outline">Diseño premium</Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4">
              Tecnologías que domino
            </h2>
            <p className="mx-auto max-w-xl text-[var(--color-on-surface-variant)]">
              Cada herramienta cumple un rol específico. Apps con Flutter, webs con Next.js — misma exigencia de
              diseño premium y rendimiento en cada capa.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_STACK.map((tech, i) => {
            const Icon = ICON_MAP[tech.themeId]
            const isActive = activeTheme === tech.themeId

            return (
              <SectionReveal key={tech.themeId} delay={i * 0.08}>
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
                    className="w-full text-left p-6 md:p-8"
                    data-hover
                    data-inspector-title="Card con Cambio de Tema Global"
                    data-inspector-desc="Al hacer clic, toda la web cambia su paleta de colores con una ola animada desde el punto del click. El tema viaja por CSS Custom Properties en cascada hacia todos los componentes, sin recargar la página."
                    data-inspector-cat="Tema Dinámico"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="tech-icon-box flex h-12 w-12 items-center justify-center rounded-xl theme-transition"
                        style={{
                          backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                          color: 'var(--color-primary)',
                          boxShadow: isActive ? '0 0 20px rgba(var(--color-primary-rgb), 0.20)' : 'none',
                        }}
                      >
                        {Icon ? <Icon className="h-6 w-6" /> : <span className="text-lg font-bold">?</span>}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORY_LABELS[tech.category]}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-1 theme-transition">
                      {tech.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-primary)] mb-3 theme-transition glow-text">
                      {tech.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-5">
                      {tech.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {tech.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                          <CheckIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--color-primary)] theme-transition" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlowCard>
              </SectionReveal>
            )
          })}
        </div>

        <SectionReveal delay={0.5}>
          <p className="mt-8 text-center text-xs" style={{ color: 'var(--color-hint)' }}>
            Hacé click en una card para cambiar el tema de todo el sitio
          </p>
        </SectionReveal>
      </div>
    </section>
  )
}
