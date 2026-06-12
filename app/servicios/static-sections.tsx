import Link from 'next/link'
import type { CSSProperties } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WEB_PLANS, APP_PLANS, formatARS } from '@/lib/types/services'
import { ROUTES } from '@/lib/constants'
import { ServiciosHeroShell } from './servicios-hero-shell'
import { FaqAccordion } from './faq-accordion'

/**
 * Verde oficial WhatsApp — única excepción de hex permitida por DESIGN_BRIEF §2
 * (solo en elementos/CTAs de WhatsApp). Todo lo demás usa vars del tema.
 */
const WA_GRADIENT = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
/** Sombra del CTA: glow verde en dark; en light, apoyo navy + verde profundo (patrón .btn-wa). */
const WA_SHADOW_CLASS =
  'shadow-[0_2px_5px_rgba(24,32,60,0.08),0_10px_26px_-10px_rgba(18,140,126,0.42)] dark:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.45)]'

/**
 * FAQ — orden de objeciones del DESIGN_BRIEF §1.6:
 * precio → tiempo → confianza → proceso → ROI → garantía → resto (logística).
 * Alimenta el accordion y el JSON-LD FAQPage en page.tsx.
 */
export const SERVICIOS_FAQ_ITEMS = [
  {
    q: '¿Cuánto cuesta una página web en Argentina?',
    a: 'Acá no hay "a cotizar": los precios están publicados. Landing $300.000, Web Interactiva $600.000 y Tienda Online $900.000 (ARS, precio fijo pactado por escrito antes de arrancar). Todos se pagan en 3 cuotas sin interés, y antes de la primera cuota ya viste un boceto gratis de tu proyecto. Las apps móviles funcionan distinto: con un fee mensual que incluye desarrollo activo, soporte y publicación en las tiendas — los valores están en la pestaña «Aplicación Móvil» de esta misma página.',
  },
  {
    q: '¿Cuánto tarda en estar lista mi página?',
    a: '15 días desde que aprobás el boceto, para cualquier plan web. La fecha queda pactada por escrito antes de empezar, y el boceto te lo entrego gratis en 24-48 h. Si no cumplo la fecha acordada, te devuelvo el depósito.',
  },
  {
    q: '¿Cómo sé que no me vas a dejar a mitad del proyecto?',
    a: 'Tres cosas concretas: ves un boceto gratis antes de pagar un peso, pagás en 3 cuotas atadas al avance (nunca todo por adelantado) y el código vive en un repositorio a tu nombre desde el primer día — pase lo que pase, lo hecho es tuyo. Además podés ver mis productos funcionando en producción (BotLode, Botrive, Assistify) y sitios de clientes reales antes de decidir. Hablás conmigo, no con un vendedor.',
  },
  {
    q: '¿Cómo es el proceso de trabajo?',
    a: 'Cuatro pasos: (1) me escribís por WhatsApp y charlamos 15 minutos sobre tu negocio; (2) en 24-48 h te mando un boceto gratis de tu página; (3) si te gusta, pagás la primera de 3 cuotas y en 15 días tenés tu web online, viendo avances en el camino; (4) lanzamos y tenés 3 meses de soporte incluido. Todo por WhatsApp o Zoom, desde cualquier punto del país.',
  },
  {
    q: '¿Qué gano con una web a medida en vez de Wix o una plantilla?',
    a: 'Números concretos: una web a medida carga en menos de 2 segundos (Google posiciona mejor los sitios rápidos), no pagás mensualidades obligatorias (Wix y Tiendanube cobran entre USD 16 y 250 por mes, para siempre), no pagás comisiones por venta y el código es tuyo — sin lock-in. Y está diseñada para convertir: botón de WhatsApp, SEO y velocidad al servicio de generar consultas. Si tu caso es muy simple, te lo digo honestamente: a veces Wix alcanza (mirá la tabla comparativa de esta página).',
  },
  {
    q: '¿Qué pasa si no me gusta el resultado?',
    a: 'El boceto es gratis y sin compromiso: si no te convence, no pagás nada y quedamos como amigos. Una vez en desarrollo, ves avances y los aprobás antes de cada cuota. Y si no llego a la fecha de entrega pactada por escrito, te devuelvo el depósito completo. El riesgo lo tomo yo, no vos.',
  },
  {
    q: '¿Cuáles son las formas de pago?',
    a: '3 cuotas sin interés, cada una un tercio del total: la primera al aprobar el boceto (activa el calendario de entrega), la segunda durante el desarrollo y la última contra entrega. Acepto transferencia bancaria, MercadoPago, dólar MEP/CCL y cripto (USDT) para clientes del exterior.',
  },
  {
    q: '¿La página se va a ver bien en el celular?',
    a: 'Sí — se diseña primero para el celular y después para la compu (mobile-first), porque la mayoría de tus clientes te va a encontrar desde el teléfono. La pruebo en distintos tamaños de pantalla antes de entregar, y el boceto que recibís ya muestra la versión móvil.',
  },
  {
    q: '¿El hosting y el dominio están incluidos?',
    a: 'El primer año de hosting profesional (Vercel) está incluido. Después suele costar USD 0-20 por mes según tráfico — te lo dejo configurado y sabés exactamente qué esperar. El dominio lo registrás a tu nombre (te guío paso a paso o lo hacemos juntos en 10 minutos): es importante que sea tuyo, no mío.',
  },
  {
    q: '¿De quién es el código cuando terminamos?',
    a: '100% tuyo desde el día uno. Vive en un repositorio (GitHub) con tu cuenta como propietaria. Si mañana querés seguir con otro desarrollador, te llevás todo sin pedir permiso ni perder un archivo. Cero lock-in.',
  },
  {
    q: '¿Pueden integrar MercadoPago, AFIP o WhatsApp Business?',
    a: 'Sí, los tres. MercadoPago para cobrar online (incluido en los planes que lo necesitan), WhatsApp para que cada consulta te llegue directo al teléfono, y facturación electrónica AFIP/ARCA automática como addon: suma entre $200.000 y $400.000 según complejidad, y emite factura A o B con CAE sin que cargues nada a mano.',
  },
  {
    q: '¿Qué pasa después de la entrega?',
    a: 'Tenés 3 meses de soporte incluido: bugs, ajustes menores y dudas de uso, sin costo. Después podés seguir por tu cuenta (la web queda andando sola) o contratar mantenimiento mensual desde $50.000, que cubre actualizaciones de seguridad, monitoreo de errores y cambios menores.',
  },
  {
    q: '¿Trabajás solo en Buenos Aires?',
    a: 'No — trabajo con clientes de toda Argentina y del exterior, 100% remoto. Reuniones por Zoom o directamente por WhatsApp. La distancia no cambia ni el precio ni el plazo.',
  },
  {
    q: '¿Hacés apps móviles o solo webs?',
    a: 'Las dos cosas: webs con Next.js y apps iOS + Android con Flutter (una sola base de código para las dos tiendas). Las apps funcionan con fee mensual porque son un producto vivo: incluye mejoras continuas, soporte y publicación en App Store y Google Play.',
  },
] as const

