'use client'

import { useState, useCallback, useRef, useEffect, useLayoutEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import {
  CheckIcon,
  ArrowRightIcon,
  BotLodeIcon,
  AssistifyIcon,
  ContactEngineIcon,
  LumaInvitaIcon,
} from '@/components/ui/icons'
import { ProjectDrawer } from '@/components/ui/project-drawer'
import { ProjectsSheet, type SheetEntry } from '@/components/ui/projects-sheet'
import { ServiceDrawer } from '@/components/ui/ServiceDrawer'
import { ServiceDrawerContent, type ServiceDrawerContentProps } from '@/components/ui/ServiceDrawerContent'
import { cn } from '@/lib/utils/cn'
import { BRAND_IMAGE_SRC } from '@/lib/constants'
import { whatsappUrl, waMsgPlan } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WEB_PLANS, APP_PLANS, formatARS, type PricingPlan } from '@/lib/types/services'
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
  'luma-invita': LumaInvitaIcon,
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

const PLAN_DELIVERY: Record<string, string> = {
  web_basic:       'Entregada en 15 días · Pago 50/50 al iniciar y al entregar',
  web_interactive: 'Entregada en 15 días · Pago en 3 cuotas sin interés',
  web_premium:     'Entregada en 15 días · Incluye capacitación para manejarlo solo',
  app_mvp:         'Fee mensual desde el día 1 · Sin contrato de permanencia',
  app_pro:         'Fee mensual · Panel admin incluido · Sin contrato de permanencia',
  app_platform:    'Propuesta personalizada · Fee mensual + implementación',
}

