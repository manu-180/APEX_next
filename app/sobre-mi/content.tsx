'use client'

import { motion } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon, CalendarIcon } from '@/components/ui/icons'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'

const SKILLS = [
  { label: 'Resolución de Problemas', icon: '\u{1F9E9}' },
  { label: 'Arquitectura Limpia', icon: '\u{1F4DA}' },
  { label: 'Constancia Diaria', icon: '\u{1F4C5}' },
  { label: 'Pensamiento Lógico', icon: '\u{1F9E0}' },
  { label: 'Enfoque en Resultados', icon: '\u{1F3AF}' },
  { label: 'Adaptabilidad', icon: '\u{1F527}' },
]

const STATS = [
  { value: '3+', label: 'Años de experiencia' },
  { value: '15+', label: 'Proyectos entregados' },
  { value: '4.9', label: 'Rating promedio' },
  { value: '100%', label: 'Clientes satisfechos' },
]

export function SobreMiContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <GridBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <SectionReveal>
            <Badge variant="primary" className="mb-4">Sobre Mí</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-6">
              Manuel Navarro
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-12 px-3 py-1.5 text-sm font-semibold text-primary">
                <span className="text-xs">⚡</span> 3 años de experiencia
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-high px-3 py-1.5 text-sm text-on-surface-variant">
                Full-Stack & Mobile
              </span>
            </div>
          </SectionReveal>

          {/* Bio */}
          <SectionReveal delay={0.15}>
            <div className="rounded-2xl border border-surface-high bg-surface-low/50 backdrop-blur-sm p-6 md:p-10 mb-8">
              <p className="text-base md:text-lg text-on-surface leading-relaxed mb-6">
                Programar es mucho más que tirar líneas de código, para mí es una disciplina de constancia
                diaria. Llevo tres años dedicándole cada día a entender cómo construir soluciones que
                realmente funcionen. Estoy convencido de que hoy no existen límites técnicos: cualquier idea
                se puede materializar si se tiene el compromiso de entender el problema y la destreza para
                construir la solución que el usuario realmente necesita.
              </p>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
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
                  className="rounded-xl border border-surface-high bg-surface-low/50 p-5 text-center"
                >
                  <p className="text-2xl md:text-3xl font-extrabold text-primary theme-transition mb-1">{s.value}</p>
                  <p className="text-xs text-on-surface-variant">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* Skills */}
          <SectionReveal delay={0.3}>
            <h2 className="text-xl font-bold text-on-surface mb-6">Habilidades clave</h2>
            <div className="flex flex-wrap gap-3 mb-16">
              {SKILLS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-2 rounded-xl border border-surface-high bg-surface-low px-4 py-2.5"
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="text-sm font-medium text-on-surface">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          {/* CTA */}
          <SectionReveal delay={0.4}>
            <div className="rounded-2xl border border-primary/30 bg-primary-8 p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-3">
                ¿Listo para llevar tu proyecto al siguiente nivel?
              </h2>
              <p className="text-on-surface-variant mb-8 max-w-lg mx-auto">
                Agendá una reunión gratuita y validamos tu idea con foco en resultados.
              </p>
              <Link href={ROUTES.contact}>
                <Button size="lg" variant="primary">
                  <CalendarIcon className="h-4 w-4" />
                  Agendar consulta gratis
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
