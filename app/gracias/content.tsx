'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { WhatsAppIcon, ArrowRightIcon } from '@/components/ui/icons'
import { GridBackground } from '@/components/ui/grid-background'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { ROUTES } from '@/lib/constants'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const NEXT_STEPS = [
  { step: '01', label: 'Enviás el mensaje', timing: 'Ahora mismo' },
  { step: '02', label: 'Te respondemos', timing: 'En menos de 2 hs' },
  { step: '03', label: 'Charlamos tu proyecto', timing: 'Sin compromiso' },
]

export function GraciasContent() {
  useEffect(() => {
    window.gtag?.('event', 'conversion', { send_to: 'G-TK45RZGM4F' })
  }, [])

  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      <GridBackground showScanline showRadialLight />

      {/* Top glow bloom */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] blur-[110px] opacity-[0.18]"
        style={{ background: 'rgba(var(--color-primary-rgb), 1)' }}
      />

      <div className="relative z-10 mx-auto max-w-md w-full">

        {/* ── Main card ─────────────────────────────────────────────── */}
        <motion.div
          className="relative glass-card rounded-2xl overflow-hidden text-center px-8 py-12 mb-4"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.9) 50%, transparent)' }}
          />

          {/* WhatsApp icon with pulse rings */}
          <motion.div
            className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: 'rgba(var(--color-primary-rgb), 0.1)',
              border: '1.5px solid rgba(var(--color-primary-rgb), 0.3)',
              boxShadow: '0 0 32px rgba(var(--color-primary-rgb), 0.15)',
            }}
            initial={{ scale: 0.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 270, damping: 20, delay: 0.12 }}
          >
            {/* Pulse ring 1 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(var(--color-primary-rgb), 0.35)' }}
              animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
            />
            {/* Pulse ring 2 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(var(--color-primary-rgb), 0.2)' }}
              animate={{ scale: [1, 1.75], opacity: [0.45, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1.1 }}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <WhatsAppIcon className="h-9 w-9 text-[var(--color-primary)]" />
            </motion.div>
          </motion.div>

          {/* Label */}
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.3 }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-primary)' }} />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Casi listo
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-primary)', animationDelay: '0.5s' }} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Se abrió WhatsApp.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-base font-semibold mb-1"
            style={{ color: 'var(--color-primary)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Solo tocá Enviar y arrancamos.
          </motion.p>

          <motion.p
            className="text-sm text-[var(--color-on-surface-variant)] mb-9 opacity-65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            El mensaje ya está escrito — no tenés que escribir nada.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.4 }}
          >
            <a
              href={whatsappUrl(WA_MSG_NAV)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-surface-base)',
                boxShadow: '0 0 28px rgba(var(--color-primary-rgb), 0.42), 0 4px 14px rgba(var(--color-primary-rgb), 0.2)',
              }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Ir a WhatsApp
            </a>

            <Link
              href={ROUTES.home ?? '/'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)]"
              style={{
                border: '1px solid rgba(var(--color-primary-rgb), 0.3)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
              Volver al inicio
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Qué pasa después ──────────────────────────────────────── */}
        <motion.div
          className="glass-card rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top micro-accent */}
          <div
            className="h-[1.5px] w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.4) 50%, transparent)' }}
          />

          <div className="px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-center mb-4"
               style={{ color: 'rgba(var(--color-primary-rgb), 0.45)' }}>
              Qué pasa después
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center">
              {NEXT_STEPS.map(({ step, label, timing }, i, arr) => (
                <div key={step} className="flex flex-col sm:flex-row items-center">
                  <div className="flex flex-col items-center text-center px-4 py-1">
                    <span
                      className="text-[10px] font-black tabular-nums mb-1 opacity-50"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {step}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-on-surface)] whitespace-nowrap">{label}</span>
                    <span
                      className="text-[10px] font-medium mt-0.5"
                      style={{ color: 'var(--color-primary)', opacity: 0.75 }}
                    >
                      {timing}
                    </span>
                  </div>

                  {i < arr.length - 1 && (
                    <div className="flex items-center my-2 sm:my-0 sm:mx-1">
                      <div
                        className="hidden sm:block w-5 h-px"
                        style={{ background: 'linear-gradient(90deg, rgba(var(--color-primary-rgb),0.2), rgba(var(--color-primary-rgb),0.5))' }}
                      />
                      <span
                        className="hidden sm:block text-sm select-none leading-none"
                        style={{ color: 'rgba(var(--color-primary-rgb), 0.45)' }}
                        aria-hidden
                      >
                        ›
                      </span>
                      <div
                        className="sm:hidden w-px h-4"
                        style={{ background: 'linear-gradient(180deg, rgba(var(--color-primary-rgb),0.2), rgba(var(--color-primary-rgb),0.5))' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Micro-copy */}
        <motion.p
          className="mt-5 text-[11px] text-center tracking-wide"
          style={{ color: 'rgba(var(--color-primary-rgb), 0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          Lunes a viernes 9-19 hs · Sin compromiso
        </motion.p>
      </div>
    </main>
  )
}