/* ────────────────────────────────────────────────────────────────────────────
   HERO — corto, orientado a decisión (brief §3 /servicios)
   Izquierda: claim + CTA WhatsApp contextual. Derecha: panel de decisión con
   los planes y precios reales (desde WEB_PLANS/APP_PLANS — nunca hardcodeados).
   ──────────────────────────────────────────────────────────────────────────── */
export function ServiciosHero() {
  const appBasePrice = APP_PLANS[0]?.price

  const decisionRows: Array<{ name: string; meta: string; price: string; href: string }> = [
    ...WEB_PLANS.map((plan) => ({
      name: plan.name,
      meta: plan.badge,
      price: plan.price !== null ? formatARS(plan.price) : 'A consultar',
      href: '#pricing',
    })),
    {
      name: 'App iOS + Android',
      meta: 'Producto vivo',
      price: appBasePrice ? `${formatARS(appBasePrice)} /mes` : 'Fee mensual',
      href: `${ROUTES.servicios}?tab=mobile#pricing`,
    },
    {
      name: 'Todavía no sé',
      meta: 'Calculadora · 90 seg',
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
              Tres planes de web, planes de app y una calculadora para estimar el tuyo.
              Elegís, me escribís por WhatsApp y en 24-48 h tenés un boceto gratis —
              antes de pagar nada.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <WhatsAppOutboundLink
                waHref={whatsappUrl(
                  'Hola, estoy viendo los planes en tu web pero no sé cuál me conviene. ¿Me orientás?',
                )}
                className={cn(
                  'btn-tech inline-flex items-center justify-center gap-2.5 font-semibold select-none',
                  'h-12 px-6 text-sm text-white',
                  'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  WA_SHADOW_CLASS,
                )}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4" />
                No sé qué necesito, escribime
              </WhatsAppOutboundLink>

              <a
                href="#pricing"
                className={cn(
                  'btn-tech btn-outline-tech inline-flex items-center justify-center gap-2 font-semibold select-none',
                  'h-12 px-6 text-sm text-[var(--color-primary)]',
                  'transition-transform duration-200 ease-out active:scale-[0.97]',
                )}
              >
                Ver planes
                <span aria-hidden className="rotate-90 inline-block leading-none">→</span>
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
                    className="group flex items-center justify-between gap-4 rounded-lg px-4 py-3.5 transition-colors hover:bg-[rgba(var(--color-primary-rgb),0.06)]"
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

export function ServiciosProcess() {
  return (
    <section id="proceso" className="py-16">
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
              04
            </span>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div
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
                    <div
                      className={cn(
                        'flex w-full flex-col items-center rounded-xl px-4 py-5 text-center transition-all duration-300 sm:flex-1',
                        highlight
                          ? 'bg-[rgba(var(--color-primary-rgb),0.07)] border border-[rgba(var(--color-primary-rgb),0.25)]'
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
                    </div>

                    {i < arr.length - 1 && (
                      <div aria-hidden className="my-2 flex items-center justify-center sm:my-0">
                        <span
                          className="hidden select-none text-base leading-none sm:block"
                          style={{ color: 'rgba(var(--color-primary-rgb), 0.55)' }}
                        >
                          ›
                        </span>
                        <div
                          className="h-5 w-px sm:hidden"
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

              <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-50">
                Sin vueltas · Sin sorpresas · Sin letra chica
              </p>
            </div>
          </div>
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
                05
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
                    <th className="px-3 py-3 text-[var(--color-primary)]">APEX</th>
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
                      style={{
                        borderTop: idx === 0 ? 'none' : '1px solid rgba(var(--color-primary-rgb), 0.08)',
                      }}
                    >
                      <td
                        className="sticky left-0 z-10 px-3 py-3 text-xs font-semibold text-[var(--color-on-surface)]"
                        style={{ backgroundColor: 'var(--color-surface-low, #0d0d0d)' }}
                      >
                        {row.feature}
                      </td>
                      <td
                        className="px-3 py-3 text-xs font-medium"
                        style={{
                          color: row.apexWins ? 'var(--color-primary)' : 'var(--color-on-surface)',
                          backgroundColor: row.apexWins
                            ? 'rgba(var(--color-primary-rgb), 0.04)'
                            : 'transparent',
                        }}
                      >
                        {row.apex}
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
          <ul className="grid gap-3 sm:grid-cols-3">
            {VERTICALS_LIST.map((v) => (
              <li key={v.slug}>
                <a
                  href={`/${v.slug}`}
                  className="group flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:border-[rgba(var(--color-primary-rgb),0.35)]"
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
    <section id="faq" className="py-16 mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <SectionReveal>
          <div className="lg:sticky lg:top-24">
            <span
              aria-hidden="true"
              className="section-number block"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' } as CSSProperties}
            >
              06
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
              className="group inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)]"
            >
              <span
                className="inline-flex size-8 items-center justify-center rounded-full text-white"
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
          <FaqAccordion items={SERVICIOS_FAQ_ITEMS} />
        </SectionReveal>
      </div>
    </section>
  )
}
