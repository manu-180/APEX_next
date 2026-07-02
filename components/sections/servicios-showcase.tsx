'use client'

/**
 * "Prueba real" — showcase de sitios reales en vivo, agrupados por nivel de
 * inversión (300k / 600k / 900k). Va justo debajo del pricing en /servicios:
 * el cliente ve el precio y, acto seguido, sitios funcionando que puede abrir.
 *
 * Diseño (DESIGN_BRIEF / CLAUDE.md):
 * - Un solo acento: el `--color-primary` del tema activo. La variedad cromática
 *   la aportan los screenshots, no la UI → se mantiene coherente en los 7 temas.
 * - Layout asimétrico: rail de nivel a la izquierda, cards a la derecha. En el
 *   primer nivel, la última card rompe el grid a ancho completo (variante wide).
 * - Browser frame premium con barra de URL real. Hover = lift + glow + zoom +
 *   overlay "Ver en vivo". Todo con motion-reduce safe.
 * - Precios desde WEB_PLANS (nunca hardcodeados).
 */

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { SectionReveal } from '@/components/ui/section-reveal'
import { BrowserChrome } from '@/components/ui/browser-chrome'
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  WhatsAppIcon,
  BotLodeIcon,
  AssistifyIcon,
  LumaInvitaIcon,
} from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { WEB_PLANS, formatARS } from '@/lib/types/services'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import {
  SHOWCASE_TIERS,
  type ShowcaseSite,
  type ShowcaseTier,
} from '@/lib/data/showcase'
import type { ThemeId } from '@/lib/types/theme'

const BRAND_ICON: Partial<Record<ThemeId, React.FC<{ className?: string }>>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'luma-invita': LumaInvitaIcon,
}

function priceForTier(tier: ShowcaseTier): string {
  const plan = WEB_PLANS.find((p) => p.id === tier.planId)
  return plan?.price != null ? formatARS(plan.price) : 'A medida'
}

/* ───────────────────────────────────────────────────────────────────────────
   Screenshot dentro de un browser frame. Degrada a marca + dominio si la
   imagen falta o falla (robusto en prod y mientras se capturan los shots).
   ─────────────────────────────────────────────────────────────────────────── */
