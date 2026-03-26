'use client'

import { useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, ArrowRightIcon, BotLodeIcon, AssistifyIcon, ContactEngineIcon } from '@/components/ui/icons'
import { GridBackground } from '@/components/ui/grid-background'
import { CircuitBoardBg } from '@/components/ui/circuit-board-bg'
import { ProjectDrawer } from '@/components/ui/project-drawer'
import { ProjectsSheet, type SheetEntry } from '@/components/ui/projects-sheet'
import { cn } from '@/lib/utils/cn'
import { BRAND_IMAGE_SRC } from '@/lib/constants'
import { whatsappUrl, waMsgPlan, waMsgEstimator } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import {
  WEB_PLANS, APP_PLANS,
  WEB_MODULES, APP_MODULES,
  formatARS,
  getPlanCtaLabel,
  type PricingPlan,
} from '@/lib/types/services'
import { PROJECTS, type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { PROJECT_THUMB_SRC } from '@/lib/constants/project-thumbs'

// Projects that open the full drawer — kept for future use
const PLAN_RELATED_PROJECTS: Record<string, ThemeId[]> = {
  web_basic: [],
  web_interactive: ['botlode', 'assistify'],
  web_premium: [],
  app_mvp: [],
  app_pro: [],
  app_platform: [],
}

// External case studies — kept for future use
type ExternalCaseStudy = { name: string; url: string; imageSrc: string }
const PLAN_EXTERNAL_CASES: Record<string, ExternalCaseStudy[]> = {
  web_basic: [
    { name: 'Simon Mindset', url: 'https://simonmindset.com', imageSrc: BRAND_IMAGE_SRC },
    { name: 'Pérez Yeregui', url: 'https://perez-yeregui2.vercel.app', imageSrc: BRAND_IMAGE_SRC },
    { name: 'Metal Wailers', url: 'https://metalwailers.com', imageSrc: BRAND_IMAGE_SRC },
    { name: 'Poncho Spanish', url: 'https://ponchospanish.com', imageSrc: BRAND_IMAGE_SRC },
  ],
  web_interactive: [{ name: 'Botrive', url: 'https://botrive.com', imageSrc: BRAND_IMAGE_SRC }],
  web_premium: [
    { name: 'Pulpiprint', url: 'https://pulpiprint.com', imageSrc: BRAND_IMAGE_SRC },
    { name: 'MNL Tecno', url: 'https://mnltecno.com', imageSrc: BRAND_IMAGE_SRC },
  ],
}

const PROJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'contact-engine': ContactEngineIcon,
}

/** Sincroniza la pestaña con `?tab=mobile` (useSearchParams bajo Suspense). */
function ServiciosTabQuerySync({ onSelectMobile }: { onSelectMobile: () => void }) {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  useEffect(() => {
    if (tabFromUrl !== 'mobile') return
    onSelectMobile()
  }, [tabFromUrl, onSelectMobile])
  return null
}

type ModuleSelections = { web: Set<string>; mobile: Set<string> }

const emptyModuleSelections = (): ModuleSelections => ({
  web: new Set(),
  mobile: new Set(),
})

const PLAN_DELIVERY: Record<string, string> = {
  web_basic:       'Entregada en 3 semanas · Pago 50/50 al iniciar y al entregar',
  web_interactive: 'Entregada en 5 semanas · Pago en 3 cuotas sin interés',
  web_premium:     'Entregada en 6 semanas · Incluye capacitación para manejarlo solo',
  app_mvp:         'Fee mensual desde el día 1 · Sin contrato de permanencia',
  app_pro:         'Fee mensual · Panel admin incluido · Sin contrato de permanencia',
  app_platform:    'Propuesta personalizada · Fee mensual + implementación',
}

