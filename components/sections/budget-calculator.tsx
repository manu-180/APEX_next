'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from '@/components/ui/icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { cn } from '@/lib/utils/cn'

/**
 * Verde oficial WhatsApp — única excepción de hex permitida por DESIGN_BRIEF §2
 * (solo en CTAs de WhatsApp). Todo lo demás usa vars del tema.
 */
const WA_GRADIENT = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
const WA_SHADOW = '0 10px 28px -10px rgba(37, 211, 102, 0.45)'

/**
 * Calculadora de presupuesto interactiva.
 *
 * Why: mecanismo de calificación + lead capture activo. El visitante responde
 * 5 preguntas, ve un rango realista, y va a WhatsApp con el contexto ya armado
 * (Manuel responde más rápido, deal cierra más fácil).
 *
 * No reemplaza el presupuesto real. Es un anchor + lead qualification.
 */

type ProjectType = 'web-simple' | 'web-interactiva' | 'ecommerce' | 'app' | 'unsure'
type Timeline = 'urgent' | 'normal' | 'flexible'
type ContentState = 'ready' | 'partial' | 'none'

interface Question<T extends string> {
  id: string
  title: string
  subtitle?: string
  options: { value: T; label: string; description?: string }[]
}

const Q_PROJECT_TYPE: Question<ProjectType> = {
  id: 'project',
  title: '¿Qué tipo de proyecto tenés en mente?',
  subtitle: 'Si no estás seguro, elegí "Todavía no sé" y lo definimos juntos.',
  options: [
    { value: 'web-simple', label: 'Página web simple', description: 'Landing o sitio con 3-5 secciones' },
    { value: 'web-interactiva', label: 'Web interactiva', description: 'Booking, formularios, calculadoras' },
    { value: 'ecommerce', label: 'Tienda online', description: 'Catálogo, carrito y pagos' },
    { value: 'app', label: 'App móvil', description: 'iOS + Android, con o sin backend' },
    { value: 'unsure', label: 'Todavía no sé', description: 'Lo definimos en la consulta' },
  ],
}

const Q_TIMELINE: Question<Timeline> = {
  id: 'timeline',
  title: '¿Cuál es tu plazo?',
  options: [
    { value: 'urgent', label: 'Urgente · 2-3 semanas', description: 'Hay un lanzamiento o evento cerca' },
    { value: 'normal', label: 'Normal · 1-2 meses', description: 'Plazo cómodo, sin estresarse' },
    { value: 'flexible', label: 'Flexible · sin apuro', description: 'Lo importante es que salga bien' },
  ],
}

const Q_INTEGRATIONS = {
  id: 'integrations',
  title: '¿Algún requerimiento específico?',
  subtitle: 'Podés elegir más de uno o ninguno.',
  options: [
    { value: 'afip', label: 'Integración AFIP', description: 'Facturación electrónica automática' },
    { value: 'payments', label: 'Pagos online', description: 'MercadoPago, Stripe, etc.' },
    { value: 'multilang', label: 'Multi-idioma', description: 'Español + Inglés u otros' },
    { value: 'crm', label: 'Integración con sistema actual', description: 'CRM, ERP, sheets, etc.' },
    { value: 'realtime', label: 'Tiempo real', description: 'Chat, notificaciones, dashboard live' },
    { value: 'none', label: 'Ninguno', description: 'Algo simple y directo' },
  ] as const,
}

const Q_CONTENT: Question<ContentState> = {
  id: 'content',
  title: '¿Ya tenés contenido (textos, fotos, branding)?',
  options: [
    { value: 'ready', label: 'Sí, todo listo', description: 'Textos, fotos y marca prontos' },
    { value: 'partial', label: 'Parcial', description: 'Tengo lo básico, falta pulir' },
    { value: 'none', label: 'Nada todavía', description: 'Necesito ayuda con el contenido también' },
  ],
}

interface CalculatorAnswers {
  project?: ProjectType
  timeline?: Timeline
  integrations: string[]
  content?: ContentState
}

