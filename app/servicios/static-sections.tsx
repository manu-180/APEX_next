'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { motion, type Variants } from 'framer-motion'
import { SectionReveal } from '@/components/ui/section-reveal'
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WEB_PLANS, formatARS } from '@/lib/types/services'
import { ROUTES } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { DELAY_AFTER_PANEL, DUR_BASE, DUR_REVEAL, DUR_SLOW, EASE_OUT, STAGGER_LOOSE } from '@/lib/motion'
import { ServiciosHeroShell } from './servicios-hero-shell'
import { FaqAccordion } from './faq-accordion'
import { SERVICIOS_FAQ_ITEMS } from './faq-data'

/**
 * Sub-headers editoriales del FAQ. Bloques CONTIGUOS sobre el orden canónico
 * de SERVICIOS_FAQ_ITEMS (alimenta el JSON-LD FAQPage en page.tsx y NO se
 * reordena): la agrupación se resuelve por rangos, nunca moviendo preguntas.
 */
const SERVICIOS_FAQ_GROUPS = [
  { label: 'Precio y pago', startIndex: 0 },
  { label: 'Proceso y garantía', startIndex: 1 },
  { label: 'Logística', startIndex: 7 },
] as const

/* ────────────────────────────────────────────────────────────────────────────
   HERO — corto, orientado a decisión (brief §3 /servicios)
   Izquierda: claim + CTA WhatsApp contextual. Derecha: panel de decisión con
   los planes y precios reales (desde WEB_PLANS — nunca hardcodeados).
   ──────────────────────────────────────────────────────────────────────────── */
