'use client'

import Link from 'next/link'
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
 */
const YEARS_EXP = new Date().getFullYear() - 2021
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
          {/* ── Profile card column ───────────────────────────────── */}
          <div
            className="relative mx-auto md:mx-0 flex flex-col gap-4 w-full max-w-[280px] rounded-xl p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow:
                '0 24px 60px -16px rgba(var(--color-primary-rgb), 0.25), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            {/* Avatar + nombre */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative">
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center text-base font-bold select-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.28), rgba(6, 182, 212, 0.18))',
                    border: '2px solid rgba(var(--color-primary-rgb), 0.38)',
                    color: 'var(--color-primary)',
                  }}
                >
                  MN
                </div>
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 animate-pulse"
                  style={{
                    backgroundColor: 'var(--color-online)',
                    borderColor: 'var(--color-surface-low)',
                    boxShadow: '0 0 6px var(--color-online)',
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--color-on-surface)]">Manuel Navarro</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Full-Stack · Mobile</p>
              </div>
            </div>

            {/* Divisor */}
            <div
              className="h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.22), transparent)',
              }}
            />

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              {[
                { v: `${YEARS_EXP}+`, l: 'Años exp.' },
                { v: '150+', l: 'Proyectos' },
                { v: '100%', l: 'Satisfechos' },
                { v: '<2h', l: 'Respuesta' },
              ].map((s) => (
                <div key={s.l}>
                  <p
                    className="text-base font-extrabold glow-text"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {s.v}
                  </p>
                  <p className="text-[9px] leading-tight text-[var(--color-on-surface-variant)]">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            {/* Divisor */}
            <div
              className="h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.22), transparent)',
              }}
            />

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1 justify-center">
              {['Next.js', 'Flutter', 'Supabase'].map((t) => (
                <span
                  key={t}
                  className="rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold"
                  style={{
                    background: 'rgba(var(--color-primary-rgb), 0.08)',
                    color: 'rgba(var(--color-primary-rgb), 0.8)',
                    border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
                  }}
                >
                  {t}
                </span>
              ))}
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
