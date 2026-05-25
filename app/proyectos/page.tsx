'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PROJECTS as PROJECT_DATA, type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'
import { ProjectsHero } from '@/components/sections/projects-hero'
import { ProjectCardPremium } from '@/components/ui/project-card-premium'
import { ProjectDrawer } from '@/components/ui/project-drawer'
import { GridBackground } from '@/components/ui/grid-background'
import { CASE_STUDIES } from '@/lib/data/case-studies'
import { ArrowRightIcon } from '@/components/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

export default function ProyectosPage() {
  const { activeTheme, applyTheme } = useApexTheme()
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  const openDrawer = useCallback((project: ProjectItem) => {
    setSelectedProject(project)
  }, [])

  const closeDrawer = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <>
      <ProjectsHero />

      <section className="relative pb-24 md:pb-32">
        <GridBackground />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            data-motion
          >
            {PROJECT_DATA.map((project, i) => (
              <motion.div
                key={project.title}
                custom={i}
                variants={fadeUp}
                className="min-h-0"
              >
                <ProjectCardPremium
                  project={project}
                  isActive={activeTheme === project.themeId}
                  onApplyTheme={applyTheme}
                  onOpenDrawer={openDrawer}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Casos de estudio profundos ─ acceso crawlable + SEO ────────── */}
      <section className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 border"
            style={{
              backgroundColor: 'var(--color-surface-low)',
              borderColor: 'var(--glass-border)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="max-w-md">
                <span
                  className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-3"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Casos de estudio
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-2">
                  <span className="font-extralight text-[var(--color-on-surface-variant)]">
                    Lectura
                  </span>{' '}
                  profunda
                </h2>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  Cada proyecto tiene su caso completo: el problema real que resolvimos, el
                  enfoque técnico, el stack y lo que el cliente se llevó.
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:min-w-[320px]">
                {CASE_STUDIES.map((cs) => (
                  <li key={cs.slug}>
                    <Link
                      href={`/proyectos/${cs.slug}`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
                      style={{
                        backgroundColor: 'var(--color-surface-base)',
                        border: '1px solid var(--glass-border)',
                      }}
                    >
                      <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                        {cs.title}
                      </span>
                      <ArrowRightIcon
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: 'var(--color-primary)' }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <ProjectDrawer
        project={selectedProject}
        open={selectedProject !== null}
        onClose={closeDrawer}
      />
    </>
  )
}