export function ServiciosHero() {
  const decisionRows: Array<{ name: string; meta: string; price: string; href: string }> = [
    ...WEB_PLANS.map((plan) => ({
      name: plan.name,
      meta: plan.badge,
      price: plan.price !== null ? formatARS(plan.price) : 'A consultar',
      href: '#pricing',
    })),
    {
      name: 'App o software a medida',
      meta: 'Proyecto a medida',
      price: 'A cotizar',
      href: `${ROUTES.servicios}?tab=mobile#pricing`,
    },
    {
      name: 'Todavía no sé',
      meta: 'Calculadora · 60 seg',
      price: 'Gratis',
      href: '#calculadora',
    },
  ]

  return (
    <ServiciosHeroShell>
      <SectionReveal>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Columna izquierda — decisión + CTA */}
          <div className="max-w-2xl">
            <p className="editorial-label editorial-label--primary mb-6">Servicios y precios</p>

            <h1 className="heading-display text-balance text-4xl sm:text-5xl md:text-6xl mb-5">
              <span className="block text-[var(--color-on-surface-variant)]">Software a medida,</span>
              <strong className="block text-[var(--color-on-surface)]">con precio publicado.</strong>
            </h1>

            <p className="text-pretty text-[var(--color-on-surface-variant)] max-w-lg mb-8 leading-relaxed">
              Tres planes de web y planes de app, con precio publicado.
              Elegís, me escribís por WhatsApp y en 24-48 h tenés un boceto gratis —
              antes de pagar nada.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <WhatsAppOutboundLink
                waHref={whatsappUrl(
                  'Hola, estoy viendo los planes en tu web pero no sé cuál me conviene. ¿Me orientás?',
                )}
                className={cn(
                  'group btn-tech inline-flex items-center justify-center gap-2.5 font-semibold select-none',
                  'h-12 px-6 text-sm text-white',
                  'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97]',
                  'motion-reduce:transform-none motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  WA_SHADOW_CLASS,
                )}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none" />
                No sé qué necesito, escribime
              </WhatsAppOutboundLink>

              <a
                href="#pricing"
                className={cn(
                  'group btn-tech btn-outline-tech inline-flex items-center justify-center gap-2 font-semibold select-none',
                  'h-12 px-6 text-sm text-[var(--color-primary)]',
                  'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                )}
              >
                Ver planes
                <span aria-hidden className="rotate-90 inline-block leading-none transition-transform duration-200 group-hover:translate-y-0.5">→</span>
              </a>
            </div>

            {/* Strip de confianza — claims reales */}
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--color-on-surface-variant)]">
              {['Te respondo en menos de 1 h', 'Boceto gratis en 24-48 h', '3 cuotas sin interés'].map(
                (claim) => (
                  <li key={claim} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-1 rounded-full"
                      style={{ background: 'var(--color-primary)' }}
                    />
                    {claim}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Columna derecha — panel de decisión (rompe la simetría del hero) */}
          <div
            className="bento-surface relative p-2 lg:mt-4"
            data-hover
            data-inspector-title="Panel de decisión"
            data-inspector-desc="En vez de hacerte scrollear a ciegas, el hero te deja saltar directo al plan que te interesa — con el precio real a la vista. Menos fricción, decisión más rápida."
            data-inspector-cat="UX · Conversión"
          >
            <p className="editorial-label px-4 pt-4 pb-2 text-[10px]">¿Qué estás buscando?</p>
            <ul>
              {decisionRows.map((row, i) => (
                <li key={row.name}>
                  {i > 0 && <div aria-hidden className="divider-theme opacity-60" />}
                  <Link
                    href={row.href}
                    className="group flex items-center justify-between gap-4 rounded-lg px-4 py-3.5 transition-colors hover:bg-[rgba(var(--color-primary-rgb),0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[var(--color-on-surface)]">
                        {row.name}
                      </span>
                      <span className="block text-[11px] text-[var(--color-on-surface-variant)] opacity-75">
                        {row.meta}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span className="text-sm font-extrabold tabular-nums text-[var(--color-primary)]">
                        {row.price}
                      </span>
                      <ArrowRightIcon className="size-3.5 text-[var(--color-on-surface-variant)] opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionReveal>
    </ServiciosHeroShell>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   PROCESO — 4 pasos con tiempos reales (brief §1.4). Paso destacado: boceto
   gratis en 24-48 h (riesgo invertido).
   ──────────────────────────────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Charlamos por WhatsApp',
    sub: '15 min — me contás tu negocio, sin compromiso',
    highlight: false,
  },
  {
    step: '02',
    title: 'Boceto gratis en 24-48 h',
    sub: 'Ves tu página antes de pagar un peso',
    highlight: true,
  },
  {
    step: '03',
    title: 'Tu web en 15 días',
    sub: 'Avances visibles y fecha pactada por escrito',
    highlight: false,
  },
  {
    step: '04',
    title: 'Lanzamiento + soporte',
    sub: '3 meses de soporte incluido post-entrega',
    highlight: false,
  },
] as const

/* Proceso narrado (spec §2/§9): el panel entra con el reveal firma y luego
   los pasos caen en cascada LOOSE (120 ms) con las líneas conectoras
   dibujándose entre medio (scaleX/scaleY, transform-only).
   Reduced-motion: SectionReveal degrada a estado final (los hijos con
   variants nunca reciben "hidden" sin propagación del contenedor). */
const PROCESS_PANEL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
    transition: {
      duration: DUR_REVEAL,
      ease: EASE_OUT,
      staggerChildren: STAGGER_LOOSE,
      delayChildren: DELAY_AFTER_PANEL,
    },
  },
}

const PROCESS_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
    transition: { duration: DUR_SLOW, ease: EASE_OUT },
  },
}

/** Línea conectora horizontal (desktop) — se dibuja de izquierda a derecha. */
const PROCESS_CONNECTOR_X_VARIANTS: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: DUR_BASE, ease: EASE_OUT } },
}

/** Línea conectora vertical (mobile) — se dibuja de arriba hacia abajo. */
const PROCESS_CONNECTOR_Y_VARIANTS: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: DUR_BASE, ease: EASE_OUT } },
}

