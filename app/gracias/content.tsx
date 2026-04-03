'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckIcon } from '@/components/ui/icons'
import { GridBackground } from '@/components/ui/grid-background'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function GraciasContent() {
  useEffect(() => {
    window.gtag?.('event', 'conversion', { send_to: 'AW-18041789644' })
    window.gtag?.('event', 'generate_lead', { value: 300000, currency: 'ARS' })
  }, [])

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      <GridBackground showScanline showRadialLight />

      <section className="relative z-10 w-full max-w-2xl rounded-2xl glass-card px-8 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full"
          style={{
            background: 'rgba(var(--color-primary-rgb), 0.15)',
            border: '1px solid rgba(var(--color-primary-rgb), 0.35)',
          }}
        >
          <CheckIcon className="size-8 text-[var(--color-primary)]" />
        </motion.div>

        <h1 className="font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
          ¡Listo! Recibimos tu consulta
        </h1>

        <p className="mx-auto mt-4 max-w-xl font-heading text-base text-[var(--color-on-surface-variant)] sm:text-lg">
          Te escribimos en menos de 2 horas por WhatsApp. Mientras tanto, conocé cómo trabajamos.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/servicios"
            className="btn-tech btn-primary-tech inline-flex h-12 w-full items-center justify-center rounded-xl px-7 text-sm font-semibold sm:w-auto"
          >
            Ver mis servicios
          </Link>
          <Link
            href="/"
            className="btn-tech btn-outline-tech inline-flex h-12 w-full items-center justify-center rounded-xl px-7 text-sm font-semibold text-[var(--color-primary)] sm:w-auto"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  )
}
