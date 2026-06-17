'use client'

/**
 * Card de sitio para el muestrario. Un browser frame premium con la captura
 * del sitio adentro; la card entera es un link que abre la web en vivo.
 *
 * Dos modos de preview, mismo shell (coherencia visual en toda la página):
 *  - 'image' → screenshot local optimizada (next/image). Fallback: póster de
 *     marca con el ícono del producto. Lo usan los casos reales en producción.
 *  - 'live'  → captura en vivo del sitio (servicio externo, <img>). Fallback:
 *     póster generado desde la paleta real del demo. Lo usa el laboratorio.
 *
 * Un solo acento (`--color-primary` del tema activo): la variedad cromática la
 * ponen las capturas, no la UI → coherente en los 7 temas. Motion-reduce safe.
 */

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { ExternalLinkIcon } from '@/components/ui/icons'

export type PreviewMode = 'image' | 'live'

export interface PreviewCardProps {
  href: string
  domain: string
  name: string
  blurb: string
  tags: string[]
  previewSrc: string
  previewMode: PreviewMode
  /** Badge superior (ej. "Producto propio" / "Cliente"). */
  badge?: string
  /** Pill destacada (ej. "Nuevo"). */
  flag?: string
  /** Fallback del modo 'image': ícono de marca. */
  BrandIcon?: React.FC<{ className?: string }>
  /** Fallback del modo 'live': hex codes de la paleta del demo. */
  paletteHexes?: string[]
  /** Inspector / tooltips (opcional). */
  inspectorTitle?: string
  inspectorDesc?: string
  className?: string
}

/* ── Browser chrome (3 puntos + pill de URL con candado) ────────────────── */
function BrowserChrome({ domain }: { domain: string }) {
  return (
    <div
      className="flex items-center gap-2 border-b px-3 py-2"
      style={{
        borderColor: 'rgba(var(--color-primary-rgb),0.12)',
        background: 'rgba(var(--color-primary-rgb),0.04)',
      }}
    >
      <span aria-hidden className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 rounded-full"
            style={{ background: 'rgba(var(--color-on-surface-variant-rgb,140,140,140),0.35)' }}
          />
        ))}
      </span>
      <span
        className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md px-2.5 py-1 text-[11px] font-medium text-[var(--color-on-surface-variant)]"
        style={{ background: 'rgba(var(--color-primary-rgb),0.07)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-3 shrink-0 opacity-70" aria-hidden>
          <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="truncate">{domain}</span>
      </span>
    </div>
  )
}

/* ── Póster de marca (fallback) ─────────────────────────────────────────── */
function BrandPoster({
  name,
  domain,
  BrandIcon,
  paletteHexes,
}: {
  name: string
  domain: string
  BrandIcon?: React.FC<{ className?: string }>
  paletteHexes?: string[]
}) {
  const hexes = paletteHexes?.filter(Boolean) ?? []
  const background =
    hexes.length >= 2
      ? `linear-gradient(140deg, ${hexes[0]} 0%, ${hexes[1]} ${hexes[2] ? '55%' : '100%'}${
          hexes[2] ? `, ${hexes[2]} 100%` : ''
        })`
      : 'radial-gradient(120% 120% at 50% 0%, rgba(var(--color-primary-rgb),0.18) 0%, transparent 60%), var(--color-surface-low)'

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4 text-center" style={{ background }}>
      {/* velo para legibilidad sobre paletas claras */}
      {hexes.length >= 2 && (
        <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45))' }} />
      )}
      <span className="relative z-10 flex flex-col items-center gap-2">
        {BrandIcon ? (
          <BrandIcon className="size-11 opacity-95" />
        ) : (
          <ExternalLinkIcon className={cn('size-8', hexes.length >= 2 ? 'text-white/90' : 'text-[var(--color-primary)] opacity-80')} />
        )}
        <span className={cn('text-base font-extrabold tracking-tight', hexes.length >= 2 ? 'text-white' : 'text-[var(--color-on-surface)]')} style={{ fontFamily: 'var(--font-heading)' }}>
          {name}
        </span>
        <span className={cn('text-[11px]', hexes.length >= 2 ? 'text-white/70' : 'text-[var(--color-on-surface-variant)] opacity-70')}>
          {domain}
        </span>
      </span>
    </div>
  )
}

