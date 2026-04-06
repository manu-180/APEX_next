'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { WHATSAPP_NUMBER } from '@/lib/constants'

const FALLBACK_WA = `https://wa.me/${WHATSAPP_NUMBER}`

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function WhatsAppIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function GraciasContent() {
  const searchParams = useSearchParams()
  const waParam = searchParams.get('wa')
  const waHref = waParam ? decodeURIComponent(waParam) : FALLBACK_WA

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    window.gtag?.('event', 'conversion', { value: 300000, currency: 'ARS' })
    window.gtag?.('event', 'generate_lead', { value: 300000, currency: 'ARS' })
  }, [])

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      <GridBackground showScanline showRadialLight />

      <section className="relative z-10 w-full max-w-lg text-center">

        {/* WhatsApp icon con glow pulsante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full"
          style={{
            background: 'rgba(37, 211, 102, 0.12)',
            border: '1.5px solid rgba(37, 211, 102, 0.4)',
            boxShadow: '0 0 32px rgba(37, 211, 102, 0.18)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <WhatsAppIcon className="size-12" style={{ color: '#25D366' }} />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          className="font-heading text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] sm:text-6xl"
        >
          ¡Gracias!
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-4 font-heading text-xl font-semibold text-[var(--color-primary)]"
        >
          Tomaste la decisión correcta.
        </motion.p>

        {/* Cuerpo */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--color-on-surface-variant)]"
        >
          WhatsApp ya debería estar abierto. Si no, usá el botón de abajo.
        </motion.p>

        {/* Separador */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mx-auto mt-8 h-px w-24 origin-center rounded-full"
          style={{ background: 'rgba(var(--color-primary-rgb), 0.3)' }}
        />

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 240, damping: 22 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-3 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
            }}
          >
            <WhatsAppIcon className="size-5" style={{ color: 'white' }} />
            Ir a WhatsApp ahora
          </a>

          <a
            href="/"
            className="btn-tech btn-outline-tech inline-flex h-11 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-[var(--color-primary)]"
          >
            <HomeIcon className="size-4" />
            Volver al inicio
          </a>
        </motion.div>

      </section>
    </main>
  )
}
