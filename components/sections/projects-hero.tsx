'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
}

export function ProjectsHero(): JSX.Element {
  return (
    <section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
      <GridBackground showRadialLight />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-3xl"
          data-motion
        >
          {/* Badges */}
          <motion.div custom={0} variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="primary">Portfolio</Badge>
            <Badge variant="outline">En producción</Badge>
          </motion.div>

          {/* Título */}
          <h1
            className="font-heading text-balance text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6"
            data-hover
            data-inspector-title="Hero asimétrico con contraste de pesos"
            data-inspector-desc="Tipografía Syne mezclando 200/300 (thin) con 800 (extrabold) en la misma frase. Layout left-aligned, no centrado."
            data-inspector-cat="Tipografía · Layout"
          >
            <motion.span custom={1} variants={fadeUp} className="block">
              <span className="font-light text-[var(--color-on-surface-variant)]">Cosas que </span>
              <span className="font-extrabold text-[var(--color-on-surface)]">construí.</span>
            </motion.span>
            <motion.span custom={2} variants={fadeUp} className="block">
              <span className="font-extrabold text-[var(--color-on-surface)]">Funcionan. </span>
              <span className="font-light text-[var(--color-primary)] glow-text">Dan plata.</span>
            </motion.span>
          </h1>

          {/* Subtítulo */}
          <motion.p
            custom={3}
            variants={fadeUp}
            className="text-pretty text-base md:text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed mb-6"
          >
            4 productos en producción usados todos los días. Cada uno tiene su propio tema visual
            — hacé clic en una card para aplicarlo y ver cómo cambia el sitio entero en tiempo real.
          </motion.p>

          {/* Stats */}
          <motion.ul
            custom={4}
            variants={fadeUp}
            role="list"
            className="flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <li className="text-xs font-medium text-[var(--color-on-surface-variant)] tabular-nums">
              4 productos
            </li>
            <li aria-hidden className="text-xs text-[var(--color-on-surface-variant)] opacity-40">·</li>
            <li className="text-xs font-medium text-[var(--color-on-surface-variant)] tabular-nums">
              3 SaaS · 1 plataforma
            </li>
            <li aria-hidden className="text-xs text-[var(--color-on-surface-variant)] opacity-40">·</li>
            <li className="text-xs font-medium text-[var(--color-on-surface-variant)] tabular-nums">
              Argentina · 2024-2026
            </li>
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
