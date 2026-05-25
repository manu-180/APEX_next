'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { CASE_STUDIES } from '@/lib/data/case-studies'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
}

/**
 * Hero editorial 2026 para /proyectos.
 *
 * Mantiene el sistema de temas dinámicos (--color-primary cambia con cada
 * proyecto). Cambios respecto al anterior:
 * - Escala dramática del headline (clamp 3rem → 6.5rem)
 * - Asimetría intencional: titular left, stats column right
 * - Marquee sutil con los nombres de los proyectos como teaser
 * - Decoración geométrica: número de sección + barras verticales animadas
 * - Glow primary más intenso desde la esquina superior izquierda
 */
export function ProjectsHero(): JSX.Element {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-40 pb-12 md:pb-16 overflow-hidden">
      <GridBackground showRadialLight showScanline />

      {/* Glow primary editorial — viene desde top-left, no centrado */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 15% -5%, rgba(var(--color-primary-rgb), 0.18), transparent 60%)',
        }}
      />

      {/* Barras verticales decorativas con accent del tema */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="absolute left-[6%] top-0 h-full w-px origin-top"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.18), transparent)',
          }}
        />
        <motion.div
          initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="absolute right-[8%] top-0 h-full w-px origin-top"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.08), transparent)',
          }}
        />
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.16), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"
          data-motion
        >
          {/* ── Left column: title + tagline ────────────────────────── */}
          <div className="max-w-3xl">
            {/* Número de sección editorial */}
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-6 flex items-center gap-3"
            >
              <span
                className="font-mono text-[10px] font-bold tracking-[0.32em] uppercase"
                style={{ color: 'var(--color-primary)' }}
              >
                / Portfolio · 2024–2026
              </span>
              <span
                aria-hidden
                className="h-px flex-1 max-w-[120px]"
                style={{
                  background:
                    'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5), transparent)',
                }}
              />
            </motion.div>

            {/* Badges */}
            <motion.div
              custom={1}
              variants={fadeUp}
              className="mb-6 flex flex-wrap items-center gap-2"
            >
              <Badge variant="primary">{CASE_STUDIES.length} productos</Badge>
              <Badge variant="outline">En producción</Badge>
              <Badge variant="outline">Argentina</Badge>
            </motion.div>

            {/* Headline editorial — escala dramática, mezcla de pesos extrema */}
            <h1
              className="font-heading text-balance leading-[0.92] mb-7"
              data-hover
              data-inspector-title="Hero editorial 2026"
              data-inspector-desc="Asimetría intencional + mezcla de pesos thin/extrabold + escala dramática del headline. El número de sección y las barras verticales dan rítmica editorial."
              data-inspector-cat="Tipografía · Layout"
            >
              <motion.span custom={2} variants={fadeUp} className="block">
                <span className="text-4xl sm:text-6xl md:text-7xl font-extralight text-[var(--color-on-surface-variant)]">
                  Cosas que
                </span>
              </motion.span>
              <motion.span custom={3} variants={fadeUp} className="block -mt-1">
                <span className="text-5xl sm:text-7xl md:text-[5.5rem] font-extrabold text-[var(--color-on-surface)] tracking-tight">
                  construí.
                </span>
              </motion.span>
              <motion.span custom={4} variants={fadeUp} className="block mt-2">
                <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[var(--color-on-surface)]">
                  Funcionan.
                </span>{' '}
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-extralight glow-text italic"
                  style={{ color: 'var(--color-primary)' }}
                >
                  dan plata.
                </span>
              </motion.span>
            </h1>

            {/* Tagline */}
            <motion.p
              custom={5}
              variants={fadeUp}
              className="text-pretty text-base md:text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed"
            >
              4 productos vivos. Tres SaaS bootstrapeados y una plataforma. Cada caso
              completo abajo: el problema real, el enfoque técnico y lo que el cliente se llevó.
            </motion.p>
          </div>

          {/* ── Right column: stats verticales editoriales ─────────── */}
          <motion.aside
            custom={6}
            variants={fadeUp}
            className="lg:min-w-[200px]"
            aria-label="Métricas del portfolio"
          >
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
              {[
                { value: '4', label: 'Productos en producción' },
                { value: '3', label: 'SaaS bootstrapeados' },
                { value: '15d', label: 'Plazo de entrega promedio' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:border-l-2 lg:pl-4 lg:py-1"
                  style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.3)' }}
                >
                  <div
                    className="font-heading text-2xl lg:text-3xl font-extrabold tabular-nums"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] opacity-75 leading-tight mt-0.5">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        </motion.div>

        {/* ── Marquee sutil con nombres de proyectos ─────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 overflow-hidden border-y py-4"
          style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.12)' }}
          aria-hidden
        >
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={
              prefersReducedMotion
                ? undefined
                : { x: ['0%', '-50%'] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 32, repeat: Infinity, ease: 'linear' }
            }
          >
            {/* Doble loop para continuous scroll */}
            {[...CASE_STUDIES, ...CASE_STUDIES, ...CASE_STUDIES].map((cs, i) => (
              <div key={`${cs.slug}-${i}`} className="flex items-center gap-12 shrink-0">
                <span
                  className="font-heading text-2xl sm:text-3xl font-extrabold opacity-60"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {cs.title}
                </span>
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