function ShowcaseShot({ site }: { site: ShowcaseSite }) {
  const [failed, setFailed] = useState(false)
  const BrandIcon = site.themeId ? BRAND_ICON[site.themeId] : undefined
  const src = site.image ?? `/projects/showcase/${site.slug}.webp`

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-base)]">
      {!failed ? (
        <Image
          src={src}
          alt={`Captura del sitio ${site.name} (${site.domain})`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 540px"
          className="object-cover object-top transition-transform duration-[1.1s] ease-out will-change-transform group-hover/card:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 0%, rgba(var(--color-primary-rgb),0.16) 0%, transparent 60%), var(--color-surface-low)',
          }}
        >
          {BrandIcon ? (
            <BrandIcon className="size-12 opacity-90" />
          ) : (
            <ExternalLinkIcon className="size-9 text-[var(--color-primary)] opacity-80" />
          )}
          <span className="text-sm font-bold tracking-tight text-[var(--color-on-surface)]">
            {site.name}
          </span>
          <span className="text-[11px] text-[var(--color-on-surface-variant)] opacity-70">
            {site.domain}
          </span>
        </div>
      )}

      {/* Velo inferior + overlay "Ver en vivo" en hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:transition-none"
        style={{ background: 'linear-gradient(to top, rgba(var(--color-primary-rgb),0.28), transparent)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white opacity-0 backdrop-blur-md transition-[transform,opacity] duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
        style={{ background: 'rgba(var(--color-primary-rgb),0.92)' }}
      >
        Ver en vivo
        <ExternalLinkIcon className="size-3" />
      </span>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Card de sitio. variant 'tall' (vertical) | 'wide' (horizontal, rompe grid).
   La card entera es un link externo a la web en vivo.
   ─────────────────────────────────────────────────────────────────────────── */
function ShowcaseCard({
  site,
  variant,
  delay,
}: {
  site: ShowcaseSite
  variant: 'tall' | 'wide'
  delay: number
}) {
  const kindLabel = site.kind === 'product' ? 'Producto propio' : 'Cliente'

  return (
    <SectionReveal delay={delay} className={cn('h-full', variant === 'wide' && 'sm:col-span-2')}>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group/card relative flex h-full overflow-hidden rounded-2xl border transition-[transform,box-shadow,border-color] duration-300 ease-out',
          'hover:-translate-y-1 active:translate-y-0 active:scale-[0.985] motion-reduce:transform-none motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
          'border-[var(--glass-border)] bg-[var(--color-surface-low)]',
          'hover:border-[rgba(var(--color-primary-rgb),0.4)]',
          // Sombra hover estándar de card (spec §5/§8.2) — token de foundation
          'hover:shadow-[var(--shadow-card-hover)]',
          variant === 'wide' ? 'flex-col sm:flex-row' : 'flex-col',
        )}
        data-hover
        data-inspector-title={`Caso real · ${site.name}`}
        data-inspector-desc="Cada card abre el sitio real en una pestaña nueva. No es un mockup: es código en producción que podés tocar ahora mismo. La prueba más honesta de lo que recibís a este precio."
        data-inspector-cat="Conversión · Prueba social"
      >
        {/* Acento superior del tema */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-20 h-[2px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.85) 50%, transparent)',
          }}
        />

        {/* Browser frame + screenshot */}
        <div className={cn('relative', variant === 'wide' ? 'sm:w-[58%]' : 'w-full')}>
          <BrowserChrome domain={site.domain} />
          <ShowcaseShot site={site} />
        </div>

        {/* Texto */}
        <div className={cn('flex flex-1 flex-col p-5', variant === 'wide' && 'sm:justify-center sm:p-6')}>
          <div className="mb-2 flex items-center gap-2.5">
            <h4 className="text-base font-bold leading-none text-[var(--color-on-surface)]">
              {site.name}
            </h4>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em]"
              style={{
                color: 'var(--color-on-surface-variant)',
                background: 'rgba(var(--color-primary-rgb),0.08)',
                border: '1px solid rgba(var(--color-primary-rgb),0.18)',
              }}
            >
              {kindLabel}
            </span>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            {site.blurb}
          </p>

          <ul className="mt-auto mb-4 flex flex-wrap gap-1.5">
            {site.highlights.map((h) => (
              <li
                key={h}
                className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold text-[var(--color-on-surface)]"
                style={{
                  background: 'rgba(var(--color-primary-rgb),0.07)',
                  border: '1px solid rgba(var(--color-primary-rgb),0.16)',
                }}
              >
                {h}
              </li>
            ))}
          </ul>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)]">
            Abrir sitio real
            <ExternalLinkIcon className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 motion-reduce:transform-none" />
          </span>
        </div>
      </a>
    </SectionReveal>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Rail de nivel (columna izquierda asimétrica).
   ─────────────────────────────────────────────────────────────────────────── */
function TierRail({ tier }: { tier: ShowcaseTier }) {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <span
          className="text-5xl font-extrabold leading-none tracking-tight"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(var(--color-primary-rgb),0.45)',
          }}
          aria-hidden
        >
          {tier.numeral}
        </span>
        <div
          aria-hidden
          className="h-px flex-1"
          style={{
            background:
              'linear-gradient(to right, rgba(var(--color-primary-rgb),0.4), transparent)',
          }}
        />
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight tabular-nums text-[var(--color-primary)] sm:text-4xl">
          {priceForTier(tier)}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] opacity-70">
          ARS
        </span>
      </div>

      <h3 className="mt-2 text-xl font-bold text-[var(--color-on-surface)]">{tier.label}</h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
        {tier.essence}
      </p>

      {tier.note && (
        <div
          className="mt-4 flex items-start gap-2.5 rounded-xl p-3"
          style={{
            background: 'rgba(var(--color-primary-rgb),0.05)',
            border: '1px solid rgba(var(--color-primary-rgb),0.14)',
          }}
        >
          <span
            aria-hidden
            className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-[var(--color-primary)]"
            style={{ border: '1px solid rgba(var(--color-primary-rgb),0.4)' }}
          >
            i
          </span>
          <p className="text-xs leading-relaxed text-[var(--color-on-surface-variant)]">{tier.note}</p>
        </div>
      )}

      <a
        href="#pricing"
        className="group/plan mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]"
      >
        Ver qué incluye este plan
        <ArrowRightIcon className="size-3.5 opacity-60 transition-transform duration-200 group-hover/plan:translate-x-0.5 group-hover/plan:opacity-100" />
      </a>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   Sección principal.
   ─────────────────────────────────────────────────────────────────────────── */
