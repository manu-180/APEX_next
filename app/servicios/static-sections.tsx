import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { ServiciosHeroShell } from './servicios-hero-shell'
import { FaqAccordion } from './faq-accordion'

export const SERVICIOS_FAQ_ITEMS = [
  {
    q: '¿Cuánto tarda hacer una página web?',
    a: 'Entrega en 15 días para cualquier proyecto web. Fecha garantizada desde el día 1 — si no cumplimos, devolvemos el depósito sin discusión.',
  },
  {
    q: '¿Cuánto cuesta una página web en Argentina?',
    a: 'Los proyectos arrancan desde ARS 300.000 con precio fijo pactado al inicio. Landing 300k, web interactiva 600k, e-commerce 900k. Apps móviles desde ARS 580.000. Podés pagarlo en 3 cuotas sin interés. Sin sorpresas al final.',
  },
  {
    q: '¿El hosting y el dominio están incluidos?',
    a: 'El primer año de hosting profesional (Vercel) viene incluido. El dominio lo registrás vos a tu nombre (te paso instrucciones) o lo registramos juntos. Después del primer año, el hosting suele costar USD 0-20/mes según tráfico.',
  },
  {
    q: '¿De quién es el código cuando terminamos el proyecto?',
    a: 'El código es 100% tuyo desde el día uno. Lo subo a un repositorio (GitHub) con tu cuenta como propietaria. No hay lock-in: si en algún momento querés cambiar de proveedor, te llevás todo sin perder un solo archivo.',
  },
  {
    q: '¿Aceptan factura A o B?',
    a: 'Sí, emitimos factura A o B según corresponda. Inscripción en AFIP al día. Ideal para empresas que necesitan computar el IVA y deducir el gasto.',
  },
  {
    q: '¿Cuál es la forma de pago?',
    a: '50% al arrancar (que activa el calendario de 15 días) y 50% al entregar. Aceptamos transferencia bancaria, MercadoPago, MEP/CCL para clientes que paguen en dólares, y cripto (USDT) para clientes del exterior.',
  },
  {
    q: '¿Qué pasa si no me gusta el resultado?',
    a: 'Hacemos el boceto completo del proyecto 100% gratis y sin compromiso. Recién cuando lo aprobás y te encanta, avanzás con la primer cuota. Si el diseño no te convence, no pagás nada — nos despedimos como amigos y listo.',
  },
  {
    q: '¿Puedo hablar con alguien antes de contratar?',
    a: 'Sí, conmigo. Soy Manuel, fundador de APEX, y siempre voy a estar disponible directamente por WhatsApp para responder cualquier consulta — antes, durante y después del proyecto. Sin vendedores, sin intermediarios, sin filtros. La primera charla son 15 minutos gratuitos y sin compromiso.',
  },
  {
    q: '¿Trabajan solo en Buenos Aires?',
    a: 'No, trabajamos con clientes de toda Argentina (y del exterior) 100% remoto. Reuniones por Zoom o WhatsApp. La distancia no cambia el plazo ni el precio.',
  },
  {
    q: '¿Hacen apps móviles nativas o solo web?',
    a: 'Hacemos las dos: webs con Next.js y apps móviles nativas con Flutter (iOS + Android desde la misma base de código). Si necesitás un MVP rápido en mobile, Flutter es la opción más rentable en 2026.',
  },
  {
    q: '¿Pueden integrar MercadoPago, AFIP o WhatsApp Business?',
    a: 'Sí. MercadoPago para checkout, AFIP para facturación electrónica automática (vía SDK oficial), y WhatsApp Business API para notificaciones y conversaciones. La integración fiscal AFIP suma ARS 200-400k según complejidad.',
  },
  {
    q: '¿Pueden migrar mi sitio actual de WordPress o Wix?',
    a: 'Sí. Migramos el contenido, las imágenes y la estructura SEO (redirects 301 incluidos para no perder ranking). El sitio nuevo arranca con todo lo que ya tenías, pero corriendo mucho más rápido y sin pagar mantenimiento mensual a una agencia.',
  },
  {
    q: '¿Qué incluye el mantenimiento post-entrega?',
    a: 'Los primeros 3 meses post-entrega tenés soporte incluido: bugs, ajustes menores, dudas de uso. Después podés contratar un plan de mantenimiento mensual (desde ARS 50k/mes) que cubre updates de seguridad, monitoreo de errores y cambios menores.',
  },
  {
    q: '¿Qué necesitan de mí para empezar?',
    a: 'Para arrancar sólo necesito: un brief corto del proyecto (lo armamos juntos en la consulta), el contenido que ya tengas (textos, fotos, logo si hay), y el 50% inicial. Si no tenés contenido todavía, te ayudo a estructurarlo.',
  },
] as const

