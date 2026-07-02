'use client'

import { useState, useCallback, useRef, useEffect, useLayoutEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import {
  CheckIcon,
  ArrowRightIcon,
  WhatsAppIcon,
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
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { DUR_FAST, DUR_SLOW, EASE_OUT, STAGGER_BASE } from '@/lib/motion'

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
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    // Limpia el backdrop-root residual (mismo patrón que SectionReveal)
    transitionEnd: { filter: 'none' },
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
            <motion.div
              className="sticky top-16 z-30 -mx-2 px-2 py-2 md:static md:top-auto md:z-auto md:mx-0 md:px-0 md:py-0"
              animate={{ opacity: isTabSticky ? 1 : 0.92 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
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
                      aria-pressed={tab === t}
                      className="relative px-6 py-2.5 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
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
              variants={prefersReducedMotion ? undefined : TAB_GRID_VARIANTS}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView={prefersReducedMotion ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.1 }}
              animate={prefersReducedMotion ? { opacity: 1 } : undefined}
              exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0 } } : 'exit'}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            >
              {plans.map((plan) => (
                <motion.div
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
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {/* Altura reservada: evita salto de layout al mostrar/ocultar el texto solo en App */}
          <div className="mx-auto mt-10 min-h-[4.75rem] max-w-2xl flex items-start justify-center">
            {tab === 'mobile' ? (
              <p className="text-center text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                <span className="font-semibold text-[var(--color-on-surface)]">Apps: producto vivo, no proyecto cerrado.</span>{' '}
                El fee mensual incluye mejoras, soporte y nuevas funcionalidades cada mes.
                A diferencia de los sitios web, en apps la relación es continua: la app sigue evolucionando después de la entrega.
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
              {plan.price === null ? 'Consultar por WhatsApp' : 'Empezar proyecto'}
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

