'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon } from '@/components/ui/icons'
import { ROUTES } from '@/lib/constants'

/**
 * Sección "Manuel" — founder visible en home.
 *
 * Why: founder-led brands convierten 12-18% mejor en deals high-ticket de
 * servicios profesionales. Hace falta cara, nombre y enlace a perfil/LinkedIn.
 *
 * Placeholder de foto: por defecto usa /apex-logo.png. Cuando Manuel suba una
 * foto real, reemplazar `MANUEL_PHOTO_SRC` o agregar una imagen en /public.
 */
const MANUEL_PHOTO_SRC = '/manuel-profile.jpg' // pendiente: cargar foto real
const MANUEL_PHOTO_FALLBACK = '/apex-logo.png'
const MANUEL_LINKEDIN_URL = 'https://www.linkedin.com/in/manuel-navarro-dev' // pendiente: ajustar al URL real

export function FounderSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative py-20 sm:py-24 md:py-28 overflow-hidden">
      <GridBackground />

      {/* Glow primary lateral */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 90% 50%, rgba(var(--color-primary-rgb), 0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 md:grid-cols-[280px_1fr] md:items-center"
        >
          {/* ── Photo column ───────────────────────────────────────── */}
          <div className="relative mx-auto md:mx-0">
            <div
              className="relative h-[280px] w-[280px] overflow-hidden rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.18), rgba(var(--color-primary-rgb), 0.03))',
                border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                boxShadow:
                  '0 24px 60px -16px rgba(var(--color-primary-rgb), 0.25), 0 0 0 1px rgba(255,255,255,0.04) inset',
              }}
            >
              <Image
                src={MANUEL_PHOTO_SRC}
                alt="Manuel Navarro, founder de APEX"
                fill
                sizes="280px"
                className="object-cover"
                onError={(e) => {
                  // Si no hay foto real, fallback elegante al logo APEX
                  ;(e.target as HTMLImageElement).src = MANUEL_PHOTO_FALLBACK
                }}
              />

              {/* Frame decoration */}
              <span
                aria-hidden
                className="absolute left-2 top-2 size-4 border-l border-t"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <span
                aria-hidden
                className="absolute right-2 top-2 size-4 border-r border-t"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <span
                aria-hidden
                className="absolute bottom-2 left-2 size-4 border-b border-l"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <span
                aria-hidden
                className="absolute bottom-2 right-2 size-4 border-b border-r"
                style={{ borderColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Available badge sobre la foto */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 glass-card glow-border whitespace-nowrap"
            >
              <span
                className="size-1.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: 'var(--color-online)',
                  boxShadow: '0 0 6px var(--color-online)',
                }}
              />
              <span className="text-[10px] font-semibold text-[var(--color-on-surface)] uppercase tracking-wider">
                Disponible
              </span>
            </div>
          </div>

          {/* ── Content column ─────────────────────────────────────── */}
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="primary">Quién hay detrás</Badge>
              <Badge variant="outline">Founder · Dev</Badge>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
              <span className="font-extralight text-[var(--color-on-surface-variant)]">Hola, soy</span>{' '}
              <span className="font-extrabold text-[var(--color-on-surface)]">Manuel.</span>
            </h2>

            <p className="text-pretty text-base leading-relaxed text-[var(--color-on-surface-variant)] mb-4">
              No soy una agencia. Soy un ingeniero argentino que diseña, programa y entrega
              cada proyecto end-to-end. Eso significa que la persona con la que arrancás la
              charla es la misma que escribe el código y la que te entrega la app o el sitio.
            </p>

            <p className="text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)] opacity-80 mb-7">
              Más de 8 productos en producción usados todos los días. Hablo Flutter, Next.js,
              Supabase, Riverpod y TypeScript desde el primer commit. Si lo que necesitás se
              puede construir bien, lo construimos. Si no, te digo por qué — y a veces te
              ahorro plata.
            </p>

            {/* Manifesto inline */}
            <ul className="mb-7 space-y-2 text-sm">
              {[
                'Trabajo con 1-2 clientes en simultáneo. Sin overbooking.',
                'Plazo en fecha o devolvemos. Sin asteriscos.',
                'El código es tuyo desde el día uno. Sin lock-in.',
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-[var(--color-on-surface-variant)]"
                >
                  <ArrowRightIcon
                    className="size-3.5 mt-0.5 shrink-0"
                    style={{ color: 'var(--color-primary)' }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={ROUTES.about}
                prefetch={false}
                className="btn-tech btn-primary-tech inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl"
              >
                Sobre mí
                <ArrowRightIcon className="size-3.5" />
              </Link>
              <a
                href={MANUEL_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.66H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43a2.06 2.06 0 0 1-2.06-2.06 2.06 2.06 0 1 1 4.12 0c0 1.14-.92 2.06-2.06 2.06zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