export function ServiciosContent() {
  const [tab, setTab] = useState<'web' | 'mobile'>('web')
  /** Drawer de detalle por plan (solo uno abierto a la vez). */
  const [openPlanDrawerId, setOpenPlanDrawerId] = useState<string | null>(null)
  /** Panel inferior de ejemplos / drawer — reservado para un CTA dedicado; no enlazar al acordeón. */
  const [sheetPlanId, setSheetPlanId] = useState<string | null>(null)
  const [drawerProject, setDrawerProject] = useState<ProjectItem | null>(null)

  const scrollYBeforeTabChange = useRef<number | null>(null)
  const isFirstTabLayoutEffect = useRef(true)

  const selectMobileTab = useCallback(() => {
    setTab('mobile')
    setOpenPlanDrawerId(null)
    setSheetPlanId(null)
  }, [])

  const handleTabChange = useCallback((t: 'web' | 'mobile') => {
    if (typeof window !== 'undefined') {
      scrollYBeforeTabChange.current = window.scrollY
    }
    setTab(t)
    setOpenPlanDrawerId(null)
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

  const openProjectDrawer = useCallback((project: ProjectItem) => {
    setDrawerProject(project)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerProject(null)
  }, [])

  const tabStickySentinelRef = useRef<HTMLDivElement>(null)
  const [isTabSticky, setIsTabSticky] = useState(false)

  useEffect(() => {
    const sentinel = tabStickySentinelRef.current
    if (!sentinel || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    let observer: IntersectionObserver | null = null

    const setupObserver = () => {
      if (observer) {
        observer.disconnect()
        observer = null
      }

      if (!mediaQuery.matches) {
        setIsTabSticky(false)
        return
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsTabSticky(!entry.isIntersecting)
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '-64px 0px 0px 0px',
        },
      )

      observer.observe(sentinel)
    }

    setupObserver()

    const handleMediaChange = () => {
      setupObserver()
    }
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <ServiciosTabQuerySync onSelectMobile={selectMobileTab} />
      </Suspense>
      {/* Pricing cards */}
      <section id="pricing" className="py-16 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionReveal>
            <div className="mb-12">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-3">
                Precios transparentes
              </p>
              <h2 className="font-heading text-balance leading-tight mb-3">
                <span className="block text-2xl sm:text-3xl md:text-4xl font-extralight text-[var(--color-on-surface-variant)]">Elegí tu</span>
                <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-on-surface)]">plan ideal</span>
              </h2>
              <p className="text-pretty text-sm text-[var(--color-on-surface-variant)] max-w-md">
                Emprendedores y pymes de toda Argentina. Precios en ARS, sin sorpresas, sin letra chica.
              </p>
            </div>
          </SectionReveal>
          <div ref={tabStickySentinelRef} aria-hidden className="h-px w-full" />
          <div className="mb-8">
            <motion.div
              className="sticky top-16 z-30 -mx-2 px-2 py-2 md:static md:top-auto md:z-auto md:mx-0 md:px-0 md:py-0"
              animate={{ opacity: isTabSticky ? 1 : 0.92 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                background: isTabSticky ? 'var(--color-surface)' : 'transparent',
                backdropFilter: isTabSticky ? 'blur(8px)' : 'blur(0px)',
                WebkitBackdropFilter: isTabSticky ? 'blur(8px)' : 'blur(0px)',
                borderBottom: isTabSticky ? '1px solid rgba(var(--color-primary-rgb), 0.16)' : '1px solid transparent',
              }}
            >
              <div className="flex justify-center">
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
            </motion.div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            >
              {plans.map((plan, i) => (
                <div
                  key={plan.id}
                  className={plan.isFeatured ? 'md:-mt-4 md:mb-4' : ''}
                >
                  <UnifiedPricingCard
                    plan={plan}
                    index={i}
                    onOpenDrawer={() => setOpenPlanDrawerId(plan.id)}
                    isDrawerOpen={openPlanDrawerId === plan.id}
                    deliveryInfo={PLAN_DELIVERY[plan.id]}
                  />
                </div>
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

      {/* ProjectsSheet: solo con sheetPlanId explícito; independiente del drawer de detalle */}
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

      <ServicePlanDrawer
        plan={plans.find((candidate) => candidate.id === openPlanDrawerId) ?? null}
        isOpen={openPlanDrawerId !== null}
        onClose={() => setOpenPlanDrawerId(null)}
      />
    </>
  )
}

type ServiceDrawerPlanType = ServiceDrawerContentProps['planType']

const PLAN_TYPE_BY_ID: Partial<Record<PricingPlan['id'], ServiceDrawerPlanType>> = {
  web_basic: 'essential',
  web_interactive: 'popular',
  web_premium: 'recommended',
  app_mvp: 'essential',
  app_pro: 'popular',
  app_platform: 'recommended',
}

function getServiceDrawerPlanType(plan: PricingPlan): ServiceDrawerPlanType {
  return PLAN_TYPE_BY_ID[plan.id] ?? (plan.isFeatured ? 'recommended' : 'essential')
}

function getServiceDrawerContentProps(plan: PricingPlan): ServiceDrawerContentProps {
  const originalPrice = plan.originalPrice ? formatARS(plan.originalPrice) : undefined
  const discount =
    plan.originalPrice && plan.price !== null
      ? `-${Math.round((1 - plan.price / plan.originalPrice) * 100)}%`
      : undefined

  return {
    planName: plan.name,
    planType: getServiceDrawerPlanType(plan),
    price:
      plan.price !== null
        ? `${formatARS(plan.price)}${plan.billing === 'month' ? ' /mes' : ''}`
        : 'A consultar',
    originalPrice,
    discount,
    idealFor: plan.idealFor.join(' · '),
    benefits: plan.gains.map((gain) => ({
      number: gain.num,
      title: gain.title,
      description: gain.desc,
    })),
    features: plan.features,
    closingQuote: plan.powerStatement,
    whatsappLink: whatsappUrl(waMsgPlan(plan.name)),
  }
}

function ServicePlanDrawer({
  plan,
  isOpen,
  onClose,
}: {
  plan: PricingPlan | null
  isOpen: boolean
  onClose: () => void
}) {
  const lastPlanRef = useRef<PricingPlan | null>(null)
  if (plan) {
    lastPlanRef.current = plan
  }
  const planToRender = plan ?? lastPlanRef.current
  if (!planToRender) return null

  const drawerProps = getServiceDrawerContentProps(planToRender)

  return (
    <ServiceDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={planToRender.name}
      dialogId={`service-plan-drawer-${planToRender.id}`}
    >
      <ServiceDrawerContent {...drawerProps} />
    </ServiceDrawer>
  )
}

function UnifiedPricingCard({
  plan,
  index,
  onOpenDrawer,
  isDrawerOpen,
  deliveryInfo,
}: {
  plan: PricingPlan
  index: number
  onOpenDrawer: () => void
  isDrawerOpen: boolean
  deliveryInfo?: string
}) {
  const discount = plan.originalPrice
    ? Math.round((1 - plan.price! / plan.originalPrice) * 100)
    : 0
  const visibleFeatures = plan.features.slice(0, 5)

  return (
    <SectionReveal delay={index * 0.1} className="h-full">
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl transition-all duration-300',
          plan.isFeatured
            ? 'border border-[rgba(var(--color-primary-rgb),0.6)] shadow-[0_0_60px_rgba(var(--color-primary-rgb),0.18),0_0_0_1px_rgba(var(--color-primary-rgb),0.08)]'
            : 'glass-card border border-[var(--glass-border)] hover:border-[rgba(var(--color-primary-rgb),0.2)]',
        )}
        style={plan.isFeatured ? { background: 'var(--color-surface-high, rgba(255,255,255,0.04))' } : undefined}
      >
        {/* Featured: radial glow background */}
        {plan.isFeatured && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(var(--color-primary-rgb), 0.1) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          style={{
            background: plan.isFeatured
              ? 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 1) 50%, transparent)'
              : 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.5) 50%, transparent)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col p-6 md:p-7">
          {/* Badge row */}
          <div className="mb-5 flex items-center gap-2">
            {plan.isFeatured ? (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em]"
                style={{
                  background: 'rgba(var(--color-primary-rgb), 0.15)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.4)',
                  color: 'var(--color-primary)',
                }}
              >
                <span className="size-1.5 rounded-full inline-block animate-pulse" style={{ background: 'var(--color-primary)' }} />
                Recomendado
              </span>
            ) : (
              <Badge variant="outline">{plan.badge}</Badge>
            )}
          </div>

          {/* Plan name */}
          <h3
            className={cn(
              'mb-4 text-xl font-bold leading-snug',
              plan.isFeatured ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface)]',
            )}
          >
            {plan.name}
          </h3>

          {/* Price block */}
          <div className="mb-5 pb-5" style={{ borderBottom: '1px solid rgba(var(--color-primary-rgb), 0.1)' }}>
            {plan.price !== null ? (
              <>
                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                  <span
                    className={cn(
                      'text-4xl font-extrabold tracking-tight',
                      plan.isFeatured ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]',
                    )}
                  >
                    {formatARS(plan.price)}
                  </span>
                  {plan.billing === 'month' && (
                    <span className="text-base font-semibold text-[var(--color-on-surface-variant)]">/mes</span>
                  )}
                </div>
                {plan.originalPrice && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-[var(--color-on-surface-variant)] line-through opacity-60">
                      {formatARS(plan.originalPrice)}
                    </span>
                    <Badge variant="primary" className="text-[10px]">-{discount}%</Badge>
                  </div>
                )}
                {plan.billing === 'month' && (
                  <p className="mt-1.5 text-xs text-[var(--color-on-surface-variant)] opacity-60">
                    Retainer mensual · IVA aparte según facturación
                  </p>
                )}
              </>
            ) : (
              <div>
                <span className="text-3xl font-extrabold text-[var(--color-primary)]">A consultar</span>
                {plan.consultSubtext && (
                  <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{plan.consultSubtext}</p>
                )}
              </div>
            )}
          </div>

          {/* Headline + description */}
          <p className="mb-2 text-sm font-bold leading-snug text-[var(--color-on-surface)]">
            {plan.frontHeadline}
          </p>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)] opacity-75">
            {plan.description}
          </p>

          {deliveryInfo && (
            <p
              className="mb-4 text-xs font-semibold"
              style={{ color: 'rgba(var(--color-primary-rgb), 0.85)' }}
            >
              {deliveryInfo}
            </p>
          )}

          {/* Features list */}
          <ul className="mb-6 flex-1 space-y-2.5">
            {visibleFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--color-on-surface-variant)]">
                <span
                  className="mt-0.5 size-4 flex-shrink-0 rounded-full inline-flex items-center justify-center"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.12)' }}
                >
                  <CheckIcon className="size-2.5 text-[var(--color-primary)]" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onOpenDrawer}
              aria-expanded={isDrawerOpen}
              aria-controls={`service-plan-drawer-${plan.id}`}
              className="inline-flex h-11 w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.06)] active:scale-[0.99]"
              style={{
                borderColor: 'rgba(var(--color-primary-rgb), 0.2)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <span className="text-sm font-medium">Ver detalle completo</span>
              <ArrowRightIcon className="size-4 opacity-60" />
            </button>

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
                'h-11 px-6 text-sm rounded-xl',
              )}
            >
              Empezar proyecto
              <ArrowRightIcon className="size-4" />
            </WhatsAppOutboundLink>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