export function ServiciosHero() {
  return (
    <ServiciosHeroShell>
      <SectionReveal>
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="primary">Servicios</Badge>
            <Badge variant="outline">Diseño premium</Badge>
          </div>
          <h1 className="font-heading text-balance leading-tight mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl font-extralight text-[var(--color-on-surface-variant)]">
              Software a medida
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
              para quienes venden en serio.
            </span>
          </h1>
          <p className="text-pretty text-[var(--color-on-surface-variant)] max-w-lg mb-6 sm:mb-8">
            Precio fijo, entrega garantizada, sin agencias. Hablás directo conmigo.
          </p>
        </div>
      </SectionReveal>
    </ServiciosHeroShell>
  )
}

export function ServiciosStaticTop() {
  return (
    <>

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
              <div
                className="h-[2px] w-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.85) 50%, transparent)',
                }}
              />

              <div className="px-8 py-8">
                <div className="flex items-center gap-3 justify-center mb-8">
                  <div
                    className="h-px flex-1 max-w-[80px]"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.45))',
                    }}
                  />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
                    ¿Cómo funciona?
                  </span>
                  <div
                    className="h-px flex-1 max-w-[80px]"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.45), transparent)',
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  {[
                    { step: '01', title: 'Consulta gratis', sub: '15 minutos', highlight: false },
                    {
                      step: '02',
                      title: 'Presupuesta en 24 hs',
                      sub: 'Precio fijo, sin sorpresas',
                      highlight: false,
                    },
                    {
                      step: '03',
                      title: 'Entrega en 15 días',
                      sub: 'Garantizado. Si no cumplimos, devolvemos el depósito.',
                      highlight: true,
                    },
                  ].map(({ step, title, sub, highlight }, i, arr) => (
                    <div key={step} className="flex flex-col sm:flex-row items-center">
                      <div
                        className={cn(
                          'flex flex-col items-center text-center px-7 py-5 rounded-xl transition-all duration-300',
                          highlight
                            ? 'bg-[rgba(var(--color-primary-rgb),0.07)] border border-[rgba(var(--color-primary-rgb),0.2)]'
                            : '',
                        )}
                      >
                        <div
                          className={cn(
                            'size-10 rounded-full flex items-center justify-center mb-3 text-xs font-black',
                            highlight
                              ? 'bg-[var(--color-primary)] text-[var(--color-surface-base)]'
                              : 'border border-[rgba(var(--color-primary-rgb),0.45)] text-[var(--color-primary)]',
                          )}
                          style={
                            highlight
                              ? { boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.45)' }
                              : undefined
                          }
                        >
                          {step}
                        </div>
                        <span className="text-sm font-bold text-[var(--color-on-surface)] mb-1 whitespace-nowrap">
                          {title}
                        </span>
                        <span
                          className={cn(
                            'text-xs leading-relaxed max-w-[9.5rem]',
                            highlight
                              ? 'text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-on-surface-variant)]',
                          )}
                        >
                          {sub}
                        </span>
                      </div>

                      {i < arr.length - 1 && (
                        <div className="flex items-center my-3 sm:my-0 sm:mx-1">
                          <div
                            className="hidden sm:block w-6 h-px"
                            style={{
                              background:
                                'linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.25), rgba(var(--color-primary-rgb), 0.6))',
                            }}
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

                <p className="text-center text-[11px] tracking-[0.2em] uppercase opacity-50 text-[var(--color-on-surface-variant)]">
                  Sin vueltas · Sin letra chica
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="my-12 mx-auto max-w-4xl px-6">
        <SectionReveal>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div
              className="h-[2px] w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.7) 50%, transparent)',
              }}
            />

            <div className="p-8">
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
                <h3 className="text-xl font-bold text-[var(--color-on-surface)]">
                  ¿Por qué APEX y no una agencia?
                </h3>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 mb-7 rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                  gap: '1px',
                  background: 'rgba(var(--color-primary-rgb), 0.1)',
                }}
              >
                <div className="p-6" style={{ background: 'var(--color-surface-low, #0d0d0d)' }}>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] opacity-60 mb-4">
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
                        <span className="size-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 bg-red-500/10 text-red-400">
                          ✕
                        </span>
                        <span className="text-sm text-[var(--color-on-surface-variant)] opacity-60">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6" style={{ background: 'rgba(var(--color-primary-rgb), 0.04)' }}>
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
                          className="size-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 text-[var(--color-primary)]"
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

              <div className="flex gap-4 items-start">
                <div
                  className="w-[3px] rounded-full flex-shrink-0 self-stretch"
                  style={{ background: 'var(--color-primary)', minHeight: '2.5rem' }}
                />
                <p className="text-sm italic text-[var(--color-on-surface-variant)] leading-relaxed">
                  &quot;Trabajo con vos, no para vos. Cuando tenés una duda, te respondo yo — no un asistente.&quot;
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
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
    apex: '15 días garantizado',
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
        <div className="glass-card rounded-2xl overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb), 0.7) 50%, transparent)',
            }}
          />

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                style={{
                  border: '1px solid rgba(var(--color-primary-rgb), 0.35)',
                  color: 'var(--color-primary)',
                }}
              >
                Comparativa
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-on-surface)]">
                APEX vs WordPress vs Wix vs Tiendanube vs Agencia
              </h3>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-2xl mb-6">
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
                    className="text-left text-[10px] uppercase tracking-wider font-bold"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)',
                      color: 'var(--color-on-surface-variant)',
                    }}
                  >
                    <th className="px-3 py-3 sticky left-0 z-10" style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)' }}>
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
                        className="px-3 py-3 text-xs font-semibold text-[var(--color-on-surface)] sticky left-0 z-10"
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
            <p className="mt-5 text-xs italic text-[var(--color-on-surface-variant)] opacity-75 leading-relaxed">
              Comparativa actualizada en mayo 2026. Los precios de Wix y Tiendanube son en USD y varían
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
        <div
          className="rounded-2xl p-6 sm:p-8 border"
          style={{
            backgroundColor: 'var(--color-surface-low)',
            borderColor: 'var(--glass-border)',
          }}
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
              style={{
                border: '1px solid rgba(var(--color-primary-rgb), 0.35)',
                color: 'var(--color-primary)',
              }}
            >
              Verticales
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-on-surface)]">
              ¿Sos un profesional con dolor específico?
            </h3>
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
            Estas landings cubren los 3 nichos que más subatendidos están en Argentina, con
            features específicas (turnos, agenda, AFIP, portal cliente) y precios definidos.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {VERTICALS_LIST.map((v) => (
              <li key={v.slug}>
                <a
                  href={`/${v.slug}`}
                  className={cn(
                    'group flex items-center justify-between rounded-xl px-4 py-3 transition-colors',
                    'border',
                  )}
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <div>
                    <span className="block text-sm font-bold text-[var(--color-on-surface)]">
                      Web para {v.label}
                    </span>
                    <span className="block text-[11px] text-[var(--color-on-surface-variant)] opacity-75 mt-0.5">
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

export function ServiciosStaticFaq() {
  return (
    <section className="py-16 mx-auto max-w-3xl px-6">
      <SectionReveal>
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
            Preguntas frecuentes
          </h2>
        </div>

        <FaqAccordion items={SERVICIOS_FAQ_ITEMS} />
      </SectionReveal>
    </section>
  )
}
