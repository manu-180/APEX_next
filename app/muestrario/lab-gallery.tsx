'use client'

/**
 * "El laboratorio" — los demos que genera la Vidriera de Libre Albedrío, leídos
 * en vivo de Supabase (ISR). Se recarga solo: cada demo nuevo aparece acá sin
 * tocar código. Filtro por tipo de producto + captura en vivo por card.
 */

import { useMemo, useState } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { PreviewCard } from './preview-card'
import { cn } from '@/lib/utils/cn'
import type { LabDemo } from '@/lib/data/lab-demos'

const ACRONYMS: Record<string, string> = {
  saas: 'SaaS', ia: 'IA', ai: 'AI', ux: 'UX', ui: 'UI', '3d': '3D',
}

/** Limpia y prettifica un facet crudo ("landing-saas" → "Landing SaaS"). */
function pretty(raw: string | null): string {
  if (!raw) return ''
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\s*\/\s*/g, ' · ')
    .split(' ')
    .map((w) => ACRONYMS[w.toLowerCase()] ?? (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .trim()
}

/** Chips informativos por card (cortos, dedup, máx 3). */
function tagsFor(demo: LabDemo): string[] {
  const out = [pretty(demo.industry), pretty(demo.productType), pretty(demo.complexity)]
    .filter((t) => t && t.length <= 26)
  return Array.from(new Set(out)).slice(0, 3)
}

const ALL = 'Todos'

export function LabGallery({ demos }: { demos: LabDemo[] }) {
  const [active, setActive] = useState<string>(ALL)

  const categories = useMemo(() => {
    const set = new Map<string, string>() // key normalizada → label
    for (const d of demos) {
      const label = pretty(d.productType)
      if (label) set.set(label.toLowerCase(), label)
    }
    return [ALL, ...Array.from(set.values())]
  }, [demos])

  const newestSlug = demos[0]?.slug

  const filtered = useMemo(() => {
    if (active === ALL) return demos
    return demos.filter((d) => pretty(d.productType).toLowerCase() === active.toLowerCase())
  }, [demos, active])

  return (
    <section id="laboratorio" className="px-6 py-16 sm:py-20">
      {/* separador sutil arriba */}
      <div aria-hidden className="mx-auto mb-16 h-px max-w-6xl" style={{ background: 'linear-gradient(90deg, transparent, var(--glass-border) 50%, transparent)' }} />

      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <p className="editorial-label editorial-label--primary !mb-0">02 · El laboratorio</p>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]"
                  style={{ background: 'rgba(var(--color-primary-rgb),0.08)', border: '1px solid rgba(var(--color-primary-rgb),0.2)' }}
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: 'var(--color-primary)' }} />
                    <span className="relative inline-flex size-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                  </span>
                  Se actualiza solo
                </span>
              </div>
              <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
                <strong className="text-[var(--color-on-surface)]">Diseño sin cliente.</strong>
                <span className="text-[var(--color-on-surface-variant)]"> Solo para romper el molde.</span>
              </h2>
              <p className="text-pretty mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Un sistema autónomo diseña, construye y publica un sitio premium cada semana. Sin
                brief de cliente: pura exploración de estética y motion. Todo lo que ves acá llegó
                solo — y va a seguir creciendo.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Filtro */}
        {categories.length > 2 && (
          <SectionReveal delay={0.05}>
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = cat === active
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    aria-pressed={isActive}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-xs font-semibold outline-none transition-[color,background-color,border-color] duration-200',
                      'focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                      isActive
                        ? 'text-white'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
                    )}
                    style={
                      isActive
                        ? { background: 'rgba(var(--color-primary-rgb),0.92)', border: '1px solid rgba(var(--color-primary-rgb),0.92)' }
                        : { background: 'rgba(var(--color-primary-rgb),0.05)', border: '1px solid var(--glass-border)' }
                    }
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </SectionReveal>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((demo, i) => (
            <SectionReveal key={demo.slug} delay={0.04 * (i % 3)}>
              <PreviewCard
                href={demo.url}
                domain={demo.domain}
                name={demo.name}
                blurb={demo.tagline}
                tags={tagsFor(demo)}
                previewSrc={demo.previewSrc}
                previewMode="live"
                paletteHexes={demo.paletteHexes}
                flag={demo.slug === newestSlug ? 'Nuevo' : undefined}
                inspectorTitle={`Laboratorio · ${demo.name}`}
                inspectorDesc="Demo generado de forma autónoma por la Vidriera de Libre Albedrío: diseñado, construido y deployado sin intervención. La captura es del sitio en vivo."
                className="h-full"
              />
            </SectionReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--color-on-surface-variant)]">
            No hay demos en esta categoría todavía.
          </p>
        )}
      </div>
    </section>
  )
}
