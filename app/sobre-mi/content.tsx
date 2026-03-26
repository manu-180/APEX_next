'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { CodeRainBg } from '@/components/ui/code-rain-bg'
import { TiltCard } from '@/components/ui/tilt-card'
import { ArrowRightIcon, CalendarIcon } from '@/components/ui/icons'
import { whatsappUrl, WA_MSG_ABOUT } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { cn } from '@/lib/utils/cn'

const SKILLS = [
  { label: 'Resolución de Problemas', icon: '🧩' },
  { label: 'Arquitectura Limpia', icon: '📚' },
  { label: 'Constancia Diaria', icon: '📅' },
  { label: 'Pensamiento Lógico', icon: '🧠' },
  { label: 'Enfoque en Resultados', icon: '🎯' },
  { label: 'Adaptabilidad', icon: '🔧' },
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
        data-inspector-desc="Al hacer scroll, esta cabecera se desvanece y la máscara suaviza el borde inferior. El fondo de lluvia de código reacciona al movimiento del mouse: las columnas brillan cerca del cursor, como una terminal cinematográfica."
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
              data-inspector-desc="Bloque de texto principal con vidrio esmerilado y borde luminoso: la lectura queda centrada y el fondo no compite."
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
                  data-inspector-desc="Cada tarjeta aparece al entrar en vista con un pequeño deslizamiento vertical; al pasar el mouse, un brillo diagonal recorre la superficie."
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
                  data-inspector-desc="Chip de habilidad: entra con un ligero zoom al hacer scroll para que la grilla no aparezca toda de golpe."
                  data-inspector-cat="UX · Motion"
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="text-sm font-medium text-[var(--color-on-surface)]">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* CTA — TiltCard con tilt sutil, sin linterna, con scan line tech */}
          <SectionReveal delay={0.4}>
            <TiltCard
              tiltMax={3}
              glowColor="rgba(0,0,0,0)"
              className="cta-tech-card rounded-2xl overflow-hidden"
            >
              {/* Floating orb lights */}
              <div className="cta-orb cta-orb-1" aria-hidden="true" />
              <div className="cta-orb cta-orb-2" aria-hidden="true" />
              <div className="cta-orb cta-orb-3" aria-hidden="true" />

              {/* Grid mesh — se intensifica en hover vía CSS */}
              <div className="cta-grid-mesh" aria-hidden="true" />

              {/* Scan line hover effect */}
              <div className="cta-scan-line" aria-hidden="true" />

              {/* Accent beams */}
              <div className="cta-top-beam" aria-hidden="true" />
              <div className="cta-bottom-beam" aria-hidden="true" />

              {/* Corner dots — pulsan más rápido en hover vía CSS */}
              <div className="cta-corner cta-corner-tl" aria-hidden="true" />
              <div className="cta-corner cta-corner-tr" aria-hidden="true" />
              <div className="cta-corner cta-corner-bl" aria-hidden="true" />
              <div className="cta-corner cta-corner-br" aria-hidden="true" />

              {/* HUD indicator */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2" aria-hidden="true">
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

              {/* Contenido principal */}
              <div
                className="relative z-20 p-8 md:p-10"
                data-hover
                data-inspector-title="CTA 3D con Tilt Parallax"
                data-inspector-desc="La card inclina muy sutilmente con física de resorte siguiendo al cursor. En hover: scan line que barre la tarjeta de arriba a abajo, grid mesh más intenso, corners que pulsan más rápido y borde que brilla."
                data-inspector-cat="3D · Glow"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">

                  {/* ── Panel izquierdo: perfil compacto (solo desktop) ── */}
                  <motion.div
                    className="hidden md:flex flex-shrink-0 flex-col gap-4 w-52 rounded-xl p-5"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.15)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  >
                    {/* Avatar + nombre */}
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="relative">
                        <div
                          className="h-14 w-14 rounded-full flex items-center justify-center text-base font-bold select-none"
                          style={{
                            background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.28), rgba(6, 182, 212, 0.18))',
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
                      style={{ background: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.22), transparent)' }}
                    />

                    {/* Mini stats */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      {[
                        { v: `${YEARS_EXP}+`, l: 'Años exp.' },
                        { v: '15+', l: 'Proyectos' },
                        { v: '100%', l: 'Satisfechos' },
                        { v: '<2h', l: 'Respuesta' },
                      ].map((s) => (
                        <div key={s.l}>
                          <p className="text-base font-extrabold glow-text" style={{ color: 'var(--color-primary)' }}>{s.v}</p>
                          <p className="text-[9px] leading-tight text-[var(--color-on-surface-variant)]">{s.l}</p>
                        </div>
                      ))}
                    </div>

                    {/* Divisor */}
                    <div
                      className="h-px"
                      style={{ background: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.22), transparent)' }}
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
                  </motion.div>

                  {/* ── Panel derecho: CTA text ── */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.h2
                      className="text-2xl md:text-3xl font-extrabold text-[var(--color-on-surface)] mb-3"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      ¿Listo para llevar tu proyecto al siguiente nivel?
                    </motion.h2>
                    <motion.p
                      className="text-[var(--color-on-surface-variant)] mb-8 max-w-md md:mx-0 mx-auto"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                    >
                      Agendá una reunión gratuita y validamos tu idea con foco en resultados.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
                    >
                      <WhatsAppOutboundLink
                        waHref={whatsappUrl(WA_MSG_ABOUT)}
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
                      </WhatsAppOutboundLink>
                    </motion.div>
                  </div>

                </div>
              </div>
            </TiltCard>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
