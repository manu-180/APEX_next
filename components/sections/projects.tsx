'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PROJECTS as PROJECT_DATA, type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { PROJECT_THUMB_SRC } from '@/lib/constants/project-thumbs'
import { useApexTheme } from '@/hooks/useTheme'
import { GlowCard } from '@/components/ui/glow-card'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import {
  ExternalLinkIcon,
  ArrowRightIcon,
  BotLodeIcon,
  AssistifyIcon,
  ContactEngineIcon,
  LumaInvitaIcon,
} from '@/components/ui/icons'
import { ProjectDrawer } from '@/components/ui/project-drawer'

const PROJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'contact-engine': ContactEngineIcon,
  'luma-invita': LumaInvitaIcon,
}

/* ────────────────────────────────────────────────────────────────────────
   Stagger animation — same rhythm as hero for visual coherence
   ──────────────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
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
        {/* ── Section header — LEFT-ALIGNED, asymmetric ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16 max-w-2xl"
          data-motion
        >
          <motion.div custom={0} variants={fadeUp} className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="primary">Proyectos</Badge>
            <Badge variant="outline">En producción</Badge>
          </motion.div>
          <motion.h2
            custom={1}
            variants={fadeUp}
            className="font-heading text-balance text-3xl sm:text-4xl md:text-5xl leading-tight mb-4"
          >
            <span className="font-extrabold text-[var(--color-on-surface)]">Productos reales</span>
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-pretty text-[var(--color-on-surface-variant)] max-w-lg"
          >
            Interfaz premium, usados por personas todos los días. Hacé clic para explorar el detalle y aplicar el tema del proyecto.
          </motion.p>
        </motion.div>

        {/* ── Cuatro cards misma altura — grilla 2×2 en desktop ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-motion
        >
          {PROJECT_DATA.map((project, i) => (
            <motion.div key={project.title} custom={3 + i} variants={fadeUp} className="min-h-0">
              <ProjectCard
                project={project}
                isActive={activeTheme === project.themeId}
                onApplyTheme={applyTheme}
                onOpenDrawer={openDrawer}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectDrawer
        project={selectedProject}
        open={selectedProject !== null}
        onClose={closeDrawer}
      />
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ProjectCard — adapts between "hero" (large) and "compact" (side) variants
   ──────────────────────────────────────────────────────────────────────── */
interface ProjectCardProps {
  project: ProjectItem
  isActive: boolean
  onApplyTheme: (themeId: ThemeId, e?: React.MouseEvent) => void
  onOpenDrawer: (project: ProjectItem) => void
}

function ProjectCard({ project, isActive, onApplyTheme, onOpenDrawer }: ProjectCardProps) {
  const Icon = PROJECT_ICONS[project.themeId]
  const thumbSrc = PROJECT_THUMB_SRC[project.themeId as ThemeId]
  const projectUrl = project.url
  const isInternalUrl = Boolean(projectUrl?.startsWith('/'))

  const linkClass =
    'flex size-9 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-colors duration-200'

  return (
    <GlowCard
      active={isActive}
      tiltIntensity={6}
      className="h-full min-h-[320px] rounded-2xl cursor-pointer"
      onClick={(e) => {
        onApplyTheme(project.themeId as ThemeId, e)
        onOpenDrawer(project)
      }}
    >
      <div
        className="p-6 md:p-8 h-full flex flex-col"
        data-hover
        data-inspector-title="Tarjeta 3D Magnética"
        data-inspector-desc="La tarjeta se inclina en 3D hacia el cursor y el brillo interno sigue el movimiento. El tema del proyecto se aplica al hacer clic."
        data-inspector-cat="3D · Glow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {thumbSrc ? (
              <div className="relative flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-high)] ring-1 ring-[var(--color-surface-highest)] theme-transition size-11 md:size-12">
                <Image
                  src={thumbSrc}
                  alt={project.title}
                  width={48}
                  height={48}
                  className="size-11 md:size-12 object-cover"
                />
              </div>
            ) : Icon ? (
              <div
                className="flex size-11 md:size-12 items-center justify-center rounded-xl theme-transition"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                  color: 'var(--color-primary)',
                }}
              >
                <Icon className="size-5 md:size-6" />
              </div>
            ) : null}
            <div>
              <h3 className="font-heading font-extrabold text-[var(--color-on-surface)] text-xl md:text-2xl">
                {project.title}
              </h3>
              <p className="text-xs md:text-sm font-medium theme-transition glow-text text-[var(--color-primary)]">
                {project.subtitle}
              </p>
            </div>
          </div>
          {projectUrl && isInternalUrl && (
            <Link
              href={projectUrl}
              onClick={(e) => e.stopPropagation()}
              className={linkClass}
              aria-label={`Abrir caso ${project.title} en APEX`}
              data-hover
              data-inspector-title="Vista caso en el sitio"
              data-inspector-desc="Navega al showcase del proyecto con el tema aplicado."
              data-inspector-cat="Navegación"
            >
              <ExternalLinkIcon className="size-4" />
            </Link>
          )}
          {projectUrl && !isInternalUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={linkClass}
              aria-label={`Ver ${project.title} en vivo`}
              data-hover
              data-inspector-title="Link Externo Seguro"
              data-inspector-desc="Abre el proyecto en pestaña nueva con rel=noopener noreferrer."
              data-inspector-cat="Seguridad"
            >
              <ExternalLinkIcon className="size-4" />
            </a>
          )}
        </div>

        {/* Tagline */}
        <p className="text-sm md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed mb-6 line-clamp-4 md:line-clamp-none">
          {project.tagline}
        </p>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {project.features.map((f) => (
              <div key={f.title} className="space-y-1">
                <div className="flex items-center gap-2">
                  <ArrowRightIcon className="size-3.5 text-[var(--color-primary)] theme-transition flex-shrink-0" />
                  <span className="text-xs md:text-sm font-semibold text-[var(--color-on-surface)]">{f.title}</span>
                </div>
                <p className="text-[11px] md:text-xs text-[var(--color-on-surface-variant)] leading-relaxed pl-5">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
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
            {project.themeId === 'assistify'
              ? 'App Store + Play Store'
              : project.themeId === 'luma-invita'
                ? 'Invitaciones · Web'
                : 'SaaS'}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-primary)] font-medium">
            Explorar
            <ArrowRightIcon className="size-3" />
          </span>
        </div>
      </div>
    </GlowCard>
  )
}
