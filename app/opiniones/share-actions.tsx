'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { DUR_FAST, EASE_OUT } from '@/lib/motion'

/**
 * Acciones de compartir para que Manuel pase el link de reseñas a sus clientes.
 * Copiar al portapapeles (con feedback) + atajo a WhatsApp con mensaje pre-armado.
 */
export function ShareActions({ url, waMessage }: { url: string; waMessage: string }) {
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard no disponible — el link igual está visible para copiar a mano */
    }
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(waMessage)}`

  // Micro-swap Copiar/Copiado: transform+opacity only, rama reduced propia
  // (el nuke CSS no alcanza a Framer inline — spec §11).
  const swapInitial = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }
  const swapExit = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div
        className="flex flex-1 items-center gap-3 rounded-xl border px-4 py-3"
        style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--color-surface-base)' }}
      >
        <span className="flex-1 truncate text-sm text-[var(--color-on-surface)]">
          {url.replace(/^https?:\/\//, '')}
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-[var(--color-primary)] transition-[background-color,transform] duration-150
            hover:bg-[rgba(var(--color-primary-rgb),0.08)]
            active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={swapInitial}
                animate={{ opacity: 1, y: 0 }}
                exit={swapExit}
                transition={{ duration: DUR_FAST, ease: EASE_OUT }}
                className="inline-flex items-center gap-1"
              >
                <CheckIcon className="size-3.5" /> Copiado
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={swapInitial}
                animate={{ opacity: 1, y: 0 }}
                exit={swapExit}
                transition={{ duration: DUR_FAST, ease: EASE_OUT }}
                className="inline-block"
              >
                Copiar
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {/* Anuncio para lectores de pantalla, fuera del swap animado */}
        <span role="status" className="sr-only">
          {copied ? 'Link copiado al portapapeles' : ''}
        </span>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-tech btn-primary-tech inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold active:scale-[0.97]"
      >
        <WhatsAppIcon className="size-4" />
        Compartir por WhatsApp
      </a>
    </div>
  )
}
