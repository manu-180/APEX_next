'use client'

/**
 * "En producción" — los sitios reales de APEX (productos propios + clientes),
 * aplanados desde SHOWCASE_TIERS a un grid premium. Acá NO va el precio (eso es
 * trabajo de /servicios): el muestrario muestra el TRABAJO, no la tarifa.
 */

import { SectionReveal } from '@/components/ui/section-reveal'
import { PreviewCard } from './preview-card'
import { SHOWCASE_TIERS, type ShowcaseSite } from '@/lib/data/showcase'
import type { ThemeId } from '@/lib/types/theme'
import { BotLodeIcon, AssistifyIcon, LumaInvitaIcon } from '@/components/ui/icons'

const BRAND_ICON: Partial<Record<ThemeId, React.FC<{ className?: string }>>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'luma-invita': LumaInvitaIcon,
}

/** Aplana los tiers preservando el orden, dedup por slug. */
function flattenSites(): ShowcaseSite[] {
  const seen = new Set<string>()
  const out: ShowcaseSite[] = []
  for (const tier of SHOWCASE_TIERS) {
    for (const site of tier.sites) {
      if (seen.has(site.slug)) continue
      seen.add(site.slug)
      out.push(site)
    }
  }
  return out
}

export function EnProduccion() {
  const sites = flattenSites()

  return (
    <section id="en-produccion" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="editorial-label editorial-label--primary mb-4">Muestrario · Diseño en vivo</p>
              <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
                <strong className="text-[var(--color-on-surface)]">Páginas que hicimos.</strong>
                <span className="text-[var(--color-on-surface-variant)]"> Abiertas, tocables, en producción.</span>
              </h2>
              <p className="text-pretty mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Cada card abre el sitio real en una pestaña nueva. Código en producción, no maquetas.
              </p>
            </div>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site, i) => (
            <SectionReveal key={site.slug} delay={0.04 * (i % 3)}>
              <PreviewCard
                href={site.url}
                domain={site.domain}
                name={site.name}
                blurb={site.blurb}
                tags={site.highlights}
                previewSrc={site.image ?? `/projects/showcase/${site.slug}.webp`}
                previewMode="image"
                BrandIcon={site.themeId ? BRAND_ICON[site.themeId] : undefined}
                inspectorTitle={`Muestrario · ${site.name}`}
                inspectorDesc="Sitio real en producción que podés abrir y tocar ahora mismo."
                className="h-full"
              />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