export function ServiciosProcess() {
  return (
    <section id="proceso" className="scroll-mt-24 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="editorial-label mb-4">Proceso</p>
              <h2 className="heading-display text-3xl sm:text-4xl">
                <span className="block text-[var(--color-on-surface-variant)]">De la idea al lanzamiento,</span>
                <strong className="block text-[var(--color-on-surface)]">sin sorpresas en el camino.</strong>
              </h2>
            </div>
            <span
              aria-hidden="true"
              className="section-number hidden sm:block"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' } as CSSProperties}
            >
              05
            </span>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} stagger={STAGGER_LOOSE}>
          <motion.div
            variants={PROCESS_PANEL_VARIANTS}
            className="bento-surface overflow-hidden"
            data-hover
            data-inspector-title="Proceso en 4 pasos"
            data-inspector-desc="Muestra el flujo de trabajo con tiempos reales para reducir fricción: el visitante sabe exactamente qué esperar antes de escribir. El paso destacado es la oferta de riesgo invertido: boceto gratis antes de pagar."
            data-inspector-cat="UX · Conversión"
          >
            <div
              aria-hidden
              className="h-[2px] w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.85) 50%, transparent)',
              }}
            />

            <div className="px-6 py-8 sm:px-8">
              <div className="mb-6 flex flex-col items-stretch justify-center sm:flex-row sm:items-center">
                {PROCESS_STEPS.map(({ step, title, sub, highlight }, i, arr) => (
                  <div key={step} className="flex flex-col items-center sm:flex-row sm:flex-1">
                    <motion.div
                      variants={PROCESS_ITEM_VARIANTS}
                      className={cn(
                        'flex w-full flex-col items-center rounded-xl px-4 py-5 text-center sm:flex-1',
                        highlight
                          ? // Paso de riesgo invertido: apenas más grande que el resto (spec: md:scale-[1.04])
                            'bg-[rgba(var(--color-primary-rgb),0.07)] border border-[rgba(var(--color-primary-rgb),0.25)] md:scale-[1.04]'
                          : '',
                      )}
                    >
                      <div
                        className={cn(
                          'mb-3 flex size-10 items-center justify-center rounded-full text-xs font-black',
                          highlight
                            ? cn(
                                'bg-[var(--color-primary)] text-[var(--color-surface-base)]',
                                // Glow del paso destacado: en light pasa a sombra de apoyo navy + halo del tema
                                'shadow-[0_1px_3px_rgba(24,32,60,0.10),0_6px_16px_-4px_rgba(var(--color-primary-rgb),0.35)]',
                                'dark:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.45)]',
                              )
                            : 'border border-[rgba(var(--color-primary-rgb),0.45)] text-[var(--color-primary)]',
                        )}
                      >
                        {step}
                      </div>
                      <span className="mb-1 text-sm font-bold text-[var(--color-on-surface)]">
                        {title}
                      </span>
                      <span
                        className={cn(
                          'max-w-[11rem] text-xs leading-relaxed',
                          highlight
                            ? 'font-medium text-[var(--color-primary)]'
                            : 'text-[var(--color-on-surface-variant)]',
                        )}
                      >
                        {sub}
                      </span>
                    </motion.div>

                    {i < arr.length - 1 && (
                      <div aria-hidden className="my-2 flex items-center justify-center sm:my-0 sm:px-1">
                        {/* Conectores que se dibujan (transform-only) entre paso y paso */}
                        <motion.span
                          variants={PROCESS_CONNECTOR_X_VARIANTS}
                          className="hidden h-px w-6 origin-left sm:block"
                          style={{
                            background:
                              'linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.2), rgba(var(--color-primary-rgb), 0.55))',
                          }}
                        />
                        <motion.span
                          variants={PROCESS_CONNECTOR_Y_VARIANTS}
                          className="block h-5 w-px origin-top sm:hidden"
                          style={{
                            background:
                              'linear-gradient(180deg, rgba(var(--color-primary-rgb), 0.25), rgba(var(--color-primary-rgb), 0.55))',
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <motion.p
                variants={PROCESS_ITEM_VARIANTS}
                className="text-center text-[11px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-50"
              >
                Sin vueltas · Sin sorpresas · Sin letra chica
              </motion.p>
            </div>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   POR QUÉ DIRECTO — diferenciador resumido (AUDIT_ADDENDUM: una sola tabla
   comparativa en la página; la grilla "vs agencia" se resume acá en una franja
   de valor sin formato de tabla — lo comparativo vive en ServiciosComparisonTable).
   ──────────────────────────────────────────────────────────────────────────── */
const WHY_APEX_POINTS = [
  {
    title: 'Hablás con quien programa',
    sub: 'Sin vendedores ni gerentes de cuenta en el medio: cada mensaje me llega a mí.',
  },
  {
    title: 'Precio fijo, por escrito',
    sub: 'Acá no existe el "a cotizar": el número que ves es el número que pagás.',
  },
  {
    title: 'Entrega en 15 días — o devuelvo el depósito',
    sub: 'Fecha pactada antes de arrancar, con 3 meses de soporte incluido después.',
  },
] as const

export function ServiciosWhyApex() {
  return (
    <section className="my-12 mx-auto max-w-5xl px-6">
      <SectionReveal>
        <div className="bento-surface overflow-hidden">
          <div
            aria-hidden
            className="h-[2px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.7) 50%, transparent)',
            }}
          />

          <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <p className="editorial-label mb-3">Sin intermediarios</p>
              <h3 className="heading-display text-2xl sm:text-3xl mb-4">
                <span className="block text-[var(--color-on-surface-variant)]">Sin agencia en el medio,</span>
                <strong className="block text-[var(--color-on-surface)]">directo con el desarrollador.</strong>
              </h3>
              <div className="flex items-start gap-4">
                <div
                  aria-hidden
                  className="w-[3px] flex-shrink-0 self-stretch rounded-full"
                  style={{ background: 'var(--color-primary)', minHeight: '2.5rem' }}
                />
                <p className="text-sm italic leading-relaxed text-[var(--color-on-surface-variant)]">
                  &quot;Trabajo con vos, no para vos. Cada consulta llega directo a mí — sin
                  intermediarios, sin demoras.&quot;
                </p>
              </div>
            </div>

            <ul className="space-y-5">
              {WHY_APEX_POINTS.map((point, i) => (
                <li key={point.title} className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black text-[var(--color-primary)]"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.12)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.3)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-on-surface)]">{point.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                      {point.sub}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}

/**
 * Tabla comparativa expandida — APEX vs WordPress vs Wix vs Tiendanube vs Agencia.
 *
 * Why: tablas comparativas son lo que más citan los LLMs (2.5x más que prosa).
 * Genera AI citations cuando alguien busca "WordPress vs custom argentina" en
 * ChatGPT/Perplexity/Gemini. SEO crítico en 2026.
 */
const COMPARISON_ROWS: Array<{
  feature: string
  apex: string
  wordpress: string
  wix: string
  tiendanube: string
  agencia: string
  apexWins: boolean
}> = [
  {
    feature: 'Precio inicial',
    apex: 'Desde ARS 300k (fijo)',
    wordpress: 'ARS 80k–600k + dev',
    wix: 'USD 16/mes mín.',
    tiendanube: 'USD 35/mes mín.',
    agencia: 'A cotizar',
    apexWins: true,
  },
  {
    feature: 'Costo mensual recurrente',
    apex: 'Hosting incluido año 1',
    wordpress: 'USD 5–25/mes',
    wix: 'USD 16–45/mes',
    tiendanube: 'USD 35–250/mes',
    agencia: 'USD 50+/mes',
    apexWins: true,
  },
  {
    feature: 'Plazo de entrega',
    apex: '15 días, por escrito',
    wordpress: '4–8 semanas',
    wix: 'Inmediato (DIY)',
    tiendanube: 'Inmediato (DIY)',
    agencia: '3–6 meses',
    apexWins: true,
  },
  {
    feature: 'Diseño 100% a medida',
    apex: 'Sí',
    wordpress: 'Limitado a tema',
    wix: 'No (drag & drop)',
    tiendanube: 'No (templates)',
    agencia: 'Sí',
    apexWins: false,
  },
  {
    feature: 'Velocidad real (Lighthouse)',
    apex: '95+ score',
    wordpress: '40–70',
    wix: '30–60',
    tiendanube: '50–75',
    agencia: 'Variable',
    apexWins: true,
  },
  {
    feature: 'Propiedad del código',
    apex: '100% tuyo desde día 1',
    wordpress: 'Sí (open source)',
    wix: 'No (locked)',
    tiendanube: 'No (locked)',
    agencia: 'Depende del contrato',
    apexWins: true,
  },
  {
    feature: 'Lock-in del proveedor',
    apex: 'Cero',
    wordpress: 'Bajo',
    wix: 'Alto',
    tiendanube: 'Alto',
    agencia: 'Medio',
    apexWins: true,
  },
  {
    feature: 'Pago argentino (factura A/B, MEP)',
    apex: 'Sí',
    wordpress: 'Depende del dev',
    wix: 'No (USD CC)',
    tiendanube: 'Sí (parcial)',
    agencia: 'Sí',
    apexWins: false,
  },
  {
    feature: 'Integración AFIP/ARCA',
    apex: 'Sí (opcional)',
    wordpress: 'Plugin externo',
    wix: 'No',
    tiendanube: 'Limitada',
    agencia: 'Sí (extra)',
    apexWins: false,
  },
  {
    feature: 'App móvil + Web',
    apex: 'Sí (mismo stack)',
    wordpress: 'No',
    wix: 'No',
    tiendanube: 'No',
    agencia: 'Sí (equipo separado)',
    apexWins: true,
  },
  {
    feature: 'Hablás directo con el dev',
    apex: 'Sí',
    wordpress: 'Sí',
    wix: 'No (DIY o foro)',
    tiendanube: 'No (soporte tier)',
    agencia: 'No (project manager)',
    apexWins: true,
  },
]

export function ServiciosComparisonTable() {
  return (
    <section className="my-12 mx-auto max-w-6xl px-6">
      <SectionReveal>
        <div className="glass-card overflow-hidden rounded-2xl">
          <div
            aria-hidden
            className="h-[2px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.7) 50%, transparent)',
            }}
          />

          <div className="p-6 sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-6">
              <div>
                <p className="editorial-label mb-3">Comparativa</p>
                <h3 className="text-xl font-bold text-[var(--color-on-surface)] sm:text-2xl">
                  APEX vs WordPress vs Wix vs Tiendanube vs Agencia
                </h3>
              </div>
              {/* Stroke 0.16 solo en dark; en light hereda el 0.34 global (visible sobre porcelana) */}
              <span
                aria-hidden="true"
                className="section-number hidden md:block dark:[--sn-stroke-alpha:0.16]"
                style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' } as CSSProperties}
              >
                06
              </span>
            </div>
            <p className="mb-6 max-w-2xl text-sm text-[var(--color-on-surface-variant)]">
              Honesto: no siempre somos la mejor opción. Si tu proyecto es un sitio simple y querés
              moverlo vos, Wix puede alcanzar. Esta tabla te ayuda a decidir.
            </p>

            {/* Tabla — scroll horizontal en mobile */}
            <div
              className="overflow-x-auto rounded-xl"
              style={{ border: '1px solid rgba(var(--color-primary-rgb), 0.1)' }}
            >
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr
                    className="text-left text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)',
                      color: 'var(--color-on-surface-variant)',
                    }}
                  >
                    <th className="sticky left-0 z-10 px-3 py-3" style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)' }}>
                      Característica
                    </th>
                    {/* Columna APEX enmarcada: inset borders primary 0.3 + fondo 0.06 */}
                    <th
                      className="px-3 py-3 text-[var(--color-primary)]"
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
                        boxShadow:
                          'inset 1px 0 0 rgba(var(--color-primary-rgb), 0.3), inset -1px 0 0 rgba(var(--color-primary-rgb), 0.3), inset 0 1px 0 rgba(var(--color-primary-rgb), 0.3)',
                      }}
                    >
                      APEX
                    </th>
                    <th className="px-3 py-3">WordPress</th>
                    <th className="px-3 py-3">Wix</th>
                    <th className="px-3 py-3">Tiendanube</th>
                    <th className="px-3 py-3">Agencia</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr
                      key={row.feature}
                      className="group/row transition-colors duration-150 hover:bg-[rgba(var(--color-primary-rgb),0.035)]"
                      style={{
                        borderTop: idx === 0 ? 'none' : '1px solid rgba(var(--color-primary-rgb), 0.08)',
                      }}
                    >
                      <td
                        className="sticky left-0 z-10 px-3 py-3 text-xs font-semibold text-[var(--color-on-surface)] transition-colors duration-150 group-hover/row:bg-[rgba(var(--color-primary-rgb),0.05)]"
                        style={{ backgroundColor: 'var(--color-surface-low)' }}
                      >
                        {row.feature}
                      </td>
                      {/* Celda APEX: marco inset continuo + check en las celdas ganadoras */}
                      <td
                        className="px-3 py-3 text-xs font-medium"
                        style={{
                          color: row.apexWins ? 'var(--color-primary)' : 'var(--color-on-surface)',
                          backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
                          boxShadow:
                            idx === COMPARISON_ROWS.length - 1
                              ? 'inset 1px 0 0 rgba(var(--color-primary-rgb), 0.3), inset -1px 0 0 rgba(var(--color-primary-rgb), 0.3), inset 0 -1px 0 rgba(var(--color-primary-rgb), 0.3)'
                              : 'inset 1px 0 0 rgba(var(--color-primary-rgb), 0.3), inset -1px 0 0 rgba(var(--color-primary-rgb), 0.3)',
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {row.apexWins && (
                            <CheckIcon aria-hidden className="size-3 shrink-0 text-[var(--color-primary)]" />
                          )}
                          {row.apex}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--color-on-surface-variant)]">
                        {row.wordpress}
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--color-on-surface-variant)]">
                        {row.wix}
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--color-on-surface-variant)]">
                        {row.tiendanube}
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--color-on-surface-variant)]">
                        {row.agencia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Disclaimer honesto */}
            <p className="mt-5 text-xs italic leading-relaxed text-[var(--color-on-surface-variant)] opacity-75">
              Comparativa actualizada en junio 2026. Los precios de Wix y Tiendanube son en USD y varían
              según plan. WordPress incluye sólo el hosting; el costo total depende del desarrollador.
              Si necesitás algo más simple que lo que ofrecemos, no dudes en pedir recomendación: a
              veces la mejor opción es la más sencilla.
            </p>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}

