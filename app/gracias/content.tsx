'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckIcon, WhatsAppIcon, ArrowRightIcon } from '@/components/ui/icons'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { ROUTES } from '@/lib/constants'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function GraciasContent() {
  useEffect(() => {
    window.gtag?.('event', 'conversion', { send_to: 'G-TK45RZGM4F' })
  }, [])

  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 20%, rgba(var(--color-primary-rgb), 0.08), transparent 65%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Animated check circle */}
        <motion.div
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: 'rgba(var(--color-primary-rgb), 0.12)',
            border: '2px solid rgba(var(--color-primary-rgb), 0.4)',
            boxShadow: '0 0 40px rgba(var(--color-primary-rgb), 0.2)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <CheckIcon className="h-10 w-10 text-[var(--color-primary)]" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          ¡Recibimos tu consulta!
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: 'var(--color-primary)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          ¡Te respondemos en menos de 2 horas!
        </motion.p>

        <motion.p
          className="text-sm text-[var(--color-on-surface-variant)] mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          Revisá tu WhatsApp — te escribimos desde el mismo número.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
        >
          <a
            href={whatsappUrl(WA_MSG_NAV)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-semibold select-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] btn-tech btn-primary-tech active:scale-[0.97] h-12 px-7 text-base rounded-xl"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Mientras tanto, escribinos por WhatsApp
          </a>

          <Link
            href={ROUTES.home ?? '/'}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-semibold rounded-xl border border-[rgba(var(--color-primary-rgb),0.4)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:border-[rgba(var(--color-primary-rgb),0.7)] transition-all duration-200 select-none"
          >
            Volver al inicio
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </Link>
        </motion.div>

        {/* Micro-copy */}
        <motion.p
          className="mt-8 text-xs text-[var(--color-on-surface-variant)] opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          Lunes a viernes 9-19 hs · Sin compromiso
        </motion.p>
      </div>
    </main>
  )
}
