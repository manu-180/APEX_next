'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { PROJECTS as PROJECT_DATA, type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { PROJECT_THUMB_SRC } from '@/lib/constants/project-thumbs'
import { useApexTheme } from '@/hooks/useTheme'
import { GlowCard } from '@/components/ui/glow-card'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ExternalLinkIcon, ArrowRightIcon, BotLodeIcon, AssistifyIcon, ContactEngineIcon } from '@/components/ui/icons'
import { ProjectDrawer } from '@/components/ui/project-drawer'

const PROJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'contact-engine': ContactEngineIcon,
}

export function ProjectsSection() {
  const { activeTheme, applyTheme } = useApexTheme()
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  const openDrawer = useCallback((project: ProjectItem) => {
    setSelectedProject(project)
  }, [])

  const closeDrawer = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <section id="proyectos" className="relative py-24 md:py-32">
      <GridBackground showRadialLight />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="primary">Proyectos</Badge>
              <Badge variant="outline">Diseño premium</Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4">
              Productos en producción
            </h2>
            <p className="mx-auto max-w-xl text-[var(--color-on-surface-variant)]">
              No son maquetas: productos reales, con interfaz y experiencia de diseño premium, usados por personas todos los días.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROJECT_DATA.map((project, i) => {
            const isActive = activeTheme === project.themeId
            const Icon = PROJECT_ICONS[project.themeId]
            const thumbSrc =
              PROJECT_THUMB_SRC[project.themeId as ThemeId]

            return (
              <SectionReveal key={project.title} delay={i * 0.1}>
                <GlowCard
                  active={isActive}
                  tiltIntensity={6}
                  className="h-full rounded-2xl cursor-pointer"
                  onClick={(e) => {
                    applyTheme(project.themeId as ThemeId, e)
                    openDrawer(project)
                  }}
                >
                  <div
                    className="p-6 md:p-8 h-full flex flex-col"
                    data-hover
                    data-inspector-title="Tarjeta 3D Magnética"
                    data-inspector-desc="La tarjeta se inclina en 3D hacia el cursor y el brillo interno sigue el movimiento. El tema del proyecto se aplica al hacer clic (junto con el panel de detalle)."
                    data-inspector-cat="3D · Glow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {thumbSrc ? (
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-high)] ring-1 ring-[var(--color-surface-highest)] theme-transition">
                            <Image
                              src={thumbSrc}
                              alt={project.title}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                        ) : Icon ? (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl theme-transition"
                            style={{
                              backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                              color: 'var(--color-primary)',
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        ) : null}
                        <div>
                          <h3 className="text-2xl font-bold text-[var(--color-on-surface)]">{project.title}</h3>
                          <p className="text-sm text-[var(--color-primary)] font-medium theme-transition glow-text">
                            {project.subtitle}
                          </p>
                        </div>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all duration-200"
                          data-hover
                          data-inspector-title="Link Externo Seguro"
                          data-inspector-desc="Este link abre el proyecto en una pestaña nueva con rel=noopener noreferrer — protección contra el ataque 'tabnabbing', donde una página externa podría redirigir tu pestaña original sin que lo notes. Invisible para el usuario, esencial para la seguridad."
                          data-inspector-cat="Seguridad"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
                      {project.tagline}
                    </p>

                    {/* Features */}
                    <div className="flex-1 space-y-4">
                      {project.features.map((f) => (
                        <div key={f.title}>
                          <div className="flex items-center gap-2 mb-1">
                            <ArrowRightIcon className="h-3.5 w-3.5 text-[var(--color-primary)] theme-transition" />
                            <span className="text-sm font-semibold text-[var(--color-on-surface)]">{f.title}</span>
                          </div>
                          <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed pl-5">
                            {f.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div
                      className="mt-6 pt-4 flex items-center justify-between"
                      style={{
                        borderTop: '1px solid',
                        borderImage: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent) 1',
                      }}
                    >
                      <Badge variant="default" className="text-[10px]">
                        {project.themeId === 'assistify' ? 'App Store + Play Store' : 'SaaS'}
                      </Badge>
                      <span className="text-xs" style={{ color: 'var(--color-hint)' }}>
                        Click para ver más
                      </span>
                    </div>
                  </div>
                </GlowCard>
              </SectionReveal>
            )
          })}
        </div>
      </div>

      <ProjectDrawer
        project={selectedProject}
        open={selectedProject !== null}
        onClose={closeDrawer}
      />
    </section>
  )
}