/**
 * Acceso crawlable a las landings verticales (médicos / abogados / contadores).
 * Una row simple debajo de la comparativa con enlaces directos.
 */
export function VerticalsBridge() {
  const VERTICALS_LIST = [
    { slug: 'web-para-medicos', label: 'Médicos', sub: 'Turnos online + AFIP' },
    { slug: 'web-para-abogados', label: 'Abogados', sub: 'Consultas + agenda' },
    { slug: 'web-para-contadores', label: 'Contadores', sub: 'Portal cliente + ARCA' },
  ]

  return (
    <section className="my-12 mx-auto max-w-6xl px-6">
      <SectionReveal>
        <div className="bento-surface p-6 sm:p-8">
          <div className="mb-5">
            <p className="editorial-label mb-3">Verticales</p>
            <h3 className="text-lg font-bold text-[var(--color-on-surface)] sm:text-xl">
              ¿Sos médico, abogado o contador?
            </h3>
          </div>
          <p className="mb-5 text-sm text-[var(--color-on-surface-variant)]">
            Tenemos soluciones específicas para tu profesión: con los módulos que realmente usás
            (turnos, agenda, AFIP, portal de clientes) y precios definidos desde el arranque.
          </p>
          {/* Primera card destacada: columna más ancha rompe la simetría */}
          <ul className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr]">
            {VERTICALS_LIST.map((v) => (
              <li key={v.slug}>
                <a
                  href={`/${v.slug}`}
                  className="group flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:border-[rgba(var(--color-primary-rgb),0.35)] hover:bg-[rgba(var(--color-primary-rgb),0.03)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <div>
                    <span className="block text-sm font-bold text-[var(--color-on-surface)]">
                      Web para {v.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--color-on-surface-variant)] opacity-75">
                      {v.sub}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="text-base transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionReveal>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   FAQ — accordion existente, layout asimétrico 2 columnas: header sticky a la
   izquierda con CTA WhatsApp contextual, preguntas a la derecha.
   ──────────────────────────────────────────────────────────────────────────── */
export function ServiciosStaticFaq() {
  return (
    <section id="faq" className="scroll-mt-24 py-16 mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <SectionReveal>
          <div className="lg:sticky lg:top-24">
            <span
              aria-hidden="true"
              className="section-number block"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' } as CSSProperties}
            >
              07
            </span>
            <p className="editorial-label editorial-label--primary mt-2 mb-4">FAQ</p>
            <h2 className="heading-display text-3xl sm:text-4xl mb-4">
              <span className="block text-[var(--color-on-surface-variant)]">Las dudas de siempre,</span>
              <strong className="block text-[var(--color-on-surface)]">respondidas sin vueltas.</strong>
            </h2>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              Precio, tiempos, garantía y proceso — todo lo que me preguntan antes de arrancar,
              con números reales.
            </p>
            <WhatsAppOutboundLink
              waHref={whatsappUrl(
                'Hola, tengo una duda que no encontré en el FAQ de tu web. ¿Me la respondés?',
              )}
              className="group inline-flex items-center gap-2.5 rounded-xl text-sm font-semibold text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
            >
              <span
                className="inline-flex size-8 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-105"
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4" />
              </span>
              ¿Otra duda? Escribime directo
              <ArrowRightIcon className="size-3.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" />
            </WhatsAppOutboundLink>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <FaqAccordion items={SERVICIOS_FAQ_ITEMS} groups={SERVICIOS_FAQ_GROUPS} />
        </SectionReveal>
      </div>
    </section>
  )
}