export function ServiciosContent() {
  const [tab, setTab] = useState<'web' | 'mobile'>('web')
  const [moduleSelections, setModuleSelections] = useState<ModuleSelections>(emptyModuleSelections)
  // sheetPlanId kept for future use — currently not triggered from card click
  const [sheetPlanId, setSheetPlanId] = useState<string | null>(null)
  const [drawerProject, setDrawerProject] = useState<ProjectItem | null>(null)

  const scrollYBeforeTabChange = useRef<number | null>(null)
  const isFirstTabLayoutEffect = useRef(true)

  const selectMobileTab = useCallback(() => {
    setTab('mobile')
    setSheetPlanId(null)
  }, [])

  const handleTabChange = useCallback((t: 'web' | 'mobile') => {
    if (typeof window !== 'undefined') {
      scrollYBeforeTabChange.current = window.scrollY
    }
    setTab(t)
    setSheetPlanId(null)
  }, [])

  /** Mantiene el scroll fijo al cambiar Web/App (evita saltos por cambio de altura / animaciones). */
  useLayoutEffect(() => {
    if (isFirstTabLayoutEffect.current) {
      isFirstTabLayoutEffect.current = false
      return
    }
    const y = scrollYBeforeTabChange.current
    scrollYBeforeTabChange.current = null
    if (y == null) return
    window.scrollTo({ top: y, left: 0, behavior: 'auto' })
  }, [tab])

  const plans = tab === 'web' ? WEB_PLANS : APP_PLANS
  const modules = tab === 'web' ? WEB_MODULES : APP_MODULES
  const selectedModules = tab === 'web' ? moduleSelections.web : moduleSelections.mobile

  const toggleModule = (id: string, isCore?: boolean) => {
    if (isCore) return
    setModuleSelections((prev) => {
      const kind = tab
      const nextForKind = new Set(prev[kind])
      nextForKind.has(id) ? nextForKind.delete(id) : nextForKind.add(id)
      return { ...prev, [kind]: nextForKind }
    })
  }

  const openProjectDrawer = useCallback((project: ProjectItem) => {
    setDrawerProject(project)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerProject(null)
  }, [])

  const estimatorTotal = modules.reduce((sum, m) => {
    if (m.isCore || selectedModules.has(m.id)) return sum + m.price
    return sum
  }, 0)

  const estimatorWaHref = useMemo(() => {
    const moduleLabels = modules.filter((m) => m.isCore || selectedModules.has(m.id)).map((m) => m.label)
    return whatsappUrl(
      waMsgEstimator({
        kind: tab,
        moduleLabels,
        totalFormatted: formatARS(estimatorTotal),
      }),
    )
  }, [tab, modules, selectedModules, estimatorTotal])

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
      <Suspense fallback={null}>
        <ServiciosTabQuerySync onSelectMobile={selectMobileTab} />
      </Suspense>
      {/* Header */}
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
        data-inspector-desc="Mientras bajás, esta zona se desvanece y la máscara suaviza el borde inferior como un monitor que se apaga de a poco. El fondo de placa de circuito reacciona a tu mouse: las conexiones brillan cerca del cursor, como si la página fuera un hardware vivo."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => { bgCursorRef.current = { x: -1, y: -1, active: false } }}
      >
        <GridBackground />
        <CircuitBoardBg cursorRef={bgCursorRef} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <SectionReveal>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="primary">Servicios</Badge>
              <Badge variant="outline">Diseño premium</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4">
              Desarrollo de software en Argentina para empresas y emprendedores
            </h1>
            <p className="mx-auto max-w-xl text-[var(--color-on-surface-variant)] mb-6 sm:mb-8">
              A medida, precio fijo y entrega garantizada. Sin agencias.
            </p>
          </SectionReveal>
        </div>
      </motion.section>

      {/* Proceso */}
      <section className="pb-8">
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div
              className="rounded-2xl overflow-hidden glass-card"
              data-hover
              data-inspector-title="Proceso en 3 pasos"
              data-inspector-desc="Muestra el flujo de trabajo para reducir fricción: el visitante sabe exactamente qué esperar antes de hacer clic."
              data-inspector-cat="UX · Conversión"
            >
              {/* Top accent line */}
              <div
                className="h-[2px] w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.85) 50%, transparent)' }}
              />

              <div className="px-8 py-8">
                {/* Label with flanking lines */}
                <div className="flex items-center gap-3 justify-center mb-8">
                  <div
                    className="h-px flex-1 max-w-[80px]"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.45))' }}
                  />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
                    ¿Cómo funciona?
                  </span>
                  <div
                    className="h-px flex-1 max-w-[80px]"
                    style={{ background: 'linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.45), transparent)' }}
                  />
                </div>

                {/* Steps */}
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  {[
                    { step: '01', title: 'Consulta gratis', sub: '15 minutos', highlight: false },
                    { step: '02', title: 'Presupuesta en 24 hs', sub: 'Precio fijo, sin sorpresas', highlight: false },
                    { step: '03', title: 'Entrega en 15 días', sub: 'Garantizado. Si no cumplimos, devolvemos el depósito.', highlight: true },
                  ].map(({ step, title, sub, highlight }, i, arr) => (
                    <div key={step} className="flex flex-col sm:flex-row items-center">
                      {/* Step card */}
                      <div
                        className={cn(
                          'flex flex-col items-center text-center px-7 py-5 rounded-xl transition-all duration-300',
                          highlight
                            ? 'bg-[rgba(var(--color-primary-rgb),0.07)] border border-[rgba(var(--color-primary-rgb),0.2)]'
                            : ''
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center mb-3 text-xs font-black',
                            highlight
                              ? 'bg-[var(--color-primary)] text-[var(--color-surface-base)]'
                              : 'border border-[rgba(var(--color-primary-rgb),0.45)] text-[var(--color-primary)]'
                          )}
                          style={highlight ? { boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.45)' } : undefined}
                        >
                          {step}
                        </div>
                        <span className="text-sm font-bold text-[var(--color-on-surface)] mb-1 whitespace-nowrap">{title}</span>
                        <span className={cn(
                          'text-xs leading-relaxed max-w-[9.5rem]',
                          highlight ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-on-surface-variant)]'
                        )}>
                          {sub}
                        </span>
                      </div>

                      {/* Connector */}
                      {i < arr.length - 1 && (
                        <div className="flex items-center my-3 sm:my-0 sm:mx-1">
                          <div
                            className="hidden sm:block w-6 h-px"
                            style={{ background: 'linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.25), rgba(var(--color-primary-rgb), 0.6))' }}
                          />
                          <span
                            className="text-base select-none hidden sm:block leading-none"
                            style={{ color: 'rgba(var(--color-primary-rgb), 0.55)' }}
                            aria-hidden
                          >
                            ›
                          </span>
                          <div
                            className="sm:hidden w-px h-5"
                            style={{ background: 'linear-gradient(180deg, rgba(var(--color-primary-rgb), 0.25), rgba(var(--color-primary-rgb), 0.55))' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-center text-[11px] tracking-[0.2em] uppercase opacity-50 text-[var(--color-on-surface-variant)]">
                  Sin vueltas · Sin letra chica
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Por qué APEX */}
      <section className="my-12 mx-auto max-w-4xl px-6">
        <SectionReveal>
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Top accent */}
            <div
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.7) 50%, transparent)' }}
            />

            <div className="p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                  style={{
                    border: '1px solid rgba(var(--color-primary-rgb), 0.35)',
                    color: 'var(--color-primary)',
                  }}
                >
                  Comparativa
                </span>
                <h3 className="text-xl font-bold text-[var(--color-on-surface)]">¿Por qué APEX y no una agencia?</h3>
              </div>

              {/* Comparison grid — gap acts as divider line */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 mb-7 rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                  gap: '1px',
                  background: 'rgba(var(--color-primary-rgb), 0.1)',
                }}
              >
                {/* Agencia column */}
                <div
                  className="p-6"
                  style={{ background: 'var(--color-surface-low, #0d0d0d)' }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500 mb-4">
                    Agencia tradicional
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Hablar con un vendedor',
                      'Precio "a cotizar"',
                      '3-6 meses de espera',
                      'Mantenimiento aparte',
                      'Plantillas genéricas',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 bg-red-500/10 text-red-400">
                          ✕
                        </span>
                        <span className="text-sm text-gray-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* APEX column */}
                <div
                  className="p-6"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.04)' }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-primary)] mb-4">
                    APEX
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Hablar directo conmigo',
                      'Precio fijo pactado',
                      'Entrega en 15 días',
                      '3 meses de soporte incluido',
                      '100% a tu medida',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 text-[var(--color-primary)]"
                          style={{
                            background: 'rgba(var(--color-primary-rgb), 0.15)',
                            boxShadow: '0 0 8px rgba(var(--color-primary-rgb), 0.2)',
                          }}
                        >
                          ✓
                        </span>
                        <span className="text-sm font-medium text-[var(--color-on-surface)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quote */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-[3px] rounded-full flex-shrink-0 self-stretch"
                  style={{ background: 'var(--color-primary)', minHeight: '2.5rem' }}
                />
                <p className="text-sm italic text-[var(--color-on-surface-variant)] leading-relaxed">
                  "Trabajo con vos, no para vos. Cuando tenés una duda, te respondo yo — no un asistente."
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Confiaron en APEX */}
      <div className="my-12 text-center mx-auto max-w-4xl px-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Confiaron en APEX</h3>
        <p className="text-sm text-gray-400 mb-6">
          simonmindset.com · metalwailers.com · botrive.com · pulpiprint.com · mnltecno.com
        </p>
        <blockquote className="text-sm italic text-gray-300 border-l-2 border-cyan-500 pl-4 max-w-2xl mx-auto text-left">
          "Entregó antes de lo prometido y quedó exactamente como lo imaginé."
          <footer className="text-xs text-gray-400 mt-2">— Simón R., Coach</footer>
        </blockquote>
      </div>

      {/* CTA intermedia */}
      <div className="my-8 mx-auto max-w-4xl px-6">
        <SectionReveal>
          <div
            className="relative rounded-2xl overflow-hidden glass-card text-center py-12 px-6"
            data-hover
            data-inspector-title="CTA intermedia"
            data-inspector-desc="Llamada a la acción intermedia: WhatsApp o ver precios."
            data-inspector-cat="UX · Conversión"
          >
            {/* Radial background glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(var(--color-primary-rgb), 0.07) 0%, transparent 70%)' }}
            />
            {/* Top accent */}
            <div
              className="absolute top-0 inset-x-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.75) 50%, transparent)' }}
            />

            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-2">
                Siguiente paso
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-2 tracking-tight">
                ¿Sabés qué necesitás?
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-8 opacity-70">
                Empezá hoy, sin compromisos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <WhatsAppOutboundLink
                  waHref={whatsappUrl('Hola, quiero saber más sobre mis opciones')}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-surface-base)',
                    boxShadow: '0 0 24px rgba(var(--color-primary-rgb), 0.35)',
                  }}
                >
                  Consulta gratis en WhatsApp
                </WhatsAppOutboundLink>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.08)]"
                  style={{
                    border: '1px solid rgba(var(--color-primary-rgb), 0.4)',
                    color: 'var(--color-primary)',
                  }}
                >
                  Ver precios →
                </a>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* Pricing cards */}
      <section id="pricing" className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-center mb-8">
            {/* Tab toggle — HUD switch justo encima de las cards de planes */}
            <div className="inline-flex rounded-xl glass-card p-1">
              {(['web', 'mobile'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className="relative px-6 py-2.5 rounded-lg text-sm font-semibold"
                  data-hover
                  data-inspector-title={t === 'web' ? 'Pestaña Sitio Web' : 'Pestaña App móvil'}
                  data-inspector-desc="El botón activo no se redibuja a mano: hay una sola 'pastilla' que viaja de un lado al otro con física de resorte (layoutId en Framer Motion). Es la misma sensación que un interruptor premium de un salpicadero, pero en tu navegador."
                  data-inspector-cat="Motion · Spring"
                >
                  {tab === t && (
                    <motion.span
                      layoutId="tab-thumb"
                      className="absolute inset-0 rounded-lg shadow-glow-sm"
                      style={{
                        background: 'rgba(var(--color-primary-rgb), 0.18)',
                        border: '1px solid rgba(var(--color-primary-rgb), 0.5)',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-10 transition-colors duration-200',
                      tab === t
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                    )}
                  >
                    {t === 'web' ? 'Sitio Web' : 'Aplicación Móvil'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {plans.map((plan, i) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  index={i}
                  isExpanded={sheetPlanId === plan.id}
                  onToggleExpand={() => setSheetPlanId(prev => prev === plan.id ? null : plan.id)}
                  deliveryInfo={PLAN_DELIVERY[plan.id]}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          {/* Altura reservada: evita salto de layout al mostrar/ocultar el texto solo en App */}
          <div className="mx-auto mt-10 min-h-[4.75rem] max-w-2xl flex items-start justify-center">
            {tab === 'mobile' ? (
              <p className="text-center text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                <span className="font-semibold text-[var(--color-on-surface)]">Apps en fee mensual:</span>{' '}
                me contratás como desarrollador del producto (evolución, soporte y nuevas funcionalidades).
                Los planes de sitio web son proyecto cerrado; en apps la relación es continua.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Estimator */}
      <section id="estimador" className="py-24 bg-[var(--color-surface-base)]">
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <div className="text-center mb-12">
              <Badge variant="primary" className="mb-4">Estimador</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-3">
                Armá tu Proyecto a Medida
              </h2>
              <p className="text-[var(--color-on-surface-variant)] mb-6">
                Seleccioná los módulos que necesitás. Precios optimizados para emprendedores.
              </p>
              <ServiciosEstimatorTabSwitch tab={tab} onChange={handleTabChange} />
            </div>
          </SectionReveal>

          <div className="space-y-3 mb-8">
            {modules.map((m) => (
              <div key={m.id}>
                <button
                  onClick={() => toggleModule(m.id, m.isCore)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl p-4 transition-all text-left glass-card',
                    m.isCore
                      ? 'glow-border cursor-default'
                      : selectedModules.has(m.id)
                        ? 'glow-border'
                        : 'hover:border-[rgba(var(--color-primary-rgb),0.3)]'
                  )}
                  data-hover
                  data-inspector-title={m.label}
                  data-inspector-desc={
                    m.isCore
                      ? 'Este módulo ya viene incluido en la base del presupuesto: no hace falta marcarlo, está fijo para que veas qué tenés seguro antes de sumar extras.'
                      : 'Tocás y el módulo entra o sale de tu presupuesto al instante. El total de abajo se recalcula en vivo: es como armar un pedido a la carta, con precios transparentes y sin sorpresas al final.'
                  }
                  data-inspector-cat="UX · Motion"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                      (m.isCore || selectedModules.has(m.id))
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                        : 'border-[var(--color-surface-highest)]'
                    )}>
                      {(m.isCore || selectedModules.has(m.id)) && <CheckIcon className="h-3 w-3" />}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[var(--color-on-surface)]">{m.label}</span>
                      {m.isCore && <span className="ml-2 text-[10px] text-[var(--color-primary)] font-bold">INCLUIDO</span>}
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{m.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-sm font-bold text-[var(--color-on-surface)]">{formatARS(m.price)}</span>
                    <p className="text-xs text-[var(--color-on-surface-variant)] line-through">{formatARS(m.originalPrice)}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 glass-card glow-border-active"
            data-hover
            data-inspector-title="Total vivo + WhatsApp con tu selección"
            data-inspector-desc="El total refleja los módulos marcados. Un clic abre WhatsApp con el listado y el monto de referencia ya redactados en el mensaje."
            data-inspector-cat="Motion · Spring"
          >
            <div>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-1">Total estimado</p>
              <p className="text-3xl font-extrabold text-[var(--color-on-surface)]">{formatARS(estimatorTotal)}</p>
            </div>
            <WhatsAppOutboundLink
              waHref={estimatorWaHref}
              data-hover
              data-inspector-title="Consultar por WhatsApp"
              data-inspector-desc="Abre WhatsApp con el tipo de proyecto, módulos elegidos y total estimado en el mensaje."
              data-inspector-cat="UX"
              className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-all duration-300 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-primary-tech active:scale-[0.97]',
                'h-11 px-6 text-sm rounded-xl',
              )}
            >
              Consultar ahora
              <ArrowRightIcon className="h-4 w-4" />
            </WhatsAppOutboundLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA final post-estimador */}
      <section className="my-16 mx-auto max-w-4xl px-6">
        <SectionReveal>
          <div
            className="relative rounded-2xl overflow-hidden glass-card text-center py-14 px-8"
            data-hover
            data-inspector-title="CTA final — ¿Todavía tenés dudas?"
            data-inspector-desc="Cierre de página: captura la intención residual con un contacto directo sin fricción."
            data-inspector-cat="UX · Conversión"
          >
            {/* Corner glow blobs */}
            <div
              className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30"
              style={{ background: 'rgba(var(--color-primary-rgb), 0.4)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ background: 'rgba(var(--color-primary-rgb), 0.3)' }}
            />
            {/* Top accent line */}
            <div
              className="absolute top-0 inset-x-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.8) 50%, transparent)' }}
            />

            <div className="relative z-10">
              {/* Animated label */}
              <div className="inline-flex items-center gap-2 mb-5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--color-primary)' }}
                />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  Contacto directo
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--color-primary)', animationDelay: '0.5s' }}
                />
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)] mb-3 tracking-tight">
                ¿Todavía tenés dudas?
              </h3>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-8 max-w-sm mx-auto leading-relaxed opacity-80">
                No hay compromiso. En 15 minutos te cuento exactamente
                qué conviene para tu caso y cuánto cuesta.
              </p>

              <WhatsAppOutboundLink
                waHref={whatsappUrl('Hola, quiero hablar sobre mi proyecto')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] mb-5"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-surface-base)',
                  boxShadow: '0 0 32px rgba(var(--color-primary-rgb), 0.4), 0 4px 16px rgba(var(--color-primary-rgb), 0.25)',
                }}
              >
                Hablemos por WhatsApp
                <span className="text-lg" aria-hidden>→</span>
              </WhatsAppOutboundLink>

              {/* Trust signal */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className="h-px w-12 opacity-30"
                  style={{ background: 'var(--color-on-surface-variant)' }}
                />
                <p className="text-[11px] text-[var(--color-on-surface-variant)] opacity-50 tracking-wide">
                  Respondemos en menos de 2 hs · Lunes a viernes 9-19 hs
                </p>
                <div
                  className="h-px w-12 opacity-30"
                  style={{ background: 'var(--color-on-surface-variant)' }}
                />
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ProjectsSheet kept for future reactivation — currently closed (sheetPlanId = null from card clicks) */}
      <ProjectsSheet
        planName={plans.find(p => p.id === sheetPlanId)?.name ?? ''}
        entries={(() => {
          if (!sheetPlanId) return []
          const relatedIds = PLAN_RELATED_PROJECTS[sheetPlanId] ?? []
          const entries: SheetEntry[] = relatedIds
            .map(id => PROJECTS.find(p => p.themeId === id))
            .filter((p): p is ProjectItem => !!p)
            .map(project => ({
              type: 'drawer' as const,
              project,
              icon: PROJECT_ICONS[project.themeId],
              thumbnailSrc: PROJECT_THUMB_SRC[project.themeId],
            }))
          const cases = PLAN_EXTERNAL_CASES[sheetPlanId] ?? []
          cases.forEach(cs =>
            entries.push({
              type: 'external' as const,
              name: cs.name,
              url: cs.url,
              imageSrc: cs.imageSrc,
            }),
          )
          return entries
        })()}
        isOpen={sheetPlanId !== null}
        onClose={() => setSheetPlanId(null)}
        onOpenProject={openProjectDrawer}
      />

      <ProjectDrawer
        project={drawerProject}
        open={drawerProject !== null}
        onClose={closeDrawer}
      />
    </>
  )
}

const FAQ_ITEMS = [
  {
    q: '¿Cuánto tarda hacer una página web?',
    a: 'Entre 2 y 4 semanas para una landing page, 15 días para una web completa. Fecha de entrega garantizada desde el día 1.',
  },
  {
    q: '¿Cuánto cuesta una página web en Argentina?',
    a: 'Nuestros proyectos arrancan desde ARS 300.000 con precio fijo. Sin sorpresas al final.',
  },
  {
    q: '¿Qué pasa si no me gusta el resultado?',
    a: 'Trabajamos con revisiones incluidas. Si al finalizar no estás conforme, devolvemos el depósito sin discusiones.',
  },
  {
    q: '¿Puedo hablar con alguien antes de contratar?',
    a: 'Sí. Tenemos una consulta inicial gratuita de 15 minutos, sin compromiso, por WhatsApp.',
  },
  {
    q: '¿Trabajan solo en Buenos Aires?',
    a: 'No, trabajamos con clientes de toda Argentina de forma 100% remota.',
  },
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <section className="py-16 mx-auto max-w-3xl px-6">
      <SectionReveal>
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex-shrink-0 inline-flex text-[var(--color-primary)] select-none"
                    aria-hidden
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.25}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="px-5 pb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </SectionReveal>
    </section>
  )
}

