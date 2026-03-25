'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SHORTCUTS } from '@/lib/constants'
import { XIcon } from '@/components/ui/icons'

interface ShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 z-[60] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-surface-high bg-surface-low p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Atajos de Teclado</h2>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors" data-hover>
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {SHORTCUTS.map((s) => (
                <div key={s.key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-high/50 transition-colors">
                  <span className="text-sm text-on-surface-variant">{s.label}</span>
                  <kbd className="flex items-center gap-1 text-xs font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-surface-highest text-on-surface-variant border border-surface-high/50">
                      Ctrl
                    </span>
                    <span className="text-on-surface-variant">+</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-highest text-on-surface-variant border border-surface-high/50">
                      {s.key}
                    </span>
                  </kbd>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-center text-on-surface-variant/60">
              Desactivados mientras escribís en un campo de texto
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
