import { SectionReveal } from '@/components/ui/section-reveal'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { ServiciosHeroShell } from './servicios-hero-shell'

export const SERVICIOS_FAQ_ITEMS = [
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
] as const

export function ServiciosStaticTop() {
  return (
    <>
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

      <div className="my-12 mx-auto max-w-4xl px-6">
        <SectionReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            <div className="shrink-0">
              <h3 className="text-lg font-heading font-extrabold text-[var(--color-on-surface)] mb-1">
                Confiaron en APEX
              </h3>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                simonmindset.com · metalwailers.com · botrive.com · pulpiprint.com · mnltecno.com
              </p>
            </div>
            <blockquote
              className="text-sm italic text-[var(--color-on-surface-variant)] pl-4 max-w-md"
              style={{ borderLeft: '2px solid var(--color-primary)' }}
            >
              &quot;Entregó antes de lo prometido y quedó exactamente como lo imaginé.&quot;
              <footer className="text-xs text-[var(--color-on-surface-variant)] opacity-60 mt-2 not-italic">
                — Simón R., Coach
              </footer>
            </blockquote>
          </div>
        </SectionReveal>
      </div>
    </>
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

        <div className="space-y-3">
          {SERVICIOS_FAQ_ITEMS.map((item, i) => (
            <details
              key={item.q}
              name="servicios-faq"
              className="group rounded-xl overflow-hidden"
              style={{
                border: '1px solid var(--glass-border)',
                backgroundColor: 'var(--color-surface-high)',
              }}
              open={i === 0}
            >
              <summary className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold text-[var(--color-on-surface)]">{item.q}</span>
                <span
                  className="flex-shrink-0 inline-flex text-[var(--color-primary)] select-none transition-transform duration-200 group-open:rotate-180"
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
                    className="size-5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </SectionReveal>
    </section>
  )
}
