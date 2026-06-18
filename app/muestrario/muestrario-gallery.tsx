'use client'

import { useMemo, useState } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { PreviewCard } from './preview-card'
import { cn } from '@/lib/utils/cn'
import { SHOWCASE_TIERS } from '@/lib/data/showcase'
import type { LabDemo } from '@/lib/data/lab-demos'
import type { ThemeId } from '@/lib/types/theme'
import { BotLodeIcon, AssistifyIcon, LumaInvitaIcon } from '@/components/ui/icons'

type PriceFilter = 'Todos' | '$300k' | '$600k' | '$900k'

const PRICE_FILTERS: PriceFilter[] = ['Todos', '$300k', '$600k', '$900k']

const TIER_PRICE: Record<string, '$300k' | '$600k' | '$900k'> = {
  web_basic: '$300k',
  web_interactive: '$600k',
  web_premium: '$900k',
}

const BRAND_ICON: Partial<Record<ThemeId, React.FC<{ className?: string }>>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'luma-invita': LumaInvitaIcon,
}

interface UnifiedItem {
  id: string
  price?: '$300k' | '$600k' | '$900k'
  href: string
  domain: string
  name: string
  blurb: string
  tags: string[]
  previewSrc: string
  previewMode: 'image' | 'live'
  BrandIcon?: React.FC<{ className?: string }>
  paletteHexes?: string[]
  badge?: string
  flag?: string
  inspectorTitle?: string
  inspectorDesc?: string
}

function buildItems(demos: LabDemo[]): UnifiedItem[] {
  const items: UnifiedItem[] = []

  const seen = new Set<string>()
  for (const tier of SHOWCASE_TIERS) {
    const price = TIER_PRICE[tier.planId]
    for (const site of tier.sites) {
      if (seen.has(site.slug)) continue
      seen.add(site.slug)
      items.push({
        id: `showcase-${site.slug}`,
        price,
        badge: price,
        href: site.url,
        domain: site.domain,
        name: site.name,
        blurb: site.blurb,
        tags: site.highlights,
        previewSrc: site.image ?? `/projects/showcase/${site.slug}.webp`,
        previewMode: 'image',
        BrandIcon: site.themeId ? BRAND_ICON[site.themeId as ThemeId] : undefined,
        inspectorTitle: `Muestrario · ${site.name}`,
        inspectorDesc: 'Sitio real en producción que podés abrir y tocar ahora mismo.',
      })
    }
  }

  const newestSlug = demos[0]?.slug
  for (const demo of demos) {
    const tags = [demo.industry, demo.productType, demo.complexity]
      .filter(Boolean)
      .map((t) => (t as string).replace(/[_-]+/g, ' ').trim())
      .filter((t) => t.length <= 26)
      .slice(0, 3)

    items.push({
      id: `lab-${demo.slug}`,
      price: undefined,
      href: demo.url,
      domain: demo.domain,
      name: demo.name,
      blurb: demo.tagline,
      tags,
      previewSrc: demo.previewSrc,
      previewMode: 'live',
      paletteHexes: demo.paletteHexes,
      flag: demo.slug === newestSlug ? 'Nuevo' : undefined,
      inspectorTitle: `Muestrario · ${demo.name}`,
      inspectorDesc:
        'Demo generado de forma autónoma por la Vidriera de Libre Albedrío: diseñado, construido y deployado sin intervención.',
    })
  }

  return items
}

export function MuestrarioGallery({ demos }: { demos: LabDemo[] }) {
  const [active, setActive] = useState<PriceFilter>('Todos')
  const allItems = useMemo(() => buildItems(demos), [demos])

  const filtered = useMemo(() => {
    if (active === 'Todos') return allItems
    return allItems.filter((item) => item.price === active)
  }, [allItems, active])

  return (
    <section id="galeria" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">

        <SectionReveal>
          <div className="mb-10">
            <p className="editorial-label editorial-label--primary mb-4">Muestrario · Diseño en vivo</p>
            <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
              <strong className="text-[var(--color-on-surface)]">Páginas que hicimos.</strong>
              <span className="text-[var(--color-on-surface-variant)]"> Abiertas, tocables, en producción.</span>
            </h2>
            <p className="text-pretty mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              Cada card abre el sitio real en una pestaña nueva. Código en producción, no maquetas.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <div className="mb-8 flex flex-wrap gap-2">
            {PRICE_FILTERS.map((f) => {
              const isActive = f === active
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActive(f)}
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
                      ? {
                          background: 'rgba(var(--color-primary-rgb),0.92)',
                          border: '1px solid rgba(var(--color-primary-rgb),0.92)',
                        }
                      : {
                          background: 'rgba(var(--color-primary-rgb),0.05)',
                          border: '1px solid var(--glass-border)',
                        }
                  }
                >
                  {f}
                </button>
              )
            })}
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <SectionReveal key={item.id} delay={0.04 * (i % 3)}>
              <PreviewCard
                href={item.href}
                domain={item.domain}
                name={item.name}
                blurb={item.blurb}
                tags={item.tags}
                previewSrc={item.previewSrc}
                previewMode={item.previewMode}
                BrandIcon={item.BrandIcon}
                paletteHexes={item.paletteHexes}
                badge={item.badge}
                flag={item.flag}
                inspectorTitle={item.inspectorTitle}
                inspectorDesc={item.inspectorDesc}
                className="h-full"
              />
            </SectionReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--color-on-surface-variant)]">
            No hay sitios en este rango todavía.
          </p>
        )}
      </div>
    </section>
  )
}