/** Mismo estado que el switch de planes: Web ↔ App; sincroniza módulos del estimador. */
function ServiciosEstimatorTabSwitch({
  tab,
  onChange,
}: {
  tab: 'web' | 'mobile'
  onChange: (t: 'web' | 'mobile') => void
}) {
  return (
    <div
      className="relative inline-flex rounded-full glass-card p-1"
      role="group"
      aria-label="Web o App en el estimador"
      data-hover
      data-inspector-title="Web o App en el estimador"
      data-inspector-desc="Un solo fondo deslizante entre dos opciones. Cambia el tipo de proyecto aquí y se actualiza la misma selección del encabezado: planes y módulos siguen sincronizados."
      data-inspector-cat="UX"
    >
      {/* Un solo thumb: evita layoutId/spring entre dos botones (saltos y rebote exagerado) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 z-0 rounded-full border border-[rgba(var(--color-primary-rgb),0.32)] bg-[rgba(var(--color-primary-rgb),0.14)]"
        initial={false}
        style={{ width: 'calc(50% - 0.25rem)' }}
        animate={{ x: tab === 'mobile' ? 'calc(100% + 0.25rem)' : 0 }}
        transition={{ type: 'tween', duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <button
        type="button"
        onClick={() => onChange('web')}
        className={cn(
          'relative z-10 min-w-[4.5rem] flex-1 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200',
          tab === 'web'
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
        )}
      >
        Web
      </button>
      <button
        type="button"
        onClick={() => onChange('mobile')}
        className={cn(
          'relative z-10 min-w-[4.5rem] flex-1 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200',
          tab === 'mobile'
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
        )}
      >
        App
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Flip Card — front: pricing info | back: value proposition
// ─────────────────────────────────────────────
function PricingCard({
  plan,
  index,
  isExpanded,
  onToggleExpand,
  deliveryInfo,
}: {
  plan: PricingPlan
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  deliveryInfo?: string
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 380, damping: 38, mass: 0.6 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springCfg)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springCfg)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    setLightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const flipToBack = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
    setIsFlipped(true)
  }

  const flipToFront = () => {
    setIsFlipped(false)
  }

  const discount = plan.originalPrice
    ? Math.round((1 - plan.price! / plan.originalPrice) * 100)
    : 0

  // Shared corner tech brackets used on both faces
  const CornerBrackets = ({ opacity = 0.5 }: { opacity?: number }) => (
    <>
      <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
        <div className="absolute top-0 left-0 h-full w-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
      </div>
      <div className="absolute top-4 right-4 w-5 h-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
        <div className="absolute top-0 right-0 h-full w-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
      </div>
      <div className="absolute bottom-4 left-4 w-5 h-5 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
        <div className="absolute bottom-0 left-0 h-full w-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
      </div>
      <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
        <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: `rgba(var(--color-primary-rgb), ${opacity})` }} />
      </div>
    </>
  )

  return (
    <SectionReveal delay={index * 0.1} className="h-full min-h-0">
      {/* Perspective wrapper — h-full para que la fila del grid reserve altura real */}
      <div style={{ perspective: '1800px' }} className="h-full min-h-0 flex flex-col">

        {/* ── Flip container ── */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 1 }}
          style={{ transformStyle: 'preserve-3d', position: 'relative' }}
          className="relative flex min-h-0 flex-1 flex-col"
        >

          {/* ══════════════════════════════════
              FRONT FACE — Pricing info
          ══════════════════════════════════ */}
          {/* Capa exterior estable: el clic no "se mueve" con el tilt 3D */}
          <div
            ref={cardRef}
            role="button"
            tabIndex={0}
            aria-label={`Ver beneficios del plan ${plan.name}`}
            onClick={flipToBack}
            onKeyDown={(e) => e.key === 'Enter' && flipToBack()}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => { if (!isFlipped) setIsHovered(true) }}
            onMouseLeave={handleMouseLeave}
            data-hover
            data-inspector-title={`Plan: ${plan.name}`}
            data-inspector-desc="Hacé clic en la tarjeta para girarla y ver por qué este plan es ideal para vos: quién se beneficia, qué ganás exactamente y una propuesta de valor concreta. El botón de WhatsApp siempre está accesible en ambas caras."
            data-inspector-cat="3D · Flip"
            className="relative flex min-h-0 flex-1 flex-col rounded-2xl cursor-pointer select-none overflow-visible touch-manipulation"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Capa interior en flujo (no absolute): aporta altura al layout y evita superponer el estimador */}
            <motion.div
              className="relative flex min-h-full w-full flex-1 flex-col rounded-2xl pointer-events-none overflow-visible"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
            >
            {/* ── Base glass ── */}
            <div className={cn(
              'absolute inset-0 rounded-2xl backdrop-blur-[20px] saturate-150 transition-colors duration-500',
              plan.isFeatured
                ? 'bg-gradient-to-br from-[rgba(var(--color-primary-rgb),0.11)] via-[rgba(var(--color-primary-rgb),0.05)] to-transparent'
                : 'bg-[var(--glass-bg)]',
            )} />

            {/* ── Border ── */}
            <div className={cn(
              'absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none',
              plan.isFeatured
                ? 'border border-[rgba(var(--color-primary-rgb),0.55)]'
                : isHovered || isExpanded
                  ? 'border border-[rgba(var(--color-primary-rgb),0.38)]'
                  : 'border border-[var(--glass-border)]',
            )} />

            {/* ── Mouse-following light source ── */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(var(--color-primary-rgb), 0.2) 0%, transparent 58%)`,
              }}
            />

            {/* ── Top shimmer line ── */}
            <div
              className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
              style={{
                transition: 'opacity 0.4s ease',
                opacity: isHovered ? 1 : plan.isFeatured ? 0.55 : 0.18,
                background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.9), transparent)',
              }}
            />

            {/* ── Featured outer glow (persistent) ── */}
            {plan.isFeatured && (
              <div
                className="absolute -inset-px rounded-2xl pointer-events-none"
                style={{
                  boxShadow: '0 0 45px rgba(var(--color-primary-rgb), 0.22), 0 0 90px rgba(var(--color-primary-rgb), 0.08)',
                }}
              />
            )}

            {/* ── Hover outer glow ── */}
            <motion.div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              animate={{
                boxShadow: isHovered
                  ? '0 24px 64px rgba(var(--color-primary-rgb), 0.22), 0 0 0 1px rgba(var(--color-primary-rgb), 0.18)'
                  : '0 0 0 rgba(var(--color-primary-rgb), 0)',
              }}
              transition={{ duration: 0.35 }}
            />

            {/* ── Corner brackets ── */}
            <CornerBrackets />

            {/* ── Dot-grid depth layer ── */}
            <div
              className="absolute bottom-0 inset-x-0 h-32 rounded-b-2xl pointer-events-none overflow-hidden"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(var(--color-primary-rgb), 0.16) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
              }}
            />

            {/* ── "Recomendado" badge ── */}
            {plan.isFeatured && (
              <div className="absolute -top-3.5 left-6 z-20">
                <Badge variant="primary" className="shadow-sm">Recomendado</Badge>
              </div>
            )}

            {/* ── Content ── */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col p-6 md:p-8">
              <Badge variant="outline" className="self-start mb-4">{plan.badge}</Badge>
              <h3 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                {plan.price !== null ? (
                  <>
                    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                      <span className={cn(
                        'text-3xl font-extrabold transition-colors duration-300',
                        plan.isFeatured
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-on-surface)]',
                      )}>
                        {formatARS(plan.price)}
                      </span>
                      {plan.billing === 'month' && (
                        <span className="text-lg font-bold text-[var(--color-on-surface-variant)]">/mes</span>
                      )}
                    </div>
                    {plan.billing === 'month' && (
                      <p className="mt-1 text-[11px] leading-snug text-[var(--color-on-surface-variant)]">
                        Retainer mensual · IVA aparte según facturación
                      </p>
                    )}
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[var(--color-on-surface-variant)] line-through">{formatARS(plan.originalPrice)}</span>
                        <Badge variant="primary" className="text-[10px]">-{discount}%</Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">A consultar</span>
                    {plan.consultSubtext && (
                      <p className="mt-2 text-xs leading-relaxed text-[var(--color-on-surface-variant)]">
                        {plan.consultSubtext}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {deliveryInfo && (
                <p className="text-xs font-medium mb-4" style={{ color: 'rgba(var(--color-primary-rgb), 0.85)' }}>
                  ✓ {deliveryInfo}
                </p>
              )}

              <p className="text-base font-semibold text-[var(--color-on-surface)] leading-snug mb-2">
                {plan.frontHeadline}
              </p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-2">
                {plan.description}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] opacity-60 mb-6">
                Para: {plan.targetAudience}
              </p>

              {/* Features */}
              <ul className="flex-1 space-y-2.5 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                    <CheckIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Flip hint — visible on hover */}
              <motion.div
                className="flex justify-center mb-4 pointer-events-none"
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 3 }}
                transition={{ duration: 0.18 }}
              >
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.08)] border border-[rgba(var(--color-primary-rgb),0.18)] rounded-full px-3 py-1">
                  <FlipIcon className="w-3 h-3" />
                  Ver por qué es ideal para vos
                </span>
              </motion.div>

              {/* CTA — pointer-events-auto: capa encima del tilt sin capturar clics del resto */}
              <div className="pointer-events-auto relative z-20" onClick={(e) => e.stopPropagation()}>
                <WhatsAppOutboundLink
                  waHref={whatsappUrl(waMsgPlan(plan.name))}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 font-semibold',
                    'transition-all duration-300 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    'btn-tech',
                    plan.isFeatured
                      ? 'btn-primary-tech active:scale-[0.97]'
                      : 'btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                    'h-11 px-6 text-sm rounded-xl'
                  )}
                  data-hover
                  data-inspector-title="Conversación por WhatsApp"
                  data-inspector-desc="Te abre WhatsApp con el mensaje listo para charlar del plan que elegiste."
                  data-inspector-cat="Seguridad"
                >
                  {getPlanCtaLabel(plan)}
                  <ArrowRightIcon className="h-4 w-4" />
                </WhatsAppOutboundLink>
              </div>
            </div>
            </motion.div>
          </div>

          {/* ══════════════════════════════════
              BACK FACE — Value proposition
          ══════════════════════════════════ */}
          <div
            onClick={flipToFront}
            className="absolute inset-0 cursor-pointer touch-manipulation select-none rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* ── Glass base ── */}
            <div className={cn(
              'absolute inset-0 rounded-2xl backdrop-blur-[24px] saturate-150',
              plan.isFeatured
                ? 'bg-gradient-to-br from-[rgba(var(--color-primary-rgb),0.16)] via-[rgba(var(--color-primary-rgb),0.07)] to-[rgba(0,0,0,0.18)]'
                : 'bg-[var(--glass-bg)]',
            )} />

            {/* ── Border ── */}
            <div className={cn(
              'absolute inset-0 rounded-2xl pointer-events-none',
              plan.isFeatured
                ? 'border border-[rgba(var(--color-primary-rgb),0.55)]'
                : 'border border-[rgba(var(--color-primary-rgb),0.28)]',
            )} />

            {/* ── Top shimmer line ── */}
            <div
              className="absolute top-0 left-8 right-8 h-px rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.9), transparent)',
                opacity: plan.isFeatured ? 0.7 : 0.45,
              }}
            />

            {/* ── Featured outer glow ── */}
            {plan.isFeatured && (
              <div
                className="absolute -inset-px rounded-2xl pointer-events-none"
                style={{
                  boxShadow: '0 0 45px rgba(var(--color-primary-rgb), 0.22), 0 0 90px rgba(var(--color-primary-rgb), 0.08)',
                }}
              />
            )}

            {/* ── Corner brackets ── */}
            <CornerBrackets opacity={0.35} />

            {/* ── Scan line texture (subtle) ── */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(var(--color-primary-rgb),0.018) 3px, rgba(var(--color-primary-rgb),0.018) 4px)',
              }}
            />

            {/* ── Content — columna que reparte alto: grilla 2×2 crece y las mini-cards respiran */}
            <div className="relative z-10 flex h-full min-h-0 flex-col p-6 md:p-8">

              {/* Hook headline — volver al frente: clic en cualquier parte del reverso (excepto WhatsApp) */}
              <div className="mb-3 shrink-0 md:mb-4">
                <p
                  className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] md:text-[11px] md:tracking-[0.18em]"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ¿Por qué elegirlo?
                </p>
                <h4 className="text-lg font-extrabold leading-snug text-[var(--color-on-surface)] md:text-xl">
                  {plan.backHook}
                </h4>
              </div>

              {/* Ideal para */}
              <div className="mb-3 shrink-0 md:mb-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)] md:text-[11px]">
                  ¿Para quién es ideal?
                </p>
                <ul className="space-y-2">
                  {plan.idealFor.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm leading-snug text-[var(--color-on-surface-variant)]"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div
                className="mb-3 h-px w-full shrink-0 md:mb-4"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.3), transparent)' }}
              />

              {/* Gains grid — filas auto (sin 1fr) para no estirar; gap amplio; bloque centrado en el hueco flexible */}
              <div className="mb-3 flex min-h-0 flex-1 flex-col md:mb-4">
                <p className="mb-2 shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)] md:text-[11px] md:mb-3">
                  Lo que ganás
                </p>
                <div className="flex min-h-0 flex-1 items-center py-2 md:py-3">
                  <div className="grid w-full grid-cols-2 gap-4 md:gap-5">
                  {plan.gains.map((gain) => (
                    <div
                      key={gain.num}
                      className="flex min-w-0 flex-col items-start justify-start gap-1 rounded-xl p-3.5 md:gap-1.5 md:p-4"
                      style={{
                        background: 'rgba(var(--color-primary-rgb), 0.06)',
                        border: '1px solid rgba(var(--color-primary-rgb), 0.14)',
                      }}
                    >
                      <span
                        className="text-xs font-black tabular-nums md:text-sm"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {gain.num}
                      </span>
                      <span className="text-sm font-bold leading-snug text-[var(--color-on-surface)] md:text-[15px]">
                        {gain.title}
                      </span>
                      <span className="text-xs leading-relaxed text-[var(--color-on-surface-variant)] md:text-[13px] md:leading-snug">
                        {gain.desc}
                      </span>
                    </div>
                  ))}
                  </div>
                </div>
              </div>

              {/* Pie fijo: cita + CTA */}
              <div className="mt-auto shrink-0 space-y-3 pt-1">
              {/* Power statement */}
              <p className="text-center text-xs leading-relaxed text-[var(--color-on-surface-variant)] opacity-80 md:text-sm">
                {plan.powerStatement}
              </p>

              {/* CTA */}
              <div onClick={(e) => e.stopPropagation()}>
                <WhatsAppOutboundLink
                  waHref={whatsappUrl(waMsgPlan(plan.name))}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 font-semibold',
                    'transition-all duration-300 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                    'btn-tech',
                    plan.isFeatured
                      ? 'btn-primary-tech active:scale-[0.97]'
                      : 'btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
                    'h-11 px-6 text-sm rounded-xl'
                  )}
                >
                  {getPlanCtaLabel(plan)}
                  <ArrowRightIcon className="h-4 w-4" />
                </WhatsAppOutboundLink>
              </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </SectionReveal>
  )
}

// Small flip/rotate icon for the hover hint
function FlipIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