/* ── Área de preview ────────────────────────────────────────────────────── */
function Preview(props: PreviewCardProps) {
  const { previewSrc, previewMode, name, domain, BrandIcon, paletteHexes } = props
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const showPoster = failed || !previewSrc

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-base)]">
      {showPoster ? (
        <BrandPoster name={name} domain={domain} BrandIcon={BrandIcon} paletteHexes={paletteHexes} />
      ) : previewMode === 'image' ? (
        <Image
          src={previewSrc}
          alt={`Captura del sitio ${name} (${domain})`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 540px"
          className="object-cover object-top transition-transform duration-[1.1s] ease-out will-change-transform group-hover/card:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          {/* skeleton mientras carga la captura en vivo (anti-CLS, sin spinner) */}
          {!loaded && (
            <span
              aria-hidden
              className="absolute inset-0 animate-pulse"
              style={{ background: 'linear-gradient(110deg, var(--color-surface-low) 30%, var(--color-surface-high) 50%, var(--color-surface-low) 70%)' }}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element -- captura externa que cambia con el deploy; next/image la cachearía 1 año */}
          <img
            src={previewSrc}
            alt={`Captura en vivo de ${name} (${domain})`}
            loading="lazy"
            decoding="async"
            className={cn(
              'absolute inset-0 size-full object-cover object-top transition-[transform,opacity] duration-700 ease-out will-change-transform',
              'group-hover/card:scale-[1.05] motion-reduce:transform-none',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      )}

      {/* velo inferior + overlay "Ver en vivo" en hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:transition-none"
        style={{ background: 'linear-gradient(to top, rgba(var(--color-primary-rgb),0.28), transparent)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
        style={{ background: 'rgba(var(--color-primary-rgb),0.92)' }}
      >
        Ver en vivo
        <ExternalLinkIcon className="size-3" />
      </span>
    </div>
  )
}

/* ── Card ───────────────────────────────────────────────────────────────── */
export function PreviewCard(props: PreviewCardProps) {
  const { href, name, blurb, tags, badge, flag, inspectorTitle, inspectorDesc, className } = props

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group/card relative flex h-full flex-col overflow-hidden rounded-2xl border transition-[transform,box-shadow,border-color] duration-300 ease-out',
        'hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
        'border-[var(--glass-border)] bg-[var(--color-surface-low)]',
        'hover:border-[rgba(var(--color-primary-rgb),0.4)]',
        'hover:shadow-[0_2px_6px_rgba(24,32,60,0.05),0_22px_48px_-24px_rgba(24,32,60,0.28),0_0_30px_-10px_rgba(var(--color-primary-rgb),0.28)]',
        'dark:hover:shadow-[0_0_46px_-10px_rgba(var(--color-primary-rgb),0.3)]',
        className,
      )}
      data-hover
      data-inspector-title={inspectorTitle}
      data-inspector-desc={inspectorDesc}
      data-inspector-cat="Muestrario · Prueba de diseño"
    >
      {/* acento superior del tema */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.85) 50%, transparent)' }}
      />

      {/* flag destacada (ej. "Nuevo") */}
      {flag && (
        <span
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm"
          style={{ background: 'rgba(var(--color-primary-rgb),0.95)' }}
        >
          <span className="size-1.5 rounded-full bg-white/90" />
          {flag}
        </span>
      )}

      <div className="relative w-full">
        <BrowserChrome domain={props.domain} />
        <Preview {...props} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2.5">
          <h4 className="text-base font-bold leading-none text-[var(--color-on-surface)]">{name}</h4>
          {badge && (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em]"
              style={{
                color: 'var(--color-on-surface-variant)',
                background: 'rgba(var(--color-primary-rgb),0.08)',
                border: '1px solid rgba(var(--color-primary-rgb),0.18)',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{blurb}</p>

        {tags.length > 0 && (
          <ul className="mt-auto mb-4 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li
                key={t}
                className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold text-[var(--color-on-surface)]"
                style={{
                  background: 'rgba(var(--color-primary-rgb),0.07)',
                  border: '1px solid rgba(var(--color-primary-rgb),0.16)',
                }}
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)]', tags.length === 0 && 'mt-auto')}>
          Abrir sitio real
          <ExternalLinkIcon className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 motion-reduce:transform-none" />
        </span>
      </div>
    </a>
  )
}