export function ServiciosShowcase() {
  return (
    <section id="casos-reales" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header — mismo patrón editorial que el resto de /servicios */}
        <SectionReveal>
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="editorial-label editorial-label--primary mb-4">
                Prueba real · sitios en vivo
              </p>
              <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl mb-3">
                <span className="block text-[var(--color-on-surface-variant)]">
                  No te pido que confíes en una promesa.
                </span>
                <strong className="block text-[var(--color-on-surface)]">
                  Mirá lo que recibís a cada precio.
                </strong>
              </h2>
              <p className="text-pretty max-w-xl text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Cada nivel tiene sitios reales funcionando hoy. Tocá cualquiera y abrilo en
                una pestaña nueva — código en producción, no maquetas.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="section-number hidden md:block"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' } as CSSProperties}
            >
              03
            </span>
          </div>
        </SectionReveal>

        {/* Tiers */}
        <div className="space-y-14 sm:space-y-20">
          {SHOWCASE_TIERS.map((tier, tierIdx) => {
            const isOdd = tier.sites.length % 2 === 1
            return (
              <div
                key={tier.planId}
                className="grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_2.18fr] lg:gap-12"
              >
                <SectionReveal direction="left">
                  <TierRail tier={tier} />
                </SectionReveal>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {tier.sites.map((site, i) => {
                    const isLast = i === tier.sites.length - 1
                    const variant: 'tall' | 'wide' = isOdd && isLast ? 'wide' : 'tall'
                    return (
                      <ShowcaseCard
                        key={site.slug}
                        site={site}
                        variant={variant}
                        delay={0.06 * i + tierIdx * 0.04}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA de cierre */}
        <SectionReveal delay={0.1}>
          <div className="mt-16 overflow-hidden rounded-2xl bento-surface">
            <div
              aria-hidden
              className="h-[2px] w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.7) 50%, transparent)',
              }}
            />
            <div className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-on-surface)] sm:text-xl">
                  ¿Querés ver el tuyo en esta lista?
                </h3>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  Algunos son productos propios; otros, clientes reales. El próximo puede ser tu
                  proyecto: contame qué tenés en mente y te muestro cómo se vería.
                </p>
                <Link
                  href={ROUTES.muestrario}
                  className="group/ml mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] outline-none transition-colors hover:opacity-80 focus-visible:underline"
                >
                  Ver el muestrario completo
                  <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover/ml:translate-x-0.5" />
                </Link>
              </div>
              <WhatsAppOutboundLink
                waHref={whatsappUrl(
                  'Hola, vi los casos reales en tu web y quiero algo así para mi proyecto. ¿Lo charlamos?',
                )}
                className={cn(
                  'group btn-tech inline-flex h-12 shrink-0 select-none items-center justify-center gap-2.5 px-6 text-sm font-semibold text-white',
                  'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97]',
                  'motion-reduce:transform-none motion-reduce:transition-none',
                  // Sombra WA canónica (rgba 18,140,126 = teal #128C7E, parte de
                  // la excepción WhatsApp documentada en lib/constants/whatsapp-ui)
                  WA_SHADOW_CLASS,
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                )}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none" />
                Quiero el mío
              </WhatsAppOutboundLink>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