/** Heurística de pricing — precios fijos accesibles, extras se charlan en la consulta. */
function calculateRange(answers: CalculatorAnswers): {
  base: number
  baseLabel: string
  installment: number
  hasFixedPrice: boolean
  notes: string[]
} {
  const notes: string[] = []
  let base = 0
  let baseLabel = ''
  let hasFixedPrice = true

  switch (answers.project) {
    case 'web-simple':
      baseLabel = 'Landing / Web simple'
      base = 300_000
      notes.push('Sitio profesional con 3-5 secciones, diseño a medida y optimización mobile.')
      break
    case 'web-interactiva':
      baseLabel = 'Web interactiva'
      base = 600_000
      notes.push('Algo más útil que una landing: booking, formularios inteligentes, calculadoras o paneles dinámicos.')
      break
    case 'ecommerce':
      baseLabel = 'Tienda online'
      base = 900_000
      notes.push('Catálogo, carrito y pagos integrados, listo para vender.')
      break
    case 'app':
      baseLabel = 'App móvil'
      base = 1_200_000
      notes.push('App nativa iOS + Android con backend incluido.')
      break
    case 'unsure':
      baseLabel = 'Proyecto a definir'
      base = 0
      hasFixedPrice = false
      notes.push('Definimos el tipo exacto en la consulta gratis de 15 min.')
      break
  }

  // Integraciones — no inflan el precio mostrado; se charlan en la consulta
  const ints = new Set(answers.integrations)
  if (ints.has('afip')) {
    notes.push('Integración AFIP: se cotiza aparte según volumen de facturación.')
  }
  if (ints.has('payments')) {
    notes.push('Pasarela de pagos (MercadoPago / Stripe): incluida sin costo adicional.')
  }
  if (ints.has('multilang')) {
    notes.push('Multi-idioma: lo charlamos por WhatsApp según cantidad de páginas.')
  }
  if (ints.has('crm')) {
    notes.push('Integración con tu sistema actual: depende del API existente.')
  }
  if (ints.has('realtime')) {
    notes.push('Funcionalidad realtime (chat, notificaciones live): la sumamos según el caso.')
  }

  // Plazo urgente
  if (answers.timeline === 'urgent') {
    notes.push('Plazo urgente (2-3 semanas): puede tener un ajuste menor, lo confirmamos en la charla.')
  }

  // Contenido
  if (answers.content === 'none') {
    notes.push('Te ayudo con contenido y branding básico sin costo extra significativo.')
  }

  const installment = hasFixedPrice ? Math.round(base / 3) : 0

  return { base, baseLabel, installment, hasFixedPrice, notes }
}

function formatARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function BudgetCalculatorSection() {
  const prefersReducedMotion = useReducedMotion()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CalculatorAnswers>({ integrations: [] })

  const totalSteps = 4
  const isLastStep = step === totalSteps
  const result = useMemo(() => (isLastStep ? calculateRange(answers) : null), [isLastStep, answers])

  const handleSelectSingle = <T extends string>(field: keyof CalculatorAnswers, value: T) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
    setTimeout(() => setStep((s) => Math.min(s + 1, totalSteps)), 200)
  }

  const toggleIntegration = (value: string) => {
    setAnswers((prev) => {
      const next = new Set(prev.integrations)
      if (value === 'none') {
        return { ...prev, integrations: ['none'] }
      }
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
        next.delete('none')
      }
      return { ...prev, integrations: Array.from(next) }
    })
  }

  const goToWhatsApp = () => {
    if (!result) return

    const summary = [
      `Hola Manuel, hice la calculadora y me dio:`,
      `Tipo: ${result.baseLabel}`,
      result.hasFixedPrice
        ? `Estimado: ${formatARS(result.base)} (3 cuotas sin interés de ${formatARS(result.installment)})`
        : `Estimado: a definir en la consulta`,
      answers.timeline ? `Plazo: ${Q_TIMELINE.options.find((o) => o.value === answers.timeline)?.label}` : '',
      answers.integrations.length > 0
        ? `Integraciones: ${answers.integrations
            .map((i) => Q_INTEGRATIONS.options.find((o) => o.value === i)?.label)
            .filter(Boolean)
            .join(', ')}`
        : '',
      `Quiero confirmar el presupuesto real.`,
    ]
      .filter(Boolean)
      .join('\n')

    openWhatsAppWithThankYouPage(whatsappUrl(summary), router)
  }

  const reset = () => {
    setStep(0)
    setAnswers({ integrations: [] })
  }

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const canAdvance = (() => {
    if (step === 0) return !!answers.project
    if (step === 1) return !!answers.timeline
    if (step === 2) return answers.integrations.length > 0
    if (step === 3) return !!answers.content
    return false
  })()

  return (
    <section
      id="calculadora"
      className="relative py-20 sm:py-24"
      data-hover
      data-inspector-title="Calculadora de presupuesto"
      data-inspector-desc="Wizard de 4 pasos que califica al lead y arma el contexto antes de ir a WhatsApp. Sin email, sin fricción — reduce la barrera de entrada al máximo."
      data-inspector-cat="UX · Formulario"
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>
            <p className="editorial-label editorial-label--primary mb-4">
              Calculadora · 5 preguntas · 90 segundos
            </p>
            <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl mb-3">
              <span className="block text-[var(--color-on-surface-variant)]">¿Cuánto te sale</span>
              <strong className="block text-[var(--color-on-surface)]">tu proyecto?</strong>
            </h2>
            <p className="text-pretty text-[var(--color-on-surface-variant)] max-w-xl">
              Respondé 5 preguntas y te muestro un rango realista en pesos.
              Sin email, sin compromiso. Si querés, después seguimos en WhatsApp.
            </p>
          </div>
          <span
            aria-hidden="true"
            className="section-number hidden sm:block"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
          >
            03
          </span>
        </motion.div>

        {/* ── Progress bar ──────────────────────────────────────────── */}
        <div
          className="mb-8"
          data-hover
          data-inspector-title="Barra de progreso del wizard"
          data-inspector-desc="Muestra avance sin obligar a completar. Reduce ansiedad y abandono: el visitante sabe exactamente cuánto falta."
          data-inspector-cat="UX · Motion"
        >
          <div className="h-1 w-full rounded-full overflow-hidden bg-[var(--color-surface-high)]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--color-primary)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)]">
            <div className="flex items-center gap-3">
              {step > 0 && !isLastStep && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1 opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all"
                  aria-label="Volver al paso anterior"
                >
                  <ArrowRightIcon className="size-3 rotate-180" aria-hidden />
                  Atrás
                </button>
              )}
              <span className="opacity-60">
                {isLastStep ? 'Listo' : `Paso ${step + 1} de ${totalSteps}`}
              </span>
            </div>
            {!isLastStep && step > 0 && (
              <button
                type="button"
                onClick={reset}
                className="opacity-60 hover:opacity-100 hover:text-[var(--color-primary)] transition-all"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>

        {/* ── Step container ───────────────────────────────────────── */}
        <div
          className="bento-surface p-6 sm:p-8"
          data-hover
          data-inspector-title="Contenedor del wizard"
          data-inspector-desc="Una pregunta por pantalla con AnimatePresence. Avance automático al elegir opción simple — sin botón Siguiente innecesario. Reduce fricción cognitiva."
          data-inspector-cat="UX · Formulario"
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="q0"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              >
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[var(--color-on-surface)] mb-1">
                  {Q_PROJECT_TYPE.title}
                </h3>
                {Q_PROJECT_TYPE.subtitle && (
                  <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
                    {Q_PROJECT_TYPE.subtitle}
                  </p>
                )}
                <div className="grid gap-2.5">
                  {Q_PROJECT_TYPE.options.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      description={opt.description}
                      selected={answers.project === opt.value}
                      onClick={() => handleSelectSingle('project', opt.value)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="q1"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              >
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[var(--color-on-surface)] mb-5">
                  {Q_TIMELINE.title}
                </h3>
                <div className="grid gap-2.5">
                  {Q_TIMELINE.options.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      description={opt.description}
                      selected={answers.timeline === opt.value}
                      onClick={() => handleSelectSingle('timeline', opt.value)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="q2"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              >
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[var(--color-on-surface)] mb-1">
                  {Q_INTEGRATIONS.title}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-5">
                  {Q_INTEGRATIONS.subtitle}
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {Q_INTEGRATIONS.options.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      description={opt.description}
                      selected={answers.integrations.includes(opt.value)}
                      onClick={() => toggleIntegration(opt.value)}
                      multiple
                    />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 min-h-11 px-4 text-sm font-semibold rounded-xl text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <ArrowRightIcon className="size-4 rotate-180" aria-hidden />
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canAdvance}
                    className={cn(
                      'btn-tech btn-primary-tech inline-flex items-center gap-2 min-h-11 px-6 text-sm font-semibold rounded-xl',
                      !canAdvance && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    Siguiente
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="q3"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              >
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[var(--color-on-surface)] mb-5">
                  {Q_CONTENT.title}
                </h3>
                <div className="grid gap-2.5">
                  {Q_CONTENT.options.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      description={opt.description}
                      selected={answers.content === opt.value}
                      onClick={() => handleSelectSingle('content', opt.value)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {isLastStep && result && (
              <motion.div
                key="result"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Estimado
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[var(--color-on-surface)] mb-1">
                  {result.baseLabel}
                </h3>
                {result.hasFixedPrice ? (
                  <>
                    <div
                      className="font-heading text-4xl sm:text-5xl font-extrabold tabular-nums mb-2"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {formatARS(result.base)}
                    </div>
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                      }}
                    >
                      <CheckIcon className="size-3.5" />
                      3 cuotas sin interés de{' '}
                      <span className="tabular-nums">{formatARS(result.installment)}</span>
                    </div>
                  </>
                ) : (
                  <div
                    className="font-heading text-2xl sm:text-3xl font-extrabold mb-6"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Lo definimos juntos
                  </div>
                )}

                {result.notes.length > 0 && (
                  <div
                    className="rounded-xl p-4 mb-6"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.04)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.12)',
                    }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-2 text-[var(--color-primary)]">
                      Qué incluye y qué charlamos aparte
                    </p>
                    <ul className="space-y-1.5">
                      {result.notes.map((n, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-on-surface-variant)]">
                          <CheckIcon
                            className="size-3 mt-0.5 shrink-0"
                            style={{ color: 'var(--color-primary)' }}
                          />
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={goToWhatsApp}
                    data-hover
                    data-inspector-title="CTA WhatsApp con contexto armado"
                    data-inspector-desc="Abre WhatsApp con el resumen completo (tipo de proyecto, plazo, integraciones). Manuel recibe el contexto ya listo — la charla empieza de donde dejó el wizard."
                    data-inspector-cat="Conversión"
                    className={cn(
                      'btn-tech inline-flex flex-1 items-center justify-center gap-2.5 min-h-12 rounded-xl px-6 text-sm font-semibold text-white select-none',
                      'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.97]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                    )}
                    style={{ background: WA_GRADIENT, boxShadow: WA_SHADOW }}
                  >
                    <WhatsAppIcon className="size-4" />
                    Validar con Manuel por WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 min-h-12 px-6 text-sm font-semibold rounded-xl text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    Empezar de nuevo
                  </button>
                </div>

                <p className="mt-5 text-xs text-[var(--color-on-surface-variant)] opacity-60 italic">
                  Este número es una estimación basada en tus respuestas. El presupuesto real se
                  pacta después de una charla de 15 min, donde definimos alcance exacto.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function OptionButton({
  label,
  description,
  selected,
  onClick,
  multiple = false,
}: {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  multiple?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-low)]',
        selected
          ? 'border-[rgba(var(--color-primary-rgb),0.5)] bg-[rgba(var(--color-primary-rgb),0.06)]'
          : 'border-[var(--glass-border)] hover:border-[rgba(var(--color-primary-rgb),0.3)]',
      )}
    >
      <span
        className={cn(
          'flex shrink-0 size-5 items-center justify-center rounded-full border mt-0.5 transition-colors',
          multiple ? 'rounded-md' : '',
          selected
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
            : 'border-[var(--color-surface-high)]',
        )}
      >
        {selected && (
          <CheckIcon
            className="size-3"
            style={{ color: 'var(--color-surface-base)' }}
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[var(--color-on-surface)]">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[var(--color-on-surface-variant)] opacity-80">
            {description}
          </span>
        )}
      </span>
    </button>
  )
}
