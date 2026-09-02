'use client'

import { useState, useCallback, useRef, useEffect, useLayoutEffect, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { m, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  CalendarIcon,
  BotLodeIcon,
  AssistifyIcon,
  ContactEngineIcon,
  LumaInvitaIcon,
} from '@/components/ui/icons'
import { ServiceDrawer } from '@/components/ui/ServiceDrawer'
import type { ServiceDrawerContentProps } from '@/components/ui/ServiceDrawerContent'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, waMsgPlan } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WEB_PLANS, APP_PLANS, formatARS, type PricingPlan } from '@/lib/types/services'
import { PROJECTS, type ProjectItem } from '@/lib/types/theme'
import { PROJECT_THUMB_SRC } from '@/lib/constants/project-thumbs'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { DUR_FAST, DUR_SLOW, EASE_OUT, STAGGER_BASE } from '@/lib/motion'

/**
 * ServiceDrawerContent solo se ve cuando el usuario abre el drawer de un plan
 * (click en "Ver detalle completo"). Antes viajaba en el chunk inicial de
 * /servicios vía import estático; con next/dynamic queda en su propio chunk,
 * pedido recién al abrir — nunca se necesita en el HTML SSR (el mismo texto
 * ya está en las cards de pricing) así que ssr:false es seguro.
 */
const ServiceDrawerContent = dynamic(
  () => import('@/components/ui/ServiceDrawerContent').then((m) => m.ServiceDrawerContent),
  { ssr: false, loading: () => <ServiceDrawerContentSkeleton /> },
)

/** Placeholder mientras se descarga el chunk del drawer — reserva el bloque, sin layout jump. */
function ServiceDrawerContentSkeleton() {
  return (
    <div className="space-y-6 pb-4 md:space-y-7" aria-hidden="true">
      <div className="space-y-3">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-7 w-1/3" />
      </div>
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-52 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  )
}

/**
 * ProjectDrawer (47 KB fuente) es un overlay completo (chrome + backdrop
 * propio) que solo existe para mostrar el detalle de un proyecto relacionado.
 * Va a next/dynamic (no hay shell estático separable sin tocar el archivo,
 * fuera de ownership acá). ssr:false: es 100% interactivo, arranca cerrado,
 * no aporta nada al HTML inicial.
 */
const ProjectDrawer = dynamic(
  () => import('@/components/ui/project-drawer').then((m) => m.ProjectDrawer),
  { ssr: false, loading: () => <OverlayLoadingFallback /> },
)

/** Backdrop + spinner mínimo mientras se descarga el chunk de un overlay pesado. */
function OverlayLoadingFallback() {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--scrim-bg)]"
      aria-hidden="true"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent motion-reduce:animate-none" />
    </div>
  )
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

/**
 * Cambio de tab Web/App (spec §9): la grilla entrante cae en cascada — cada
 * card con y+blur y la curva firma. `mode="wait"` y el useLayoutEffect de
 * scroll quedan intactos.
 */
const TAB_GRID_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_BASE } },
  exit: { opacity: 0, transition: { duration: DUR_FAST, ease: EASE_OUT } },
}

const TAB_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR_SLOW, ease: EASE_OUT },
  },
}

/**
 * Tier ancla por pestaña (AUDIT_ADDENDUM: UN solo badge de ancla — «Más elegido»
 * en Web Interactiva). El anclaje visual del tab de apps cae en el tier del medio.
 */
const ANCHOR_PLAN_IDS = new Set<string>(['web_interactive', 'app_pro'])

/** De-riskers VISIBLES por plan — boceto gratis y cuotas dejan de ser letra chica. */
const PLAN_DERISKERS: Record<string, string[]> = {
  web_basic:       ['Boceto gratis antes de pagar', '3 cuotas sin interés', 'Entrega en 15 días'],
  web_interactive: ['Boceto gratis antes de pagar', '3 cuotas sin interés', 'Entrega en 15 días'],
  web_premium:     ['Boceto gratis antes de pagar', '3 cuotas sin interés', 'Entrega en 15 días'],
  app_mvp:         ['Sin contrato de permanencia', 'Mejoras todos los meses'],
  app_pro:         ['Sin contrato de permanencia', 'Panel admin incluido'],
  app_platform:    ['Propuesta a medida', 'Modelo partner técnico'],
}

