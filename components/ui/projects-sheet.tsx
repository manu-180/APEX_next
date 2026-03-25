'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, ExternalLinkIcon } from '@/components/ui/icons'
import type { ProjectItem, ThemeId } from '@/lib/types/theme'
import { useApexTheme } from '@/hooks/useTheme'

interface ProjectEntry {
  type: 'drawer'
  project: ProjectItem
  icon?: React.FC<{ className?: string }>
  /** Miniatura del proyecto (`PROJECT_THUMB_SRC` o vacío → icono). */
  thumbnailSrc?: string
}

interface ExternalEntry {
  type: 'external'
  name: string
  url: string
  imageSrc: string
}

type SheetEntry = ProjectEntry | ExternalEntry

export function ProjectsSheet({
  planName,
  entries,
  isOpen,
  onClose,
  onOpenProject,
}: {
  planName: string
  entries: SheetEntry[]
  isOpen: boolean
  onClose: () => void
  onOpenProject: (project: ProjectItem) => void
}) {
  const { applyTheme } = useApexTheme()

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleEscape])

  const hasEntries = entries.length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet — centrado, ancho máximo tipo bottom-sheet premium */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 380 }}
              className="pointer-events-auto w-full max-w-md sm:max-w-lg max-h-[min(60vh,520px)] overflow-hidden rounded-t-2xl sm:rounded-t-3xl glass-card shadow-[0_-12px_48px_-12px_rgba(0,0,0,0.45)]"
              style={{
                borderTop: '1px solid rgba(var(--color-primary-rgb), 0.3)',
              }}
            >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-[var(--color-on-surface-variant)] opacity-30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <p className="text-xs font-mono tracking-wider text-[var(--color-primary)] opacity-70 uppercase">
                  Proyectos
                </p>
                <h3 className="text-lg font-bold text-[var(--color-on-surface)]">
                  {planName}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-colors"
                data-hover
                data-inspector-title="Cerrar panel de proyectos"
                data-inspector-desc="Cierra el panel inferior y volvés a las tarjetas de planes. También podés usar la tecla Escape: el listener se engancha solo mientras el panel está abierto y se limpia al cerrar, sin fugas de memoria."
                data-inspector-cat="UX · Motion"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>

            {/* Content */}
            <div
              className="overflow-y-auto px-5 sm:px-6 pb-6 space-y-2"
              style={{ maxHeight: 'min(calc(60vh - 100px), 420px)' }}
            >
              {hasEntries ? (
                entries.map((entry, i) => {
                  if (entry.type === 'drawer') {
                    const Icon = entry.icon
                    const thumb = entry.thumbnailSrc
                    return (
                      <motion.button
                        key={entry.project.themeId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={(e) => {
                          applyTheme(entry.project.themeId as ThemeId, e)
                          onOpenProject(entry.project)
                        }}
                        className="w-full flex items-center gap-3 rounded-xl p-3 glass-card hover:glow-border transition-all text-left select-none"
                        data-hover
                        data-inspector-title={entry.project.title}
                        data-inspector-desc="Al tocar, el tema del sitio cambia al de este proyecto y se abre el cajón lateral con el detalle completo. Es la forma de ‘probar’ la identidad visual antes de contratar: el color y el acento viajan con vos."
                        data-inspector-cat="Motion · Spring"
                      >
                        {thumb ? (
                          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-high)] ring-1 ring-white/5">
                            <Image
                              src={thumb}
                              alt={entry.project.title}
                              width={36}
                              height={36}
                              className="h-9 w-9 object-cover"
                            />
                          </div>
                        ) : Icon ? (
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                            style={{
                              backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                              color: 'var(--color-primary)',
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                            {entry.project.title}
                          </p>
                          <p className="text-xs text-[var(--color-on-surface-variant)] truncate">
                            {entry.project.subtitle}
                          </p>
                        </div>
                        <ArrowRightIcon className="h-3.5 w-3.5 text-[var(--color-on-surface-variant)] flex-shrink-0" />
                      </motion.button>
                    )
                  }

                  return (
                    <motion.a
                      key={entry.name}
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="w-full flex items-center gap-3 rounded-xl p-3 glass-card hover:glow-border transition-all text-left select-none"
                      data-hover
                      data-inspector-title={entry.name}
                      data-inspector-desc="Enlace a un sitio real ya publicado: se abre en pestaña nueva con noopener para que el sitio externo no acceda a tu ventana. Ideal para ver el resultado final en vivo."
                      data-inspector-cat="Seguridad"
                    >
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-high)] ring-1 ring-white/5">
                        <Image
                          src={entry.imageSrc}
                          alt={entry.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                          {entry.name}
                        </p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">Ver proyecto</p>
                      </div>
                      <ExternalLinkIcon className="h-3.5 w-3.5 text-[var(--color-on-surface-variant)] flex-shrink-0" />
                    </motion.a>
                  )
                })
              ) : (
                <div
                  className="rounded-xl p-6 text-center"
                  style={{ border: '1px dashed rgba(var(--color-primary-rgb), 0.2)' }}
                  data-hover
                  data-inspector-title="Casos en preparación"
                  data-inspector-desc="Este plan todavía no tiene ejemplos enlazados en el panel: el borde punteado y el texto suave indican ‘próximamente’ sin romper el diseño. Cuando haya proyectos, aparecerán filas como las de arriba."
                  data-inspector-cat="UX · Motion"
                >
                  <p className="text-sm text-[var(--color-on-surface-variant)] opacity-60">
                    Próximamente
                  </p>
                </div>
              )}
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export type { SheetEntry }
