'use client'

import { TECH_STACK, type ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'
import { TiltCard } from '@/components/ui/tilt-card'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, FlutterIcon, NextjsIcon, SupabaseIcon, RiverpodIcon, TypeScriptIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  flutter: FlutterIcon,
  nextjs: NextjsIcon,
  bolt: SupabaseIcon,
  'water-drop': RiverpodIcon,
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
  const { activeTheme, applyTheme, previewThemeFn } = useApexTheme()

  return (
    <section id="stack" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Tech Stack</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Tecnologías que domino
            </h2>
            <p className="mx-auto max-w-xl text-on-surface-variant">
              Cada herramienta cumple un rol específico. Apps móviles con Flutter,
              webs con Next.js — dos especialidades, una visión.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_STACK.map((tech, i) => {
            const Icon = ICON_MAP[tech.themeId === 'supabase' ? 'bolt' : tech.themeId === 'riverpod' ? 'water-drop' : tech.themeId]
            const isActive = activeTheme === tech.themeId

            return (
              <SectionReveal key={tech.themeId} delay={i * 0.08}>
                <TiltCard
                  className={cn(
                    'group h-full rounded-2xl border bg-surface-low/50 backdrop-blur-sm overflow-hidden transition-all duration-300',
                    isActive
                      ? 'border-primary/50 shadow-glow-sm'
                      : 'border-surface-high/50 hover:border-primary/30'
                  )}
                >
                  <button
                    onClick={() => applyTheme(tech.themeId as ThemeId)}
                    onMouseEnter={() => previewThemeFn(tech.themeId as ThemeId)}
                    onMouseLeave={() => previewThemeFn(null)}
                    className="w-full text-left p-6 md:p-8"
                    data-hover
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-12 text-primary theme-transition">
                        {Icon ? <Icon className="h-6 w-6" /> : <span className="text-lg font-bold">?</span>}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORY_LABELS[tech.category]}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-on-surface mb-1 theme-transition">
                      {tech.title}
                    </h3>
                    <p className="text-sm font-medium text-primary mb-3 theme-transition">
                      {tech.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
                      {tech.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {tech.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-on-surface-variant">
                          <CheckIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary theme-transition" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                </TiltCard>
              </SectionReveal>
            )
          })}
        </div>

        {/* Legend */}
        <SectionReveal delay={0.5}>
          <p className="mt-8 text-center text-xs text-on-surface-variant/50">
            Hacé click en una card para cambiar el tema de todo el sitio
          </p>
        </SectionReveal>
      </div>
    </section>
  )
}