export function ServiciosContent() {
  const prefersReducedMotion = useReducedMotion()
  const [tab, setTab] = useState<'web' | 'mobile'>('web')
  /** Drawer de detalle por plan (solo uno abierto a la vez). */
  const [openPlanDrawerId, setOpenPlanDrawerId] = useState<string | null>(null)
  const [drawerProject, setDrawerProject] = useState<ProjectItem | null>(null)
  /**
   * Gate de montaje del overlay dinámico ProjectDrawer: arranca sin montar
   * (su chunk nunca se pide) y queda montado para siempre desde la primera
   * vez que se abre — así next/dynamic solo dispara el fetch al abrir, y las
   * animaciones de cierre (que necesitan el componente montado con
   * open=false) siguen funcionando en re-aperturas.
   */
  const everOpenedProjectDrawerRef = useRef(false)
  everOpenedProjectDrawerRef.current ||= drawerProject !== null

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
      <section id="pricing" className="scroll-mt-24 py-16 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionReveal>
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="editorial-label editorial-label--primary mb-4">Precios transparentes</p>
                <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl mb-3">
                  <span className="block text-[var(--color-on-surface-variant)]">Encontrá el plan</span>
                  <strong className="block text-[var(--color-on-surface)]">que hace crecer tu negocio.</strong>
                </h2>
                <p className="text-pretty text-sm text-[var(--color-on-surface-variant)] max-w-md">
                  Precios en ARS, pactados por escrito antes de arrancar. Primero ves un boceto
                  gratis de tu proyecto — si no te convence, no pagás nada.
                </p>
              </div>
              <span
                aria-hidden="true"
                className="section-number hidden md:block"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
              >
                02
              </span>
            </div>
          </SectionReveal>
          <div ref={tabStickySentinelRef} aria-hidden className="h-px w-full" />
          <div className="mb-8">
            <m.div
              className="relative sticky top-16 z-30 -mx-2 px-2 py-2 md:static md:top-auto md:z-auto md:mx-0 md:px-0 md:py-0"
              animate={{ opacity: isTabSticky ? 1 : 0.92 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              {/* Fondo con blur FIJO (nunca se anima el radio, solo el opacity vía clase —
                  animar backdrop-filter fuerza repintado costoso en cada frame de scroll). */}
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 -z-10 transition-opacity duration-200',
                  isTabSticky ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderBottom: '1px solid rgba(var(--color-primary-rgb), 0.16)',
                }}
              />
              <div className="flex justify-center">
                {/* Tab toggle — HUD switch justo encima de las cards de planes */}
                <div className="inline-flex rounded-xl glass-card p-1">
                  {(['web', 'mobile'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTabChange(t)}
                      aria-pressed={tab === t}
                      className="relative min-h-[44px] px-6 py-3 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
                      data-hover
                      data-inspector-title={t === 'web' ? 'Pestaña Sitio Web' : 'Pestaña App a medida'}
                      data-inspector-desc="El botón activo no se redibuja a mano: hay una sola 'pastilla' que viaja de un lado al otro con física de resorte (layoutId en Framer Motion). Es la misma sensación que un interruptor premium de un salpicadero, pero en tu navegador."
                      data-inspector-cat="Motion · Spring"
                    >
                      {tab === t && (
                        <m.span
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
                        {t === 'web' ? 'Sitio Web' : 'App a medida'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </m.div>
          </div>
          <AnimatePresence mode="wait">
            {/* Wrapper de crossfade: exit simple y determinista (opacity) para que
                mode="wait" siempre complete el swap Web↔App. El stagger de cards y
                el reveal del panel viven en los hijos, no en este contenedor. */}
            <m.div
              key={tab}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? 0 : DUR_FAST, ease: EASE_OUT } }}
              transition={{ duration: prefersReducedMotion ? 0 : DUR_FAST, ease: EASE_OUT }}
            >
              {tab === 'web' ? (
                <m.div
                  variants={prefersReducedMotion ? undefined : TAB_GRID_VARIANTS}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  whileInView={prefersReducedMotion ? undefined : 'visible'}
                  viewport={{ once: true, amount: 0.1 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : undefined}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
                >
                  {plans.map((plan) => (
                    <m.div
                      key={plan.id}
                      variants={prefersReducedMotion ? undefined : TAB_CARD_VARIANTS}
                      className={cn('h-full', ANCHOR_PLAN_IDS.has(plan.id) && 'md:-mt-4 md:mb-4')}
                    >
                      <UnifiedPricingCard
                        plan={plan}
                        onOpenDrawer={() => setOpenPlanDrawerId(plan.id)}
                        isDrawerOpen={openPlanDrawerId === plan.id}
                        deriskers={PLAN_DERISKERS[plan.id]}
                      />
                    </m.div>
                  ))}
                </m.div>
              ) : (
                <CustomSoftwarePanel />
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ProjectsSheet: solo con sheetPlanId explícito; independiente del drawer de detalle.
          Gateado por everOpenedSheetRef — no se monta (ni se pide su chunk) hasta el primer open. */}
      {everOpenedSheetRef.current && (
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
      )}

      {everOpenedProjectDrawerRef.current && (
        <ProjectDrawer
          project={drawerProject}
          open={drawerProject !== null}
          onClose={closeDrawer}
        />
      )}

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
  // Sin precios tachados ni "-XX%" (AUDIT_ADDENDUM): el precio es el precio.
  // El valor se ancla con entregables + boceto gratis + 3 cuotas sin interés.
  return {
    planName: plan.name,
    planType: getServiceDrawerPlanType(plan),
    price:
      plan.price !== null
        ? `${formatARS(plan.price)}${plan.billing === 'month' ? ' /mes' : ''}`
        : 'A consultar',
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
  onOpenDrawer,
  isDrawerOpen,
  deriskers,
}: {
  plan: PricingPlan
  onOpenDrawer: () => void
  isDrawerOpen: boolean
  deriskers?: string[]
}) {
  const isAnchor = ANCHOR_PLAN_IDS.has(plan.id)

  return (
    <>
      {/* Ancla: superficie E3 — double-bezel + noise (spec §3/§6), única de la
          sección. El resto queda en glass E2. El reveal lo maneja el stagger
          del contenedor de tabs (TAB_CARD_VARIANTS). */}
      <div
        className={cn(
          'group/card relative h-full overflow-hidden rounded-2xl transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none',
          isAnchor
            ? cn(
                'bento-surface--framed noise-overlay rounded-[var(--radius-shell)]',
                'border border-[rgba(var(--color-primary-rgb),0.6)]',
                'hover:shadow-[var(--shadow-card-hover)]',
              )
            : cn(
                'glass-card border border-[var(--glass-border)] hover:border-[rgba(var(--color-primary-rgb),0.3)]',
                'hover:shadow-[0_2px_6px_rgba(24,32,60,0.05),0_18px_40px_-22px_rgba(24,32,60,0.22),0_0_24px_-12px_rgba(var(--color-primary-rgb),0.2)]',
                'dark:hover:shadow-[0_0_40px_-8px_rgba(var(--color-primary-rgb),0.22)]',
              ),
        )}
      >
        {/* Ancla: radial glow background */}
        {isAnchor && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(var(--color-primary-rgb), 0.1) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Top accent line */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          style={{
            background: isAnchor
              ? 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 1) 50%, transparent)'
              : 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.5) 50%, transparent)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col p-6 md:p-7">
          {/* Badge: UN solo badge de ancla («Más elegido» en Web Interactiva).
              El resto lleva su categoría discreta en outline. */}
          <div className="mb-5 flex items-center gap-2">
            {plan.id === 'web_interactive' ? (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em]"
                style={{
                  background: 'rgba(var(--color-primary-rgb), 0.15)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.4)',
                  color: 'var(--color-primary)',
                }}
              >
                <span className="size-1.5 rounded-full inline-block animate-pulse" style={{ background: 'var(--color-primary)' }} />
                {plan.badge}
              </span>
            ) : (
              <Badge variant="outline">{plan.badge}</Badge>
            )}
          </div>

          {/* Plan name */}
          <h3 className="mb-4 text-xl font-bold leading-snug text-[var(--color-on-surface)]">
            {plan.name}
          </h3>

          {/* Price block — sin tachados ni "-XX%": el precio es el precio.
              Ticket con contraste 200/800 (spec §10): prefijo ARS extralight
              REAL junto a la cifra extrabold. */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(var(--color-primary-rgb), 0.1)' }}>
            {plan.price !== null ? (
              <>
                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                  <span
                    className={cn(
                      'font-extralight uppercase tracking-wide',
                      isAnchor ? 'text-xl text-[var(--color-primary)]' : 'text-lg text-[var(--color-on-surface-variant)]',
                    )}
                  >
                    ARS
                  </span>
                  <span
                    className={cn(
                      'font-extrabold tracking-tight tabular-nums',
                      isAnchor ? 'text-[2.75rem] leading-none text-[var(--color-primary)]' : 'text-4xl text-[var(--color-on-surface)]',
                    )}
                  >
                    {formatARS(plan.price).replace(/^\$\s?/, '')}
                  </span>
                  {plan.billing === 'month' && (
                    <span className="text-base font-semibold text-[var(--color-on-surface-variant)]">/mes</span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-[var(--color-on-surface-variant)] opacity-60">
                  {plan.billing === 'month'
                    ? 'Fee mensual: desarrollo activo, soporte y mejoras · IVA aparte'
                    : 'Precio final en ARS, pactado por escrito'}
                </p>
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

          {/* De-riskers visibles (boceto gratis / cuotas / entrega) */}
          {deriskers && deriskers.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-1.5">
              {deriskers.map((d) => (
                <li
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--color-on-surface)]"
                  style={{
                    background: 'rgba(var(--color-primary-rgb), 0.08)',
                    border: '1px solid rgba(var(--color-primary-rgb), 0.22)',
                  }}
                >
                  <CheckIcon className="size-3 shrink-0 text-[var(--color-primary)]" />
                  {d}
                </li>
              ))}
            </ul>
          )}

          {/* Headline + description — el texto fluye completo (sin ellipsis en mobile) */}
          <p className="mb-2 text-sm font-bold leading-snug text-[var(--color-on-surface)]">
            {plan.frontHeadline}
          </p>
          <p className="mb-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] opacity-80">
            {plan.description}
          </p>

          {/* Entregables concretos */}
          <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-60">
            Qué incluye
          </p>
          <ul className="mb-6 flex-1 space-y-2.5">
            {plan.features.map((f) => (
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

          {/* Actions — CTA de dinero SIEMPRE sólido verde WhatsApp; detalle en ghost */}
          <div className="space-y-2.5">
            <WhatsAppOutboundLink
              waHref={whatsappUrl(waMsgPlan(plan.name))}
              className={cn(
                'group/wa btn-tech inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold text-white select-none',
                'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97]',
                'motion-reduce:transform-none motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                WA_SHADOW_CLASS,
              )}
              style={{ background: WA_GRADIENT }}
            >
              <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover/wa:scale-110 motion-reduce:transform-none" />
              {/* "Empezar proyecto" pedía la compra; el ofrecimiento real del
                  sitio es el boceto gratis. Alinear el label con el del hero, la
                  home y las verticales deja UNA sola pregunta repetida en todo
                  el funnel, y es la de menor compromiso. */}
              {plan.price === null ? 'Consultar por WhatsApp' : 'Quiero mi boceto gratis'}
            </WhatsAppOutboundLink>

            <button
              type="button"
              onClick={onOpenDrawer}
              aria-expanded={isDrawerOpen}
              aria-controls={`service-plan-drawer-${plan.id}`}
              className="group/detail inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-medium text-[var(--color-on-surface-variant)] transition-[border-color,color,transform] duration-200 hover:border-[rgba(var(--color-primary-rgb),0.25)] hover:text-[var(--color-primary)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
            >
              Ver detalle completo
              <ArrowRightIcon className="size-4 opacity-60 transition-transform duration-200 group-hover/detail:translate-x-0.5 group-hover/detail:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   PANEL A MEDIDA — reemplaza las 3 cards de app por una sola oferta de
   desarrollo de software a medida. Sin precio de lista: la conversación (video-
   llamada) es el próximo paso. Superficie E3 (double-bezel + grain) y layout
   asimétrico de 2 columnas, coherente con los paneles de decisión del sitio.
   ──────────────────────────────────────────────────────────────────────────── */

/** Lo que cubre el proyecto a medida — apps, web, sistemas, integraciones, IA. */
const CUSTOM_SOFTWARE_CAPABILITIES = [
  'Apps móviles iOS + Android (Flutter)',
  'Aplicaciones y sistemas web a medida (Next.js)',
  'Paneles de administración y dashboards',
  'Integraciones: MercadoPago, WhatsApp y otras APIs',
  'Automatizaciones y funciones con inteligencia artificial',
  'Backend, base de datos e infraestructura (Supabase)',
] as const

/** De-riskers: la charla no cuesta y el precio queda cerrado por escrito. */
const CUSTOM_SOFTWARE_DERISKERS = [
  'Videollamada sin cargo',
  'Alcance y precio por escrito',
  'Sin compromiso',
] as const

/** Mensaje de WhatsApp para coordinar la videollamada del proyecto a medida. */
const WA_MSG_CUSTOM_SOFTWARE =
  'Hola Manuel, quiero contarte un proyecto de software a medida. ¿Coordinamos una videollamada para verlo?'

function CustomSoftwarePanel() {
  return (
    <div
      className="relative overflow-hidden bento-surface bento-surface--framed noise-overlay"
      data-hover
      data-inspector-title="Panel a medida"
      data-inspector-desc="Cuando el proyecto no entra en un plan cerrado, se cotiza a medida: una sola card que abre la conversación (videollamada) en lugar de mostrar un precio de lista."
      data-inspector-cat="UX · Conversión"
    >
      {/* Hairline decorativa superior (spec §4) */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.5) 50%, transparent)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 gap-8 p-6 sm:p-8 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Izquierda — propuesta + acción */}
        <div className="flex flex-col">
          <div className="mb-5">
            <Badge variant="outline">Proyecto a medida</Badge>
          </div>

          <h3 className="heading-display text-balance text-2xl sm:text-3xl md:text-4xl mb-4">
            <span className="block text-[var(--color-on-surface-variant)]">Apps y software</span>
            <strong className="block text-[var(--color-on-surface)]">hechos a tu medida.</strong>
          </h3>

          <p className="mb-6 max-w-md text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            Apps para iOS y Android, sistemas web, paneles internos, integraciones y
            automatizaciones con IA. Si se puede programar, lo armamos. Como cada proyecto es
            único, no hay precio de lista: lo definimos juntos en una videollamada y te lo dejo
            por escrito antes de arrancar.
          </p>

          {/* De-riskers visibles */}
          <ul className="mb-7 flex flex-wrap gap-1.5">
            {CUSTOM_SOFTWARE_DERISKERS.map((d) => (
              <li
                key={d}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--color-on-surface)]"
                style={{
                  background: 'rgba(var(--color-primary-rgb), 0.08)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.22)',
                }}
              >
                <CheckIcon className="size-3 shrink-0 text-[var(--color-primary)]" />
                {d}
              </li>
            ))}
          </ul>

          {/* Acciones — CTA de dinero verde WhatsApp + agenda en ghost */}
          <div className="mt-auto space-y-2.5">
            <WhatsAppOutboundLink
              waHref={whatsappUrl(WA_MSG_CUSTOM_SOFTWARE)}
              className={cn(
                'group/wa btn-tech inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold text-white select-none',
                'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97]',
                'motion-reduce:transform-none motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                WA_SHADOW_CLASS,
              )}
              style={{ background: WA_GRADIENT }}
            >
              <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover/wa:scale-110 motion-reduce:transform-none" />
              Coordinar una videollamada
            </WhatsAppOutboundLink>

            <Link
              href={ROUTES.contact}
              className="group/detail inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-medium text-[var(--color-on-surface-variant)] transition-[border-color,color,transform] duration-200 hover:border-[rgba(var(--color-primary-rgb),0.25)] hover:text-[var(--color-primary)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
            >
              <CalendarIcon className="size-4 opacity-70 transition-opacity duration-200 group-hover/detail:opacity-100" />
              Agendar una reunión de 15 min
              <ArrowRightIcon className="size-4 opacity-60 transition-transform duration-200 group-hover/detail:translate-x-0.5 group-hover/detail:opacity-100" />
            </Link>
          </div>
        </div>

        {/* Derecha — qué incluye "todo el desarrollo de software" */}
        <div className="lg:border-l lg:border-[rgba(var(--color-primary-rgb),0.12)] lg:pl-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-60">
            Qué puedo construir
          </p>
          <ul className="space-y-3">
            {CUSTOM_SOFTWARE_CAPABILITIES.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-[var(--color-on-surface-variant)]">
                <span
                  className="mt-0.5 size-4 flex-shrink-0 rounded-full inline-flex items-center justify-center"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.12)' }}
                >
                  <CheckIcon className="size-2.5 text-[var(--color-primary)]" />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs italic leading-relaxed text-[var(--color-on-surface-variant)] opacity-75">
            ¿No lo ves en la lista? Escribime igual — casi seguro también se puede.
          </p>
        </div>
      </div>
    </div>
  )
}

