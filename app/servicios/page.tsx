'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/icons'
import { GridBackground } from '@/components/ui/grid-background'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import {
  WEB_PLANS, APP_PLANS,
  WEB_MODULES, APP_MODULES,
  formatARS,
  type PricingPlan, type EstimatorModule,
} from '@/lib/types/services'

export default function ServiciosPage() {
  const [tab, setTab] = useState<'web' | 'mobile'>('web')
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set())

  const plans = tab === 'web' ? WEB_PLANS : APP_PLANS
  const modules = tab === 'web' ? WEB_MODULES : APP_MODULES

  const toggleModule = (id: string, isCore?: boolean) => {
    if (isCore) return
    setSelectedModules((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const estimatorTotal = modules.reduce((sum, m) => {
    if (m.isCore || selectedModules.has(m.id)) return sum + m.price
    return sum
  }, 0)

  return (
    <>
      {/* Header */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <GridBackground />
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <SectionReveal>
            <Badge variant="primary" className="mb-4">Servicios</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Mis Servicios
            </h1>
            <p className="mx-auto max-w-xl text-on-surface-variant mb-10">
              Soluciones tecnológicas diseñadas para escalar tu negocio
            </p>

            {/* Tab toggle */}
            <div className="inline-flex rounded-xl border border-surface-high bg-surface-low p-1">
              {(['web', 'mobile'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setSelectedModules(new Set()) }}
                  className={cn(
                    'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
                    tab === t ? 'bg-primary text-primary-foreground' : 'text-on-surface-variant hover:text-on-surface'
                  )}
                  data-hover
                >
                  {t === 'web' ? 'Sitio Web' : 'Aplicación Móvil'}
                </button>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {plans.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Estimator */}
      <section id="estimador" className="py-24 bg-surface-lowest/50">
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div className="text-center mb-12">
              <Badge variant="primary" className="mb-4">Estimador</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mb-3">
                Armá tu Proyecto a Medida
              </h2>
              <p className="text-on-surface-variant">
                Seleccioná los módulos que necesitás. Precios optimizados para emprendedores.
              </p>
            </div>
          </SectionReveal>

          <div className="space-y-3 mb-8">
            {modules.map((m) => (
              <SectionReveal key={m.id}>
                <button
                  onClick={() => toggleModule(m.id, m.isCore)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl border p-4 transition-all text-left',
                    m.isCore
                      ? 'border-primary/30 bg-primary-8 cursor-default'
                      : selectedModules.has(m.id)
                        ? 'border-primary/50 bg-primary-8'
                        : 'border-surface-high hover:border-primary/30 bg-surface-low/50'
                  )}
                  data-hover
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                      (m.isCore || selectedModules.has(m.id))
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-surface-highest'
                    )}>
                      {(m.isCore || selectedModules.has(m.id)) && <CheckIcon className="h-3 w-3" />}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-on-surface">{m.label}</span>
                      {m.isCore && <span className="ml-2 text-[10px] text-primary font-bold">INCLUIDO</span>}
                      <p className="text-xs text-on-surface-variant">{m.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-sm font-bold text-on-surface">{formatARS(m.price)}</span>
                    <p className="text-xs text-on-surface-variant line-through">{formatARS(m.originalPrice)}</p>
                  </div>
                </button>
              </SectionReveal>
            ))}
          </div>

          {/* Total */}
          <motion.div
            layout
            className="rounded-2xl border border-primary/30 bg-primary-8 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm text-on-surface-variant mb-1">Total estimado</p>
              <p className="text-3xl font-extrabold text-on-surface">{formatARS(estimatorTotal)}</p>
            </div>
            <Link href={ROUTES.contact}>
              <Button variant="primary" size="lg">
                Consultar ahora
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const discount = plan.originalPrice
    ? Math.round((1 - plan.price! / plan.originalPrice) * 100)
    : 0

  return (
    <SectionReveal delay={index * 0.1}>
      <div
        className={cn(
          'relative h-full rounded-2xl border p-6 md:p-8 flex flex-col transition-all',
          plan.isFeatured
            ? 'border-primary/50 bg-primary-8 shadow-glow-sm'
            : 'border-surface-high bg-surface-low/50'
        )}
      >
        {plan.isFeatured && (
          <div className="absolute -top-3 left-6">
            <Badge variant="primary" className="shadow-sm">Recomendado</Badge>
          </div>
        )}

        <Badge variant="outline" className="self-start mb-4">{plan.badge}</Badge>
        <h3 className="text-2xl font-bold text-on-surface mb-2">{plan.name}</h3>

        {/* Price */}
        <div className="mb-4">
          {plan.price !== null ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-on-surface">{formatARS(plan.price)}</span>
              </div>
              {plan.originalPrice && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-on-surface-variant line-through">{formatARS(plan.originalPrice)}</span>
                  <Badge variant="primary" className="text-[10px]">-{discount}%</Badge>
                </div>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold text-primary">A consultar</span>
          )}
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
          {plan.description}
        </p>
        <p className="text-xs text-on-surface-variant/60 mb-6">
          Para: {plan.targetAudience}
        </p>

        {/* Features */}
        <ul className="flex-1 space-y-2.5 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <CheckIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href={ROUTES.contact}>
          <Button
            variant={plan.isFeatured ? 'primary' : 'outline'}
            className="w-full"
            size="md"
          >
            {plan.price !== null ? 'Empezar proyecto' : 'Solicitar presupuesto'}
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </Link>

        {/* Case studies */}
        {plan.caseStudies && plan.caseStudies.length > 0 && (
          <p className="mt-4 text-center text-[10px] text-on-surface-variant/50">
            Casos: {plan.caseStudies.join(' \u2022 ')}
          </p>
        )}
      </div>
    </SectionReveal>
  )
}
