'use client'

import { PROJECTS as PROJECT_DATA, type ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'
import { TiltCard } from '@/components/ui/tilt-card'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon, ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

export function ProjectsSection() {
  const { activeTheme, applyTheme, previewThemeFn } = useApexTheme()

  return (
    <section id="proyectos" className="relative py-24 md:py-32 bg-surface-lowest/50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Proyectos</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Productos en producción
            </h2>
            <p className="mx-auto max-w-xl text-on-surface-variant">
              No son maquetas. Son productos reales usados por personas reales todos los días.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROJECT_DATA.map((project, i) => {
            const isActive = activeTheme === project.themeId

            return (
              <SectionReveal key={project.title} delay={i * 0.1}>
                <TiltCard
                  tiltMax={6}
                  className={cn(
                    'group h-full rounded-2xl border overflow-hidden transition-all duration-300',
                    isActive
                      ? 'border-primary/50 bg-primary-8'
                      : 'border-surface-high/50 bg-surface-low/50 hover:border-primary/30'
                  )}
                >
                  <div
                    onMouseEnter={() => previewThemeFn(project.themeId as ThemeId)}
                    onMouseLeave={() => previewThemeFn(null)}
                    onClick={() => applyTheme(project.themeId as ThemeId)}
                    className="p-6 md:p-8 h-full flex flex-col"
                    data-hover
                    role="button"
                    tabIndex={0}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-on-surface mb-1">{project.title}</h3>
                        <p className="text-sm text-primary font-medium theme-transition">{project.subtitle}</p>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-8 transition-colors"
                          data-hover
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                      {project.tagline}
                    </p>

                    {/* Features */}
                    <div className="flex-1 space-y-4">
                      {project.features.map((f) => (
                        <div key={f.title}>
                          <div className="flex items-center gap-2 mb-1">
                            <ArrowRightIcon className="h-3.5 w-3.5 text-primary theme-transition" />
                            <span className="text-sm font-semibold text-on-surface">{f.title}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed pl-5">
                            {f.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer badge */}
                    <div className="mt-6 pt-4 border-t border-surface-high/30 flex items-center justify-between">
                      <Badge variant="default" className="text-[10px]">
                        {project.themeId === 'assistify' ? 'App Store + Play Store' : 'SaaS'}
                      </Badge>
                      <span className="text-xs text-on-surface-variant/50">
                        Click para cambiar tema
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
