'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHORTCUTS } from '@/lib/constants'
import { XIcon } from '@/components/ui/icons'

interface ShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, handleEscape])

  const navShortcuts = SHORTCUTS.filter((s) => s.group === 'nav')
  const actionShortcuts = SHORTCUTS.filter((s) => s.group === 'action')

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-[92vw] max-w-2xl rounded-2xl px-7 py-6 sm:px-8 glass-card glow-border"
            style={{
              boxShadow:
                '0 0 40px -10px rgba(var(--color-primary-rgb), 0.15), 0 25px 50px -12px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--color-on-surface)]">
                Atajos de Teclado
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
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
                  {navShortcuts.map((s) => (
                    <ShortcutRow
                      key={s.label}
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
                  {actionShortcuts.map((s) => (
                    <ShortcutRow
                      key={s.label}
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
}: {
  shortcutKey: string
  label: string
  requiresAlt?: boolean
  requiresShift?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-[rgba(255,255,255,0.03)] transition-colors">
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
    </div>
  )
}
