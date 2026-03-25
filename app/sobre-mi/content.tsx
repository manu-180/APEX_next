'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { CodeRainBg } from '@/components/ui/code-rain-bg'
import { ArrowRightIcon, CalendarIcon } from '@/components/ui/icons'
import { whatsappUrl, WA_MSG_ABOUT } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'

const SKILLS = [
  { label: 'Resolución de Problemas', icon: '\u{1F9E9}' },
  { label: 'Arquitectura Limpia', icon: '\u{1F4DA}' },
  { label: 'Constancia Diaria', icon: '\u{1F4C5}' },
  { label: 'Pensamiento Lógico', icon: '\u{1F9E0}' },
  { label: 'Enfoque en Resultados', icon: '\u{1F3AF}' },
  { label: 'Adaptabilidad', icon: '\u{1F527}' },
]

const YEARS_EXP = new Date().getFullYear() - 2021

const STATS = [
  { value: `${YEARS_EXP}+`, label: 'Años de experiencia' },
  { value: '15+', label: 'Proyectos creados' },
  { value: '8+', label: 'Tecnologías dominadas' },
  { value: '100%', label: 'Clientes satisfechos' },
]

export function SobreMiContent() {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef({ x: -1, y: -1, active: false })
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0])
  const headerMask = useTransform(scrollYProgress, [0.2, 0.8],
    ['linear-gradient(to bottom, black 80%, transparent 100%)',
     'linear-gradient(to bottom, black 0%, transparent 60%)']
  )

  return (
    <>
      {/* Hero header */}
      <motion.section
        ref={headerRef}
        className="relative pt-20 pb-12 overflow-hidden"
        style={{
          opacity: headerOpacity,
          maskImage: headerMask,
          WebkitMaskImage: headerMask,
        }}
        data-hover
        data-inspector-title="Hero que respira con el scroll"
        data-inspector-desc="Al hacer scroll, esta cabecera se desvanece y la máscara suaviza el borde inferior. El fondo de ‘lluvia de código’ reacciona al movimiento del mouse: las columnas brillan cerca del cursor, como una terminal cinematográfica."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => { bgCursorRef.current = { x: -1, y: -1, active: false } }}
      >
        <GridBackground />
        <CodeRainBg cursorRef={bgCursorRef} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <SectionReveal>
            <Badge variant="primary" className="mb-4">Sobre Mí</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-6">
              Manuel Navarro
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[rgba(var(--color-primary-rgb),0.12)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)]">
                <span className="text-xs">⚡</span> {YEARS_EXP} años de experiencia
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-high)] px-3 py-1.5 text-sm text-[var(--color-on-surface-variant)]">
                Full-Stack & Mobile
              </span>
              <Badge variant="outline" className="rounded-lg px-3 py-1.5 text-sm">
                Diseño premium
              </Badge>
            </div>
          </SectionReveal>
        </div>
      </motion.section>

      {/* Content */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Bio */}
          <SectionReveal delay={0.15}>
            <div
              className="rounded-2xl glass-card glow-border p-6 md:p-10 mb-8"
              data-hover
              data-inspector-title="Biografía en vidrio"
              data-inspector-desc="Bloque de texto principal con vidrio esmerilado y borde luminoso: la lectura queda centrada y el fondo no compite. Es contenido estático pero presentado con la misma estética tech del resto del sitio."
              data-inspector-cat="CSS · Ambiance"
            >
              <p className="text-base md:text-lg text-[var(--color-on-surface)] leading-relaxed mb-6">
                Programar es mucho más que tirar líneas de código, para mí es una disciplina de constancia
                diaria. Llevo {YEARS_EXP} años dedicándole cada día a entender cómo construir soluciones que
                realmente funcionen. Estoy convencido de que hoy no existen límites técnicos: cualquier idea
                se puede materializar si se tiene el compromiso de entender el problema y la destreza para
                construir la solución que el usuario realmente necesita.
              </p>
              <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                Considero que la verdadera brecha entre un programador junior y un arquitecto de software
                de alto nivel radica en la capacidad de resolución de problemas bajo cualquier circunstancia.
                Mi filosofía es clara: no existe desafío técnico que no tenga solución. He perfeccionado mi
                capacidad para desglosar problemas complejos mediante el uso estratégico de herramientas de
                vanguardia, transformando obstáculos críticos en procesos lógicos y ejecutables.
              </p>
            </div>
          </SectionReveal>

          {/* Stats */}
          <SectionReveal delay={0.25}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="stat-card-shine rounded-xl glass-card glow-border p-5 text-center"
                  data-hover
                  data-inspector-title={s.label}
                  data-inspector-desc="Cada tarjeta aparece al entrar en vista con un pequeño deslizamiento vertical; al pasar el mouse, un brillo diagonal muy sutil recorre la superficie (solo si el usuario no pidió reducir movimiento)."
                  data-inspector-cat="UX · Motion"
                >
                  <p className="relative z-10 text-2xl md:text-3xl font-extrabold text-[var(--color-primary)] shadow-glow-sm theme-transition mb-1">{s.value}</p>
                  <p className="relative z-10 text-xs text-[var(--color-on-surface-variant)]">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* Skills */}
          <SectionReveal delay={0.3}>
            <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-6">Habilidades clave</h2>
            <div className="flex flex-wrap gap-3 mb-16">
              {SKILLS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-2 rounded-xl glass-card px-4 py-2.5"
                  data-hover
                  data-inspector-title={s.label}
                  data-inspector-desc="Chip de habilidad con icono y texto: entra con un ligero zoom al hacer scroll para que la grilla no aparezca toda de golpe. Refuerza el mensaje sin saturar la pantalla."
                  data-inspector-cat="UX · Motion"
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="text-sm font-medium text-[var(--color-on-surface)]">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* CTA */}
          <SectionReveal delay={0.4}>
            <motion.div
              className="cta-tech-card relative rounded-2xl overflow-hidden p-8 md:p-12 text-center"
              whileHover={{ scale: 1.006 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              data-hover
              data-inspector-title="CTA estilo consola"
              data-inspector-desc="Orbes flotantes, malla, haces y esquinas tipo HUD envuelven el llamado a la acción. Al pasar el mouse, el bloque crece un pelo con resorte; el indicador ‘PROYECTO_SLOT’ pulsa como un LED de panel industrial."
              data-inspector-cat="3D · Glow"
            >
              {/* Floating orb lights */}
              <div className="cta-orb cta-orb-1" aria-hidden="true" />
              <div className="cta-orb cta-orb-2" aria-hidden="true" />
              <div className="cta-orb cta-orb-3" aria-hidden="true" />

              {/* Grid mesh */}
              <div className="cta-grid-mesh" aria-hidden="true" />

              {/* Accent beams */}
              <div className="cta-top-beam" aria-hidden="true" />
              <div className="cta-bottom-beam" aria-hidden="true" />

              {/* Corner dots */}
              <div className="cta-corner cta-corner-tl" aria-hidden="true" />
              <div className="cta-corner cta-corner-tr" aria-hidden="true" />
              <div className="cta-corner cta-corner-bl" aria-hidden="true" />
              <div className="cta-corner cta-corner-br" aria-hidden="true" />

              {/* HUD indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2" aria-hidden="true">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-hud-pulse"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span
                  className="text-[10px] font-mono tracking-wider animate-hud-pulse"
                  style={{ color: 'rgba(var(--color-primary-rgb), 0.6)', animationDelay: '0.4s' }}
                >
                  PROYECTO_SLOT: DISPONIBLE
                </span>
              </div>

              <motion.h2
                className="relative z-10 text-2xl md:text-3xl font-extrabold text-[var(--color-on-surface)] mb-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                ¿Listo para llevar tu proyecto al siguiente nivel?
              </motion.h2>
              <motion.p
                className="relative z-10 text-[var(--color-on-surface-variant)] mb-8 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              >
                Agendá una reunión gratuita y validamos tu idea con foco en resultados.
              </motion.p>
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
              >
                <a
                  href={whatsappUrl(WA_MSG_ABOUT)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  data-inspector-title="WhatsApp desde Sobre mí"
                  data-inspector-desc="Abre WhatsApp con un mensaje corto indicando que vienen de la página Sobre mí."
                  data-inspector-cat="UX"
                  className={cn(
                    'inline-flex items-center justify-center gap-2 font-semibold select-none',
                    'transition-all duration-300 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    'btn-tech btn-primary-tech active:scale-[0.97]',
                    'h-13 px-8 text-base rounded-xl',
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Agendar consulta gratis
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
