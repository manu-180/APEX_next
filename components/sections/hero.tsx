'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { TextReveal, TypeWriter } from '@/components/ui/text-reveal'
import { GridBackground } from '@/components/ui/grid-background'
import { ParticleField, type MousePosition } from '@/components/ui/particle-field'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import Link from 'next/link'

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const particleMouseRef = useRef<MousePosition>({ x: -9999, y: -9999, active: false })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [2, -2]), { stiffness: 150, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-2, 2]), { stiffness: 150, damping: 25 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
    particleMouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    particleMouseRef.current.active = false
  }, [])

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      {/* Layers: grid → particles → radial light */}
      <GridBackground showScanline showRadialLight />
      <div
        className="pointer-events-none absolute inset-0"
        data-hover
        data-inspector-title="Campo de Partículas Reactivo"
        data-inspector-desc="Las partículas del fondo te siguen en tiempo real usando física de repulsión. Cuando acercás el cursor, huyen calculando distancias y vectores 60 veces por segundo con requestAnimationFrame — todo en Canvas 2D puro, sin WebGL."
        data-inspector-cat="Animación"
      >
        <ParticleField externalMouse={particleMouseRef} particleCount={300} />
      </div>

      {/* Radial spotlight from top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 35% at 50% -2%, rgba(var(--color-primary-rgb), 0.10), transparent 65%),
            radial-gradient(ellipse 40% 25% at 50% 0%, rgba(6, 182, 212, 0.06), transparent 55%)
          `,
        }}
      />

      {/* Subtle decorative lines */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.06), transparent)' }}
        />
        <div
          className="absolute right-1/4 top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(var(--color-primary-rgb), 0.06), transparent)' }}
        />
        <div
          className="absolute top-1/3 left-0 w-full h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(6, 182, 212, 0.05), transparent)' }}
        />
      </div>

      <motion.div
        style={{ rotateX, rotateY, perspective: 1200 }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        data-hover
        data-inspector-title="Hero con Física de Spring"
        data-inspector-desc="Todo este bloque gira en 3D siguiendo tu mouse usando física de resorte real: tiene masa, amortiguación y velocidad calculada en cada frame. No es una curva fija — es un motor de física corriendo en tu navegador, impulsado por Framer Motion."
        data-inspector-cat="Física · 3D"
      >
        {/* Estado + sello de calidad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-card glow-border"
            data-hover
            data-inspector-title="Badge de Disponibilidad en Vivo"
            data-inspector-desc="El punto verde es un indicador de disponibilidad real — pulsa usando pura animación CSS (animate-pulse) sin JavaScript. El borde brillante que ves es un efecto glass morphism con backdrop-filter, que difumina lo que hay detrás en tiempo real."
            data-inspector-cat="CSS · Ambiance"
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--color-online)', boxShadow: '0 0 8px var(--color-online)' }}
            />
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
              Disponible para nuevos proyectos
            </span>
          </div>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold">
            Diseño premium
          </Badge>
        </motion.div>

        {/* Heading */}
        <h1 className="font-sans text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.18] sm:leading-[1.15] text-[var(--color-on-surface)] mb-6">
          <TextReveal text="Desarrollo" delay={0.3} />
          <br />
          <span className="text-gradient-primary inline-block pb-0.5">
            <TextReveal text="Full-Stack & Mobile" delay={0.5} />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--color-on-surface-variant)] leading-relaxed mb-10"
        >
          Especializado en crear experiencias fluidas, eficientes y con diseño premium.
          <br className="hidden sm:block" />
          Apps móviles con{' '}
          <span className="font-semibold" style={{ color: '#0175C2' }}>Flutter</span> y webs de alto rendimiento con{' '}
          <span className="text-[var(--color-on-surface)] font-semibold">Next.js</span>.
        </motion.p>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative mx-auto mb-10 max-w-lg overflow-hidden rounded-xl font-mono text-sm"
          data-hover
          data-inspector-title="Terminal con TypeWriter Animado"
          data-inspector-desc="El texto aparece letra por letra simulando una escritura en vivo. El efecto usa un delay calculado por carácter con Framer Motion. Las líneas de escaneo del fondo recrean la estética de monitores CRT en CSS puro — sin imágenes, solo gradientes repetidos."
          data-inspector-cat="Animación"
          style={{
            backgroundColor: 'var(--terminal-bg)',
            border: '1px solid var(--terminal-border)',
            boxShadow: '0 0 30px -10px rgba(var(--color-primary-rgb), 0.10)',
          }}
        >
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.1) 2px, rgba(6, 182, 212, 0.1) 4px)',
            }}
          />

          <div className="relative z-20 p-4 text-left">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-auto text-[10px] text-[var(--color-on-surface-variant)]/30 font-mono">bash</span>
            </div>
            <div className="text-[var(--color-on-surface-variant)]">
              <span style={{ color: 'rgba(6, 182, 212, 0.5)' }}>$</span>{' '}
              <TypeWriter text="npx create-apex-app --full-stack" delay={1.2} />
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          data-hover
          data-inspector-title="Botones con Microinteracción Spring"
          data-inspector-desc="Estos botones escalan y se elevan al hover usando spring physics de Framer Motion — la diferencia entre sentir que 'presionás' algo físico versus simplemente cambiar de color. El efecto 'press' al click usa una escala de 0.97 con duración de 80ms para dar sensación de peso real."
          data-inspector-cat="UX · Motion"
        >
          <a
            href={whatsappUrl(WA_MSG_NAV)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center justify-center gap-2 font-semibold select-none',
              'transition-all duration-300 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              'btn-tech btn-primary-tech active:scale-[0.97]',
              'h-13 px-8 text-base rounded-xl',
            )}
            data-hover
          >
            Agendar consulta gratis
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <Link href={ROUTES.servicios}>
            <Button size="lg" variant="outline">Ver servicios</Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
