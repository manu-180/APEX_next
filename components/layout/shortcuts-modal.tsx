'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { SHORTCUTS } from '@/lib/constants'
import { EASE_OUT, STAGGER_TIGHT, DELAY_AFTER_PANEL } from '@/lib/motion'
import { XIcon } from '@/components/ui/icons'

interface ShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  const prefersReducedMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  // Escape para cerrar + focus trap dentro del modal.
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Mover foco al panel al abrir; devolverlo al disparador al cerrar.
  useEffect(() => {
    if (!open) return
    openerRef.current = (document.activeElement as HTMLElement) ?? null
    panelRef.current?.focus()
    return () => {
      const opener = openerRef.current
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [open])

  const navShortcuts = SHORTCUTS.filter((s) => s.group === 'nav')
  const actionShortcuts = SHORTCUTS.filter((s) => s.group === 'action')

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-modal-title"
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: EASE_OUT }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--scrim-bg)] backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.22,
              ease: EASE_OUT,
            }}
            className="relative z-10 w-full max-w-2xl rounded-2xl px-7 py-6 sm:px-8 outline-none glass-card glow-border dark:shadow-[0_0_40px_-10px_rgba(var(--color-primary-rgb),0.15),0_25px_50px_-12px_rgba(var(--shadow-tint-rgb),0.6)]"
          >
            <div className="flex items-center justify-between mb-6">
              {/* Contraste display (spec §10): thin Oxanium 200 + display extrabold */}
              <h2
                id="shortcuts-modal-title"
                className="text-lg text-[var(--color-on-surface)]"
              >
                <span className="font-extralight">Atajos de</span>{' '}
                <span className="font-heading font-extrabold">Teclado</span>
              </h2>
              <button
                onClick={onClose}
                aria-label="Cerrar atajos de teclado"
                className="flex size-9 items-center justify-center rounded-lg outline-none text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)] transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)]"
                data-hover
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {/* Navigation */}
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-primary)] opacity-70 mb-3">
                  Navegación
                </p>
                <div className="space-y-1">
                  {navShortcuts.map((s, i) => (
                    <ShortcutRow
                      key={s.label}
                      index={i}
                      shortcutKey={s.key}
                      label={s.label}
                      requiresAlt={'requiresAlt' in s && s.requiresAlt === true}
                      requiresShift={'requiresShift' in s && s.requiresShift === true}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-primary)] opacity-70 mb-3">
                  Acciones
                </p>
                <div className="space-y-1">
                  {actionShortcuts.map((s, i) => (
                    <ShortcutRow
                      key={s.label}
                      index={i}
                      shortcutKey={s.key}
                      label={s.label}
                      requiresAlt={'requiresAlt' in s && s.requiresAlt === true}
                      requiresShift={'requiresShift' in s && s.requiresShift === true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ShortcutRow({
  shortcutKey,
  label,
  requiresAlt,
  requiresShift,
  index,
}: {
  shortcutKey: string
  label: string
  requiresAlt?: boolean
  requiresShift?: boolean
  index: number
}) {
  const prefersReducedMotion = useReducedMotion()
  return (
    // Cascada de filas densas (spec §9): STAGGER_TIGHT tras el settle del panel.
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.12 }
          : { delay: DELAY_AFTER_PANEL + index * STAGGER_TIGHT, duration: 0.3, ease: EASE_OUT }
      }
      className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-[rgba(11,15,26,0.04)] dark:hover:bg-[rgba(255,255,255,0.03)] transition-colors"
    >
      <span className="text-sm text-[var(--color-on-surface-variant)]">{label}</span>
      <kbd className="flex flex-wrap items-center justify-end gap-1 text-xs font-mono shrink-0">
        <span className="kbd-key">Ctrl</span>
        <span className="text-[var(--color-on-surface-variant)] opacity-50">+</span>
        {requiresShift && (
          <>
            <span className="kbd-key">Shift</span>
            <span className="text-[var(--color-on-surface-variant)] opacity-50">+</span>
          </>
        )}
        {requiresAlt && (
          <>
            <span className="kbd-key">Alt</span>
            <span className="text-[var(--color-on-surface-variant)] opacity-50">+</span>
          </>
        )}
        <span className="kbd-key">{shortcutKey}</span>
      </kbd>
    </motion.div>
  )
}
