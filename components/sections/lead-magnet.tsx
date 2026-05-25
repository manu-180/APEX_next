'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons'
import { trackMetaLead } from '@/components/analytics/meta-pixel'
import { cn } from '@/lib/utils/cn'

/**
 * Lead magnet — captura email a cambio de la "Guía Precios 2026".
 *
 * Why: 70% del tráfico (sobre todo paid) se va sin tomar WhatsApp. Este form
 * convierte esa salida en lead capturado + secuencia nurture.
 *
 * Setup:
 * - PDF en /public/lead-magnets/guia-precios-2026.pdf (pendiente subir)
 * - Endpoint /api/lead-magnet ya creado
 * - Supabase: aplicar migración lead_magnet_subscribers.sql
 * - Edge function send-lead-magnet (opcional, para nurture vía Resend)
 *
 * Si Supabase no está configurado, el form igual funciona: descarga directa
 * del PDF, sin captura. Esto es importante: nunca bloquear el valor por una
 * dependencia técnica.
 */

const PDF_PATH = '/lead-magnets/guia-precios-2026.pdf'

const PROJECT_TYPES = [
  'Página web',
  'Tienda online',
  'App móvil',
  'No sé todavía',
] as const

interface LeadMagnetSectionProps {
  /** Variant compacta (sin grid de bullets) — útil al final de páginas. */
  variant?: 'full' | 'compact'
  /** Sección donde aparece — se trackea para análisis. */
  source?: string
}

export function LeadMagnetSection({
  variant = 'full',
  source = 'servicios',
}: LeadMagnetSectionProps = {}) {
  const prefersReducedMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [projectType, setProjectType] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Email inválido')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          name: name.trim() || undefined,
          projectType: projectType || undefined,
          source,
        }),
      })

      const data = await res.json().catch(() => ({}))
      const downloadUrl =
        typeof data?.downloadUrl === 'string' ? data.downloadUrl : PDF_PATH

      trackMetaLead()
      setSuccess(true)

      // Abrir PDF en nueva pestaña — el usuario obtiene el valor sin abandonar
      // la página actual (queda con el form en estado "Listo, mirá tu email")
      window.open(downloadUrl, '_blank', 'noopener,noreferrer')
    } catch {
      setError('No pudimos procesar tu pedido. Probá de nuevo en un momento.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl overflow-hidden border p-8 sm:p-10"
          style={{
            background:
              'linear-gradient(155deg, color-mix(in srgb, var(--color-surface-high) 88%, var(--color-primary) 12%) 0%, var(--color-surface-base) 100%)',
            borderColor: 'rgba(var(--color-primary-rgb), 0.18)',
          }}
        >
          {/* Decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl opacity-60"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.25)' }}
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* ── Left: pitch ──────────────────────────────────────── */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">Recurso gratis</Badge>
                <Badge variant="outline">PDF · 14 páginas</Badge>
              </div>

              <h2 className="font-heading text-balance text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-[var(--color-on-surface)] mb-4">
                Guía precios web y app en Argentina{' '}
                <span className="font-extralight text-[var(--color-on-surface-variant)]">2026</span>
              </h2>

              <p className="text-pretty text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
                Lo que cuesta de verdad cada tipo de proyecto (landing, e-commerce, app),
                qué incluye, qué NO incluye, y cómo evitar la trampa del{' '}
                <em>&ldquo;te lo hago barato&rdquo;</em>. Sin venta encubierta, sin formulario kilométrico.
              </p>

              {variant === 'full' && (
                <ul className="space-y-2.5">
                  {[
                    'Tabla de precios por tipo de proyecto (ARS y USD)',
                    'Qué preguntas hacer antes de contratar a un dev',
                    'Cómo proteger el código y los datos de tu negocio',
                    '5 errores que te hacen pagar el doble',
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <span
                        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full mt-0.5"
                        style={{
                          backgroundColor: 'rgba(var(--color-primary-rgb), 0.16)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        <CheckIcon className="size-2.5" />
                      </span>
                      <span className="text-[var(--color-on-surface-variant)]">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Right: form ──────────────────────────────────────── */}
            <div>
              {success ? (
                /* Success state — abrió el PDF, recordatorio del email */
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-6 text-center"
                  style={{
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
                    border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-surface-base)',
                    }}
                  >
                    <CheckIcon className="size-6" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)] mb-2">
                    ¡Listo! Te abrimos la guía en otra pestaña.
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    En las próximas 24 hs te mando un email con la guía adjunta + un par de
                    casos de estudio relacionados a lo que necesitás. Sin spam.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="lm-name"
                      className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]"
                    >
                      Nombre <span className="opacity-60 font-normal">(opcional)</span>
                    </label>
                    <input
                      id="lm-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      className="w-full rounded-xl border bg-[var(--color-surface-lowest)] px-4 py-2.5 text-base md:text-sm text-[var(--color-on-surface)] outline-none transition-all duration-200 border-[var(--color-surface-high)] focus:border-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)] focus:ring-0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lm-email"
                      className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]"
                    >
                      Email <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      id="lm-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vos@email.com"
                      autoComplete="email"
                      className="w-full rounded-xl border bg-[var(--color-surface-lowest)] px-4 py-2.5 text-base md:text-sm text-[var(--color-on-surface)] outline-none transition-all duration-200 border-[var(--color-surface-high)] focus:border-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)] focus:ring-0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lm-type"
                      className="block text-xs font-semibold mb-1.5 text-[var(--color-on-surface-variant)]"
                    >
                      Tipo de proyecto <span className="opacity-60 font-normal">(opcional)</span>
                    </label>
                    <select
                      id="lm-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full rounded-xl border bg-[var(--color-surface-lowest)] px-4 py-2.5 text-base md:text-sm text-[var(--color-on-surface)] outline-none appearance-none transition-all duration-200 border-[var(--color-surface-high)] focus:border-[rgba(var(--color-primary-rgb),0.5)] focus:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.2)] focus:ring-0"
                    >
                      <option value="">Elegí (te ayuda a personalizar la guía)</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 font-semibold rounded-xl min-h-12 px-5 py-3 text-sm',
                      'btn-tech btn-primary-tech active:scale-[0.97] transition-all',
                      sending && 'opacity-60 cursor-not-allowed',
                    )}
                  >
                    {sending ? 'Procesando…' : 'Descargar la guía gratis'}
                    {!sending && <ArrowRightIcon className="size-4" />}
                  </button>

                  <p className="text-[11px] text-[var(--color-on-surface-variant)] opacity-60 text-center">
                    Sin spam. Podés darte de baja en cualquier momento.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
