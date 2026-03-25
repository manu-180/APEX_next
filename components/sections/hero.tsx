'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { TextReveal, TypeWriter } from '@/components/ui/text-reveal'
import { GridBackground } from '@/components/ui/grid-background'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@/components/ui/icons'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [3, -3]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-3, 3]), { stiffness: 150, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <GridBackground />

      {/* Floating grid lines — subtle decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      <motion.div
        style={{ rotateX, rotateY, perspective: 1200 }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-surface-high px-4 py-1.5 bg-surface-low/50 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-online animate-pulse" />
          <span className="text-xs font-medium text-on-surface-variant">Disponible para nuevos proyectos</span>
        </motion.div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-on-surface mb-6">
          <TextReveal text="Desarrollo" delay={0.3} />
          <br />
          <span className="text-gradient-primary">
            <TextReveal text="Full-Stack & Mobile" delay={0.5} />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-on-surface-variant leading-relaxed mb-10"
        >
          Especializado en crear experiencias de usuario fluidas y eficientes.
          <br className="hidden sm:block" />
          Apps móviles con{' '}
          <span className="text-theme-flutter font-semibold">Flutter</span> y webs de alto rendimiento con{' '}
          <span className="text-on-surface font-semibold">Next.js</span>.
        </motion.p>

        {/* Terminal snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mx-auto mb-10 max-w-lg rounded-xl border border-surface-high bg-surface-lowest p-4 text-left font-mono text-sm"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="text-on-surface-variant">
            <span className="text-on-surface-variant/50">$</span>{' '}
            <TypeWriter text="npx create-apex-app --full-stack" delay={1.2} />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={ROUTES.contact}>
            <Button size="lg" variant="primary">
              Agendar consulta gratis
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={ROUTES.servicios}>
            <Button size="lg" variant="outline">Ver servicios</Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
