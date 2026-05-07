'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS as PROJECT_DATA, type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'
import { ProjectsHero } from '@/components/sections/projects-hero'
import { ProjectCardPremium } from '@/components/ui/project-card-premium'
import { ProjectDrawer } from '@/components/ui/project-drawer'
import { GridBackground } from '@/components/ui/grid-background'

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

      <ProjectDrawer
        project={selectedProject}
        open={selectedProject !== null}
        onClose={closeDrawer}
      />
    </>
  )
}
