'use client'

import { useState } from 'react'
import { CheckIcon, WhatsAppIcon } from '@/components/ui/icons'

/**
 * Acciones de compartir para que Manuel pase el link de reseñas a sus clientes.
 * Copiar al portapapeles (con feedback) + atajo a WhatsApp con mensaje pre-armado.
 */
export function ShareActions({ url, waMessage }: { url: string; waMessage: string }) {
  const [copied, setCopied] = useState(false)

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
          aria-live="polite"
          className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors
            hover:bg-[rgba(var(--color-primary-rgb),0.08)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          {copied ? (
            <span className="inline-flex items-center gap-1">
              <CheckIcon className="size-3.5" /> Copiado
            </span>
          ) : (
            'Copiar'
          )}
        </button>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-tech btn-primary-tech inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
      >
        <WhatsAppIcon className="size-4" />
        Compartir por WhatsApp
      </a>
    </div>
  )
}
