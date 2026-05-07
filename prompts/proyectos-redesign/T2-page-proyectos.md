---
permissionMode: bypassPermissions
wave: 2
---

# T2 — Crear ruta `/proyectos` (page + layout)

## Prerrequisitos (deben estar mergeados antes)
- T1-routes-add-proyectos (ROUTES.proyectos disponible)
- T1-projects-hero (componente `ProjectsHero` existe)
- T1-project-card-premium (componente `ProjectCardPremium` existe)

## Objetivo
Crear la nueva ruta `/proyectos` que reemplaza la sección `<ProjectsSection>` que estaba en el home. Usa el hero premium nuevo + grid de cards premium nuevas. Mantiene el `<ProjectDrawer>` existente para el detalle al click.

## Archivos únicos a crear
- `app/proyectos/layout.tsx` (metadata SEO)
- `app/proyectos/page.tsx` (composición)

## `app/proyectos/layout.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyectos · APEX',
  description:
    '4 productos en producción: BotLode, Assistify, Contact Engine y Luma Invita. SaaS y apps reales construidas con Next.js, Flutter y Supabase.',
  openGraph: {
    title: 'Proyectos · APEX',
    description:
      'Productos reales en producción. SaaS, apps y plataformas construidas con Next.js, Flutter y Supabase.',
    type: 'website',
  },
}

export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

## `app/proyectos/page.tsx`

```tsx
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
```

## Notas
- El page es `'use client'` porque usa `useState`, `useApexTheme` y `<ProjectDrawer>` (interactivos). Esto está bien — el Hero también es client.
- **No** agregar `export const revalidate` en un componente con `'use client'` (Next 15 no lo soporta a nivel de page client). Si querés ISR, mover el contenido estático (Hero) a un Server Component padre y dejar solo el grid como Client Component. Para esta tarea, dejarlo como está (todo client en page).
- Si surge advertencia de Next sobre metadata en archivo client: el `metadata` va en `layout.tsx` (que es Server Component), no en `page.tsx`. Está resuelto.

## Verificación local
- Navegar a `http://localhost:3000/proyectos` debe renderizar:
  - Hero con las dos líneas de título asimétricas
  - Grid 2×2 con 4 cards premium
  - Click en card aplica tema + abre drawer detallado
  - Drawer cierra correctamente
- `npx tsc --noEmit` pasa
- `npm run lint` sin warnings nuevos

## NO hacer
- NO modificar `app/page.tsx` (eso es T2-home-remove-section)
- NO modificar `components/layout/navbar.tsx` (eso es T2-navbar-integrate)
- NO eliminar `components/sections/projects.tsx` (queda como código no referenciado; T3 puede flagear)
- NO duplicar tipos ni reescribir `useApexTheme`
